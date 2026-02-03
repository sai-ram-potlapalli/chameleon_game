// Word associations for AI players to generate contextual clues
// Each secret word maps to arrays of clues at different difficulty levels
// Easy: obvious connections, Medium: reasonable, Hard: subtle/clever

const wordAssociations = {
  // Food
  'Pizza': {
    easy: ['Italy', 'cheese', 'pepperoni', 'slice', 'delivery'],
    medium: ['oven', 'dough', 'toppings', 'round', 'crust'],
    hard: ['Naples', 'triangle', 'box', 'party', 'late']
  },
  'Sushi': {
    easy: ['Japan', 'fish', 'rice', 'raw', 'chopsticks'],
    medium: ['roll', 'seaweed', 'wasabi', 'fresh', 'chef'],
    hard: ['conveyor', 'sake', 'precision', 'art', 'edo']
  },
  'Burger': {
    easy: ['beef', 'bun', 'fries', 'fast', 'patty'],
    medium: ['grill', 'ketchup', 'lettuce', 'American', 'juicy'],
    hard: ['flame', 'stack', 'drive-thru', 'smash', 'char']
  },
  'Pasta': {
    easy: ['Italy', 'noodles', 'sauce', 'spaghetti', 'carbs'],
    medium: ['boil', 'al-dente', 'tomato', 'twirl', 'fork'],
    hard: ['grandmother', 'shapes', 'water', 'Sunday', 'comfort']
  },
  'Salad': {
    easy: ['lettuce', 'healthy', 'vegetables', 'green', 'dressing'],
    medium: ['fresh', 'bowl', 'toss', 'crisp', 'diet'],
    hard: ['rainbow', 'crunch', 'starter', 'light', 'garden']
  },
  'Steak': {
    easy: ['beef', 'grill', 'rare', 'meat', 'juicy'],
    medium: ['medium', 'sizzle', 'tender', 'knife', 'dinner'],
    hard: ['prime', 'marbling', 'rest', 'sear', 'iron']
  },
  'Tacos': {
    easy: ['Mexico', 'shell', 'Tuesday', 'salsa', 'filling'],
    medium: ['corn', 'street', 'lime', 'spicy', 'fold'],
    hard: ['truck', 'hand', 'stand', 'cilantro', 'authentic']
  },
  'Curry': {
    easy: ['India', 'spicy', 'rice', 'yellow', 'sauce'],
    medium: ['coconut', 'flavor', 'aromatic', 'warm', 'blend'],
    hard: ['pot', 'comfort', 'complex', 'golden', 'simmer']
  },
  'Ramen': {
    easy: ['Japan', 'noodles', 'soup', 'broth', 'bowl'],
    medium: ['slurp', 'egg', 'hot', 'pork', 'college'],
    hard: ['steam', 'midnight', 'queue', 'tonkotsu', 'cheap']
  },
  'Sandwich': {
    easy: ['bread', 'lunch', 'layers', 'deli', 'meat'],
    medium: ['filling', 'slice', 'packed', 'quick', 'stack'],
    hard: ['Earl', 'portable', 'cut', 'picnic', 'invention']
  },
  'Soup': {
    easy: ['hot', 'bowl', 'liquid', 'spoon', 'warm'],
    medium: ['broth', 'comfort', 'chicken', 'simmer', 'sick'],
    hard: ['grandmother', 'ladle', 'steam', 'winter', 'soul']
  },
  'Rice': {
    easy: ['grain', 'white', 'Asian', 'bowl', 'staple'],
    medium: ['paddy', 'sticky', 'cook', 'side', 'water'],
    hard: ['field', 'wedding', 'basic', 'billion', 'ancient']
  },
  'Bread': {
    easy: ['loaf', 'wheat', 'toast', 'slice', 'bake'],
    medium: ['yeast', 'crust', 'dough', 'fresh', 'butter'],
    hard: ['rise', 'staff', 'basket', 'aroma', 'daily']
  },
  'Cheese': {
    easy: ['dairy', 'yellow', 'mouse', 'milk', 'Swiss'],
    medium: ['aged', 'melt', 'slice', 'sharp', 'hole'],
    hard: ['cave', 'moon', 'culture', 'wheel', 'ripe']
  },
  'Chicken': {
    easy: ['bird', 'poultry', 'eggs', 'farm', 'wings'],
    medium: ['fried', 'breast', 'cluck', 'tender', 'roast'],
    hard: ['crossing', 'dinner', 'Sunday', 'golden', 'common']
  },
  'Fish': {
    easy: ['ocean', 'swim', 'scales', 'water', 'fins'],
    medium: ['catch', 'fresh', 'hook', 'seafood', 'tank'],
    hard: ['Friday', 'school', 'silent', 'memory', 'cold']
  },

  // Movie Genres
  'Horror': {
    easy: ['scary', 'fear', 'ghost', 'scream', 'dark'],
    medium: ['nightmare', 'blood', 'monster', 'jump', 'thriller'],
    hard: ['October', 'shadows', 'basement', 'alone', 'tension']
  },
  'Comedy': {
    easy: ['funny', 'laugh', 'joke', 'humor', 'silly'],
    medium: ['smile', 'wit', 'timing', 'light', 'gag'],
    hard: ['relief', 'awkward', 'setup', 'punchline', 'tears']
  },
  'Action': {
    easy: ['explosion', 'fight', 'hero', 'chase', 'gun'],
    medium: ['stunt', 'fast', 'danger', 'intense', 'muscle'],
    hard: ['summer', 'sequel', 'CGI', 'budget', 'popcorn']
  },
  'Romance': {
    easy: ['love', 'kiss', 'heart', 'couple', 'date'],
    medium: ['passion', 'sweet', 'relationship', 'tender', 'chemistry'],
    hard: ['notebook', 'rain', 'airport', 'sunset', 'fate']
  },
  'Sci-Fi': {
    easy: ['space', 'future', 'alien', 'robot', 'technology'],
    medium: ['laser', 'ship', 'galaxy', 'time', 'advanced'],
    hard: ['dystopia', 'chrome', 'possibility', 'wonder', 'vision']
  },
  'Drama': {
    easy: ['serious', 'emotional', 'acting', 'story', 'tears'],
    medium: ['Oscar', 'intense', 'character', 'deep', 'moving'],
    hard: ['awards', 'heavy', 'human', 'authentic', 'powerful']
  },
  'Thriller': {
    easy: ['suspense', 'tension', 'mystery', 'edge', 'twist'],
    medium: ['gripping', 'plot', 'dark', 'intense', 'nerve'],
    hard: ['Hitchcock', 'paranoia', 'clock', 'reveal', 'pulse']
  },
  'Western': {
    easy: ['cowboy', 'horse', 'desert', 'sheriff', 'gun'],
    medium: ['saloon', 'frontier', 'outlaw', 'sunset', 'duel'],
    hard: ['tumbleweeds', 'noon', 'whiskey', 'spurs', 'gold']
  },
  'Musical': {
    easy: ['singing', 'dancing', 'songs', 'Broadway', 'stage'],
    medium: ['choreography', 'melody', 'ensemble', 'show', 'number'],
    hard: ['spontaneous', 'harmonize', 'spotlight', 'encore', 'overture']
  },
  'Animation': {
    easy: ['cartoon', 'drawing', 'Pixar', 'Disney', 'kids'],
    medium: ['colorful', 'family', 'voice', 'character', 'creative'],
    hard: ['frames', 'studio', 'render', 'imagination', 'timeless']
  },
  'Documentary': {
    easy: ['real', 'facts', 'true', 'nature', 'interview'],
    medium: ['educational', 'footage', 'narrator', 'research', 'truth'],
    hard: ['lens', 'expose', 'perspective', 'archive', 'witness']
  },
  'Mystery': {
    easy: ['clue', 'detective', 'solve', 'secret', 'puzzle'],
    medium: ['investigate', 'suspect', 'reveal', 'hidden', 'case'],
    hard: ['whodunit', 'red-herring', 'alibi', 'motive', 'twist']
  },
  'Fantasy': {
    easy: ['magic', 'dragon', 'wizard', 'kingdom', 'sword'],
    medium: ['mythical', 'quest', 'creature', 'realm', 'epic'],
    hard: ['lore', 'prophecy', 'chosen', 'enchanted', 'ancient']
  },
  'Adventure': {
    easy: ['journey', 'explore', 'treasure', 'quest', 'hero'],
    medium: ['discovery', 'danger', 'exotic', 'map', 'brave'],
    hard: ['unknown', 'horizon', 'calling', 'wild', 'fortune']
  },
  'Crime': {
    easy: ['police', 'criminal', 'law', 'theft', 'investigation'],
    medium: ['evidence', 'court', 'justice', 'heist', 'underworld'],
    hard: ['noir', 'syndicate', 'corruption', 'witness', 'case']
  },
  'War': {
    easy: ['battle', 'soldier', 'military', 'combat', 'army'],
    medium: ['conflict', 'sacrifice', 'victory', 'history', 'patriot'],
    hard: ['trenches', 'brotherhood', 'duty', 'home', 'honor']
  },

  // Animals
  'Dog': {
    easy: ['bark', 'pet', 'loyal', 'puppy', 'fetch'],
    medium: ['tail', 'walk', 'bone', 'collar', 'friend'],
    hard: ['unconditional', 'years', 'companion', 'door', 'best']
  },
  'Cat': {
    easy: ['meow', 'pet', 'purr', 'kitten', 'whiskers'],
    medium: ['independent', 'paw', 'nap', 'curious', 'climb'],
    hard: ['nine', 'internet', 'aloof', 'midnight', 'box']
  },
  'Lion': {
    easy: ['king', 'roar', 'mane', 'Africa', 'pride'],
    medium: ['savanna', 'hunt', 'majestic', 'wild', 'strength'],
    hard: ['Simba', 'courage', 'sun', 'lazy', 'apex']
  },
  'Eagle': {
    easy: ['bird', 'fly', 'America', 'soar', 'wings'],
    medium: ['prey', 'nest', 'bald', 'freedom', 'sky'],
    hard: ['patriot', 'vision', 'majestic', 'scout', 'symbol']
  },
  'Shark': {
    easy: ['ocean', 'teeth', 'fin', 'dangerous', 'swim'],
    medium: ['predator', 'jaws', 'deep', 'fear', 'water'],
    hard: ['week', 'ancient', 'silent', 'survival', 'apex']
  },
  'Elephant': {
    easy: ['trunk', 'big', 'Africa', 'grey', 'ears'],
    medium: ['memory', 'tusk', 'herd', 'gentle', 'wise'],
    hard: ['room', 'never', 'matriarch', 'ivory', 'graveyard']
  },
  'Snake': {
    easy: ['slither', 'scales', 'hiss', 'venom', 'reptile'],
    medium: ['coil', 'fangs', 'cold', 'shed', 'danger'],
    hard: ['garden', 'charmer', 'grass', 'temptation', 'silent']
  },
  'Dolphin': {
    easy: ['ocean', 'smart', 'swim', 'friendly', 'jump'],
    medium: ['pod', 'sonar', 'playful', 'mammal', 'click'],
    hard: ['intelligence', 'rescue', 'smile', 'flipper', 'echo']
  },
  'Tiger': {
    easy: ['stripes', 'jungle', 'orange', 'fierce', 'cat'],
    medium: ['hunt', 'Asia', 'powerful', 'endangered', 'stealth'],
    hard: ['eye', 'burning', 'solitary', 'frost', 'tank']
  },
  'Bear': {
    easy: ['forest', 'hibernate', 'fur', 'honey', 'big'],
    medium: ['claw', 'grizzly', 'wild', 'den', 'strong'],
    hard: ['market', 'hug', 'teddy', 'salmon', 'picnic']
  },
  'Wolf': {
    easy: ['howl', 'pack', 'wild', 'forest', 'hunt'],
    medium: ['moon', 'alpha', 'fierce', 'grey', 'cunning'],
    hard: ['door', 'sheep', 'lone', 'loyalty', 'night']
  },
  'Rabbit': {
    easy: ['hop', 'carrot', 'ears', 'bunny', 'cute'],
    medium: ['burrow', 'fast', 'fluffy', 'Easter', 'multiply'],
    hard: ['hole', 'lucky', 'magic', 'hat', 'warren']
  },
  'Horse': {
    easy: ['ride', 'gallop', 'stable', 'mane', 'fast'],
    medium: ['saddle', 'neigh', 'race', 'wild', 'hoof'],
    hard: ['power', 'gift', 'Trojan', 'dark', 'sense']
  },
  'Monkey': {
    easy: ['banana', 'climb', 'jungle', 'funny', 'swing'],
    medium: ['primate', 'curious', 'tree', 'tail', 'smart'],
    hard: ['business', 'wrench', 'see', 'typewriter', 'evolution']
  },
  'Penguin': {
    easy: ['ice', 'waddle', 'tuxedo', 'cold', 'Antarctica'],
    medium: ['swim', 'colony', 'cute', 'flightless', 'slide'],
    hard: ['march', 'formal', 'huddle', 'Linux', 'south']
  },
  'Owl': {
    easy: ['hoot', 'night', 'wise', 'eyes', 'bird'],
    medium: ['nocturnal', 'hunt', 'feathers', 'rotate', 'silent'],
    hard: ['who', 'Hogwarts', 'parliament', 'pellet', 'Athens']
  },

  // Sports
  'Soccer': {
    easy: ['ball', 'goal', 'kick', 'field', 'team'],
    medium: ['World Cup', 'penalty', 'header', 'referee', 'stadium'],
    hard: ['beautiful', 'nil', 'pitch', 'injury', 'global']
  },
  'Basketball': {
    easy: ['hoop', 'dunk', 'court', 'bounce', 'NBA'],
    medium: ['dribble', 'three-pointer', 'slam', 'net', 'tall'],
    hard: ['March', 'air', 'buzzer', 'pickup', 'hardwood']
  },
  'Tennis': {
    easy: ['racket', 'ball', 'court', 'serve', 'net'],
    medium: ['ace', 'match', 'Wimbledon', 'love', 'deuce'],
    hard: ['Grand', 'rally', 'grass', 'fault', 'advantage']
  },
  'Swimming': {
    easy: ['pool', 'water', 'stroke', 'lane', 'dive'],
    medium: ['lap', 'freestyle', 'medal', 'goggles', 'splash'],
    hard: ['butterfly', 'Olympic', 'turn', 'breathe', 'block']
  },
  'Golf': {
    easy: ['club', 'hole', 'ball', 'green', 'swing'],
    medium: ['birdie', 'course', 'tee', 'putt', 'caddy'],
    hard: ['fore', 'handicap', 'Augusta', 'bogey', 'iron']
  },
  'Baseball': {
    easy: ['bat', 'ball', 'pitch', 'home', 'catch'],
    medium: ['diamond', 'innings', 'strike', 'glove', 'stadium'],
    hard: ['America', 'seventh', 'peanuts', 'curve', 'steal']
  },
  'Hockey': {
    easy: ['ice', 'puck', 'stick', 'goal', 'skate'],
    medium: ['penalty', 'rink', 'check', 'goalie', 'fight'],
    hard: ['Stanley', 'Canadian', 'Zamboni', 'sudden', 'power']
  },
  'Boxing': {
    easy: ['punch', 'ring', 'gloves', 'fight', 'knockout'],
    medium: ['jab', 'round', 'referee', 'heavyweight', 'corner'],
    hard: ['rope', 'dance', 'sweet', 'canvas', 'bell']
  },
  'Rugby': {
    easy: ['ball', 'tackle', 'try', 'scrum', 'field'],
    medium: ['oval', 'tough', 'team', 'kick', 'conversion'],
    hard: ['haka', 'ruck', 'union', 'egg', 'blood']
  },
  'Cricket': {
    easy: ['bat', 'ball', 'wicket', 'pitch', 'England'],
    medium: ['bowler', 'innings', 'test', 'boundary', 'umpire'],
    hard: ['tea', 'gentleman', 'sticky', 'duck', 'century']
  },
  'Volleyball': {
    easy: ['net', 'spike', 'serve', 'beach', 'team'],
    medium: ['set', 'bump', 'dig', 'block', 'court'],
    hard: ['sand', 'rotation', 'ace', 'rally', 'libero']
  },
  'Skiing': {
    easy: ['snow', 'mountain', 'slope', 'cold', 'poles'],
    medium: ['downhill', 'lift', 'resort', 'slalom', 'speed'],
    hard: ['mogul', 'powder', 'après', 'black', 'edge']
  },
  'Surfing': {
    easy: ['wave', 'ocean', 'board', 'beach', 'balance'],
    medium: ['ride', 'wax', 'tube', 'wetsuit', 'swell'],
    hard: ['gnarly', 'barrel', 'dawn', 'patrol', 'stoked']
  },
  'Cycling': {
    easy: ['bike', 'pedal', 'wheel', 'ride', 'helmet'],
    medium: ['Tour', 'race', 'gear', 'road', 'speed'],
    hard: ['yellow', 'peloton', 'France', 'climb', 'cadence']
  },
  'Wrestling': {
    easy: ['pin', 'mat', 'strength', 'match', 'hold'],
    medium: ['takedown', 'grapple', 'weight', 'referee', 'submission'],
    hard: ['Greco', 'ancient', 'singlet', 'folding', 'chair']
  },
  'Archery': {
    easy: ['bow', 'arrow', 'target', 'aim', 'shoot'],
    medium: ['bullseye', 'quiver', 'string', 'release', 'focus'],
    hard: ['Robin', 'Olympic', 'compound', 'anchor', 'zen']
  },

  // Countries
  'USA': {
    easy: ['America', 'flag', 'states', 'president', 'eagle'],
    medium: ['liberty', 'Hollywood', 'dollar', 'freedom', 'diverse'],
    hard: ['dream', 'melting', 'stripes', 'opportunity', 'big']
  },
  'Japan': {
    easy: ['Tokyo', 'sushi', 'anime', 'samurai', 'cherry'],
    medium: ['rising', 'technology', 'tradition', 'island', 'honor'],
    hard: ['harmony', 'precision', 'bullet', 'zen', 'land']
  },
  'Brazil': {
    easy: ['soccer', 'carnival', 'Amazon', 'beach', 'samba'],
    medium: ['Rio', 'coffee', 'rainforest', 'colorful', 'passion'],
    hard: ['Christ', 'capoeira', 'favela', 'verde', 'rhythm']
  },
  'France': {
    easy: ['Paris', 'Eiffel', 'wine', 'baguette', 'fashion'],
    medium: ['romance', 'art', 'cheese', 'revolution', 'café'],
    hard: ['liberty', 'croissant', 'haute', 'joie', 'Marseillaise']
  },
  'Egypt': {
    easy: ['pyramids', 'pharaoh', 'Nile', 'desert', 'sphinx'],
    medium: ['ancient', 'mummy', 'Cairo', 'sand', 'tomb'],
    hard: ['Cleopatra', 'hieroglyphics', 'oasis', 'eternal', 'gold']
  },
  'Australia': {
    easy: ['kangaroo', 'outback', 'Sydney', 'koala', 'beach'],
    medium: ['down-under', 'reef', 'mate', 'cricket', 'surf'],
    hard: ['upside', 'dangerous', 'barbie', 'Opera', 'vegemite']
  },
  'India': {
    easy: ['curry', 'Taj Mahal', 'Bollywood', 'spices', 'tiger'],
    medium: ['Gandhi', 'diverse', 'cricket', 'temple', 'color'],
    hard: ['subcontinent', 'billion', 'chai', 'elephant', 'monsoon']
  },
  'Germany': {
    easy: ['Berlin', 'beer', 'cars', 'sausage', 'engineering'],
    medium: ['efficient', 'October', 'wall', 'precision', 'industry'],
    hard: ['autobahn', 'reunification', 'castle', 'order', 'Bach']
  },
  'Mexico': {
    easy: ['tacos', 'sombrero', 'fiesta', 'tequila', 'mariachi'],
    medium: ['Aztec', 'border', 'spicy', 'colorful', 'Maya'],
    hard: ['Day', 'dead', 'Frida', 'piñata', 'mole']
  },
  'Italy': {
    easy: ['Rome', 'pizza', 'pasta', 'art', 'fashion'],
    medium: ['Venice', 'Renaissance', 'wine', 'history', 'romantic'],
    hard: ['boot', 'Vatican', 'Vespa', 'marble', 'dolce']
  },
  'Canada': {
    easy: ['maple', 'hockey', 'cold', 'polite', 'moose'],
    medium: ['Toronto', 'nature', 'Niagara', 'French', 'mountie'],
    hard: ['eh', 'poutine', 'north', 'vast', 'neighbor']
  },
  'China': {
    easy: ['wall', 'dragon', 'Beijing', 'rice', 'pandas'],
    medium: ['ancient', 'dynasty', 'tea', 'population', 'silk'],
    hard: ['forbidden', 'middle', 'kingdom', 'characters', 'red']
  },
  'Spain': {
    easy: ['Madrid', 'flamenco', 'bullfight', 'soccer', 'paella'],
    medium: ['siesta', 'tapas', 'passionate', 'Barcelona', 'sun'],
    hard: ['conquistador', 'Picasso', 'running', 'ole', 'plaza']
  },
  'Russia': {
    easy: ['Moscow', 'cold', 'vodka', 'big', 'bear'],
    medium: ['Kremlin', 'winter', 'czar', 'ballet', 'vast'],
    hard: ['matryoshka', 'chess', 'space', 'soul', 'revolution']
  },
  'Kenya': {
    easy: ['safari', 'Africa', 'running', 'wildlife', 'Nairobi'],
    medium: ['savanna', 'marathon', 'lion', 'tribe', 'equator'],
    hard: ['Maasai', 'migration', 'tea', 'Kilimanjaro', 'coffee']
  },
  'Greece': {
    easy: ['Athens', 'mythology', 'islands', 'ancient', 'Olympics'],
    medium: ['democracy', 'philosophy', 'Mediterranean', 'ruins', 'gods'],
    hard: ['Acropolis', 'Parthenon', 'cradle', 'gyros', 'blue']
  },

  // Professions
  'Doctor': {
    easy: ['hospital', 'medicine', 'heal', 'patient', 'health'],
    medium: ['diagnosis', 'stethoscope', 'white', 'prescription', 'care'],
    hard: ['Hippocrates', 'rounds', 'scrubs', 'bedside', 'oath']
  },
  'Teacher': {
    easy: ['school', 'student', 'learn', 'class', 'education'],
    medium: ['lesson', 'homework', 'grade', 'knowledge', 'board'],
    hard: ['apple', 'summer', 'patience', 'future', 'inspire']
  },
  'Chef': {
    easy: ['cook', 'kitchen', 'food', 'restaurant', 'recipe'],
    medium: ['knife', 'flavor', 'hat', 'taste', 'culinary'],
    hard: ['Michelin', 'plating', 'heat', 'passion', 'fire']
  },
  'Pilot': {
    easy: ['airplane', 'fly', 'captain', 'airport', 'sky'],
    medium: ['cockpit', 'landing', 'wings', 'altitude', 'travel'],
    hard: ['Roger', 'turbulence', 'uniform', 'control', 'hours']
  },
  'Artist': {
    easy: ['paint', 'canvas', 'creative', 'draw', 'gallery'],
    medium: ['brush', 'color', 'expression', 'museum', 'vision'],
    hard: ['starving', 'muse', 'studio', 'soul', 'masterpiece']
  },
  'Engineer': {
    easy: ['build', 'design', 'technical', 'problem', 'create'],
    medium: ['structure', 'calculate', 'innovation', 'bridge', 'systems'],
    hard: ['blueprint', 'precision', 'solution', 'degree', 'specs']
  },
  'Lawyer': {
    easy: ['court', 'law', 'judge', 'case', 'justice'],
    medium: ['argue', 'client', 'trial', 'evidence', 'defend'],
    hard: ['bar', 'objection', 'precedent', 'billable', 'brief']
  },
  'Nurse': {
    easy: ['hospital', 'care', 'patient', 'medicine', 'help'],
    medium: ['scrubs', 'shift', 'compassion', 'injection', 'vital'],
    hard: ['Florence', 'bedside', 'angels', 'triage', 'overtime']
  },
  'Firefighter': {
    easy: ['fire', 'rescue', 'brave', 'truck', 'hose'],
    medium: ['alarm', 'ladder', 'hero', 'station', 'smoke'],
    hard: ['pole', 'dalmatian', 'hydrant', 'turnout', 'backdraft']
  },
  'Police': {
    easy: ['law', 'badge', 'crime', 'patrol', 'protect'],
    medium: ['officer', 'arrest', 'justice', 'uniform', 'serve'],
    hard: ['beat', 'Miranda', 'dispatch', 'blue', 'academy']
  },
  'Scientist': {
    easy: ['research', 'experiment', 'lab', 'discover', 'study'],
    medium: ['hypothesis', 'data', 'microscope', 'theory', 'analyze'],
    hard: ['peer', 'Nobel', 'publish', 'eureka', 'method']
  },
  'Writer': {
    easy: ['book', 'story', 'words', 'author', 'write'],
    medium: ['novel', 'creative', 'publish', 'chapter', 'imagination'],
    hard: ['block', 'deadline', 'draft', 'muse', 'rejection']
  },
  'Musician': {
    easy: ['music', 'instrument', 'play', 'song', 'concert'],
    medium: ['melody', 'band', 'perform', 'practice', 'talent'],
    hard: ['gig', 'tour', 'studio', 'ear', 'soul']
  },
  'Architect': {
    easy: ['building', 'design', 'plan', 'structure', 'blueprint'],
    medium: ['space', 'creative', 'construct', 'vision', 'model'],
    hard: ['Frank', 'sustainable', 'scale', 'form', 'function']
  },
  'Farmer': {
    easy: ['farm', 'crop', 'harvest', 'land', 'grow'],
    medium: ['tractor', 'field', 'animal', 'rural', 'soil'],
    hard: ['dawn', 'season', 'organic', 'subsidies', 'weather']
  },
  'Actor': {
    easy: ['movie', 'stage', 'perform', 'role', 'Hollywood'],
    medium: ['character', 'script', 'audition', 'camera', 'fame'],
    hard: ['method', 'Oscar', 'typecast', 'understudy', 'craft']
  },

  // Technology
  'Smartphone': {
    easy: ['phone', 'call', 'app', 'screen', 'mobile'],
    medium: ['touch', 'notification', 'battery', 'camera', 'pocket'],
    hard: ['addiction', 'upgrade', 'cracked', 'doom', 'scroll']
  },
  'Laptop': {
    easy: ['computer', 'keyboard', 'screen', 'work', 'portable'],
    medium: ['battery', 'typing', 'wireless', 'processor', 'fold'],
    hard: ['cafe', 'thigh', 'burn', 'sticker', 'charger']
  },
  'Robot': {
    easy: ['machine', 'metal', 'automatic', 'future', 'artificial'],
    medium: ['program', 'mechanical', 'intelligence', 'automate', 'sensor'],
    hard: ['Asimov', 'uncanny', 'uprising', 'vacuum', 'laws']
  },
  'Drone': {
    easy: ['fly', 'camera', 'remote', 'aerial', 'hover'],
    medium: ['propeller', 'control', 'delivery', 'surveillance', 'buzzing'],
    hard: ['FAA', 'swarm', 'footage', 'regulations', 'privacy']
  },
  'Internet': {
    easy: ['web', 'online', 'connect', 'browse', 'network'],
    medium: ['digital', 'global', 'information', 'wifi', 'access'],
    hard: ['surfing', 'fiber', 'protocol', 'series', 'tubes']
  },
  'Satellite': {
    easy: ['space', 'orbit', 'signal', 'sky', 'communication'],
    medium: ['dish', 'GPS', 'launch', 'transmit', 'global'],
    hard: ['Sputnik', 'debris', 'geo', 'constellation', 'relay']
  },
  'Camera': {
    easy: ['photo', 'picture', 'lens', 'capture', 'image'],
    medium: ['flash', 'focus', 'zoom', 'digital', 'memory'],
    hard: ['aperture', 'exposure', 'candid', 'shutter', 'raw']
  },
  'Television': {
    easy: ['TV', 'watch', 'screen', 'channel', 'show'],
    medium: ['remote', 'entertainment', 'broadcast', 'stream', 'couch'],
    hard: ['binge', 'potato', 'cable', 'ratings', 'programming']
  },
  'Headphones': {
    easy: ['music', 'listen', 'ears', 'audio', 'sound'],
    medium: ['wireless', 'noise', 'cancel', 'bass', 'volume'],
    hard: ['isolation', 'commute', 'podcast', 'tangled', 'audiophile']
  },
  'Tablet': {
    easy: ['screen', 'touch', 'iPad', 'portable', 'apps'],
    medium: ['digital', 'stylus', 'read', 'medium', 'device'],
    hard: ['between', 'Moses', 'kindergarten', 'plane', 'hybrid']
  },
  'Console': {
    easy: ['gaming', 'play', 'video', 'controller', 'PlayStation'],
    medium: ['Xbox', 'Nintendo', 'graphics', 'multiplayer', 'entertainment'],
    hard: ['generation', 'exclusive', 'couch', 'war', 'backward']
  },
  'Printer': {
    easy: ['paper', 'print', 'ink', 'document', 'office'],
    medium: ['copy', 'scan', 'cartridge', 'wireless', 'page'],
    hard: ['jam', 'toner', 'cyan', 'frustration', 'queue']
  },
  'Speaker': {
    easy: ['sound', 'music', 'loud', 'audio', 'bass'],
    medium: ['bluetooth', 'wireless', 'portable', 'volume', 'stereo'],
    hard: ['woofer', 'Alexa', 'smart', 'party', 'distortion']
  },
  'Keyboard': {
    easy: ['type', 'keys', 'computer', 'letters', 'input'],
    medium: ['mechanical', 'wireless', 'qwerty', 'shortcut', 'click'],
    hard: ['ergonomic', 'membrane', 'RGB', 'carpal', 'macro']
  },
  'Monitor': {
    easy: ['screen', 'display', 'computer', 'view', 'desktop'],
    medium: ['resolution', 'pixel', 'refresh', 'curved', 'dual'],
    hard: ['IPS', 'ultrawide', 'calibrate', 'response', 'bezel']
  },
  'Router': {
    easy: ['internet', 'wifi', 'connect', 'network', 'wireless'],
    medium: ['signal', 'password', 'modem', 'antenna', 'broadcast'],
    hard: ['restart', 'firmware', 'bandwidth', 'mesh', 'IT']
  },

  // Weather
  'Sunny': {
    easy: ['sun', 'bright', 'warm', 'clear', 'beach'],
    medium: ['rays', 'vitamin', 'shadow', 'outdoors', 'squint'],
    hard: ['disposition', 'optimistic', 'SPF', 'glare', 'golden']
  },
  'Rainy': {
    easy: ['rain', 'wet', 'umbrella', 'cloud', 'drops'],
    medium: ['puddle', 'storm', 'gray', 'drizzle', 'pour'],
    hard: ['petrichor', 'melancholy', 'romantic', 'Seattle', 'patter']
  },
  'Snowy': {
    easy: ['snow', 'cold', 'white', 'winter', 'flake'],
    medium: ['frost', 'blizzard', 'sled', 'shovel', 'ice'],
    hard: ['blanket', 'pristine', 'silent', 'Narnia', 'drifts']
  },
  'Windy': {
    easy: ['wind', 'blow', 'breeze', 'air', 'gust'],
    medium: ['strong', 'leaves', 'kite', 'turbulent', 'hat'],
    hard: ['Chicago', 'Aeolus', 'hair', 'sail', 'turbine']
  },
  'Cloudy': {
    easy: ['cloud', 'gray', 'overcast', 'sky', 'cover'],
    medium: ['gloomy', 'shade', 'dark', 'forecast', 'layer'],
    hard: ['nine', 'silver', 'lining', 'formation', 'mood']
  },
  'Stormy': {
    easy: ['storm', 'thunder', 'lightning', 'rain', 'loud'],
    medium: ['violent', 'dark', 'shelter', 'dangerous', 'rumble'],
    hard: ['tempest', 'brewing', 'eye', 'chase', 'electric']
  },
  'Foggy': {
    easy: ['fog', 'mist', 'visibility', 'gray', 'thick'],
    medium: ['drive', 'eerie', 'damp', 'morning', 'lift'],
    hard: ['London', 'pea', 'soup', 'mysterious', 'shroud']
  },
  'Humid': {
    easy: ['wet', 'sticky', 'moisture', 'sweat', 'hot'],
    medium: ['tropical', 'air', 'uncomfortable', 'damp', 'summer'],
    hard: ['Florida', 'frizz', 'hair', 'muggy', 'suffocating']
  },
  'Freezing': {
    easy: ['cold', 'ice', 'frost', 'winter', 'shiver'],
    medium: ['below', 'zero', 'bitter', 'numb', 'bundle'],
    hard: ['hypothermia', 'brass', 'monkey', 'teeth', 'bone']
  },
  'Hot': {
    easy: ['warm', 'summer', 'heat', 'sweat', 'sun'],
    medium: ['burning', 'temperature', 'AC', 'shade', 'drink'],
    hard: ['heatwave', 'sizzle', 'handle', 'scorching', 'melt']
  },
  'Mild': {
    easy: ['pleasant', 'comfortable', 'moderate', 'nice', 'warm'],
    medium: ['perfect', 'gentle', 'temperate', 'balanced', 'light'],
    hard: ['Goldilocks', 'spring', 'Mediterranean', 'sweater', 'ideal']
  },
  'Hail': {
    easy: ['ice', 'balls', 'storm', 'damage', 'falling'],
    medium: ['pellets', 'dent', 'car', 'shelter', 'hard'],
    hard: ['cab', 'insurance', 'golf', 'stone', 'crops']
  },
  'Thunder': {
    easy: ['loud', 'storm', 'lightning', 'boom', 'sky'],
    medium: ['rumble', 'crash', 'flash', 'sound', 'scary'],
    hard: ['Zeus', 'down-under', 'clap', 'rolling', 'gods']
  },
  'Rainbow': {
    easy: ['colors', 'rain', 'arc', 'sky', 'beautiful'],
    medium: ['sun', 'spectrum', 'pot', 'gold', 'prism'],
    hard: ['leprechaun', 'promise', 'Dorothy', 'refraction', 'double']
  },
  'Tornado': {
    easy: ['wind', 'spin', 'destructive', 'funnel', 'dangerous'],
    medium: ['twister', 'shelter', 'Midwest', 'warning', 'debris'],
    hard: ['Dorothy', 'Oz', 'alley', 'chase', 'cellar']
  },
  'Hurricane': {
    easy: ['storm', 'wind', 'tropical', 'destructive', 'ocean'],
    medium: ['eye', 'category', 'flood', 'evacuate', 'season'],
    hard: ['name', 'Katrina', 'landfall', 'surge', 'Caribbean']
  },

  // Emotions
  'Happy': {
    easy: ['joy', 'smile', 'cheerful', 'glad', 'positive'],
    medium: ['content', 'pleased', 'delight', 'bright', 'upbeat'],
    hard: ['endorphins', 'euphoria', 'bliss', 'radiant', 'sunshine']
  },
  'Sad': {
    easy: ['unhappy', 'cry', 'tears', 'down', 'blue'],
    medium: ['melancholy', 'gloomy', 'sorrowful', 'upset', 'heavy'],
    hard: ['ennui', 'blues', 'rain', 'heartache', 'shadow']
  },
  'Angry': {
    easy: ['mad', 'upset', 'furious', 'rage', 'annoyed'],
    medium: ['frustrated', 'heated', 'hostile', 'temper', 'boiling'],
    hard: ['seeing', 'red', 'steam', 'hulk', 'blood']
  },
  'Scared': {
    easy: ['fear', 'afraid', 'frightened', 'terrified', 'nervous'],
    medium: ['anxious', 'panic', 'dread', 'alarmed', 'spooked'],
    hard: ['goosebumps', 'pale', 'deer', 'headlights', 'frozen']
  },
  'Excited': {
    easy: ['eager', 'thrilled', 'enthusiastic', 'pumped', 'anticipation'],
    medium: ['buzzing', 'hyped', 'animated', 'energized', 'electric'],
    hard: ['butterflies', 'edge', 'seat', 'countdown', 'bursting']
  },
  'Nervous': {
    easy: ['anxious', 'worried', 'tense', 'jittery', 'uneasy'],
    medium: ['apprehensive', 'fidgety', 'restless', 'sweaty', 'butterflies'],
    hard: ['wreck', 'pins', 'needles', 'stomach', 'knots']
  },
  'Calm': {
    easy: ['peaceful', 'relaxed', 'tranquil', 'serene', 'quiet'],
    medium: ['composed', 'collected', 'still', 'zen', 'centered'],
    hard: ['cucumber', 'storm', 'meditation', 'equanimity', 'unruffled']
  },
  'Confused': {
    easy: ['puzzled', 'lost', 'uncertain', 'bewildered', 'unsure'],
    medium: ['perplexed', 'baffled', 'disoriented', 'muddled', 'foggy'],
    hard: ['scratching', 'head', 'maze', 'spinning', 'crossroads']
  },
  'Proud': {
    easy: ['accomplished', 'satisfied', 'pleased', 'achievement', 'success'],
    medium: ['dignified', 'honored', 'triumphant', 'confident', 'self-esteem'],
    hard: ['peacock', 'chest', 'puffed', 'lion', 'strutting']
  },
  'Jealous': {
    easy: ['envious', 'covet', 'want', 'resentful', 'desire'],
    medium: ['possessive', 'bitter', 'grudging', 'begrudge', 'longing'],
    hard: ['green', 'monster', 'Shakespeare', 'eye', 'Othello']
  },
  'Surprised': {
    easy: ['shocked', 'amazed', 'startled', 'unexpected', 'astonished'],
    medium: ['stunned', 'speechless', 'flabbergasted', 'caught', 'wow'],
    hard: ['jaw', 'drop', 'double-take', 'twist', 'plot']
  },
  'Bored': {
    easy: ['uninterested', 'dull', 'tedious', 'monotonous', 'tired'],
    medium: ['restless', 'apathetic', 'listless', 'yawn', 'drag'],
    hard: ['paint', 'dry', 'watching', 'grass', 'grow']
  },
  'Grateful': {
    easy: ['thankful', 'appreciative', 'blessed', 'thankfulness', 'gratitude'],
    medium: ['indebted', 'obliged', 'touched', 'moved', 'recognition'],
    hard: ['count', 'blessings', 'Thanksgiving', 'journal', 'mindful']
  },
  'Lonely': {
    easy: ['alone', 'isolated', 'solitary', 'sad', 'empty'],
    medium: ['abandoned', 'disconnected', 'longing', 'void', 'missing'],
    hard: ['crowd', 'wolf', 'hermit', 'ache', 'island']
  },
  'Hopeful': {
    easy: ['optimistic', 'positive', 'expecting', 'confident', 'bright'],
    medium: ['encouraged', 'anticipating', 'wishful', 'aspiring', 'promising'],
    hard: ['silver', 'lining', 'dawn', 'tunnel', 'light']
  },
  'Anxious': {
    easy: ['worried', 'nervous', 'stressed', 'uneasy', 'tense'],
    medium: ['apprehensive', 'restless', 'on-edge', 'agitated', 'fretful'],
    hard: ['spiral', 'overthinking', 'doom', 'catastrophizing', 'knots']
  },

  // Transportation
  'Car': {
    easy: ['drive', 'road', 'vehicle', 'wheels', 'engine'],
    medium: ['traffic', 'highway', 'license', 'commute', 'parking'],
    hard: ['freedom', 'American', 'dream', 'backseat', 'road-trip']
  },
  'Airplane': {
    easy: ['fly', 'sky', 'pilot', 'airport', 'wings'],
    medium: ['takeoff', 'landing', 'altitude', 'travel', 'passenger'],
    hard: ['turbulence', 'peanuts', 'recline', 'overhead', 'window']
  },
  'Train': {
    easy: ['tracks', 'station', 'passenger', 'conductor', 'railway'],
    medium: ['commute', 'locomotive', 'schedule', 'platform', 'whistle'],
    hard: ['thought', 'steam', 'Orient', 'Express', 'caboose']
  },
  'Bicycle': {
    easy: ['pedal', 'wheels', 'ride', 'handlebars', 'chain'],
    medium: ['exercise', 'balance', 'lane', 'helmet', 'gear'],
    hard: ['fish', 'training', 'wheels', 'Amsterdam', 'green']
  },
  'Bus': {
    easy: ['public', 'stop', 'driver', 'route', 'passengers'],
    medium: ['schedule', 'transit', 'city', 'fare', 'seat'],
    hard: ['Rosa', 'Parks', 'magic', 'school', 'wheels']
  },
  'Motorcycle': {
    easy: ['bike', 'ride', 'helmet', 'engine', 'fast'],
    medium: ['leather', 'highway', 'freedom', 'loud', 'two-wheels'],
    hard: ['Harley', 'rebel', 'wind', 'chrome', 'gang']
  },
  'Boat': {
    easy: ['water', 'sail', 'ocean', 'captain', 'deck'],
    medium: ['anchor', 'port', 'voyage', 'waves', 'cruise'],
    hard: ['rock', 'same', 'float', 'missed', 'ship']
  },
  'Helicopter': {
    easy: ['fly', 'blades', 'hover', 'pilot', 'air'],
    medium: ['rotor', 'rescue', 'landing', 'chopper', 'vertical'],
    hard: ['Apache', 'news', 'traffic', 'medic', 'parent']
  },
  'Subway': {
    easy: ['underground', 'train', 'station', 'city', 'tunnel'],
    medium: ['commute', 'metro', 'platform', 'rush', 'map'],
    hard: ['sardines', 'transfer', 'busker', 'rat', 'delay']
  },
  'Taxi': {
    easy: ['cab', 'driver', 'fare', 'ride', 'yellow'],
    medium: ['meter', 'hail', 'passenger', 'city', 'tip'],
    hard: ['Uber', 'medallion', 'confession', 'driver', 'backseat']
  },
  'Truck': {
    easy: ['big', 'haul', 'cargo', 'driver', 'road'],
    medium: ['delivery', 'diesel', 'freight', 'semi', 'load'],
    hard: ['monster', 'ice', 'road', 'eighteen', 'convoy']
  },
  'Scooter': {
    easy: ['ride', 'kick', 'wheels', 'electric', 'small'],
    medium: ['balance', 'rental', 'sidewalk', 'vespa', 'commute'],
    hard: ['lime', 'bird', 'menace', 'Italy', 'Roman']
  },
  'Ferry': {
    easy: ['boat', 'water', 'passengers', 'dock', 'cross'],
    medium: ['harbor', 'transport', 'deck', 'island', 'car'],
    hard: ['Staten', 'godmother', 'crossing', 'commute', 'horn']
  },
  'Rocket': {
    easy: ['space', 'launch', 'astronaut', 'NASA', 'fast'],
    medium: ['fuel', 'orbit', 'mission', 'countdown', 'blast'],
    hard: ['science', 'Elton', 'man', 'pocket', 'red']
  },
  'Ambulance': {
    easy: ['emergency', 'hospital', 'siren', 'medical', 'rescue'],
    medium: ['paramedic', 'stretcher', 'urgent', 'lights', 'first-aid'],
    hard: ['chaser', 'golden', 'hour', 'trauma', 'yield']
  },
  'Tram': {
    easy: ['tracks', 'city', 'electric', 'passengers', 'street'],
    medium: ['cable', 'public', 'historic', 'route', 'bell'],
    hard: ['San Francisco', 'desire', 'named', 'trolley', 'vintage']
  },

  // Music Genres
  'Rock': {
    easy: ['guitar', 'band', 'loud', 'drums', 'concert'],
    medium: ['electric', 'anthem', 'rebel', 'stage', 'amplifier'],
    hard: ['ages', 'hard', 'place', 'roll', 'stone']
  },
  'Pop': {
    easy: ['catchy', 'radio', 'dance', 'mainstream', 'hit'],
    medium: ['chart', 'hook', 'celebrity', 'upbeat', 'trendy'],
    hard: ['bubble', 'corn', 'fizz', 'soda', 'culture']
  },
  'Jazz': {
    easy: ['saxophone', 'improvise', 'smooth', 'swing', 'blues'],
    medium: ['New Orleans', 'trumpet', 'bebop', 'club', 'cool'],
    hard: ['hands', 'age', 'standard', 'Utah', 'all-that']
  },
  'Classical': {
    easy: ['orchestra', 'symphony', 'violin', 'Mozart', 'Beethoven'],
    medium: ['conductor', 'composer', 'opera', 'concert', 'elegant'],
    hard: ['conditioning', 'education', 'period', 'timeless', 'movement']
  },
  'Hip-Hop': {
    easy: ['rap', 'beats', 'rhyme', 'DJ', 'urban'],
    medium: ['flow', 'lyrics', 'producer', 'sample', 'street'],
    hard: ['cipher', 'bars', 'culture', 'battle', 'conscious']
  },
  'Country': {
    easy: ['guitar', 'Nashville', 'cowboy', 'twang', 'boots'],
    medium: ['ballad', 'storytelling', 'pickup', 'truck', 'heart'],
    hard: ['roads', 'club', 'mile', 'western', 'honky-tonk']
  },
  'Electronic': {
    easy: ['DJ', 'beats', 'dance', 'synthesizer', 'club'],
    medium: ['bass', 'drop', 'remix', 'festival', 'EDM'],
    hard: ['rave', 'glow', 'underground', 'warehouse', 'sunrise']
  },
  'Blues': {
    easy: ['guitar', 'sad', 'soul', 'Mississippi', 'feeling'],
    medium: ['harmonica', 'melancholy', 'delta', 'rhythm', 'authentic'],
    hard: ['Monday', 'Baby', 'crossroads', 'twelve', 'bar']
  },
  'Reggae': {
    easy: ['Jamaica', 'Bob Marley', 'relaxed', 'island', 'dreadlocks'],
    medium: ['rhythm', 'roots', 'peace', 'bass', 'positive'],
    hard: ['Babylon', 'Zion', 'irie', 'riddim', 'skank']
  },
  'Metal': {
    easy: ['heavy', 'loud', 'guitar', 'headbang', 'black'],
    medium: ['drums', 'aggressive', 'concert', 'mosh', 'shred'],
    hard: ['detector', 'iron', 'thrash', 'death', 'horns']
  },
  'Folk': {
    easy: ['acoustic', 'traditional', 'storytelling', 'simple', 'ballad'],
    medium: ['roots', 'heritage', 'banjo', 'authentic', 'community'],
    hard: ['lore', 'campfire', 'protest', 'Dylan', 'Woody']
  },
  'Soul': {
    easy: ['emotional', 'rhythm', 'gospel', 'Motown', 'heart'],
    medium: ['Aretha', 'feeling', 'powerful', 'passionate', 'voice'],
    hard: ['brother', 'sister', 'train', 'mate', 'food']
  },
  'Punk': {
    easy: ['rebellion', 'fast', 'mohawk', 'loud', 'attitude'],
    medium: ['DIY', 'underground', 'anarchy', 'raw', 'energy'],
    hard: ['safety', 'pin', 'Ramones', 'CBGB', 'scene']
  },
  'Opera': {
    easy: ['singing', 'dramatic', 'classical', 'stage', 'costume'],
    medium: ['soprano', 'aria', 'Italian', 'theater', 'orchestra'],
    hard: ['fat', 'lady', 'Phantom', 'Wagner', 'horse']
  },
  'Disco': {
    easy: ['dance', 'seventies', 'ball', 'club', 'groove'],
    medium: ['funky', 'glitter', 'Saturday', 'fever', 'floor'],
    hard: ['demolition', 'dead', 'Travolta', 'polyester', 'hustle']
  },
  'Gospel': {
    easy: ['church', 'choir', 'spiritual', 'praise', 'religious'],
    medium: ['Sunday', 'soul', 'uplifting', 'harmony', 'worship'],
    hard: ['truth', 'good', 'news', 'testimony', 'preach']
  },

  // Places
  'Beach': {
    easy: ['sand', 'ocean', 'waves', 'sun', 'vacation'],
    medium: ['shore', 'towel', 'sunscreen', 'swim', 'relax'],
    hard: ['life', 'bum', 'boys', 'blanket', 'castles']
  },
  'Mountain': {
    easy: ['peak', 'climb', 'snow', 'high', 'hiking'],
    medium: ['summit', 'range', 'altitude', 'scenic', 'valley'],
    hard: ['molehill', 'Everest', 'dew', 'goat', 'moving']
  },
  'City': {
    easy: ['urban', 'buildings', 'traffic', 'busy', 'downtown'],
    medium: ['skyline', 'metropolitan', 'crowded', 'lights', 'concrete'],
    hard: ['jungle', 'slicker', 'never', 'sleeps', 'emerald']
  },
  'Forest': {
    easy: ['trees', 'nature', 'woods', 'green', 'wildlife'],
    medium: ['canopy', 'trail', 'leaves', 'peaceful', 'hiking'],
    hard: ['Gump', 'trees', 'miss', 'enchanted', 'lost']
  },
  'Desert': {
    easy: ['sand', 'hot', 'dry', 'cactus', 'sun'],
    medium: ['oasis', 'dunes', 'arid', 'harsh', 'camel'],
    hard: ['abandon', 'mirage', 'Sahara', 'bloom', 'isolation']
  },
  'Island': {
    easy: ['water', 'tropical', 'beach', 'isolated', 'palm'],
    medium: ['paradise', 'surrounded', 'escape', 'remote', 'ocean'],
    hard: ['man', 'Gilligan', 'treasure', 'Manhattan', 'kitchen']
  },
  'Lake': {
    easy: ['water', 'fishing', 'calm', 'boat', 'swim'],
    medium: ['shore', 'reflection', 'peaceful', 'dock', 'nature'],
    hard: ['cabin', 'house', 'Tahoe', 'placid', 'effect']
  },
  'Cave': {
    easy: ['dark', 'underground', 'bats', 'rock', 'explore'],
    medium: ['stalactite', 'deep', 'spelunking', 'cold', 'echo'],
    hard: ['man', 'allegory', 'Plato', 'bear', 'wine']
  },
  'Castle': {
    easy: ['king', 'medieval', 'tower', 'stone', 'royal'],
    medium: ['moat', 'fortress', 'knight', 'throne', 'princess'],
    hard: ['air', 'sand', 'bouncy', 'Disney', 'Dracula']
  },
  'Museum': {
    easy: ['art', 'history', 'exhibit', 'display', 'culture'],
    medium: ['gallery', 'artifact', 'tour', 'collection', 'educational'],
    hard: ['night', 'Smithsonian', 'quiet', 'guard', 'heist']
  },
  'Park': {
    easy: ['grass', 'trees', 'playground', 'bench', 'nature'],
    medium: ['walk', 'picnic', 'recreation', 'green', 'relax'],
    hard: ['ball', 'parallel', 'Jurassic', 'theme', 'double']
  },
  'Stadium': {
    easy: ['sports', 'crowd', 'game', 'team', 'seats'],
    medium: ['arena', 'cheer', 'field', 'event', 'loud'],
    hard: ['wave', 'nosebleed', 'hot-dog', 'jumbotron', 'tailgate']
  },
  'Hospital': {
    easy: ['doctor', 'sick', 'medical', 'nurse', 'patient'],
    medium: ['emergency', 'surgery', 'health', 'treatment', 'care'],
    hard: ['General', 'visiting', 'hours', 'scrubs', 'cafeteria']
  },
  'Airport': {
    easy: ['plane', 'travel', 'flight', 'terminal', 'luggage'],
    medium: ['security', 'gate', 'boarding', 'delay', 'departure'],
    hard: ['layover', 'customs', 'duty-free', 'redeye', 'overhead']
  },
  'Library': {
    easy: ['books', 'quiet', 'read', 'study', 'shelves'],
    medium: ['silence', 'knowledge', 'borrow', 'reference', 'card'],
    hard: ['shush', 'Dewey', 'overdue', 'Alexandria', 'stacks']
  },
  'Temple': {
    easy: ['religion', 'worship', 'sacred', 'prayer', 'spiritual'],
    medium: ['ancient', 'shrine', 'peace', 'holy', 'ritual'],
    hard: ['doom', 'Shirley', 'body', 'forehead', 'Indiana']
  }
};

// Get clue for a word at specified difficulty
function getClueForWord(word, difficulty = 'medium', excludeClues = []) {
  const associations = wordAssociations[word];
  if (!associations) {
    return null;
  }

  const clues = associations[difficulty] || associations.medium;
  const availableClues = clues.filter(c => !excludeClues.includes(c.toLowerCase()));

  if (availableClues.length === 0) {
    // Fallback to other difficulties
    const allClues = [...associations.easy, ...associations.medium, ...associations.hard];
    const fallbackClues = allClues.filter(c => !excludeClues.includes(c.toLowerCase()));
    if (fallbackClues.length > 0) {
      return fallbackClues[Math.floor(Math.random() * fallbackClues.length)];
    }
    return null;
  }

  return availableClues[Math.floor(Math.random() * availableClues.length)];
}

// Get all possible clues for a word (for chameleon analysis)
function getAllCluesForWord(word) {
  const associations = wordAssociations[word];
  if (!associations) return [];
  return [...associations.easy, ...associations.medium, ...associations.hard];
}

// Find which words a clue might relate to (for chameleon guessing)
function findWordsForClue(clue, topicWords) {
  const matches = [];
  const clueLower = clue.toLowerCase();

  for (const word of topicWords) {
    const associations = wordAssociations[word];
    if (!associations) continue;

    const allClues = [...associations.easy, ...associations.medium, ...associations.hard];
    for (const assoc of allClues) {
      if (assoc.toLowerCase().includes(clueLower) || clueLower.includes(assoc.toLowerCase())) {
        matches.push({ word, relevance: 'high' });
        break;
      }
    }
  }

  return matches;
}

module.exports = {
  wordAssociations,
  getClueForWord,
  getAllCluesForWord,
  findWordsForClue
};
