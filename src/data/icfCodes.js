// ICF (International Classification of Functioning, Disability and Health) codes
// Proper structure: code, description, source, component, notes

export const icfCodes = [
  // Body Functions - Pain (b280-b289)
  { code: 'b280', description: 'Sensation of pain', source: 'ICF', component: 'Body Functions', notes: { definition: 'Unpleasant sensation indicating potential or actual damage to body structure' } },
  { code: 'b2800', description: 'Generalized pain', source: 'ICF', component: 'Body Functions', notes: { definition: 'Pain experienced throughout entire body or whole body region' } },
  { code: 'b2801', description: 'Pain in body part', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b2802', description: 'Pain in multiple body parts', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b2803', description: 'Radiating pain in a segment or region', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b289', description: 'Sensation of pain, other specified', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Joint Mobility (b710-b719)
  { code: 'b710', description: 'Mobility of joint functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Mobility of single or several joints' } },
  { code: 'b7100', description: 'Mobility of a single joint', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b7101', description: 'Mobility of several joints', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Muscle Power (b730-b740)
  { code: 'b730', description: 'Muscle power functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Power of muscles of limbs, trunk, body' } },
  { code: 'b7300', description: 'Power of isolated muscles and muscle groups', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b7301', description: 'Power of muscles of one limb', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b735', description: 'Muscle tone functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b740', description: 'Muscle endurance functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Movement Control (b760-b770)
  { code: 'b760', description: 'Control of voluntary movement functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Control and coordination of voluntary movements' } },
  { code: 'b765', description: 'Involuntary movement functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Tremor, tics, mannerisms' } },
  { code: 'b770', description: 'Gait pattern functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Walking and running patterns' } },
  
  // Activities & Participation - Changing Position (d410-d429)
  { code: 'd410', description: 'Changing basic body position', source: 'ICF', component: 'Activities & Participation', notes: { includes: 'Lying, squatting, kneeling, sitting, standing' } },
  { code: 'd4100', description: 'Lying down', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd4101', description: 'Squatting', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd4102', description: 'Kneeling', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd4103', description: 'Sitting', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd4104', description: 'Standing', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd4105', description: 'Bending', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd415', description: 'Maintaining a body position', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd420', description: 'Transferring oneself', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd430', description: 'Lifting and carrying objects', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Hand Use (d440-d449)
  { code: 'd440', description: 'Fine hand use', source: 'ICF', component: 'Activities & Participation', notes: { includes: 'Picking up, grasping, manipulating, releasing' } },
  { code: 'd445', description: 'Hand and arm use', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Walking (d450-d475)
  { code: 'd450', description: 'Walking', source: 'ICF', component: 'Activities & Participation', notes: { includes: 'Walking short or long distances, on different surfaces' } },
  { code: 'd4500', description: 'Walking short distances', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd4501', description: 'Walking long distances', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd4502', description: 'Walking on different surfaces', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd4503', description: 'Walking around obstacles', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd455', description: 'Moving around', source: 'ICF', component: 'Activities & Participation', notes: { includes: 'Crawling, climbing, running, jogging' } },
  { code: 'd460', description: 'Moving around in different locations', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd465', description: 'Moving around using equipment', source: 'ICF', component: 'Activities & Participation', notes: { includes: 'Wheelchair, walker, skates' } },
  { code: 'd470', description: 'Using transportation', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd475', description: 'Driving', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd498', description: 'Mobility, other specified', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd499', description: 'Mobility, unspecified', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Self-care (d510-d560)
  { code: 'd510', description: 'Washing oneself', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd520', description: 'Caring for body parts', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd530', description: 'Toileting', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd540', description: 'Dressing', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd550', description: 'Eating', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd560', description: 'Drinking', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Body Functions - Cardiovascular (b410-b440)
  { code: 'b410', description: 'Heart functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Heart rate, rhythm, cardiac output' } },
  { code: 'b415', description: 'Blood vessel functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b420', description: 'Blood pressure functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b440', description: 'Respiration functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Respiration rate, rhythm, depth' } },
  
  // Body Functions - Digestive (b510-b525)
  { code: 'b510', description: 'Ingestion functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Sucking, chewing, swallowing' } },
  { code: 'b515', description: 'Digestive functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b525', description: 'Defecation functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Mental (b110-b152)
  { code: 'b110', description: 'Consciousness functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'State of awareness and alertness' } },
  { code: 'b114', description: 'Orientation functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Orientation to time, place, person' } },
  { code: 'b117', description: 'Intellectual functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b122', description: 'Global psychosocial functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b126', description: 'Temperament and personality functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b130', description: 'Energy and drive functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Energy level, motivation, appetite' } },
  { code: 'b134', description: 'Sleep functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b140', description: 'Attention functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b144', description: 'Memory functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Short-term, long-term memory' } },
  { code: 'b152', description: 'Emotional functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Sensory (b210-b270)
  { code: 'b210', description: 'Seeing functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Visual acuity, field of vision' } },
  { code: 'b230', description: 'Hearing functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b235', description: 'Vestibular functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Balance, position sense' } },
  { code: 'b260', description: 'Proprioceptive function', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b265', description: 'Touch function', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b270', description: 'Sensory functions related to temperature and other stimuli', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Activities & Participation - Learning (d110-d177)
  { code: 'd110', description: 'Watching', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd115', description: 'Listening', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd130', description: 'Copying', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd135', description: 'Rehearsing', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd140', description: 'Learning to read', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd145', description: 'Learning to write', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd150', description: 'Learning to calculate', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd155', description: 'Acquiring skills', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd160', description: 'Focusing attention', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd163', description: 'Thinking', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd166', description: 'Reading', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd170', description: 'Writing', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd172', description: 'Calculating', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd175', description: 'Solving problems', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd177', description: 'Making decisions', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Communication (d310-d360)
  { code: 'd310', description: 'Communicating with - receiving - spoken messages', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd315', description: 'Communicating with - receiving - nonverbal messages', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd320', description: 'Communicating with - receiving - formal sign language', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd325', description: 'Communicating with - receiving - written messages', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd330', description: 'Speaking', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd335', description: 'Producing nonverbal messages', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd340', description: 'Producing messages in formal sign language', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd345', description: 'Writing messages', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd350', description: 'Conversation', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd355', description: 'Discussion', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd360', description: 'Using communication devices and techniques', source: 'ICF', component: 'Activities & Participation', notes: {} },
];
