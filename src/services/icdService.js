// Lightweight ICD lookup service for the front-end - Client-side search
import { icfCodes } from '../data/icfCodes';

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

    // 2) Search ICD-10-CM codes from comprehensive demo database
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

    // Sort by score (highest first) and return top 40
    allResults.sort((a, b) => b.score - a.score);
    return allResults.slice(0, 40);
  }
};

export default icdService;
