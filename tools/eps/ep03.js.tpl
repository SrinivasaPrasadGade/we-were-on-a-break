// =============================================================================
// S1E3  The Health Inspection
// =============================================================================
EPISODES.push({
  season: 1, num: 3, title: 'The Health Inspection', music: 'panic',
  blurb: 'The inspector arrives in one hour. The café is... not ready.',
  rooms: [
    {
      name: 'The Daily Grind', slug: 'INT. THE DAILY GRIND - MORNING', theme: 'cafe', shot: 'cafe_day',
      map: [
        @@r1@@
      ],
      ents: {
        C: { t: 'crate', kind: 'couch' },
        Z: { t: 'plate', w: 3, heavy: true, mark: true, id: 'couch' },
        E: { t: 'broken', kind: 'espresso', w: 2, h: 2, id: 'espresso', say: [['gus', 'You fixed it?! It hasn\'t worked since the Clinton administration.'], ['theo', 'Which one?'], ['gus', 'Don\'t start.']] },
        S: { t: 'hazard', kind: 'steam', w: 2, h: 3, link: 'espresso', always: true },
        P: { t: 'npc', look: 'pigeons', solve: 'music', id: 'pigeons', moveTo: 8, vanish: true, voice: 'npc', name: 'PIGEONS',
          block: 'Coo. Coo-coo. (Translation: no.)', won: 'COO! (They love jazz.)' },
        X: { t: 'exit', link: 'couch', lockedMsg: 'FIRE EXIT BLOCKED! MOVE THE COUCH' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['gus', 'Inspector\'s coming! The couch is blocking the fire exit route!'], ['dex', 'The couch? OUR couch? I\'ll be gentle with her.'], ['mila', 'It\'s a couch, Dex.'], ['dex', 'She has a NAME, Mila.']] },
        B: { t: 'trigger', w: 2, h: 3, lines: [['juno', 'There are PIGEONS in the café.'], ['priya', 'That\'s not a health violation. That\'s a health catastrophe.']], hintKeys: H_KEYS('Pigeons won\'t budge for anyone... except JUNO\'s music (E).', 'Pigeons won\'t budge for anyone... except JUNO\'s music (E).') },
      },
      extra: [
        { t: 'trigger', x: 15, y: 13, w: 2, h: 3, lines: [['gus', 'Put it on the X! And easy on the cushions!']], hint: 'DEX: push the couch onto the X.' },
        { t: 'trigger', x: 21, y: 13, w: 2, h: 3, lines: [['theo', 'The espresso machine is leaking steam. Like Gus.']], hintKeys: H_KEYS('THEO: hold E at the espresso machine.', 'THEO: hold E at the espresso machine.') },
      ],
    },
    {
      name: 'The Kitchen', slug: 'INT. THE DAILY GRIND KITCHEN - MORNING', theme: 'kitchen', shot: 'cafe_day',
      map: [
        @@r2@@
      ],
      ents: {
        F: { t: 'door', link: 'fridge', h: 3, kind: 'door' },
        K: { t: 'broken', kind: 'panel', id: 'fridge', say: [['theo', 'Walk-in fridge: open. Smell: unspeakable.']] },
        B: { t: 'crate', kind: 'box' },
        V: { t: 'grate', id: 'vent' },
        G: { t: 'door', link: 'pantry', h: 2, kind: 'door' },
        L: { t: 'lever', id: 'pantry', say: 'Pantry\'s open! Nobody look at the expiration dates.' },
        X: { t: 'exit', link: 'pantry' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Mousetraps. Everywhere.'], ['gus', 'They\'re decorative!'], ['priya', 'Gus. Nothing about this is decorative.']] },
        T: { t: 'trigger', w: 2, h: 3, lines: [['benny', 'The pantry\'s locked from the inside. Through the vent? Classic Benny.'], ['dex', 'You can\'t reach it, little man. I\'ll get you a box.']], hintKeys: H_KEYS('DEX: push the box from the fridge to the shelf so BENNY can reach the vent.', 'DEX: push the box from the fridge to the shelf so BENNY can reach the vent.') },
      },
      extra: [
        { t: 'trigger', x: 15, y: 13, w: 2, h: 3, lines: [['theo', 'Fridge door\'s jammed. My specialty! Well, after toasters. No, wait.']], hintKeys: H_KEYS('THEO: hold E at the fridge panel.', 'THEO: hold E at the fridge panel.') },
      ],
    },
    {
      name: 'The Basement Storeroom', slug: 'INT. CAFE BASEMENT - MORNING', theme: 'basement', shot: 'cafe_day', dark: true, lightLink: 'fuses',
      map: [
        @@r3@@
      ],
      ents: {
        N: { t: 'npc', look: 'inspector', solve: 'talk', id: 'stalled', moveTo: -9, vanish: true, face: -1, voice: 'npc', name: 'INSPECTOR', expr: 'smug',
          block: 'Health Department. I came in the back. I always come in the back.',
          after: ['Five minutes.'],
          talk: {
            q: 'It\'s pitch dark down here. Is that a health violation I smell?',
            opts: [
              { t: 'That\'s not a rat! It\'s Benny\'s magic rabbit.', ok: false, r: 'A RABBIT in a café?! Writing that down.' },
              { t: 'Look over there! A clean surface!', ok: false, r: '...It IS clean. That\'s suspicious.' },
              { t: 'I know a guy at your office. Brenda? She says you love jazz brunch upstairs.', ok: true, r: 'Brenda said that? ...I DO love jazz brunch. Five minutes.' },
            ],
          } },
        U: { t: 'shutter', h: 3, lift: 2 },
        F: { t: 'broken', kind: 'fusebox', id: 'fuses', r: 20, say: [['gus', 'LIGHTS! It\'s a miracle!'], ['theo', 'It\'s a fuse, Gus.'], ['gus', 'It\'s a miracle fuse.']] },
        A: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'Who turned out the lights?'], ['theo', 'The fuse box is in the storage cage. Behind a VERY heavy shutter.']] },
        B: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Leave the inspector to me. I know a guy.'], ['mila', 'You know EVERY guy.']], hintKeys: H_KEYS('PRIYA can stall the inspector (E).', 'PRIYA can stall the inspector (E).') },
        T: { t: 'trigger', w: 2, h: 3, any: true, hintKeys: H_KEYS('DEX lifts the shutter (E). Then switch to THEO to fix the fuses.', 'DEX lifts the shutter (E). Then switch to THEO to fix the fuses.') },
      },
      goal: 'fuses',
    },
  ],
  endLine: 'INSPECTION PASSED!',
});
