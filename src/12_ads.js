// ---------------------------------------------------------------------------
// Commercial breaks. Before each episode's last act the network cuts away:
// "We'll be right back", one satirical local commercial, then back to the show.
// Beat speakers: 'host' (on camera), 'vo' (announcer), 'co' (another voice),
// 'sing' (the jingle). Beat flags reveal the badge, price, phone number, etc.
// ---------------------------------------------------------------------------
const ADS = [
  { // S1E1 moving day
    brand: 'MOVE-IT MOVERS', tag: 'You lift. We watch.', look: 'pitchman', name: 'BRAD', bg: ['#e8641e', '#ffb43a'], prod: 'truck',
    badge: ['FRIENDS', 'NOT INCL.'], price: ['$19.95', 'A DAY*'], phone: '1-800-555-LIFT',
    beats: [
      ['host', 'Moving? Why pay professionals when you\'ve got FRIENDS?', { anim: 'point', expr: 'grin' }],
      ['host', 'MOVE-IT MOVERS rents you a truck, a ramp, and the courage to ask.', { expr: 'happy' }],
      ['vo', 'Every truck comes with one dolly and one friend who says "I\'m free Saturday."', { badge: 1 }],
      ['host', 'Pizza not included. Friendships not insured!', { expr: 'grin', price: 1 }],
      ['sing', 'Move-It Movers! You lift, we watch!', { phone: 1 }],
    ],
    fine: '*Plus mileage, fuel, ramp fee, dolly fee, fee fee, and a cleaning charge for emotional baggage. Backs not covered. Friendship may not survive the third flight of stairs.',
  },
  { // S1E2 the iguana
    brand: 'PET PSYCHIC HOTLINE', tag: 'Madame Zara knows what your pet is thinking.', look: 'psychic', name: 'MADAME ZARA', bg: ['#4a1e78', '#8a4ad0'], prod: 'crystal',
    badge: ['1ST MINUTE', 'FREE!'], price: ['$4.99', 'EVERY MINUTE AFTER'], phone: '1-900-555-PAWS',
    beats: [
      ['host', 'Does your pet stare at you... and you don\'t know why?', { expr: 'smug' }],
      ['host', 'I am Madame Zara. I hear what animals are thinking.', { expr: 'neutral', anim: 'point' }],
      ['co', 'Hi, Zara? My cat keeps knocking cups off the table!', { name: 'CALLER' }],
      ['host', 'She says... stop buying cups.', { expr: 'smug', badge: 1 }],
      ['vo', 'Call now! Your first minute is FREE. Every minute after that is $4.99.', { price: 1, phone: 1 }],
      ['host', 'Wait. Your iguana is on line two. He is calling collect.', { expr: 'surprised' }],
    ],
    fine: 'For entertainment purposes only. Madame Zara is not a licensed psychic, veterinarian, or Zara. Animals do not have opinions about your haircut. Probably. Iguana charges apply.',
  },
  { // S1E3 the health inspection
    brand: 'SPRITZ-O ULTRA', tag: 'Kills 99.9% of household germs!', look: 'spokesmom', name: 'DEBBIE', bg: ['#1e9a64', '#6ad8a0'], prod: 'spray',
    badge: ['99.9%', 'OF GERMS!'], price: ['$2.99', 'NEW LEMON SCENT'], phone: null,
    beats: [
      ['host', 'My kitchen USED to have germs. Then I found SPRITZ-O ULTRA!', { anim: 'cheer', expr: 'happy' }],
      ['vo', 'SPRITZ-O ULTRA kills 99.9% of household germs!', { badge: 1 }],
      ['host', 'Wow! What about the other 0.1%?', { expr: 'surprised' }],
      ['vo', 'They have formed a union. We are in negotiations.', {}],
      ['host', 'Now with a lemony scent that scientists describe as "aggressive"!', { expr: 'grin', price: 1 }],
      ['sing', 'Spritz-O Ultra! Spray your cares away!', {}],
    ],
    fine: 'Do not spray on food, pets, faces, or health inspectors. May cause mild lemon. Not a lemon. The remaining 0.1% of germs reserve the right to strike.',
  },
  { // S1E4 the blackout
    brand: 'LARKSPUR POWER & LIGHT', tag: 'We care. Rates apply.', look: 'exec', name: 'MR. DUNLEAVY', bg: ['#1e2a54', '#34477e'], prod: 'bulb',
    badge: ['WE', 'CARE!'], price: null, phone: '1-800-555-OOPS',
    beats: [
      ['host', 'At Larkspur Power & Light, we care about you.', { expr: 'happy' }],
      ['host', 'That\'s why we\'re raising rates. To pay for this commercial about how much we care.', { expr: 'grin', badge: 1 }],
      ['vo', 'Larkspur Power & Light. Keeping the lights on. Usually.', { prod: 'flicker' }],
      ['host', 'And if your power goes out, simply... wait. We are on it. Eventually.', { expr: 'neutral', prod: 'off', phone: 1 }],
      ['host', '...Can somebody find the switch?', { expr: 'scared', dark: 1 }],
    ],
    fine: 'Outages may occur during storms, heat waves, holidays, Tuesdays, and important moments. Rates subject to change, mood, and moon phase. Caring is billed monthly.',
  },
  { // S1E5 the rooftop
    brand: 'DIET WATER', tag: 'All the water you love. Now with zero calories!', look: 'fitguy', name: 'TANNER', bg: ['#1e86c8', '#62c4f4'], prod: 'bottle',
    badge: ['ZERO', 'CALORIES!'], price: ['$4.99', 'NOW SMALLER!'], phone: null,
    beats: [
      ['host', 'Summer\'s here! Are you drinking too many calories?', { anim: 'flex', expr: 'grin' }],
      ['host', 'Introducing DIET WATER! All the water you love, with ZERO calories!', { anim: 'cheer', badge: 1 }],
      ['vo', 'Regular water also has zero calories.', {}],
      ['host', '...DIET WATER! Now in a smaller bottle! For the same price!', { expr: 'surprised', price: 1 }],
      ['vo', 'Diet Water. Because you deserve less.', {}],
    ],
    fine: 'Diet Water contains water. Not a significant source of anything. Bottle is 40% air for your convenience. Tanner is not a doctor. Tanner is barely a Tanner.',
  },
  { // S1E6 the wedding band
    brand: 'SPARKLE BARN', tag: 'Fine jewelers. Also a barn.', look: 'pitchman', name: 'BRAD', bg: ['#b81e5a', '#ee6ea0'], prod: 'ring',
    badge: ['0% DOWN', '99% LATER'], price: ['$79/MO', 'FOREVER'], phone: '1-800-555-RING',
    beats: [
      ['host', 'Hi! Brad here. You may remember me from trucks.', { anim: 'point', expr: 'grin' }],
      ['host', 'Is she worth three months\' salary? Sparkle Barn research says: FOUR.', { expr: 'happy' }],
      ['vo', 'Sparkle Barn financing! Nothing says forever like a payment plan that lasts forever!', { badge: 1, price: 1 }],
      ['host', 'Diamonds are forever. So is the interest!', { expr: 'grin' }],
      ['sing', 'Sparkle Barn! Love is a monthly payment!', { phone: 1 }],
    ],
    fine: '29.9% APR. Love not guaranteed. Diamond may be a very confident rock. Sparkle Barn is a barn. Hay may be present in your ring box.',
  },
  { // S2E1 Rule Nine
    brand: 'NOSY-PRO 2000', tag: 'Know your neighbors. Whether they like it or not.', look: 'spokesmom', name: 'DEBBIE', bg: ['#2e5e2e', '#5e9a4a'], prod: 'binoculars',
    badge: ['NOW WITH', 'LADDER!'], price: ['$29.95', 'LADDER EXTRA'], phone: '1-800-555-SNOOP',
    beats: [
      ['host', 'Is your neighbor up to something? Of course they are.', { expr: 'smug', anim: 'point' }],
      ['vo', 'Introducing the NOSY-PRO 2000 home observation kit!', {}],
      ['vo', 'It comes with binoculars, a notepad, and a ladder!', { badge: 1 }],
      ['host', 'Now I know EVERYTHING. Mrs. Dunwiddie bought a new toaster. On a TUESDAY.', { expr: 'shock', price: 1 }],
      ['vo', 'NOSY-PRO 2000. Because privacy is just a word.', { phone: 1 }],
    ],
    fine: 'Nosy-Pro is not responsible for restraining orders, fence damage, or what you find out. Ladder sold separately. Kit is binoculars. Mrs. Dunwiddie has asked us to stop.',
  },
  { // S2E2 the Great Bennini
    brand: 'CRUNCH-O-TRON', tag: 'Rock-hard abs while you SLEEP!', look: 'fitguy', name: 'TANNER', bg: ['#d8321e', '#ff8a3a'], prod: 'abmachine',
    badge: ['WHILE YOU', 'SLEEP!'], price: ['3 x $39.95', 'THEN 4 MORE'], phone: '1-800-555-ABSS',
    beats: [
      ['host', 'Want rock-hard abs in three minutes a day... WHILE YOU SLEEP?', { anim: 'flex', expr: 'grin' }],
      ['host', 'The CRUNCH-O-TRON straps on at bedtime and does the crunches FOR you!', { badge: 1 }],
      ['vo', 'Before.', { before: 1 }],
      ['vo', 'After.', { after: 1 }],
      ['host', 'Same guy! Better lighting!', { expr: 'happy', anim: 'cheer' }],
      ['vo', 'Three easy payments of $39.95. Then four more.', { price: 1, phone: 1 }],
    ],
    fine: 'Results not typical. Results not possible. Models are professional abs. Do not use while awake. The Crunch-O-Tron is a folding chair with a motor.',
  },
  { // S2E3 the subway
    brand: 'FENWICK & FENWICK', tag: 'Attorneys at Law. Mostly.', look: 'fenwick', name: 'MR. FENWICK', bg: ['#1a305e', '#2e4e88'], prod: 'gavel',
    badge: ['YOU MAY BE', 'ENTITLED!'], price: null, phone: '1-800-555-SUEM',
    beats: [
      ['host', 'Hurt on the subway? Bumped? Delayed? Looked at by a pigeon?', { anim: 'point', expr: 'angry' }],
      ['host', 'You may be entitled to COMPENSATION!', { expr: 'grin', badge: 1 }],
      ['vo', 'Fenwick & Fenwick. Serving the community from our living room since Tuesday.', {}],
      ['host', 'My brother and I will sue ANYBODY. We once sued each other. We both won!', { expr: 'happy', phone: 1 }],
      ['host', 'And yes, this is my bathrobe. It is business casual.', { expr: 'smug' }],
    ],
    fine: 'Fenwick & Fenwick are two brothers with a fax machine. Not a law firm. Results may vary. Results may be soup. The pigeons have retained counsel.',
  },
  { // S2E4 the invention expo
    brand: 'SLICE-A-TRON 3000', tag: 'It slices! It dices! It does your taxes!', look: 'pitchman', name: 'BRAD', bg: ['#e01e5a', '#ffbe3a'], prod: 'slicer',
    badge: ['BUT', 'WAIT!'], price: ['$19.99', 'TODAY ONLY'], was: '$199.99', phone: '1-800-555-SLICE',
    beats: [
      ['host', 'Brad here! Formerly trucks. Formerly diamonds. Are you tired of KNIVES?', { anim: 'point', expr: 'grin' }],
      ['host', 'The SLICE-A-TRON 3000 slices! It dices! It does your taxes!', { anim: 'cheer', expr: 'happy' }],
      ['vo', 'Incorrectly.', {}],
      ['host', 'But wait, there\'s MORE! Order now and get a SECOND Slice-A-Tron!', { badge: 1, price: 1 }],
      ['vo', 'Just pay separate shipping and handling. And handling. And handling.', { phone: 1 }],
    ],
    fine: 'Shipping & handling $49.99. Handling & shipping $49.99. Slice-A-Tron does not slice. Second unit is the box. Taxes prepared by Slice-A-Tron are your problem now.',
  },
  { // S2E5 snow day
    brand: 'CHANNEL 6 NEWS', tag: 'Tonight at eleven.', look: 'anchor', name: 'CHET STORM', bg: ['#1e3e7e', '#3a64b0'], prod: 'news',
    badge: ['TONIGHT', 'AT 11'], price: null, phone: null,
    beats: [
      ['host', 'Coming up at eleven: SNOW. It\'s cold. It\'s white. It\'s falling.', { expr: 'neutral' }],
      ['host', 'Is it coming for your children? Experts say no.', { expr: 'scared', badge: 1 }],
      ['host', 'We say... maybe.', { expr: 'shock' }],
      ['vo', 'Plus: is your snow shovel plotting against you? A Channel 6 investigation.', {}],
      ['host', 'Channel 6 News. First with the news. Occasionally with the facts.', { expr: 'smug' }],
    ],
    fine: 'Channel 6 News is a production of Channel 6 Entertainment. Opinions are weather. Weather is opinions. Shovels contacted for comment did not respond.',
  },
  { // S2E6 the airport
    brand: 'SKYPENNY AIRLINES', tag: 'Fly anywhere for just $9!*', look: 'gateagent', name: 'CANDI', bg: ['#1e78c8', '#58b4f0'], prod: 'plane',
    badge: ['ONLY', '$9!*'], price: ['$9*', 'ONE WAY, STANDING'], phone: '1-800-555-FLYY',
    beats: [
      ['host', 'Fly SkyPenny! Anywhere in the country for just NINE DOLLARS!', { anim: 'cheer', expr: 'grin', badge: 1 }],
      ['vo', 'Seats: forty dollars. Seat belts: fifteen. Window views: twenty-five.', {}],
      ['host', 'And oxygen masks are now rent-to-own!', { expr: 'happy' }],
      ['vo', 'Carry-on bags: fifty dollars. Carrying on: priceless.', { price: 1 }],
      ['sing', 'SkyPenny! The sky\'s the limit on your card!', { phone: 1 }],
    ],
    fine: '*Fare is one way, standing, in the cargo hold. Gravity included at no extra charge (for now). Peanuts $6. Peanut $2. Your bag is having a lovely time in another city.',
  },
  { // the finale
    brand: 'VANCE DEVELOPMENTS', tag: 'Turning neighborhoods into "neighborhoods."', look: 'vance', name: 'MR. VANCE', bg: ['#141424', '#2a2a46'], prod: 'tower',
    badge: ['COMING', 'SOON!'], price: ['$4,000/MO', 'PER SQUARE FOOT'], phone: '1-800-555-LOFT',
    beats: [
      ['host', 'At Vance Developments, we see everything you love about your neighborhood...', { expr: 'smug' }],
      ['host', '...and we charge more for it.', { expr: 'grin', badge: 1 }],
      ['vo', 'Coming soon: THE GRIND LOFTS. Exposed brick. Exposed pipes. Exposed feelings.', {}],
      ['host', 'Our community spaces have everything a real community has. Except a community.', { expr: 'happy' }],
      ['vo', 'Starting at just four thousand dollars a month. Per square foot.', { price: 1, phone: 1 }],
    ],
    fine: 'Artist\'s rendering. Not a real building. Not real artists. The cafe will be replaced with a cafe-themed experience. Muffins sold separately. Couches not permitted.',
  },
];

// ---- product shots (bottom-centre at cx, by) -------------------------------------
function drawAdProduct(kind, cx, by, t, st) {
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const O = OUTLINE;
  const box = (x, y, w, h, c, hi, sh) => { R(x - 1, y - 1, w + 2, h + 2, O); R(x, y, w, h, c); if (hi) R(x, y, w, 2, hi); if (sh) R(x, y + h - 2, w, 2, sh); };
  const twinkle = (x, y, k) => { if (((t + k * 13) >> 3) % 3 === 0) { R(x, y - 3, 1, 7, '#ffffff'); R(x - 3, y, 7, 1, '#ffffff'); } };
  switch (kind) {
    case 'truck': {
      const x = cx - 42, y = by - 46;
      box(x, y, 56, 36, '#ff8a2a', '#ffb060', '#d86a1a');
      drawText('MOVE-IT', x + 28, y + 9, '#ffffff', { align: 'center', outline: O });
      drawText('MOVERS', x + 28, y + 21, '#3a2418', { align: 'center' });
      box(x + 58, y + 12, 22, 24, '#f4f0e8', '#ffffff', '#c8c0b0');
      R(x + 67, y + 15, 10, 9, '#6ac8f0'); R(x + 67, y + 15, 10, 2, '#b8ecff');
      R(x - 2, y + 36, 84, 4, '#3a3a44');
      for (const wx of [x + 10, x + 44, x + 70]) { circleFill(wx, by - 4, 6, O); circleFill(wx, by - 4, 4, '#2a2a30'); circleFill(wx, by - 4, 2, '#c8c8d0'); }
      break;
    }
    case 'crystal': {
      R(cx - 15, by - 11, 30, 11, O); R(cx - 14, by - 10, 28, 9, '#c89a2a'); R(cx - 14, by - 10, 28, 2, '#ffd86a');
      R(cx - 8, by - 15, 16, 5, '#a87a1a');
      ctx.globalAlpha = 0.25 + Math.sin(t / 12) * 0.1; circleFill(cx, by - 34, 28, '#e0b8ff'); ctx.globalAlpha = 1;
      circleFill(cx, by - 34, 20, O); circleFill(cx, by - 34, 19, '#9a6ae8'); circleFill(cx - 2, by - 36, 15, '#c8a8ff');
      for (let i = 0; i < 12; i++) { const a = t / 18 + i * 0.55; R(cx + Math.cos(a) * (5 + (i % 4) * 3), by - 34 + Math.sin(a * 1.3) * 6, 2, 2, '#ffffff'); }
      R(cx - 10, by - 47, 5, 3, '#ffffff');
      twinkle(cx + 18, by - 50, 1); twinkle(cx - 20, by - 22, 2);
      break;
    }
    case 'spray': {
      const x = cx - 12, y = by - 48;
      box(x, y + 16, 24, 32, '#3ac88a', '#7af0b8', '#2a9a6a');
      R(x + 3, y + 24, 18, 13, '#ffffff'); drawText('99%', cx, y + 27, '#1e8a5a', { align: 'center' });
      box(x + 6, y + 6, 12, 10, '#ffffff', null, '#d8d8d8');
      box(x + 17, y + 6, 11, 4, '#ffffff');
      R(x + 3, y + 11, 4, 10, '#e8e8e8');
      if ((t >> 4) % 3 === 0) for (let i = 0; i < 9; i++) R(x + 31 + i * 3, y + 7 + Math.sin(i + t / 3) * 3 - i * 0.6, 2, 2, '#f4fff8');
      twinkle(cx - 18, by - 40, 3);
      break;
    }
    case 'bulb': {
      const on = st === 'off' ? false : st === 'flicker' ? ((t >> 2) % 3 !== 0) : true;
      if (on) { ctx.globalAlpha = 0.28; circleFill(cx, by - 42, 36, '#fff3a0'); ctx.globalAlpha = 1; }
      circleFill(cx, by - 42, 18, O); circleFill(cx, by - 42, 17, on ? '#fff6b0' : '#8a8a96');
      R(cx - 5, by - 46, 2, 9, on ? '#ff9a2a' : '#5a5a60'); R(cx + 3, by - 46, 2, 9, on ? '#ff9a2a' : '#5a5a60'); R(cx - 5, by - 47, 10, 2, on ? '#ffb84a' : '#5a5a60');
      R(cx - 9, by - 53, 4, 3, '#ffffff');
      box(cx - 8, by - 26, 16, 14, '#b8b8c0', '#e0e0e8', '#8a8a90');
      R(cx - 8, by - 22, 16, 1, '#7a7a80'); R(cx - 8, by - 18, 16, 1, '#7a7a80');
      box(cx - 4, by - 12, 8, 12, '#3a3a44');
      break;
    }
    case 'bottle': {
      const x = cx - 10, y = by - 56;
      box(x, y + 12, 20, 44, '#a8dcf8', '#e0f6ff', '#7ab8e0');
      R(x + 1, y + 13, 18, 18, '#d8f0ff');
      R(x + 3, y + 14, 3, 38, '#f0fbff');
      box(x + 5, y + 3, 10, 9, '#2a6ad8', '#5a9aff');
      R(x, y + 32, 20, 14, '#ffffff'); drawText('DIET', cx, y + 36, '#2a6ad8', { align: 'center' });
      twinkle(cx + 16, by - 50, 4);
      break;
    }
    case 'ring': {
      box(cx - 24, by - 44, 48, 22, '#7a1030', '#a02040');
      R(cx - 20, by - 40, 40, 15, '#f4eaf0');
      box(cx - 24, by - 20, 48, 20, '#8a1a3a', '#b02a50', '#5a0a20');
      R(cx - 10, by - 21, 20, 4, '#5a0a20');
      circleFill(cx, by - 26, 9, O); circleFill(cx, by - 26, 8, '#ffd23f'); circleFill(cx, by - 26, 5, '#f4eaf0');
      R(cx - 7, by - 41, 14, 8, O); R(cx - 6, by - 40, 12, 6, '#d8f4ff'); R(cx - 4, by - 43, 8, 3, '#b8e8ff'); R(cx - 4, by - 39, 3, 2, '#ffffff');
      twinkle(cx + 10, by - 46, 5); twinkle(cx - 12, by - 36, 6);
      break;
    }
    case 'binoculars': {
      box(cx + 20, by - 26, 18, 26, '#fff6c8', '#ffffff');
      for (let i = 0; i < 4; i++) R(cx + 23, by - 20 + i * 5, 12, 1, '#8a8a9a');
      for (const dx of [-12, 10]) { circleFill(cx + dx, by - 22, 12, O); circleFill(cx + dx, by - 22, 11, '#2a2a30'); circleFill(cx + dx, by - 22, 6, '#4a9ad8'); R(cx + dx - 3, by - 26, 3, 2, '#ffffff'); }
      R(cx - 4, by - 30, 6, 10, '#3a3a44');
      R(cx - 36, by - 46, 3, 46, '#c89a5a'); R(cx - 26, by - 46, 3, 46, '#c89a5a');
      for (let i = 0; i < 5; i++) R(cx - 36, by - 42 + i * 9, 13, 2, '#a87a3a');
      break;
    }
    case 'abmachine': {
      const x = cx - 30;
      box(x + 40, by - 60, 8, 32, '#c8c8d0', '#ffffff');
      box(x, by - 30, 50, 6, '#c8c8d0', '#ffffff');
      R(x + 4, by - 24, 3, 24, '#8a8a90'); R(x + 43, by - 24, 3, 24, '#8a8a90');
      box(x + 8, by - 22, 22, 13, '#e83a2a', '#ff7a5a');
      const gx = x + 19, gy = by - 40;
      for (let k = 0; k < 8; k++) { const a = t / 5 + k * Math.PI / 4; R(gx + Math.cos(a) * 9 - 1, gy + Math.sin(a) * 9 - 1, 3, 3, '#ffd23f'); }
      circleFill(gx, gy, 7, '#e8b82a'); circleFill(gx, gy, 2, O);
      R(x + 19, by - 33, 2, 11, '#8a8a90');
      R(x + 2, by - 36, 38, 3, '#2a2a3a');
      if ((t >> 3) % 2) drawText('BZZT', x + 56, by - 48, '#ffffff', { outline: O });
      break;
    }
    case 'gavel': {
      const tilt = Math.round(Math.sin(t / 30) * 4);
      R(cx - 1, by - 56, 3, 50, '#c8a040'); R(cx - 26, by - 54, 54, 3, '#c8a040'); circleFill(cx + 1, by - 57, 3, '#ffd86a');
      for (const [px, d] of [[cx - 22, tilt], [cx + 24, -tilt]]) {
        R(px - 9, by - 51, 1, 18 + d, '#a8803a'); R(px + 9, by - 51, 1, 18 + d, '#a8803a');
        R(px - 11, by - 33 + d, 22, 4, O); R(px - 10, by - 33 + d, 20, 3, '#ffd86a');
      }
      box(cx - 14, by - 6, 30, 6, '#8a6a2a', '#c8a040');
      box(cx - 46, by - 16, 20, 8, '#7a4a20', '#a86a30'); R(cx - 38, by - 8, 4, 8, '#5a3a18');
      break;
    }
    case 'slicer': {
      box(cx - 24, by - 34, 48, 34, '#e8e8f0', '#ffffff', '#b8b8c8');
      R(cx - 20, by - 30, 40, 11, '#2a2a3a');
      for (let k = 0; k < 4; k++) { const a = t / 2.5 + k * Math.PI / 2; R(cx + Math.cos(a) * 14 - 2, by - 25 + Math.sin(a) * 3, 5, 2, '#c8f0ff'); }
      R(cx - 11, by - 47, 22, 13, O); R(cx - 10, by - 46, 20, 11, '#ff2a6a'); R(cx - 10, by - 46, 20, 2, '#ff7aa0');
      R(cx + 24, by - 24, 8, 3, '#8a8a90'); R(cx + 30, by - 31 + Math.round(Math.sin(t / 5) * 4), 3, 10, '#ff2a6a');
      drawText('3000', cx, by - 15, '#e01e5a', { align: 'center' });
      for (let i = 0; i < 3; i++) { const k = (t * 2 + i * 22) % 66; R(cx - 30 - k, by - 44 - i * 7 + k / 6, 5, 4, ['#ff6a3a', '#7ad84a', '#ffd23f'][i]); }
      break;
    }
    case 'news': {
      box(cx - 36, by - 56, 72, 48, '#2a2a30', '#3a3a44');
      R(cx - 32, by - 52, 64, 40, '#1e4aa8');
      drawText('6', cx - 20, by - 46, '#ffd23f', { scale: 3, outline: O });
      const sx = cx + 12, sy = by - 32;
      R(sx - 9, sy, 19, 2, '#ffffff'); R(sx, sy - 9, 2, 19, '#ffffff');
      for (let i = -6; i <= 6; i++) { R(sx + i, sy + i, 2, 2, '#ffffff'); R(sx + i, sy - i, 2, 2, '#ffffff'); }
      if ((t >> 4) % 2) drawText('?', sx + 12, sy - 18, '#ff4a3a', { scale: 2, outline: O });
      R(cx - 6, by - 8, 12, 8, '#3a3a44');
      break;
    }
    case 'plane': {
      const y = by - 40 + Math.round(Math.sin(t / 20) * 3);
      R(cx - 1, y + 14, 3, by - y - 14, '#8a8a90'); R(cx - 10, by - 3, 22, 3, '#8a8a90');
      box(cx - 36, y - 13, 11, 13, '#ffd23f', '#ffe88a');
      drawText('$', cx - 30, y - 11, '#1e78c8', { align: 'center' });
      box(cx - 36, y, 62, 14, '#f4f4f8', '#ffffff', '#c8c8d0');
      R(cx + 26, y + 1, 6, 12, O); R(cx + 26, y + 2, 5, 10, '#f4f4f8'); R(cx + 31, y + 4, 2, 6, O);
      for (let i = 0; i < 6; i++) R(cx - 20 + i * 7, y + 4, 4, 4, '#6ac8f0');
      box(cx - 10, y + 9, 22, 5, '#1e78c8', '#58b4f0');
      break;
    }
    case 'tower': {
      const x = cx - 22, y = by - 72;
      R(x + 30, y - 22, 3, 22, '#ffd23f'); R(x + 4, y - 22, 44, 3, '#ffd23f'); R(x + 8, y - 19, 1, 8 + Math.round(Math.sin(t / 15) * 2), '#2a2a30');
      box(x, y, 44, 72, '#5a7aa8', '#8aa8d8', '#3a5a88');
      for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) R(x + 4 + c * 10, y + 6 + r * 8, 7, 5, ((r * 3 + c + (t >> 5)) % 7) ? '#b8d4f8' : '#ffe88a');
      box(x - 16, y + 60, 76, 11, '#141424');
      drawText('GRIND LOFTS', cx, y + 62, '#e8d070', { align: 'center' });
      twinkle(x + 50, y + 8, 7);
      break;
    }
    default: break;
  }
}

// a small starburst badge
function drawAdBadge(x, y, lines, t) {
  const r = 30 + Math.sin(t / 7) * 1.5, n = 14, rot = t / 90;
  const star = (rad, col) => {
    ctx.fillStyle = col; ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, rr = i % 2 ? rad * 0.8 : rad; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  };
  star(r + 2, OUTLINE); star(r, '#ffd23f');
  drawText(lines[0], x, y - 9, '#c8201e', { align: 'center' });
  if (lines[1]) drawText(lines[1], x, y + 2, '#c8201e', { align: 'center' });
}

class AdBreakScene {
  constructor(ad, opts) {
    this.ad = ad; this.opts = opts || {};
    this.t = 0; this.pt = 0; this.phase = 'out';
    this.beat = -1; this.line = null; this.flags = {}; this.prodState = 'on';
    this.expr = 'happy'; this.anim = 'idle';
    this.tickT = 0; this.wantsTouch = false; this.doneF = false; this.skipHint = 0;
  }
  enter() { Music.stop(0.15); Music.oneShot(pick(['bumper1', 'bumper2', 'bumper3', 'bumper4']), 0.9); }
  setPhase(p) { this.phase = p; this.pt = 0; }
  next() {
    this.beat++;
    const b = this.ad.beats[this.beat];
    if (!b) { this.setPhase('static2'); AudioSys.sfx('tvon'); Music.stop(0.15); return; }
    const who = b[0], text = b[1], o = b[2] || {};
    for (const k of ['badge', 'price', 'phone', 'before', 'after', 'dark']) if (o[k]) this.flags[k] = true;
    if (o.prod) this.prodState = o.prod;
    if (o.expr) this.expr = o.expr;
    if (o.anim) this.anim = o.anim;
    let minT = 0;
    if (who === 'sing') minT = Math.round(playJingle(text, text.length * 13) * 60) + 20;
    this.line = { who, text: normText(who === 'sing' ? '♪ ' + text + ' ♪' : text), shown: 0, t: 0, after: 0, minT, name: o.name };
  }
  update() {
    this.t++; this.pt++;
    if (this.skipHint < 240) this.skipHint++;
    const m = Input.menu;
    const tap = Input.clicks.length > 0;
    if ((Input.keyPressed('Escape') || Input.clickIn(W - 64, 2, 62, 14)) && (this.phase === 'out' || this.phase === 'static1' || this.phase === 'ad')) {
      AudioSys.sfx('tvon'); Music.stop(0.1); this.setPhase('static2'); return;
    }
    switch (this.phase) {
      case 'out':
        if (this.pt > 84 || (this.pt > 20 && (m.ok || tap))) { Input.clicks.length = 0; this.setPhase('static1'); AudioSys.sfx('tvon'); }
        break;
      case 'static1':
        if (this.pt > 10) { this.setPhase('ad'); this.tickT = 0; Music.play('adbed', { fadeIn: 0.3 }); this.next(); }
        break;
      case 'ad':
        this.tickT++;
        this.updateLine(m, tap);
        break;
      case 'static2':
        if (this.pt > 10) { this.setPhase('back'); Music.oneShot(pick(['bumper1', 'bumper2', 'bumper3', 'bumper4']), 0.9); }
        break;
      case 'back':
        if (this.pt > 74 || (this.pt > 16 && (m.ok || tap))) { Input.clicks.length = 0; this.finish(); }
        break;
      default: break;
    }
  }
  updateLine(m, tap) {
    const L = this.line;
    if (!L) return;
    L.t++;
    if (L.shown < L.text.length) {
      L.shown = Math.min(L.text.length, L.shown + 0.9);
      const ch = L.text[Math.floor(L.shown)];
      if (L.who !== 'sing' && Math.floor(L.shown) % 2 === 0 && ch !== ' ') AudioSys.blip(L.who === 'vo' ? 'announcer' : L.who === 'co' ? 'npc' : 'pitch');
      if ((m.ok || tap) && L.t > 6) { L.shown = L.text.length; Input.clicks.length = 0; }
    } else {
      L.after++;
      const autoT = Math.max(L.minT - L.t, 34 + L.text.length * 1.4);
      if (((m.ok || tap) && L.after > 6) || L.after > autoT) { Input.clicks.length = 0; this.next(); }
    }
  }
  finish() {
    if (this.doneF) return;
    this.doneF = true;
    if (this.opts.done) this.opts.done();
  }

  // ---- drawing -----------------------------------------------------------------------
  draw() {
    if (this.phase === 'out' || this.phase === 'back') this.drawCard();
    else if (this.phase === 'static1' || this.phase === 'static2') this.drawStatic();
    else this.drawAd();
    if (this.phase !== 'back' && this.phase !== 'static2' && this.skipHint < 240) {
      ctx.globalAlpha = this.skipHint > 210 ? (240 - this.skipHint) / 30 : 0.85;
      drawText(Input.lastDevice === 'touch' ? 'SKIP AD >' : 'ESC: SKIP AD', W - 6, 5, '#f6ead8', { align: 'right', outline: OUTLINE });
      ctx.globalAlpha = 1;
    }
  }
  drawCard() {
    const back = this.phase === 'back';
    if (back) drawMemphis('#123a4a', ['#ff4f9a', '#ffd23f', '#f4efe6', '#ff8a5a'], this.t, 77, 34, [40, 60, 400, 150]);
    else drawMemphis('#2a1a5a', ['#ff4f9a', '#ffd23f', '#4cc9f0', '#7cf29a'], this.t, 33, 34, [40, 50, 400, 160]);
    ctx.globalAlpha = Math.min(1, this.pt / 10);
    if (back) {
      drawText('AND NOW, BACK TO', W / 2, 92, '#f6ead8', { align: 'center', outline: OUTLINE });
      drawText("THE GANG'S ALL HERE", W / 2, 110, '#ffd23f', { align: 'center', scale: 3, outline: OUTLINE });
    } else {
      drawText("THE GANG'S ALL HERE", W / 2, 66, '#f6ead8', { align: 'center', outline: OUTLINE });
      drawText("WE'LL BE RIGHT BACK", W / 2, 86, '#ffd23f', { align: 'center', scale: 3, outline: OUTLINE });
      drawSetProp(ctx, 'couch', W / 2 - 60, 142, this.t);
    }
    ctx.globalAlpha = 1;
    if (back && this.pt > 56) { ctx.fillStyle = 'rgba(10,6,14,' + Math.min(1, (this.pt - 56) / 18) + ')'; ctx.fillRect(0, 0, W, H); }
  }
  drawStatic() {
    ctx.fillStyle = '#121216'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 1500; i++) {
      const v = (Math.random() * 210) | 0;
      ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
      ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 2, 1);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(0, (this.pt * 29) % H, W, 12);
  }
  drawAd() {
    const ad = this.ad, t = this.t, f = this.flags;
    // sunburst set
    const bx = 330, byc = 118;
    ctx.fillStyle = ad.bg[0]; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = ad.bg[1];
    const n = 16, a0 = t / 260;
    for (let i = 0; i < n; i++) {
      const a = a0 + i * Math.PI * 2 / n, b = a + Math.PI / n;
      ctx.beginPath(); ctx.moveTo(bx, byc); ctx.lineTo(bx + Math.cos(a) * 640, byc + Math.sin(a) * 640); ctx.lineTo(bx + Math.cos(b) * 640, byc + Math.sin(b) * 640); ctx.closePath(); ctx.fill();
    }
    // glossy studio floor
    ctx.fillStyle = 'rgba(10,6,20,0.45)'; ctx.fillRect(0, 214, W, H - 214);
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(0, 214, W, 1);
    // title and tagline
    const sc = textWidth(ad.brand, 3) <= W - 40 ? 3 : 2;
    drawText(ad.brand, W / 2 + 2, 10 + 2, 'rgba(10,6,20,0.55)', { align: 'center', scale: sc });
    drawText(ad.brand, W / 2, 10, '#ffffff', { align: 'center', scale: sc, outline: OUTLINE });
    drawText(ad.tag, W / 2, 14 + sc * 9, '#ffe88a', { align: 'center', outline: OUTLINE });
    // pedestal + product
    const px = 338;
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(px - 50, 212, 100, 4);
    R0(px - 46, 196, 92, 18, OUTLINE); R0(px - 45, 197, 90, 16, '#f4f0e8'); R0(px - 45, 197, 90, 2, '#ffffff'); R0(px - 45, 211, 90, 2, '#c8c0b0');
    drawAdProduct(ad.prod, px, 196, t, this.prodState);
    // before / after photos
    if (f.before) this.drawPhoto(232, 62, 'BEFORE', false);
    if (f.after) this.drawPhoto(306, 62, 'AFTER', true);
    if (f.badge && ad.badge) drawAdBadge(438, 92, ad.badge, t);
    if (f.price && ad.price) {
      const x = 236, y = 168;
      if (ad.was) { const w = textWidth(ad.was); drawText(ad.was, x, y - 13, '#ffffff', { align: 'center', outline: OUTLINE }); R0(x - w / 2 - 1, y - 10, w + 2, 2, '#e8201e'); }
      drawText(ad.price[0], x, y, '#ffd23f', { align: 'center', scale: 2, outline: OUTLINE });
      if (ad.price[1]) drawText(ad.price[1], x, y + 17, '#ffffff', { align: 'center', outline: OUTLINE });
    }
    if (f.phone && ad.phone) {
      const on = (t >> 4) % 2;
      panel(232, 245, 212, 12, on ? '#e8201e' : '#b81818', OUTLINE);
      drawText('CALL NOW! ' + ad.phone, 338, 247, '#ffffff', { align: 'center' });
    }
    // the host, twice as large as life
    const hx = 92, hy = 226;
    const L = this.line;
    const talking = L && L.who === 'host' && L.shown < L.text.length;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(hx, hy); ctx.scale(2, 2);
    blitPerson(ctx, 'npc:' + ad.look, npcSpecFn(ad.look), { anim: this.anim, t: this.t, expr: this.expr, blink: (this.t % 170) < 6, talk: talking }, 0, 0, {});
    ctx.restore();
    drawText(ad.name, hx, hy + 4, '#ffffff', { align: 'center', outline: OUTLINE });
    // lights out
    if (f.dark) { ctx.fillStyle = 'rgba(4,2,12,0.86)'; ctx.fillRect(0, 0, W, H); if ((t % 150) > 6) { ctx.fillStyle = '#ffffff'; ctx.fillRect(hx - 4, hy - 58, 2, 3); ctx.fillRect(hx + 3, hy - 58, 2, 3); } }
    // what's being said
    if (L) {
      const shown = L.text.slice(0, Math.floor(L.shown));
      if (L.who === 'host') drawSpeechBubble(shown, L.text, hx + 6, hy - 66, ad.name, '#ffd23f', L.t < 4 ? L.t / 4 : 1);
      else this.drawCaption(shown, L.text, L.who === 'sing' ? 'JINGLE' : L.who === 'co' ? (L.name || 'CALLER') : 'ANNOUNCER', L.who === 'sing');
    }
    // fine print, too fast to read (almost)
    ctx.fillStyle = 'rgba(6,4,12,0.82)'; ctx.fillRect(0, 258, W, 12);
    const txt = ad.fine + '          ';
    const w = textWidth(txt);
    let x = W - this.tickT * 1.6;
    while (x < -w) x += w;
    for (; x < W; x += w) drawText(txt, x, 260, '#d8d0c0', {});
    // a little VHS texture
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    for (let y = this.t % 3; y < 258; y += 3) ctx.fillRect(0, y, W, 1);
  }
  // announcer / jingle / caller lines: a caption to the right of the host, above the phone banner
  drawCaption(shown, full, label, sing) {
    const x0 = 160, x1 = W - 8, cx = (x0 + x1) / 2;
    const lines = wrapText(full, x1 - x0 - 16);
    const h = 12 + lines.length * 10;
    const y = 243 - h;
    panel(x0, y, x1 - x0, h, 'rgba(14,8,24,0.9)', sing ? '#ffd23f' : '#f6ead8');
    drawText(label, x0 + 8, y - 4, sing ? '#ffd23f' : '#4cc9f0', { outline: OUTLINE });
    let left = shown.length;
    lines.forEach((ln, i) => {
      const part = ln.slice(0, Math.max(0, left));
      left -= ln.length + 1;
      drawText(part, cx - textWidth(ln) / 2, y + 6 + i * 10, sing ? '#ffd23f' : '#f6ead8', {});
    });
  }
  drawPhoto(x, y, label, after) {
    panel(x, y, 66, 64, '#f4f0e8', OUTLINE);
    R0(x + 4, y + 4, 58, 46, after ? '#ffe08a' : '#8a8a96');
    ctx.save();
    ctx.translate(x + 33, y + 48);
    blitPerson(ctx, 'npc:' + this.ad.look, npcSpecFn(this.ad.look), { anim: after ? 'flex' : 'idle', t: this.t, expr: after ? 'grin' : 'sad', blink: false }, 0, 0, {});
    ctx.restore();
    if (after) { ctx.globalAlpha = 0.25; R0(x + 4, y + 4, 58, 46, '#ffb030'); ctx.globalAlpha = 1; if ((this.t >> 3) % 2) { R0(x + 52, y + 8, 1, 7, '#ffffff'); R0(x + 49, y + 11, 7, 1, '#ffffff'); } }
    drawText(label, x + 33, y + 53, '#2a1a30', { align: 'center' });
  }
}
function R0(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
