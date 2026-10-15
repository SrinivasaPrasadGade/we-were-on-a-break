// =============================================================================
// S2E3  Subway Shuffle
// =============================================================================
EPISODES.push({
  season: 2, num: 3, title: 'Subway Shuffle', music: 'subway',
  blurb: 'Theo\'s Tidy-Bot is in storage at the end of the line. The Expo is tomorrow.',
  rooms: [
    {
      name: 'Larkspur St. Station', slug: 'INT. LARKSPUR ST. STATION - MORNING', theme: 'subway', shot: 'subway_day',
      map: [
        @@r1@@
      ],
      ents: {
        N: { t: 'npc', look: 'agent', solve: 'talk', id: 'marge', moveTo: -3, vanish: true, face: -1, voice: 'npc', name: 'MARGE', expr: 'smug',
          block: 'Tokens only.',
          after: ['Have a nice day. Or don\'t. I\'m not your mother.'],
          talk: {
            q: 'Tokens only. We stopped SELLING tokens in 1998.',
            opts: [
              { t: 'Then how does anybody get in?', ok: false, r: 'They don\'t, sweetie. That\'s the beauty of it.' },
              { t: 'We\'re late for a very important invention!', ok: false, r: 'Everybody\'s late. That\'s the subway.' },
              { t: 'Marge! I know a guy who found your missing 1987 token collection.', ok: true, r: 'My commemoratives?! ...Go. GO. Tell him I\'ll pay in tokens.' },
            ],
          } },
        G: { t: 'door', kind: 'turnstile', h: 2, link: 'turn9' },
        K: { t: 'broken', kind: 'turnstile', id: 'turn9', say: [['theo', 'Turnstile\'s fixed! It just needed a little percussive maintenance.'], ['juno', 'He kicked it.'], ['theo', 'PERCUSSIVELY.']] },
        P: { t: 'platform', kind: 'cart', w: 2, dy: 6, path: [[0, 0], [6, 0]], wait: 60, speed: 0.8 },
        X: { t: 'exit' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'Tidy-Bot is in storage at the end of the line. And the Expo is TOMORROW.'], ['mila', 'End of the line? That\'s, like, an hour.'], ['dex', 'I\'ll carry it home.'], ['theo', 'It weighs four hundred pounds.'], ['dex', '...I\'ll carry it slowly.']], hintKeys: H_KEYS('PRIYA: talk to the token clerk (E).', 'PRIYA: talk to the token clerk (E).') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'Turnstiles are jammed. Out of my way, I\'m a professional.']], hintKeys: H_KEYS('THEO: hold E at the turnstile control box.', 'THEO: hold E at the turnstile control box.') },
        C: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'Our train\'s on the far platform. Across the TRACKS.'], ['benny', 'There\'s a little maintenance cart going back and forth.'], ['priya', 'Hop on, hop off. Like a tourist.']], hintKeys: H_KEYS('Ride the maintenance cart across the tracks. Don\'t fall in!', 'Ride the maintenance cart across the tracks. Don\'t fall in!') },
      },
      extra: [
        { t: 'deco', kind: 'rails', x: 40, y: 16, w: 8, h: 3, back: true },
      ],
    },
    {
      name: 'The Uptown Local', slug: 'INT. UPTOWN LOCAL - CAR 3 - MORNING', theme: 'train', shot: 'train_day',
      map: [
        @@r2@@
      ],
      ents: {
        N: { t: 'npc', look: 'commuter', seed: 1, solve: 'music', id: 'c1', moveTo: 30, vanish: true, face: -1, voice: 'npc', name: 'COMMUTER', expr: 'angry',
          block: 'This is MY pole.', won: '...Is that a sea shanty? I LOVE a sea shanty!' },
        O: { t: 'npc', look: 'commuter', seed: 2, solve: 'music', id: 'c2', moveTo: 28, vanish: true, face: -1, voice: 'npc', name: 'COMMUTER', expr: 'angry',
          block: 'Do NOT make eye contact.', won: 'Okay, this is a bop. I hate that this is a bop.' },
        Q: { t: 'npc', look: 'commuter', seed: 3, solve: 'music', id: 'c3', moveTo: 26, vanish: true, face: -1, voice: 'npc', name: 'COMMUTER', expr: 'angry',
          block: 'I\'ve been standing here since 1994.', won: 'Thirty years and NOBODY ever played me a song!' },
        U: { t: 'shutter', h: 3, lift: 2 },
        X: { t: 'exit' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Rush hour. Everyone\'s grumpy and nobody moves.'], ['juno', 'Nobody moves... YET.']], hintKeys: H_KEYS('JUNO: play (E) near the commuters. Music moves people!', 'JUNO: play (E) near the commuters. Music moves people!') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['dex', 'The door to the next car is stuck. Classic me moment.'], ['mila', 'Hold it up, Dex. We\'ll go through.']], hintKeys: H_KEYS('DEX: lift the connecting door (E). Switch to someone else to walk through.', 'DEX: lift the connecting door. Switch to someone else to walk through.') },
      },
    },
    {
      name: 'End of the Line', slug: 'INT. GRIMSBY SELF-STORAGE - DAY', theme: 'storage', shot: 'storage_day', dark: true, lightLink: 'lift9',
      map: [
        @@r3@@
      ],
      ents: {
        N: { t: 'npc', look: 'security', solve: 'talk', id: 'storageguy', moveTo: -6, vanish: true, face: -1, voice: 'npc', name: 'STORAGE GUY', expr: 'neutral',
          block: 'Unit 7B? You got a key?',
          talk: {
            q: 'No key, no unit. Those are the rules. I didn\'t make them. Well. I did.',
            opts: [
              { t: 'Theo IS the key. Spiritually.', ok: false, r: 'That\'s not how keys work, pal.' },
              { t: 'Your sign says "We store your dreams." Theo\'s dream is in there.', ok: true, r: '...You read the SIGN? Nobody reads the sign. Go. Live your dream.' },
              { t: 'We can pay you in lettuce.', ok: false, r: 'Why does everybody keep offering me lettuce?' },
            ],
          } },
        V: { t: 'grate', id: 'vent9' },
        G: { t: 'door', kind: 'shutter', h: 3, link: 'unit9' },
        J: { t: 'door', kind: 'shutter', h: 3, link: 'unit9' },
        L: { t: 'lever', id: 'unit9', say: 'Both doors open! Ta-da! ...The Great Benny, master of storage.' },
        C: { t: 'crate', kind: 'botcrate' },
        K: { t: 'broken', kind: 'panel', id: 'lift9', say: [['theo', 'Power\'s back! Lights and the freight lift!'], ['priya', 'And this place is... a lot dustier than I thought.']] },
        P: { t: 'platform', kind: 'lift', w: 3, dy: 6, path: [[0, 0], [0, -6]], link: 'lift9', wait: 100, speed: 0.8, cableTop: 2 },
        Z: { t: 'plate', w: 2, heavy: true, mark: true, id: 'botup' },
        X: { t: 'exit', link: 'botup', lockedMsg: 'GET THE TIDY-BOT ONTO THE DOCK!' },
        Y: { t: 'light', kind: 'hang', r: 5 },
        A: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'Unit 7B. My entire invention archive.'], ['mila', 'Your entire archive is ONE crate?'], ['theo', 'It\'s a very full crate.']], hintKeys: H_KEYS('PRIYA: talk to the storage guy (E).', 'PRIYA: talk to the storage guy (E).') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['dex', 'Freight lift to the loading dock. Crate goes on the lift, I go with it.'], ['theo', 'And the lift needs power. That\'s me.']], hintKeys: H_KEYS('BENNY opens the unit through the vent. DEX pushes the crate onto the lift. THEO powers it.', 'BENNY opens the unit through the vent. DEX pushes the crate onto the lift. THEO powers it.') },
      },
    },
  ],
  endLine: 'BOT RETRIEVED!',
});
