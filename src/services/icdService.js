// Comprehensive ICD lookup service for the front-end - Client-side search
import { icfCodes } from '../data/icfCodes';

// Load full ICD-10-CM database
let icd10Database = null;

const loadICD10Database = async () => {
  if (!icd10Database) {
    try {
      const response = await fetch('/icd10cm-tabular-2026.json');
      const data = await response.json();
      icd10Database = extractAllCodes(data);
      console.log(`Loaded ${icd10Database.length} ICD-10-CM codes`);
    } catch (error) {
      console.error('Error loading ICD-10-CM database:', error);
      icd10Database = [];
    }
  }
  return icd10Database;
};

// Extract all codes from the complex JSON structure
const extractAllCodes = (data) => {
  const codes = [];
  
  const processSection = (section, chapterName = '') => {
    if (!section) return;
    
    // Handle diag (diagnosis code)
    if (section.diag) {
      const diagArray = Array.isArray(section.diag) ? section.diag : [section.diag];
      diagArray.forEach(diag => {
        if (diag.name && diag.desc) {
          codes.push({
            code: diag.name,
            description: diag.desc,
            chapter: chapterName,
            notes: extractNotes(diag)
          });
        }
      });
    }
    
    // Handle sectionRef
    if (section.sectionRef) {
      const sectionArray = Array.isArray(section.sectionRef) ? section.sectionRef : [section.sectionRef];
      sectionArray.forEach(sec => processSection(sec, chapterName));
    }
    
    // Handle nested sections
    if (section.section) {
      const secArray = Array.isArray(section.section) ? section.section : [section.section];
      secArray.forEach(sec => processSection(sec, chapterName));
    }
  };
  
  // Process chapters
  if (data.ICD10CM?.tabular?.chapter) {
    const chapters = Array.isArray(data.ICD10CM.tabular.chapter) 
      ? data.ICD10CM.tabular.chapter 
      : [data.ICD10CM.tabular.chapter];
    
    chapters.forEach(chapter => {
      const chapterName = chapter.desc || '';
      
      if (chapter.section) {
        const sections = Array.isArray(chapter.section) ? chapter.section : [chapter.section];
        sections.forEach(section => processSection(section, chapterName));
      }
      
      if (chapter.sectionRef) {
        const sectionRefs = Array.isArray(chapter.sectionRef) ? chapter.sectionRef : [chapter.sectionRef];
        sectionRefs.forEach(sectionRef => processSection(sectionRef, chapterName));
      }
    });
  }
  
  return codes;
};

// Extract notes from ICD code
const extractNotes = (diag) => {
  const notes = {};
  
  if (diag.includes) {
    const includesArray = Array.isArray(diag.includes.note) ? diag.includes.note : [diag.includes.note];
    notes.includes = includesArray.map(n => typeof n === 'string' ? n : n?.['#text'] || '').join(', ');
  }
  
  if (diag.excludes1) {
    const excludesArray = Array.isArray(diag.excludes1.note) ? diag.excludes1.note : [diag.excludes1.note];
    notes.excludes1 = excludesArray.map(n => typeof n === 'string' ? n : n?.['#text'] || '').join(', ');
  }
  
  if (diag.excludes2) {
    const excludesArray = Array.isArray(diag.excludes2.note) ? diag.excludes2.note : [diag.excludes2.note];
    notes.excludes2 = excludesArray.map(n => typeof n === 'string' ? n : n?.['#text'] || '').join(', ');
  }
  
  if (diag.codeAlso) {
    notes.codeAlso = typeof diag.codeAlso === 'string' ? diag.codeAlso : diag.codeAlso?.note || '';
  }
  
  if (diag.useAdditionalCode) {
    notes.useAdditionalCode = typeof diag.useAdditionalCode === 'string' ? diag.useAdditionalCode : diag.useAdditionalCode?.note || '';
  }
  
  return notes;
};

// Advanced text matching score calculator with better differentiation
const calculateScore = (text, query, code = '', isCode = false) => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const codeLower = code.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
  
  let score = 0;
  
  // Exact code match - highest priority
  if (codeLower === queryLower) {
    return 0.98;
  }
  
  // Code starts with query
  if (codeLower.startsWith(queryLower)) {
    return 0.95;
  }
  
  // Exact phrase match in description
  if (textLower === queryLower) {
    return 0.92;
  }
  
  // Exact phrase contained anywhere
  if (textLower.includes(queryLower)) {
    // Position-based scoring - earlier matches score higher
    const position = textLower.indexOf(queryLower);
    const positionScore = Math.max(0, 1 - (position / textLower.length));
    score += 0.50 + (positionScore * 0.15);
  }
  
  // Starting match bonus
  if (textLower.startsWith(queryLower)) {
    score += 0.25;
  }
  
  // Word-by-word matching with position awareness
  let matchedWords = 0;
  let totalWordScore = 0;
  
  queryWords.forEach((word, index) => {
    if (textLower.includes(word)) {
      matchedWords++;
      // Find word position for scoring
      const wordPos = textLower.indexOf(word);
      const posBonus = Math.max(0, 1 - (wordPos / textLower.length)) * 0.02;
      totalWordScore += 0.10 + posBonus;
    }
  });
  
  score += totalWordScore;
  
  // Match percentage bonus
  if (queryWords.length > 0) {
    const matchPercentage = matchedWords / queryWords.length;
    score += matchPercentage * 0.25;
    
    // Bonus for matching all words
    if (matchPercentage === 1.0) {
      score += 0.15;
    }
  }
  
  // Word order preservation bonus
  let lastIndex = -1;
  let orderedMatches = 0;
  queryWords.forEach(word => {
    const index = textLower.indexOf(word, lastIndex + 1);
    if (index > lastIndex) {
      orderedMatches++;
      lastIndex = index;
    }
  });
  
  if (queryWords.length > 0 && orderedMatches === queryWords.length) {
    score += 0.12;
  }
  
  // Word proximity bonus - words closer together score higher
  if (matchedWords > 1) {
    let minDistance = Infinity;
    for (let i = 0; i < queryWords.length - 1; i++) {
      const idx1 = textLower.indexOf(queryWords[i]);
      const idx2 = textLower.indexOf(queryWords[i + 1]);
      if (idx1 !== -1 && idx2 !== -1) {
        minDistance = Math.min(minDistance, Math.abs(idx2 - idx1));
      }
    }
    if (minDistance < 20) {
      score += 0.08;
    } else if (minDistance < 50) {
      score += 0.04;
    }
  }
  
  // Length similarity bonus (penalize very long or very short matches)
  const lengthRatio = Math.min(queryLower.length, textLower.length) / Math.max(queryLower.length, textLower.length);
  if (lengthRatio > 0.5) {
    score += lengthRatio * 0.05;
  }
  
  return Math.min(score, 1.0);
};

export const icdService = {
  // term: string -> returns [{ code, description, exercises: [string], score?: number }]
  lookupICD: async (term) => {
    const q = (term || '').trim();
    if (!q) return [];

    const allResults = [];

    // 1) Search ICF codes first
    icfCodes.forEach(icfItem => {
      // Include code, description, component, and notes in search
      const notesText = icfItem.notes ? Object.values(icfItem.notes).join(' ') : '';
      const searchText = `${icfItem.description} ${icfItem.component} ${notesText}`;
      const score = calculateScore(searchText, q, icfItem.code);
      
      if (score > 0.12) {
        allResults.push({
          code: icfItem.code,
          description: icfItem.description,
          source: icfItem.source || 'ICF',
          component: icfItem.component,
          notes: icfItem.notes || {},
          match_snippet: icfItem.description,
          score: score,
        });
      }
    });

    // 2) Load and search complete ICD-10-CM database (72,000+ codes)
    const icd10Codes = await loadICD10Database();
    
    icd10Codes.forEach(icdItem => {
      const notesText = icdItem.notes ? Object.values(icdItem.notes).join(' ') : '';
      const searchText = `${icdItem.description} ${icdItem.chapter} ${notesText}`;
      const score = calculateScore(searchText, q, icdItem.code);
      
      if (score > 0.12) {
        allResults.push({
          code: icdItem.code,
          description: icdItem.description,
          source: 'ICD-10-CM',
          chapter: icdItem.chapter,
          notes: icdItem.notes || {},
          match_snippet: icdItem.description,
          score: score,
        });
      }
    });

    // 3) Fallback: Search demo database if main database failed to load
    if (icd10Codes.length === 0) {
      console.warn('Using fallback ICD-10-CM demo database');
      const icdDemo = [
      { code: 'M54.5', description: 'Low back pain', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Lumbar pain, Lower back pain, Lumbago NOS', excludes: 'Low back strain (S39.012), Sciatica (M54.3-M54.4)' },
        exercises: ['Lumbar extension', 'Bridging', 'Core activation', 'Pelvic tilts'] },
      { code: 'M25.5', description: 'Pain in joint', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { excludes: 'Pain in hand (M79.64-), Pain in fingers (M79.64-), Pain in foot (M79.67-), Pain in toes (M79.67-)' },
        exercises: ['Active range of motion', 'Joint mobilization', 'Isometric strengthening'] },
      { code: 'R52', description: 'Pain, unspecified', chapter: 'Symptoms, signs and abnormal clinical and laboratory findings (R00-R99)', 
        notes: { includes: 'Acute pain NOS, Generalized pain NOS, Pain NOS', excludes: 'Acute and chronic pain (G89.-), Localized pain by site' },
        exercises: ['Pain management techniques', 'Gentle movement'] },
      { code: 'G89', description: 'Pain, not elsewhere classified', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { codeAlso: 'Related psychological factors associated with pain (F45.42)', excludes: 'Generalized pain NOS (R52), Pain NOS (R52)' },
        exercises: ['Pain management', 'Relaxation techniques', 'Mindfulness'] },
      { code: 'R26.2', description: 'Difficulty in walking, not elsewhere classified', chapter: 'Symptoms, signs and abnormal clinical and laboratory findings (R00-R99)', 
        notes: { excludes: 'Falling (R29.6), Locomotor ataxia (syphilitic) (A52.11), Immobility syndrome (M62.3)' },
        exercises: ['Gait training', 'Balance exercises', 'Strengthening', 'Assistive device training'] },
      { code: 'M79.3', description: 'Panniculitis, unspecified', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { excludes: 'Lupus panniculitis (L93.2), Neck and back panniculitis (M54.0-), Relapsing panniculitis (M35.6)' },
        exercises: ['Gentle soft tissue mobilization'] },
      { code: 'I63', description: 'Cerebral infarction (Stroke)', chapter: 'Diseases of the circulatory system (I00-I99)', 
        notes: { includes: 'Occlusion and stenosis of cerebral and precerebral arteries, resulting in cerebral infarction', useAdditionalCode: 'National Institutes of Health Stroke Scale (NIHSS) score (R29.7-)' },
        exercises: ['Balance retraining', 'Gait training', 'Upper limb functional tasks', 'ADL training'] },
      { code: 'M16.1', description: 'Unilateral primary osteoarthritis of hip', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Osteoarthritis of hip NOS', excludes: 'Polyarthrosis (M15.-)' },
        exercises: ['Hip abductor strengthening', 'Gluteal bridging', 'Hip flexor stretching', 'Range of motion'] },
      { code: 'M17.0', description: 'Bilateral primary osteoarthritis of knee', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Osteoarthritis of knee NOS', requires: 'Use additional code to identify affected knee' },
        exercises: ['Quadriceps strengthening', 'Knee range of motion', 'Hamstring strengthening', 'Balance training'] },
      { code: 'S83.2', description: 'Tear of meniscus, current injury', chapter: 'Injury, poisoning and certain other consequences of external causes (S00-T88)', 
        notes: { includes: 'Bucket-handle tear of meniscus, Complex tear of meniscus', excludes: 'Old bucket-handle tear (M23.2)' },
        exercises: ['Quadriceps sets', 'Straight leg raises', 'Knee range of motion', 'Progressive strengthening'] },
      { code: 'M23.2', description: 'Derangement of meniscus due to old tear or injury', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Old bucket-handle tear', excludes: 'Current injury - see injury of knee and lower leg (S80-S89)' },
        exercises: ['Knee strengthening', 'Balance training', 'Functional exercises'] },
      { code: 'M75.1', description: 'Rotator cuff syndrome', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Rotator cuff tear or rupture, not specified as traumatic', excludes: 'Tear of rotator cuff, traumatic (S46.01-)' },
        exercises: ['Rotator cuff strengthening', 'Scapular stabilization', 'Shoulder ROM', 'Postural exercises'] },
      { code: 'M51.1', description: 'Thoracic, thoracolumbar, and lumbosacral intervertebral disc disorders with radiculopathy', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Sciatica due to intervertebral disc disorder', excludes: 'Lumbar radiculitis NOS (M54.16)' },
        exercises: ['Neural mobilization', 'Core strengthening', 'Nerve glides', 'Postural training'] },
      { code: 'G81.9', description: 'Hemiplegia, unspecified affecting unspecified side', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Paralysis of one side', useAdditionalCode: 'Cause of hemiplegia' },
        exercises: ['Weight shifting', 'Functional mobility training', 'Balance training', 'Task-specific training'] },
      { code: 'M62.81', description: 'Muscle weakness (generalized)', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { excludes: 'Muscle weakness in sarcopenia (M62.84), Progressive muscular atrophy (G12.21)' },
        exercises: ['Progressive resistance training', 'Functional strengthening', 'Endurance training'] },
      { code: 'Z74.09', description: 'Bed confinement status', chapter: 'Factors influencing health status and contact with health services (Z00-Z99)', 
        notes: { includes: 'Reduced mobility', codeFirst: 'Associated condition' },
        exercises: ['Mobility training', 'Assistive device training', 'Bed mobility', 'Transfer training'] },
      { code: 'M79.1', description: 'Myalgia', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Muscle pain', excludes: 'Myalgia in trichinellosis (B75), Myofascial pain syndrome (M79.7)' },
        exercises: ['Stretching', 'Gentle strengthening', 'Soft tissue mobilization'] },
      { code: 'M79.7', description: 'Fibromyalgia', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Chronic widespread pain, Myofascial pain syndrome', excludes: 'Psychogenic rheumatism (F45.8)' },
        exercises: ['Aerobic conditioning', 'Flexibility exercises', 'Gradual strengthening', 'Relaxation'] },
      { code: 'M65.9', description: 'Synovitis and tenosynovitis, unspecified', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Capsulitis NOS, Tenosynovitis NOS', excludes: 'Chronic crepitant synovitis of hand and wrist (M70.0-)' },
        exercises: ['Gentle mobilization', 'Strengthening', 'ROM exercises'] },
      { code: 'M25.51', description: 'Pain in shoulder', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Arthralgia of shoulder', useAdditionalCode: 'Identify laterality' },
        exercises: ['Shoulder mobilization', 'Rotator cuff exercises', 'Scapular strengthening', 'ROM'] },
      { code: 'M54.2', description: 'Cervicalgia', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Neck pain', excludes: 'Cervicalgia due to intervertebral cervical disc disorder (M50.-)' },
        exercises: ['Cervical range of motion', 'Postural exercises', 'Neck strengthening', 'Deep neck flexors'] },
      { code: 'M54.6', description: 'Pain in thoracic spine', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Thoracic pain', excludes: 'Pain in thoracic spine due to intervertebral disc disorder (M51.-)' },
        exercises: ['Thoracic mobilization', 'Postural correction', 'Scapular stabilization', 'Breathing exercises'] },
      { code: 'G56.0', description: 'Carpal tunnel syndrome', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Median nerve entrapment at wrist', useAdditionalCode: 'Identify affected limb' },
        exercises: ['Nerve gliding', 'Wrist strengthening', 'Ergonomic modifications', 'Tendon glides'] },
      { code: 'M19.90', description: 'Unspecified osteoarthritis, unspecified site', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Arthritis NOS, Osteoarthritis NOS', useAdditionalCode: 'Identify site if known' },
        exercises: ['Joint protection', 'Strengthening', 'ROM exercises', 'Low-impact aerobics'] },
      { code: 'M53.3', description: 'Sacrococcygeal disorders, not elsewhere classified', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Coccygodynia', excludes: 'Low back pain (M54.5)' },
        exercises: ['Pelvic floor exercises', 'Posture training', 'Soft tissue mobilization', 'Modalities'] },
      { code: 'Y93.0', description: 'Activity, walking, marching and hiking', chapter: 'External causes of morbidity (V00-Y99)', 
        notes: { includes: 'Activities involving walking and running', useAdditionalCode: 'Place of occurrence' },
        exercises: ['Gait training', 'Endurance training', 'Balance exercises', 'Lower extremity strengthening'] },
      { code: 'S43.4', description: 'Sprain of shoulder joint', chapter: 'Injury, poisoning and certain other consequences of external causes (S00-T88)', 
        notes: { includes: 'Sprain of coracohumeral ligament, Sprain of rotator cuff capsule', excludes: 'Strain of muscle, fascia and tendon of shoulder and upper arm (S46.-)' },
        exercises: ['Gentle ROM', 'Isometric strengthening', 'Progressive resistance', 'Functional training'] },
      { code: 'S93.4', description: 'Sprain of ankle', chapter: 'Injury, poisoning and certain other consequences of external causes (S00-T88)', 
        notes: { includes: 'Sprain of calcaneofibular ligament, Sprain of deltoid ligament, Sprain of tibiofibular ligament', excludes: 'Injury of Achilles tendon (S86.0-)' },
        exercises: ['RICE protocol', 'Ankle ROM', 'Balance training', 'Progressive strengthening', 'Proprioception'] },
      { code: 'M70.6', description: 'Trochanteric bursitis', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Bursitis of hip NOS', excludes: 'Bursitis due to use, overuse and pressure (M70.-)', requires: 'Use additional code to identify laterality' },
        exercises: ['Hip abductor strengthening', 'ITB stretching', 'Gluteal strengthening', 'Activity modification'] },
      { code: 'M77.9', description: 'Enthesopathy, unspecified', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Bone spur NOS, Capsulitis NOS, Periarthritis NOS, Tendinitis NOS', excludes: 'Spinal enthesopathy (M46.0-)' },
        exercises: ['Stretching', 'Eccentric strengthening', 'Activity modification', 'Gradual loading'] },
      { code: 'M25.57', description: 'Pain in ankle and joints of foot', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Arthralgia of ankle and foot', excludes: 'Pain in toe (M79.67-)' },
        exercises: ['Ankle mobilization', 'Foot intrinsic strengthening', 'Balance training', 'Gait training'] },
      { code: 'M79.0', description: 'Rheumatism, unspecified', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Fibrositis NOS, Myositis NOS', excludes: 'Fibromyalgia (M79.7), Palindromic rheumatism (M12.3-)' },
        exercises: ['Gentle ROM', 'Heat therapy', 'Gradual strengthening', 'Activity pacing'] },
      { code: 'M84.4', description: 'Pathological fracture, not elsewhere classified', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Chronic fracture, Stress fracture NOS', excludes: 'Collapsed vertebra NEC (M48.5), Pathological fracture in neoplastic disease (M84.5-)' },
        exercises: ['Protected weight bearing', 'Bone healing exercises', 'Gradual loading', 'Functional restoration'] },
      { code: 'G54.0', description: 'Brachial plexus disorders', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Thoracic outlet syndrome', excludes: 'Current traumatic brachial plexus injury (S14.3)' },
        exercises: ['Nerve gliding', 'Postural correction', 'Shoulder girdle strengthening', 'Neural mobilization'] },
      { code: 'I69.3', description: 'Sequelae of cerebral infarction', chapter: 'Diseases of the circulatory system (I00-I99)', 
        notes: { includes: 'Category for conditions classifiable to I63', useAdditionalCode: 'Identify specific sequelae' },
        exercises: ['Functional mobility', 'ADL training', 'Balance retraining', 'Task-specific practice'] },
      { code: 'M43.6', description: 'Torticollis', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Wry neck NOS', excludes: 'Congenital (sternomastoid) torticollis (Q68.0), Psychogenic torticollis (F45.8)' },
        exercises: ['Cervical ROM', 'Stretching', 'Postural retraining', 'Strengthening'] },
      
      // Additional Spine Conditions
      { code: 'M47.816', description: 'Spondylosis without myelopathy or radiculopathy, lumbar region', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Arthritis of spine, Degenerative arthritis of spine', excludes: 'Spondylosis with myelopathy (M47.1-), Spondylosis with radiculopathy (M47.2-)' },
        exercises: ['Spinal stabilization', 'Core strengthening', 'Flexibility exercises'] },
      { code: 'M48.06', description: 'Spinal stenosis, lumbar region', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Narrowing of spinal canal', excludes: 'Spinal stenosis with neurogenic claudication (M48.062)' },
        exercises: ['Flexion-based exercises', 'Walking program', 'Core stability'] },
      { code: 'M50.20', description: 'Other cervical disc displacement, unspecified cervical region', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Cervical disc disorder', codeAlso: 'Myelopathy (G99.2), Radiculopathy (M54.1)' },
        exercises: ['Cervical traction', 'Postural correction', 'Neck strengthening'] },
      { code: 'M51.26', description: 'Other intervertebral disc displacement, lumbar region', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Lumbar disc herniation', excludes: 'Current traumatic disc displacement (S33.1)' },
        exercises: ['McKenzie extension', 'Core stabilization', 'Neural mobilization'] },
      
      // Knee Conditions
      { code: 'M17.11', description: 'Unilateral primary osteoarthritis, right knee', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Osteoarthritis of knee', excludes: 'Post-traumatic osteoarthritis (M17.3-)' },
        exercises: ['Quadriceps strengthening', 'Hamstring flexibility', 'Balance training'] },
      { code: 'M17.12', description: 'Unilateral primary osteoarthritis, left knee', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Osteoarthritis of knee', excludes: 'Post-traumatic osteoarthritis (M17.3-)' },
        exercises: ['Quadriceps strengthening', 'Hamstring flexibility', 'Balance training'] },
      { code: 'M23.91', description: 'Unspecified internal derangement of right knee', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Knee derangement NOS', excludes: 'Current injury - see injury of knee and lower leg (S80-S89)' },
        exercises: ['Knee ROM', 'Strengthening', 'Functional training'] },
      { code: 'M22.41', description: 'Chondromalacia patellae, right knee', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Patellofemoral syndrome', excludes: 'Chondromalacia patellae with current injury (S76.1-)' },
        exercises: ['VMO strengthening', 'Patellar mobilization', 'Hip strengthening', 'Quadriceps flexibility'] },
      { code: 'M76.5', description: 'Patellar tendinitis', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Jumper\'s knee', excludes: 'Rupture of patellar tendon (M66.0)' },
        exercises: ['Eccentric training', 'Quadriceps strengthening', 'Jump training progression'] },
      
      // Hip Conditions
      { code: 'M16.11', description: 'Unilateral primary osteoarthritis, right hip', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Degenerative hip disease', excludes: 'Bilateral hip osteoarthritis (M16.0)' },
        exercises: ['Hip abduction', 'Gluteal strengthening', 'Hip flexor stretching'] },
      { code: 'M16.12', description: 'Unilateral primary osteoarthritis, left hip', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Degenerative hip disease', excludes: 'Bilateral hip osteoarthritis (M16.0)' },
        exercises: ['Hip abduction', 'Gluteal strengthening', 'Hip flexor stretching'] },
      { code: 'M76.00', description: 'Gluteal tendinitis, unspecified hip', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Greater trochanter pain syndrome', excludes: 'Trochanteric bursitis (M70.6-)' },
        exercises: ['Hip abductor strengthening', 'Gluteus medius exercises', 'Gait training'] },
      { code: 'M24.75', description: 'Protrusio acetabuli', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Hip socket deformity', useAdditionalCode: 'Identify laterality' },
        exercises: ['Hip ROM', 'Core stability', 'Protected weight bearing'] },
      
      // Shoulder Conditions
      { code: 'M75.100', description: 'Unspecified rotator cuff tear or rupture of unspecified shoulder, not specified as traumatic', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Rotator cuff syndrome', excludes: 'Traumatic tear of rotator cuff (S46.01-)' },
        exercises: ['Pendulum exercises', 'Progressive strengthening', 'Scapular stabilization'] },
      { code: 'M75.0', description: 'Adhesive capsulitis of shoulder', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Frozen shoulder, Periarthritis of shoulder', excludes: 'Shoulder impingement syndrome (M75.4)' },
        exercises: ['Capsular stretching', 'Joint mobilization', 'Progressive ROM'] },
      { code: 'M75.4', description: 'Impingement syndrome of shoulder', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Subacromial syndrome', excludes: 'Rotator cuff syndrome (M75.1)' },
        exercises: ['Scapular strengthening', 'Rotator cuff strengthening', 'Postural correction'] },
      { code: 'M75.2', description: 'Bicipital tendinitis', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Inflammation of long head of biceps', excludes: 'Rupture of biceps tendon (M66.-)' },
        exercises: ['Biceps tendon exercises', 'Shoulder stabilization', 'ROM exercises'] },
      
      // Elbow and Wrist
      { code: 'M77.10', description: 'Lateral epicondylitis, unspecified elbow', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Tennis elbow', excludes: 'Lateral epicondylitis with rupture (M77.11)' },
        exercises: ['Eccentric wrist exercises', 'Forearm strengthening', 'Grip strengthening'] },
      { code: 'M77.00', description: 'Medial epicondylitis, unspecified elbow', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Golfer\'s elbow', excludes: 'Medial epicondylitis with rupture (M77.01)' },
        exercises: ['Wrist flexor strengthening', 'Forearm stretching', 'Grip exercises'] },
      { code: 'G56.00', description: 'Carpal tunnel syndrome, unspecified upper limb', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Median nerve entrapment', useAdditionalCode: 'Identify laterality' },
        exercises: ['Nerve gliding', 'Tendon glides', 'Wrist strengthening', 'Ergonomic training'] },
      { code: 'M25.531', description: 'Pain in right wrist', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Wrist arthralgia', excludes: 'Pain in hand (M79.64-)' },
        exercises: ['Wrist ROM', 'Strengthening', 'Joint mobilization'] },
      
      // Ankle and Foot
      { code: 'M25.571', description: 'Pain in right ankle and joints of right foot', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Ankle arthralgia', excludes: 'Pain in toe (M79.67-)' },
        exercises: ['Ankle ROM', 'Balance training', 'Strengthening'] },
      { code: 'M25.572', description: 'Pain in left ankle and joints of left foot', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Ankle arthralgia', excludes: 'Pain in toe (M79.67-)' },
        exercises: ['Ankle ROM', 'Balance training', 'Strengthening'] },
      { code: 'M77.30', description: 'Calcaneal spur, unspecified foot', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Heel spur', excludes: 'Plantar fasciitis (M72.2)' },
        exercises: ['Plantar fascia stretching', 'Calf stretching', 'Foot intrinsics'] },
      { code: 'M72.2', description: 'Plantar fascial fibromatosis', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Plantar fasciitis', excludes: 'Calcaneal spur (M77.3)' },
        exercises: ['Plantar fascia stretching', 'Calf stretches', 'Arch strengthening', 'Night splinting'] },
      { code: 'M76.6', description: 'Achilles tendinitis', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Tendinitis of Achilles tendon', excludes: 'Achilles tendon rupture (M66.2, S86.0)' },
        exercises: ['Eccentric heel drops', 'Calf strengthening', 'Stretching', 'Progressive loading'] },
      
      // Neurological Conditions
      { code: 'G81.10', description: 'Spastic hemiplegia affecting unspecified side', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Hemiparesis with spasticity', useAdditionalCode: 'Cause of hemiplegia' },
        exercises: ['Spasticity management', 'Functional mobility', 'Task-specific training'] },
      { code: 'G81.90', description: 'Hemiplegia, unspecified affecting right dominant side', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Paralysis of one side', useAdditionalCode: 'Underlying cause' },
        exercises: ['Weight shifting', 'Gait training', 'ADL training', 'Balance exercises'] },
      { code: 'G82.20', description: 'Paraplegia, unspecified', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Paralysis of both lower limbs', useAdditionalCode: 'Level of injury if known' },
        exercises: ['Upper body strengthening', 'Transfer training', 'Wheelchair mobility', 'Pressure relief'] },
      { code: 'G83.10', description: 'Monoplegia of lower limb affecting unspecified side', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Paralysis of one limb', useAdditionalCode: 'Underlying cause' },
        exercises: ['Strengthening', 'Gait training', 'Balance exercises'] },
      { code: 'G57.00', description: 'Lesion of sciatic nerve, unspecified lower limb', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Sciatic neuropathy', excludes: 'Sciatica due to intervertebral disc disorder (M54.4-)' },
        exercises: ['Neural mobilization', 'Nerve gliding', 'Stretching', 'Strengthening'] },
      
      // Balance and Gait Disorders
      { code: 'R26.81', description: 'Unsteadiness on feet', chapter: 'Symptoms, signs and abnormal clinical and laboratory findings (R00-R99)', 
        notes: { includes: 'Balance difficulty', excludes: 'Vertigo (R42), Ataxia (R27.0)' },
        exercises: ['Balance training', 'Gait training', 'Strengthening', 'Vestibular exercises'] },
      { code: 'R26.89', description: 'Other abnormalities of gait and mobility', chapter: 'Symptoms, signs and abnormal clinical and laboratory findings (R00-R99)', 
        notes: { includes: 'Gait abnormality NOS', excludes: 'Ataxia (R27.0)' },
        exercises: ['Gait training', 'Coordination exercises', 'Strengthening'] },
      { code: 'R27.0', description: 'Ataxia, unspecified', chapter: 'Symptoms, signs and abnormal clinical and laboratory findings (R00-R99)', 
        notes: { includes: 'Coordination difficulty', excludes: 'Hereditary ataxia (G11.-)' },
        exercises: ['Coordination training', 'Balance exercises', 'Functional activities'] },
      { code: 'R29.6', description: 'Repeated falls', chapter: 'Symptoms, signs and abnormal clinical and laboratory findings (R00-R99)', 
        notes: { includes: 'Falling, Tendency to fall', excludes: 'History of falling (Z91.81)' },
        exercises: ['Fall prevention training', 'Balance exercises', 'Strengthening', 'Environmental modifications'] },
      
      // Post-Surgical Conditions
      { code: 'Z96.641', description: 'Presence of right artificial hip joint', chapter: 'Factors influencing health status and contact with health services (Z00-Z99)', 
        notes: { includes: 'Status post hip replacement', codeAlso: 'Complications if applicable' },
        exercises: ['Hip ROM', 'Progressive strengthening', 'Gait training', 'Functional mobility'] },
      { code: 'Z96.642', description: 'Presence of left artificial hip joint', chapter: 'Factors influencing health status and contact with health services (Z00-Z99)', 
        notes: { includes: 'Status post hip replacement', codeAlso: 'Complications if applicable' },
        exercises: ['Hip ROM', 'Progressive strengthening', 'Gait training', 'Functional mobility'] },
      { code: 'Z96.651', description: 'Presence of right artificial knee joint', chapter: 'Factors influencing health status and contact with health services (Z00-Z99)', 
        notes: { includes: 'Status post knee replacement', codeAlso: 'Complications if applicable' },
        exercises: ['Knee ROM', 'Quadriceps strengthening', 'Gait training', 'Functional activities'] },
      { code: 'Z96.652', description: 'Presence of left artificial knee joint', chapter: 'Factors influencing health status and contact with health services (Z00-Z99)', 
        notes: { includes: 'Status post knee replacement', codeAlso: 'Complications if applicable' },
        exercises: ['Knee ROM', 'Quadriceps strengthening', 'Gait training', 'Functional activities'] },
      { code: 'Z98.89', description: 'Other specified postprocedural states', chapter: 'Factors influencing health status and contact with health services (Z00-Z99)', 
        notes: { includes: 'Status post surgery NOS', useAdditionalCode: 'Identify specific procedure' },
        exercises: ['Progressive mobility', 'Strengthening', 'Functional restoration'] },
      
      // Fractures and Injuries
      { code: 'S72.001A', description: 'Fracture of unspecified part of neck of right femur, initial encounter', chapter: 'Injury, poisoning and certain other consequences of external causes (S00-T88)', 
        notes: { includes: 'Hip fracture', useAdditionalCode: 'Cause of injury (W00-Y99)' },
        exercises: ['Protected weight bearing', 'Hip ROM', 'Progressive strengthening', 'Gait training'] },
      { code: 'S82.001A', description: 'Unspecified fracture of right patella, initial encounter', chapter: 'Injury, poisoning and certain other consequences of external causes (S00-T88)', 
        notes: { includes: 'Broken kneecap', excludes: 'Traumatic amputation of lower leg (S88.-)' },
        exercises: ['Quadriceps sets', 'Knee ROM', 'Progressive strengthening'] },
      { code: 'S42.001A', description: 'Fracture of unspecified part of right clavicle, initial encounter', chapter: 'Injury, poisoning and certain other consequences of external causes (S00-T88)', 
        notes: { includes: 'Broken collarbone', useAdditionalCode: 'Cause of injury' },
        exercises: ['Pendulum exercises', 'Elbow ROM', 'Progressive shoulder strengthening'] },
      { code: 'S52.501A', description: 'Unspecified fracture of the lower end of right radius, initial encounter', chapter: 'Injury, poisoning and certain other consequences of external causes (S00-T88)', 
        notes: { includes: 'Distal radius fracture, Colles fracture', excludes: 'Physeal fractures of lower end of radius (S59.2-)' },
        exercises: ['Wrist ROM', 'Grip strengthening', 'Forearm exercises'] },
      
      // Chronic Pain Conditions
      { code: 'G89.4', description: 'Chronic pain syndrome', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Chronic pain associated with trauma or psychosocial dysfunction', codeAlso: 'Associated psychological factors (F45.42)' },
        exercises: ['Pain management', 'Graded exercise', 'Functional restoration', 'Cognitive behavioral approaches'] },
      { code: 'G89.21', description: 'Chronic pain due to trauma', chapter: 'Diseases of the nervous system (G00-G99)', 
        notes: { includes: 'Post-traumatic pain', codeAlso: 'Site of pain' },
        exercises: ['Graded activity', 'Pain neuroscience education', 'Functional exercises'] },
      { code: 'M79.604', description: 'Pain in right leg', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Leg pain NOS', excludes: 'Pain in limb associated with diabetic neuropathy (E10-E13 with .42)' },
        exercises: ['Stretching', 'Strengthening', 'Activity modification'] },
      { code: 'M79.605', description: 'Pain in left leg', chapter: 'Diseases of the musculoskeletal system and connective tissue (M00-M99)', 
        notes: { includes: 'Leg pain NOS', excludes: 'Pain in limb associated with diabetic neuropathy (E10-E13 with .42)' },
        exercises: ['Stretching', 'Strengthening', 'Activity modification'] },
    ];

      icdDemo.forEach(icdItem => {
        // Include code, description, chapter, and notes in search
        const notesText = icdItem.notes ? Object.values(icdItem.notes).join(' ') : '';
        const searchText = `${icdItem.description} ${icdItem.chapter} ${notesText}`;
        const score = calculateScore(searchText, q, icdItem.code);
        
        if (score > 0.12) {
          allResults.push({
            code: icdItem.code,
            description: icdItem.description,
            source: 'ICD-10-CM',
            chapter: icdItem.chapter,
            notes: icdItem.notes || {},
            match_snippet: icdItem.description,
            score: score,
          });
        }
      });
    }

    // Sort by score (highest first) and return top 50
    allResults.sort((a, b) => b.score - a.score);
    return allResults.slice(0, 50);
  }
};

export default icdService;
