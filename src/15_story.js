// ---------------------------------------------------------------------------
// Story: cold opens, tags, recaps, hub banter, credits
// ---------------------------------------------------------------------------
const SIT_Y = 214;
const STORY = [];

// S1E1 ---------------------------------------------------------------------------
STORY[0] = {
  coldOpen: [
    ['set', 'cafe'],
    ['at', 'dex', 140, { anim: 'sit', y: SIT_Y }], ['at', 'juno', 168, { anim: 'sit', y: SIT_Y }], ['at', 'theo', 196, { anim: 'sit', y: SIT_Y }],
    ['at', 'mila', 254, { face: -1 }], ['at', 'gus', 382, { face: -1 }],
    ['wait', 30],
    ['say', 'gus', 'You six have been on that couch for nine hours.'],
    ['say', 'mila', 'Eight hours, fifty-two minutes. I\'m keeping score.', { expr: 'smug' }],
    ['say', 'gus', 'Score of WHAT?', { expr: 'angry' }],
    ['say', 'mila', 'Everything.', { expr: 'smug' }],
    ['laugh', 'laugh'],
    ['enter', 'priya', 'D1', 104, { wait: true }],
    ['say', 'priya', 'Big news! I found a tenant for 5A!', { anim: 'phone', expr: 'happy' }],
    ['say', 'theo', '5A? The elevator\'s been broken since 1987.'],
    ['say', 'dex', 'Since YOU fixed it.', { expr: 'smug' }],
    ['laugh', 'chuckle'],
    ['say', 'priya', 'She moves in TODAY. She owns a grand piano.', { anim: 'idle' }],
    ['faceall', 'dex'],
    ['wait', 40],
    ['zoom', 'dex', 2],
    ['say', 'dex', '...Why is everybody looking at me?', { expr: 'surprised' }],
    ['laugh', 'big'],
    ['zoom', null],
    ['sing', 'juno', 'Moving day, moving day, Dex\'s back is gonna give way!'],
    ['laugh', 'laugh'],
    ['say', 'dex', 'Fine. I\'ll help. But I\'m complaining the whole time.', { expr: 'sad', anim: 'backpain' }],
    ['pop', 'benny', 222, 224, 'cheer'],
    ['expr', 'all', 'surprised'],
    ['say', 'benny', 'TA-DA!', { expr: 'grin' }],
    ['say', 'theo', 'Benny?! How long have you been behind the couch?', { expr: 'surprised' }],
    ['say', 'benny', 'Since Tuesday. It\'s a really long trick.', { expr: 'grin' }],
    ['laugh', 'big'],
    ['freeze'],
  ],
  tag: [
    ['set', 'hall'],
    ['at', 'dex', 214, { anim: 'backpain', expr: 'pain' }], ['at', 'mila', 160, { face: 1 }], ['at', 'theo', 256, { face: -1 }],
    ['at', 'priya', 296, { face: -1 }], ['at', 'juno', 118, { face: 1 }], ['at', 'benny', 330, { face: -1 }],
    ['enter', 'roz', 'R', 392, { wait: true }],
    ['say', 'roz', 'Darlings! You moved EVERYTHING! Even the piano!', { expr: 'happy' }],
    ['say', 'dex', 'My back... is... fine.', { expr: 'pain', anim: 'backpain' }],
    ['say', 'roz', 'Wonderful! Because the OTHER piano arrives tomorrow.', { expr: 'happy' }],
    ['zoom', 'dex', 2.2],
    ['say', 'dex', 'The other WHAT?!', { expr: 'shock' }],
    ['laugh', 'big'],
    ['freeze'],
  ],
  credits: ['Piano Logistics: DEX (under protest)', 'Bylaw Enforcement: MR. FENWICK', 'Elevator Repair: THEO (1987, also today)', 'Mail Slot Occupant: BENNY'],
};

// S1E2 ---------------------------------------------------------------------------
STORY[1] = {
  previously: [
    ['set', 'hall'],
    ['at', 'roz', 330, { face: -1, expr: 'happy' }], ['at', 'dex', 230, { face: 1, anim: 'backpain', expr: 'pain' }],
    ['say', 'roz', 'The OTHER piano arrives tomorrow!', { expr: 'happy' }],
    ['say', 'dex', 'The other WHAT?!', { expr: 'shock' }],
    ['wait', 20],
  ],
  coldOpen: [
    ['set', 'apt3a'],
    ['at', 'theo', 250, { face: 1, expr: 'happy' }], ['at', 'dex', 92, { anim: 'sit', y: SIT_Y }], ['at', 'mila', 160, { face: 1 }], ['at', 'benny', 196, { face: 1 }],
    ['prop', 'sarge', 'iguana', 330, 210],
    ['say', 'theo', 'Behold! The Iguana-Feeder 3000! Fresh lettuce every four hours!', { anim: 'cheer' }],
    ['say', 'dex', 'What happens at hour five?'],
    ['say', 'theo', 'Nobody knows. That\'s science!', { expr: 'grin' }],
    ['fx', 'sparks', 240, 180], ['sfx', 'zap'], ['shake', 3],
    ['prop', 'lettuce', 'lettuce', 236, 176], ['moveprop', 'lettuce', 60, 120, 5],
    ['expr', 'all', 'surprised'],
    ['laugh', 'big'],
    ['wait', 30],
    ['say', 'mila', 'Point for the lettuce.'],
    ['laugh', 'chuckle'],
    ['unprop', 'sarge'], ['sfx', 'squeak'],
    ['wait', 30],
    ['face', 'theo', -1],
    ['say', 'theo', '...Has anyone seen Sarge?', { expr: 'scared' }],
    ['laugh', 'ooh'],
    ['say', 'benny', 'I\'ll check my apartment. Everything ends up in my apartment.', { expr: 'neutral' }],
    ['say', 'mila', 'He\'s got a head start. I love a race.', { expr: 'smug', anim: 'flex' }],
    ['laugh', 'chuckle'],
    ['freeze'],
  ],
  tag: [
    ['set', 'hall'],
    ['at', 'theo', 120, { face: 1 }], ['at', 'dex', 160, { face: 1 }], ['at', 'mila', 196, { face: 1 }], ['at', 'priya', 90, { face: 1 }], ['at', 'benny', 228, { face: 1 }], ['at', 'juno', 60, { face: 1 }],
    ['enter', 'holloway', 'R', 330, { wait: true, expr: 'angry' }],
    ['prop', 'sargehead', 'iguanaL', 330, 194],
    ['say', 'holloway', 'If I EVER find that lizard in my building...', { expr: 'angry' }],
    ['say', 'holloway', 'Rule 9. No reptiles. I\'ll be watching.', { anim: 'point' }],
    ['expr', 'all', 'surprised'],
    ['wait', 40],
    ['say', 'holloway', 'What? What are you all looking at?', { expr: 'neutral' }],
    ['laugh', 'big'],
    ['freeze'],
  ],
  credits: ['Iguana Wrangler: THEO (fired)', 'Hallway Choreography: MR. HOLLOWAY', 'Lettuce: Organic, airborne', 'Greenhouse Security: ROZ'],
};

// S1E3 ---------------------------------------------------------------------------
STORY[2] = {
  previously: [
    ['set', 'hall'],
    ['at', 'holloway', 300, { face: -1, expr: 'angry' }],
    ['prop', 'sargehead', 'iguanaL', 300, 194],
    ['at', 'theo', 200, { face: 1, expr: 'surprised' }],
    ['say', 'holloway', 'What? What are you all looking at?'],
    ['wait', 20],
  ],
  coldOpen: [
    ['set', 'cafe'],
    ['at', 'dex', 140, { anim: 'sit', y: SIT_Y }], ['at', 'priya', 168, { anim: 'sit', y: SIT_Y }], ['at', 'theo', 230, { face: 1 }],
    ['at', 'juno', 196, { anim: 'sit', y: SIT_Y }], ['at', 'gus', 382, { face: -1, expr: 'scared' }],
    ['say', 'gus', 'The health inspector is coming. In ONE HOUR.', { expr: 'scared' }],
    ['say', 'theo', 'Relax, Gus. What could possibly go wrong?', { expr: 'happy' }],
    ['fx', 'steam', 355, 140], ['shake', 4], ['sfx', 'crash'],
    ['expr', 'all', 'surprised'],
    ['wait', 30],
    ['say', 'gus', 'THAT. That could go wrong.', { expr: 'angry', anim: 'point' }],
    ['laugh', 'big'],
    ['say', 'priya', 'Don\'t panic. I know a guy at the health department.', { anim: 'phone' }],
    ['say', 'gus', 'You know a guy EVERYWHERE.'],
    ['say', 'priya', 'I know a guy who knows that.', { expr: 'smug' }],
    ['laugh', 'laugh'],
    ['sing', 'juno', 'Health inspector at the door, hide the pigeons, mop the floor!'],
    ['say', 'gus', 'What pigeons?', { expr: 'scared' }],
    ['sfx', 'flutter'], ['sfx', 'coo'],
    ['laugh', 'ooh'],
    ['freeze'],
  ],
  tag: [
    ['set', 'cafe'],
    ['at', 'inspector', 300, { face: -1, expr: 'neutral' }], ['at', 'gus', 382, { face: -1, expr: 'scared' }],
    ['at', 'dex', 100, { face: 1 }], ['at', 'mila', 130, { face: 1 }], ['at', 'theo', 160, { face: 1 }], ['at', 'priya', 190, { face: 1 }], ['at', 'juno', 70, { face: 1 }],
    ['say', 'inspector', 'Clean floors. Working machines. No pigeons.', { expr: 'neutral' }],
    ['say', 'inspector', 'I\'m giving The Daily Grind... an A.', { expr: 'happy' }],
    ['say', 'gus', 'An A? I\'m gonna cry. Don\'t look at me.', { expr: 'cry', anim: 'cry' }],
    ['laugh', 'aww'],
    ['walk', 'inspector', 210, { wait: true }],
    ['anim', 'inspector', 'sit'],
    ['pop', 'benny', 222, 224, 'cheer'],
    ['say', 'benny', 'TA-DA!', { expr: 'grin' }],
    ['expr', 'inspector', 'shock'],
    ['wait', 30],
    ['say', 'inspector', '...A-minus.', { expr: 'angry' }],
    ['laugh', 'big'],
    ['freeze'],
  ],
  credits: ['Pigeon Relocation: JUNO (jazz)', 'Espresso Archaeology: THEO', 'Couch Placement: DEX (gently)', 'Inspector Wrangling: PRIYA (knows Brenda)'],
};

// S1E4 ---------------------------------------------------------------------------
STORY[3] = {
  previously: [
    ['set', 'cafe'],
    ['at', 'inspector', 210, { anim: 'sit', y: SIT_Y, expr: 'happy' }], ['at', 'gus', 382, { face: -1, expr: 'cry', anim: 'cry' }],
    ['pop', 'benny', 222, 224, 'cheer'],
    ['expr', 'inspector', 'shock'],
    ['say', 'inspector', '...A-minus.', { expr: 'angry' }],
    ['wait', 20],
  ],
  coldOpen: [
    ['set', 'apt3b'],
    ['at', 'mila', 200, { face: 1, expr: 'happy' }], ['at', 'dex', 112, { anim: 'sit', y: SIT_Y }], ['at', 'benny', 150, { anim: 'sit', y: SIT_Y }],
    ['at', 'theo', 300, { face: -1 }], ['at', 'juno', 340, { face: -1 }], ['at', 'priya', 60, { face: 1 }],
    ['say', 'mila', 'Party starts at eight. Snacks: optimal. Playlist: optimal. Guests: forty-one.', { anim: 'point' }],
    ['say', 'dex', 'Forty-one? This apartment fits nine. Ten if Benny\'s in a drawer.'],
    ['say', 'benny', 'I\'ve been in worse drawers.', { expr: 'grin' }],
    ['laugh', 'chuckle'],
    ['say', 'theo', 'And for the grand finale: my new invention. The Clap-o-Matic!', { anim: 'cheer', expr: 'happy' }],
    ['say', 'theo', 'Watch. Two claps, and the lights go full party mode.'],
    ['anim', 'theo', 'cheer'], ['sfx', 'claps'], ['wait', 20],
    ['sfx', 'powerdown'], ['dark', true, true], ['shake', 2],
    ['laugh', 'big'],
    ['wait', 40],
    ['say', 'theo', 'Okay. That\'s... the opposite of party mode.'],
    ['say', 'mila', 'THEO.'],
    ['say', 'juno', 'Is this part of the party? I can work with this. ♪ Spooky jazz ♪'],
    ['say', 'benny', 'Stand back. ABRACADABRA!'],
    ['dark', false, true], ['flash'], ['sfx', 'magic'],
    ['expr', 'all', 'surprised'],
    ['laugh', 'ooh'],
    ['wait', 25],
    ['sfx', 'powerdown'], ['dark', true, true],
    ['wait', 30],
    ['say', 'benny', '...Partial credit?'],
    ['laugh', 'big'],
    ['say', 'priya', 'Guys. It\'s not just us. It\'s the WHOLE building.', { anim: 'phone' }],
    ['say', 'mila', 'Nobody panic. Except Theo. Theo, panic PRODUCTIVELY.'],
    ['laugh', 'laugh'],
    ['freeze'],
  ],
  tag: [
    ['set', 'apt3b'],
    ['at', 'mila', 200, { face: 1, expr: 'happy', anim: 'cheer' }], ['at', 'dex', 112, { anim: 'sit', y: SIT_Y }], ['at', 'benny', 150, { anim: 'sit', y: SIT_Y }],
    ['at', 'theo', 250, { face: -1 }], ['at', 'juno', 300, { face: -1 }], ['at', 'priya', 60, { face: 1 }],
    ['say', 'mila', 'Lights on! Party on! Forty-one guests and ZERO blackouts!', { anim: 'cheer' }],
    ['say', 'theo', 'This calls for a celebration!', { anim: 'cheer', expr: 'happy' }],
    ['sfx', 'claps'], ['wait', 18],
    ['sfx', 'powerdown'], ['dark', true, true],
    ['laugh', 'big'],
    ['wait', 30],
    ['say', 'mila', 'Theo. I am going to put you in the scoreboard. As a LOSS.'],
    ['at', 'roz', 392, { face: -1, expr: 'happy' }], ['at', 'holloway', 372, { face: 1, expr: 'happy' }],
    ['say', 'juno', 'Hang on. I\'ve got this. ♪ Da-da-DUM! ♪', { anim: 'play' }],
    ['sfx', 'powerup'], ['dark', false, true], ['flash'],
    ['emote', 'roz', '♥'], ['emote', 'holloway', '♥'], ['fx', 'hearts', 382, 170],
    ['faceall', 'holloway'], ['expr', 'all', 'surprised'],
    ['laugh', 'ooh'],
    ['wait', 30],
    ['expr', 'holloway', 'scared'],
    ['say', 'holloway', '...This never happened.', { expr: 'scared' }],
    ['say', 'roz', 'Oh, it happened, darling.', { expr: 'smug' }],
    ['laugh', 'big'],
    ['freeze'],
  ],
  credits: ['Clap-o-Matic Inventor: THEO (please stop)', 'Breaker Flipping: MILA (scoreboard pending)', 'Trapdoor Consultant: JUNO', 'Smoking Jacket: MR. HOLLOWAY\'S OWN'],
};

// S1E5 ---------------------------------------------------------------------------
STORY[4] = {
  previously: [
    ['set', 'apt3b'],
    ['at', 'roz', 392, { face: -1, expr: 'smug' }], ['at', 'holloway', 372, { face: 1, expr: 'scared' }],
    ['at', 'mila', 200, { face: 1, expr: 'surprised' }], ['at', 'theo', 250, { face: 1, expr: 'surprised' }],
    ['emote', 'roz', '♥'],
    ['say', 'holloway', '...This never happened.', { expr: 'scared' }],
    ['say', 'roz', 'Oh, it happened, darling.', { expr: 'smug' }],
    ['wait', 20],
  ],
  coldOpen: [
    ['set', 'cafe'],
    ['at', 'priya', 140, { anim: 'sit', y: SIT_Y }], ['at', 'juno', 168, { anim: 'sit', y: SIT_Y }], ['at', 'theo', 196, { anim: 'sit', y: SIT_Y }],
    ['at', 'dex', 262, { face: -1, expr: 'happy' }], ['at', 'mila', 300, { face: -1 }], ['at', 'benny', 92, { face: 1 }], ['at', 'gus', 382, { face: -1 }],
    ['say', 'dex', 'Ladies and gentlemen: the First Annual Bellweather Rooftop Barbecue.', { anim: 'point', expr: 'happy' }],
    ['say', 'gus', 'Who approved this?'],
    ['say', 'dex', 'Me. I\'m a gym teacher. Summer is my Olympics.', { anim: 'flex' }],
    ['laugh', 'chuckle'],
    ['say', 'mila', 'I\'m bringing a stopwatch. For the hot dog eating.', { expr: 'smug' }],
    ['say', 'theo', 'And I\'m bringing my grill! It barely explodes anymore.', { expr: 'happy' }],
    ['say', 'priya', 'One problem. Holloway\'s Rule 112: no open flames on the roof.'],
    ['say', 'juno', 'What about CLOSED flames?'],
    ['laugh', 'chuckle'],
    ['say', 'dex', 'Easy. We just don\'t tell Holloway.', { expr: 'smug' }],
    ['enter', 'holloway', 'D1', 220, { wait: true, expr: 'angry' }],
    ['say', 'holloway', 'Don\'t tell Holloway WHAT?', { expr: 'angry' }],
    ['expr', 'all', 'scared'],
    ['laugh', 'big'],
    ['say', 'dex', '...Hi, Mr. Holloway. Lovely sweater vest.', { expr: 'scared' }],
    ['say', 'holloway', 'Rule 112. No flames. No grills. No FUN.', { anim: 'point', expr: 'angry' }],
    ['exit', 'holloway', 'L', { wait: true }],
    ['say', 'mila', 'He said "no fun" like it\'s a rule.'],
    ['say', 'priya', 'It IS a rule. It\'s Rule 1.'],
    ['laugh', 'laugh'],
    ['freeze'],
  ],
  tag: [
    ['set', 'roof'],
    ['at', 'dex', 316, { face: 1, expr: 'happy' }], ['at', 'priya', 110, { face: 1 }], ['at', 'mila', 150, { face: 1 }],
    ['at', 'theo', 196, { face: 1 }], ['at', 'juno', 236, { face: 1 }], ['at', 'benny', 272, { face: 1 }],
    ['say', 'dex', 'Burgers are UP! Who\'s hungry?', { anim: 'cheer', expr: 'happy' }],
    ['say', 'benny', 'For my next trick, I will make this burger DISAPPEAR.', { expr: 'grin' }],
    ['say', 'mila', 'That\'s just eating, Benny.'],
    ['laugh', 'chuckle'],
    ['enter', 'holloway', 'R', 392, { wait: true, expr: 'angry' }],
    ['faceall', 'holloway'],
    ['say', 'holloway', 'RULE 112! OPEN FLAMES! On MY roof!', { anim: 'point', expr: 'angry' }],
    ['expr', 'all', 'scared'],
    ['laugh', 'ooh'],
    ['enter', 'roz', 'R', 432, { wait: true, expr: 'happy' }],
    ['face', 'holloway', 'roz'],
    ['say', 'roz', 'Bertram, darling. Medium-rare. Just how you like it.', { expr: 'happy' }],
    ['wait', 40],
    ['say', 'holloway', '...Rule 112 is suspended. Pass the ketchup.', { expr: 'happy' }],
    ['emote', 'roz', '♥'],
    ['laugh', 'big'],
    ['say', 'dex', 'I\'m not crying. It\'s the onions.', { expr: 'cry', anim: 'cry' }],
    ['say', 'juno', 'There are no onions, Dex.'],
    ['say', 'dex', '...It\'s the friendship.', { expr: 'cry', anim: 'cry' }],
    ['laugh', 'aww'],
    ['freeze'],
  ],
  credits: ['Grill Master: DEX (apron-certified)', 'Fire Escape Speedrun: MILA (new record)', 'Sunbather Relations: PRIYA', 'Rule 112: SUSPENDED (medium-rare)'],
};

// ---------------------------------------------------------------------------
// Hub flavour
// ---------------------------------------------------------------------------
const SARGE_LINES = ['Sarge stares into your soul.', 'Sarge flicks his tongue. Respectfully.', 'Sarge has seen things.', 'Sarge salutes. Probably.', 'Sarge is plotting his next escape.'];
const WINDOW_LINES = ['Still raining. This city has one weather.', 'Somebody\'s umbrella just flew past. Again.', 'Nice view. Of rain.', 'I can see my apartment from here. It\'s across the street.'];
const COUCH_LINES = {
  dex: ['Ahh. Back support.', 'This couch gets me. Emotionally.'],
  mila: ['Called this spot. Point for Mila.', 'Best seat. I won it fair and square.'],
  theo: ['I should invent a couch that makes coffee.', 'Ahh. My thinking cushion.'],
  priya: ['Mid-century. Original. Priceless.', 'If I sold this couch, I\'d be rich. And hated.'],
  benny: ['I\'ll just... disappear into the cushions.', 'Found a quarter! And a sock. Mine?'],
  juno: ['♪ Couch, sweet couch ♪', 'Best acoustics in the city.'],
};
function progressStage() {
  const d = doneCount(Save.data);
  if (Save.data.done[12]) return 7;
  return Math.min(6, Math.floor(d / 2));
}
const GUS_LINES = [
  ['You\'re here early. Or late. I can\'t tell anymore.', 'The couch is for paying customers. Pay me in respect.', 'Chalkboard\'s right there. Do something with your lives.'],
  ['Heard you moved a piano. Five floors. You\'re all idiots. Nice job.', 'Keep that lizard away from my muffins.', 'Health inspector gave me an A-minus. Because of you. Thank you. I hate it.'],
  ['A blackout party AND a rooftop barbecue? Who are you people?', 'Holloway and that opera lady? Didn\'t see that coming.', 'You six are like a sitcom. A bad one. I watch every episode.'],
  ['Wedding band, huh? Juno played "Celebrate" four times. I counted.', 'Holloway\'s married. The world is weird.', 'I\'m putting a meter on that couch.'],
  ['A magic show, an inventing contest, the subway. Do you ever sleep?', 'Benny owes me for three "disappearing" croissants.', 'Theo\'s robot vacuumed my tip jar. I want it back.'],
  ['The boiler\'s still making noises. Like me.', 'Business is slow. Don\'t tell anybody I said that.', 'I\'m fine. Everything\'s fine. Have a muffin.'],
  ['...You came to the airport. For me. Don\'t make it weird.', 'I\'m still here. Somebody\'s iguana grounded a plane.', 'The new owner comes Friday. Unless... no. Forget it.'],
  ['Grand reopening. Packed every day since. I blame you six.', 'The couch is yours. Forever. Don\'t make me say it twice.', 'Best customers I ever had. Worst, too. Same six.'],
];
function gusLines() { return GUS_LINES[progressStage()]; }

// Banter: [stage][who] -> exchanges. 'me' = the friend you're playing, 'them' = who you talk to.
const BANTER = {
  dex: [
    [['them', 'I said I\'d help Roz move. Why did I say that? Why do I always say that?'], ['me', 'Because you\'re nice.'], ['them', 'Nice is a disease.']],
    [['them', 'I saw a car commercial today. The dad teaches his kid to drive.'], ['them', 'I\'m not crying. It\'s allergies. To feelings.']],
    [['them', 'I\'m a gym teacher. Lifting is my job. Lifting PIANOS was not in the contract.']],
    [['them', 'I cried at the wedding. Twice. Once at the vows, once at the shrimp tower.']],
    [['them', 'I\'m training for the next move. Squats. Lots of squats. Pray for me.']],
    [['them', 'Gus looks sad lately. I know sad. I watch a lot of commercials.']],
    [['them', 'You know what\'s heavier than a piano? Goodbyes. And pianos.']],
    [['them', 'Grand reopening. Best day ever. My back agrees, for once.']],
  ],
  mila: [
    [['them', 'Scoreboard update: me 2,347. You: participation trophy.'], ['me', 'We\'re not even competing.'], ['them', 'That\'s exactly what a loser would say. Point for me.']],
    [['them', 'I raced Sarge down three flights of stairs. He cheated. He\'s an iguana.']],
    [['them', 'Who won the health inspection? Technically me. I mopped fastest.']],
    [['them', 'Wedding bouquet toss. I caught it. I wasn\'t even trying. I was trying.']],
    [['them', 'I raced the subway on my bike. The subway won. Rematch Tuesday.']],
    [['them', 'Snow day! I biked to the café. In the snow. Uphill. Point for Mila.']],
    [['them', 'I don\'t lose. But if Gus leaves... that feels like losing.']],
    [['them', 'Final scoreboard: The Gang: 1. Bad Days: 0. Even I\'m impressed.']],
  ],
  theo: [
    [['them', 'Behold! The Toast-o-Matic 2! ...It\'s on fire. That\'s normal.'], ['me', 'Is it?'], ['them', 'For my toasters, yes.']],
    [['them', 'Sarge is fine. He\'s a free spirit. He\'s also in my sock drawer.']],
    [['them', 'I\'m inventing a self-folding laundry machine. It folded my cat.'], ['me', 'You don\'t have a cat.'], ['them', 'Not anymore.']],
    [['them', 'The wedding amp was rated for 11. We hit 12. Science!']],
    [['them', 'My Tidy-Bot only vacuumed ONE judge. That\'s a personal best.']],
    [['them', 'I fixed the café boiler with a paper clip and hope. Mostly hope.']],
    [['them', 'I could rewire an airport. I just can\'t fix Gus leaving. Yet.']],
    [['them', 'Behold! The espresso machine works! I\'m as surprised as you!']],
  ],
  priya: [
    [['them', 'I know a guy who sells couches. Not THIS couch. This couch is sacred.']],
    [['them', 'I sold a closet as a "micro-loft" today. Benny lives in it.'], ['me', 'Benny lives there?'], ['them', 'He pays in card tricks.']],
    [['them', 'I know a guy at the health department. He owes me a casserole.']],
    [['them', 'I know a guy who rents wedding venues. And a guy who rents grooms. Kidding. Mostly.']],
    [['them', 'I know a guy who knows the subway map. He\'s been lost since 2009.']],
    [['them', 'I know a guy with a snowplow. He\'s in Florida. Useless.']],
    [['them', 'I know a guy at the airport. I know a guy everywhere. Except in Gus\'s heart.']],
    [['them', 'Grand reopening sold out. I didn\'t even know a guy. I WAS the guy.']],
  ],
  benny: [
    [['them', 'Pick a card. Any card.'], ['me', 'This is a coaster.'], ['them', 'The trick is... it\'s a coaster now.']],
    [['them', 'I can fit in ANY vent. It\'s my gift. And my curse. Mostly my curse.']],
    [['them', 'For my next trick, I\'ll make a croissant disappear. ...Done. Don\'t tell Gus.']],
    [['them', 'I did a magic trick at the wedding. The rings vanished.'], ['me', 'Benny...'], ['them', 'They came back! ...One came back.']],
    [['them', 'The Great Bennini! Live! Tonight! Possibly on fire!']],
    [['them', 'I live in apartment 4½. It used to be a broom closet. It still is.']],
    [['them', 'I can make anything disappear. Except sad feelings. Working on it.']],
    [['them', 'Ta-da! The café is saved! ...I\'m taking partial credit.']],
  ],
  juno: [
    [['them', '♪ Couch, couch, comfy couch, Gus is getting kind of grouch ♪'], ['me', 'Catchy.'], ['them', 'Wedding band rule: everything is catchy.']],
    [['them', '♪ Where\'s Sarge? Where\'s Sarge? He\'s probably on the barge ♪'], ['me', 'There\'s no barge.'], ['them', 'Creative license.']],
    [['them', 'I wrote a jingle for the health inspector. He gave me a B-plus.']],
    [['them', 'Wedding gigs pay the rent. Bar mitzvahs pay the snacks.']],
    [['them', 'The magic show needed a drumroll. I did it on a lunchbox.']],
    [['them', '♪ Snow, snow, everywhere I go, my keytar\'s frozen, oh no ♪']],
    [['them', 'I wrote Gus a goodbye song. I can\'t finish it. The ending\'s wrong.']],
    [['them', '♪ The gang\'s all here, the couch is near, Gus is staying, give a cheer! ♪']],
  ],
};
function pickBanter(me, them, idx) {
  const st = progressStage();
  const pool = (BANTER[them] && BANTER[them][st]) || [[['them', 'Hey.']]];
  const key = them + st;
  const i = (idx[key] = ((idx[key] || 0) + 1));
  // each stage has one main exchange; alternate with a generic quip
  if (i % 2 === 0) {
    const q = (QUIPS[them] && QUIPS[them].length) ? pick(QUIPS[them]) : '♪ La la la ♪';
    return [['them', q]];
  }
  return pool;
}

function miniCreditLines(i) {
  const ep = EPISODES[i] || EPISODES[0];
  const st = STORY[i] || {};
  const L = [];
  L.push({ text: "THE GANG'S ALL HERE", col: '#ffd23f', scale: 1, h: 18 });
  L.push({ text: ep.finale ? 'The Season Finale' : 'Season ' + ep.season + ', Episode ' + ep.num, col: '#c8b8d8' });
  L.push({ text: '"' + ep.title + '"', col: '#ffffff', h: 26 });
  L.push({ text: 'STARRING', col: '#ffd23f' });
  for (const w of FRIENDS) L.push({ text: FRIEND_INFO[w].name, col: FRIEND_INFO[w].color });
  L.push({ text: '', h: 10 });
  for (const c of (st.credits || [])) { const [a, b] = c.split(': '); L.push({ text: a, col: '#c8b8d8' }); L.push({ text: b || '', col: '#ffffff', h: 18 }); }
  L.push({ text: 'Couch provided by GUS (reluctantly)', col: '#c8b8d8', h: 18 });
  L.push({ text: 'Filmed in front of a live studio audience', col: '#8a7a9a' });
  L.push({ text: '(synthesized, but sincere)', col: '#8a7a9a' });
  return L;
}
function endCreditLines() {
  const L = [];
  const add = (text, col, scale, h) => L.push({ text, col, scale, h });
  add("THE GANG'S ALL HERE", '#ffd23f', 2, 34);
  add('Season One & Season Two', '#f6ead8', 1, 30);
  add('STARRING', '#ffd23f', 1, 20);
  const roles = { dex: 'the gym teacher who cries at commercials', mila: 'the bike courier who keeps score', theo: 'the inventor whose toaster hates him', priya: 'the agent who knows a guy', benny: 'the magician who lives in a closet', juno: 'the keyboardist with a jingle for everything' };
  for (const w of FRIENDS) { L.push({ portrait: w, h: 22 }); add(FRIEND_INFO[w].name, FRIEND_INFO[w].color, 2, 20); add('as ' + roles[w], '#f6ead8', 1, 22); }
  add('ALSO STARRING', '#ffd23f', 1, 18);
  add('GUS as the owner of the couch', '#8ac89a'); add('MR. HOLLOWAY as the landlord (Rule 1: no fun)', '#d8b84a'); add('ROZ as the new neighbor with two pianos', '#c88ad8'); add('SARGE as himself', '#6ac84a', 1, 26);
  add('GUEST STARS', '#ffd23f', 1, 18);
  add('Mr. Fenwick (bathrobe, his own)', '#f6ead8'); add('The Health Inspector (A-minus)', '#f6ead8'); add('The Tidy-Bot 9000 (no longer in custody)', '#f6ead8'); add('Professor Fluffington (rabbit, union)', '#f6ead8'); add('Mr. Vance (left disappointed)', '#f6ead8', 1, 26);
  add('THE STUDIO AUDIENCE', '#ffd23f', 1, 18);
  add('Every laugh, ooh, aww and round of applause', '#f6ead8'); add('was synthesized live by your browser.', '#f6ead8'); add('We like to think they meant it.', '#f6ead8', 1, 26);
  add('NO IGUANAS WERE HARMED', '#ffd23f', 1, 16); add('(Sarge harmed several plants and one airplane schedule)', '#f6ead8', 1, 26);
  add('YOUR SEASON', '#ffd23f', 1, 18);
  const S = Save.data;
  add('Episodes completed: ' + doneCount(S) + ' / 13', '#f6ead8');
  add('Golden mugs: ' + mugCount(S) + ' / 13', '#f5c542');
  add('Total takes (mishaps & retakes): ' + (S.totalTakes || 0), '#f6ead8', 1, 30);
  L.push({ couch: true, h: 70 });
  add('THANKS FOR WATCHING!', '#ff4f9a', 2, 30);
  add('The gang will be right here. On the couch.', '#f6ead8', 1, 40);
  add('THE END', '#ffd23f', 3, 60);
  return L;
}

// attach story to episodes
EPISODES.forEach((e, i) => { if (STORY[i]) Object.assign(e, STORY[i]); });
