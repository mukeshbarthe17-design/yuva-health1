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
  
  // Body Functions - Additional Pain codes
  { code: 'b28010', description: 'Pain in head and neck', source: 'ICF', component: 'Body Functions', notes: { includes: 'Headache, facial pain, neck pain' } },
  { code: 'b28011', description: 'Pain in chest', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b28012', description: 'Pain in stomach or abdomen', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b28013', description: 'Pain in back', source: 'ICF', component: 'Body Functions', notes: { includes: 'Upper back, lower back, sacral pain' } },
  { code: 'b28014', description: 'Pain in upper limb', source: 'ICF', component: 'Body Functions', notes: { includes: 'Shoulder, arm, hand pain' } },
  { code: 'b28015', description: 'Pain in lower limb', source: 'ICF', component: 'Body Functions', notes: { includes: 'Hip, leg, foot pain' } },
  { code: 'b28016', description: 'Pain in joints', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b28018', description: 'Pain in body part, other specified', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Touch and Temperature
  { code: 'b265', description: 'Touch function', source: 'ICF', component: 'Body Functions', notes: { includes: 'Tactile discrimination, texture perception' } },
  { code: 'b2650', description: 'Touch function of hand', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b2651', description: 'Touch function of foot', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b270', description: 'Sensory functions related to temperature and other stimuli', source: 'ICF', component: 'Body Functions', notes: { includes: 'Temperature sensitivity, pressure, vibration' } },
  { code: 'b2700', description: 'Temperature sensation', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b2701', description: 'Vibration sensation', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b2702', description: 'Pressure sensation', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Balance and Coordination
  { code: 'b755', description: 'Involuntary movement reaction functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Postural reactions, righting reflexes' } },
  { code: 'b7550', description: 'Postural reactions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b7551', description: 'Righting reflexes', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Structures
  { code: 's750', description: 'Structure of lower extremity', source: 'ICF', component: 'Body Structures', notes: { includes: 'Hip, thigh, leg, ankle, foot' } },
  { code: 's7500', description: 'Hip', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7501', description: 'Thigh', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7502', description: 'Knee', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7503', description: 'Lower leg', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7504', description: 'Ankle', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7505', description: 'Foot', source: 'ICF', component: 'Body Structures', notes: {} },
  
  { code: 's720', description: 'Structure of shoulder region', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7200', description: 'Bones of shoulder region', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7201', description: 'Joints of shoulder region', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7202', description: 'Muscles of shoulder region', source: 'ICF', component: 'Body Structures', notes: {} },
  
  { code: 's730', description: 'Structure of upper extremity', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7300', description: 'Upper arm', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7301', description: 'Forearm', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7302', description: 'Wrist', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7303', description: 'Hand', source: 'ICF', component: 'Body Structures', notes: {} },
  
  { code: 's760', description: 'Structure of trunk', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7600', description: 'Structure of cervical region', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7601', description: 'Structure of thoracic region', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7602', description: 'Structure of lumbar region', source: 'ICF', component: 'Body Structures', notes: {} },
  { code: 's7603', description: 'Structure of pelvic region', source: 'ICF', component: 'Body Structures', notes: {} },
  
  // Activities & Participation - Domestic Life
  { code: 'd630', description: 'Preparing meals', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd640', description: 'Doing housework', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd6400', description: 'Washing and drying clothes', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd6401', description: 'Cleaning cooking area and utensils', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd6402', description: 'Cleaning living area', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd650', description: 'Caring for household objects', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd660', description: 'Assisting others', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Work and Employment
  { code: 'd845', description: 'Acquiring, keeping and terminating a job', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd850', description: 'Remunerative employment', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd855', description: 'Non-remunerative employment', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd860', description: 'Basic economic transactions', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd870', description: 'Economic self-sufficiency', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Community, Social and Civic Life
  { code: 'd910', description: 'Community life', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd920', description: 'Recreation and leisure', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd9200', description: 'Play', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd9201', description: 'Sports', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd9202', description: 'Arts and culture', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd9203', description: 'Crafts', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd9204', description: 'Hobbies', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd9205', description: 'Socializing', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Environmental Factors
  { code: 'e110', description: 'Products or substances for personal consumption', source: 'ICF', component: 'Environmental Factors', notes: { includes: 'Food, drinks, medications' } },
  { code: 'e115', description: 'Products and technology for personal use in daily living', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e120', description: 'Products and technology for personal indoor and outdoor mobility', source: 'ICF', component: 'Environmental Factors', notes: { includes: 'Wheelchairs, walkers, canes' } },
  { code: 'e125', description: 'Products and technology for communication', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e135', description: 'Products and technology for employment', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e150', description: 'Design, construction and building products of buildings for public use', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e155', description: 'Design, construction and building products of buildings for private use', source: 'ICF', component: 'Environmental Factors', notes: {} },
  
  { code: 'e310', description: 'Immediate family', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e315', description: 'Extended family', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e320', description: 'Friends', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e325', description: 'Acquaintances, peers, colleagues, neighbours and community members', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e330', description: 'People in positions of authority', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e340', description: 'Personal care providers and personal assistants', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e355', description: 'Health professionals', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e360', description: 'Other professionals', source: 'ICF', component: 'Environmental Factors', notes: {} },
  
  { code: 'e410', description: 'Individual attitudes of immediate family members', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e420', description: 'Individual attitudes of friends', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e450', description: 'Individual attitudes of health professionals', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e460', description: 'Societal attitudes', source: 'ICF', component: 'Environmental Factors', notes: {} },
  
  { code: 'e525', description: 'Housing services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e535', description: 'Communication services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e540', description: 'Transportation services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e550', description: 'Legal services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e570', description: 'Social security services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e575', description: 'General social support services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e580', description: 'Health services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e585', description: 'Education and training services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e590', description: 'Labour and employment services, systems and policies', source: 'ICF', component: 'Environmental Factors', notes: {} },
  
  // Additional Body Functions - Mental (b1)
  { code: 'b156', description: 'Perceptual functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Auditory perception, visual perception, tactile perception' } },
  { code: 'b160', description: 'Thought functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Pace, form, content and control of thought' } },
  { code: 'b164', description: 'Higher-level cognitive functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Abstraction, organization, time management, cognitive flexibility' } },
  { code: 'b167', description: 'Mental functions of language', source: 'ICF', component: 'Body Functions', notes: { includes: 'Expression and reception of language' } },
  { code: 'b172', description: 'Calculation functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b176', description: 'Mental function of sequencing complex movements', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b180', description: 'Experience of self and time functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Sensory and Pain (b2)
  { code: 'b215', description: 'Functions of structures adjoining the eye', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b220', description: 'Sensations associated with the eye and adjoining structures', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b240', description: 'Sensations associated with hearing and vestibular function', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b250', description: 'Taste function', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b255', description: 'Smell function', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Voice and Speech (b3)
  { code: 'b310', description: 'Voice functions', source: 'ICF', component: 'Body Functions', notes: { includes: 'Voice production, quality' } },
  { code: 'b320', description: 'Articulation functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b330', description: 'Fluency and rhythm of speech functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b340', description: 'Alternative vocalization functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Cardiovascular, Hematological (b4)
  { code: 'b430', description: 'Haematological system functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b435', description: 'Immunological system functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b445', description: 'Respiratory muscle functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b450', description: 'Additional respiratory functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b455', description: 'Exercise tolerance functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b460', description: 'Sensations associated with cardiovascular and respiratory functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Digestive, Metabolic, Endocrine (b5)
  { code: 'b520', description: 'Assimilation functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b530', description: 'Weight maintenance functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b535', description: 'Sensations associated with the digestive system', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b540', description: 'General metabolic functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b545', description: 'Water, mineral and electrolyte balance functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b550', description: 'Thermoregulatory functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b555', description: 'Endocrine gland functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Genitourinary and Reproductive (b6)
  { code: 'b610', description: 'Urinary excretory functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b620', description: 'Urination functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b630', description: 'Sensations associated with urinary functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b640', description: 'Sexual functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b650', description: 'Menstruation functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b660', description: 'Procreation functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b670', description: 'Sensations associated with genital and reproductive functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Neuromusculoskeletal (b7)
  { code: 'b720', description: 'Mobility of bone functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b750', description: 'Motor reflex functions', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b780', description: 'Sensations related to muscles and movement functions', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // Body Functions - Skin (b8)
  { code: 'b810', description: 'Protective functions of the skin', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b820', description: 'Repair functions of the skin', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b830', description: 'Other functions of the skin', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b840', description: 'Sensation related to the skin', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b850', description: 'Functions of hair', source: 'ICF', component: 'Body Functions', notes: {} },
  { code: 'b860', description: 'Functions of nails', source: 'ICF', component: 'Body Functions', notes: {} },
  
  // More Activities & Participation - Learning and Applying Knowledge (d1)
  { code: 'd120', description: 'Other purposeful sensing', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd125', description: 'Using all senses intentionally', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd131', description: 'Learning through actions with objects', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd132', description: 'Acquiring language', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd133', description: 'Acquiring additional language', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd134', description: 'Acquiring non-verbal language', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd137', description: 'Acquiring concepts', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd138', description: 'Acquiring information', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - General Tasks and Demands (d2)
  { code: 'd210', description: 'Undertaking a single task', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd220', description: 'Undertaking multiple tasks', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd230', description: 'Carrying out daily routine', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd240', description: 'Handling stress and other psychological demands', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Mobility (d4) Extended
  { code: 'd435', description: 'Moving objects with lower extremities', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd445', description: 'Hand and arm use', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd446', description: 'Fine foot use', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd469', description: 'Walking and moving, other specified and unspecified', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Self-care (d5) Extended
  { code: 'd570', description: 'Looking after one\'s health', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd571', description: 'Looking after one\'s safety', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Domestic Life (d6) Extended
  { code: 'd610', description: 'Acquiring a place to live', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd620', description: 'Acquisition of goods and services', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Interpersonal Interactions (d7)
  { code: 'd710', description: 'Basic interpersonal interactions', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd720', description: 'Complex interpersonal interactions', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd730', description: 'Relating with strangers', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd740', description: 'Formal relationships', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd750', description: 'Informal social relationships', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd760', description: 'Family relationships', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd770', description: 'Intimate relationships', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Activities & Participation - Major Life Areas (d8) Extended
  { code: 'd810', description: 'Informal education', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd815', description: 'Preschool education', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd820', description: 'School education', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd825', description: 'Vocational training', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd830', description: 'Higher education', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd835', description: 'Apprenticeship (work preparation)', source: 'ICF', component: 'Activities & Participation', notes: {} },
  { code: 'd840', description: 'Apprenticeship (work)', source: 'ICF', component: 'Activities & Participation', notes: {} },
  
  // Environmental Factors - Products and Technology (e1) Extended
  { code: 'e130', description: 'Products and technology for education', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e140', description: 'Products and technology for culture, recreation and sport', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e145', description: 'Products and technology for the practice of religion and spirituality', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e160', description: 'Products and technology of land development', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e165', description: 'Assets', source: 'ICF', component: 'Environmental Factors', notes: {} },
  
  // Environmental Factors - Natural Environment (e2)
  { code: 'e210', description: 'Physical geography', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e215', description: 'Population', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e220', description: 'Flora and fauna', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e225', description: 'Climate', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e230', description: 'Natural events', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e235', description: 'Human-caused events', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e240', description: 'Light', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e245', description: 'Time-related changes', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e250', description: 'Sound', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e255', description: 'Vibration', source: 'ICF', component: 'Environmental Factors', notes: {} },
  { code: 'e260', description: 'Air quality', source: 'ICF', component: 'Environmental Factors', notes: {} },
];
