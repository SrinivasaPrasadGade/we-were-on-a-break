// =============================================================================
// S2E1  The Landlord Strikes Back
// =============================================================================
EPISODES.push({
  season: 2, num: 1, title: 'The Landlord Strikes Back', music: 'snoop',
  blurb: 'Holloway is back from the honeymoon. Surprise inspection. Rule 9: no reptiles.',
  rooms: [
    {
      name: '3rd Floor Hallway', slug: 'INT. 3RD FLOOR HALLWAY - MORNING', theme: 'hall', shot: 'building_day',
      map: [
        @@r1@@
      ],
      ents: {
        C: { t: 'crate', kind: 'terrarium' },
        Z: { t: 'plate', w: 2, heavy: true, mark: true, id: 'terra7' },
        W: { t: 'watcher', look: 'holloway', from: -8, to: 8, range: 6, speed: 0.6, dance: 420, voice: 'holloway',
          lines: ['INSPECTION! Back to your apartment!', 'Rule 14! No loitering during inspections!', 'I see you, 3A! I ALWAYS see 3A!', 'Married life has NOT softened me!'],
          danceLines: ['Is that... our wedding song?', 'Roz taught me this one!', 'My feet are married to the rhythm!'] },
        P: { t: 'hideout', kind: 'door', label: '3C' },
        Q: { t: 'hideout', kind: 'door', label: '3D' },
        R: { t: 'hideout', kind: 'door', label: '3E' },
        K: { t: 'broken', kind: 'panel', id: 'keypad7', say: [['theo', 'Keypad\'s fixed. The code was 1-2-3-4. Of course it was.']] },
        G: { t: 'door', link: 'keypad7', h: 3, kind: 'door' },
        X: { t: 'exit', link: 'terra7&keypad7', lockedMsg: 'HIDE SARGE IN 3B FIRST!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'Holloway\'s inspecting every apartment. If he finds Sarge, I\'m evicted.'], ['juno', 'Hide him in 3B! Holloway never inspects 3B.'], ['dex', 'Why not?'], ['juno', 'He\'s scared of my keytar.']] },
        B: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'Holloway\'s patrolling the whole hall.'], ['priya', 'Then we do it the old-fashioned way. Duck into doorways.']], hintKeys: H_KEYS('Stand in a doorway and press E to HIDE. Holloway can\'t see you there!', 'Stand in a doorway and press E to HIDE. Holloway can\'t see you there!') },
        E: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'Stairwell keypad. Dead, naturally. Give me a minute.']], hintKeys: H_KEYS('DEX: terrarium onto the 3B mark. THEO: fix the stairwell keypad.', 'DEX: terrarium onto the 3B mark. THEO: fix the stairwell keypad.') },
      },
      extra: [
        { t: 'hideout', kind: 'door', x: 12, y: 13, label: '3B', w: 2 },
      ],
    },
    {
      name: 'Apartment 3A', slug: 'INT. APARTMENT 3A - MORNING', theme: 'apt', shot: 'building_day',
      map: [
        @@r2@@
      ],
      ents: {
        K: { t: 'broken', kind: 'robot', id: 'bot7', label: 'Switch off (hold)', say: [['theo', 'Tidy-Bot prototype: deactivated. It was vacuuming the ceiling.'], ['dex', 'How?!'], ['theo', 'I don\'t KNOW, Dex.']] },
        F: { t: 'crate', kind: 'fridge' },
        Z: { t: 'plate', heavy: true, mark: true, id: 'hole7' },
        L: { t: 'lever', id: 'lamp7', kind: 'button', say: 'Heat lamp off! No reptile evidence here! Scoreboard: Mila 1.' },
        X: { t: 'exit', link: 'bot7&hole7&lamp7', lockedMsg: 'HIDE THE EVIDENCE FIRST!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Inspection checklist: one haywire robot, one iguana-shaped hole, one heat lamp.'], ['dex', 'That\'s not a checklist. That\'s our lives.']], hintKeys: H_KEYS('Hide the evidence: THEO the robot, DEX the fridge over the hole, MILA the heat lamp.', 'Hide the evidence: THEO the robot, DEX the fridge over the hole, MILA the heat lamp.') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'The heat lamp switch is on top of the bookshelf.'], ['mila', 'I\'ve been training for this my whole life. Literally. I climb bookshelves recreationally.']] },
      },
      extra: [
        { t: 'deco', kind: 'hole', x: 24, y: 13, w: 1, h: 1, back: true },
      ],
    },
    {
      name: 'Holloway\'s Office', slug: 'INT. SUPERINTENDENT\'S OFFICE - DAY', theme: 'lobby', shot: 'building_day',
      map: [
        @@r3@@
      ],
      ents: {
        N: { t: 'npc', look: 'roz', solve: 'talk', id: 'roz7', moveTo: -5, face: -1, voice: 'roz', name: 'ROZ', expr: 'smug',
          block: 'Darlings! Bertram\'s office is off-limits. It\'s his "sanctuary." It has a FERN.',
          after: ['I didn\'t see a thing, darlings.', 'Bertram talks to that fern. It\'s adorable.'],
          talk: {
            q: 'And what, pray tell, do you want in my husband\'s office?',
            opts: [
              { t: 'A cup of sugar. From his desk.', ok: false, r: 'Darling, he alphabetizes his sugar. No.' },
              { t: 'Is that a new perfume?', ok: false, r: 'It\'s called "Bylaws." Bertram named it. I wear it ironically.' },
              { t: 'It\'s Sarge. If Bertram finds him, Theo gets evicted!', ok: true, r: 'Evict my sweet Sarge? Over my dead begonias. Go!' },
            ],
          } },
        G: { t: 'door', link: 'office7', h: 2, kind: 'door' },
        V: { t: 'grate', id: 'vent7' },
        L: { t: 'lever', id: 'office7', say: 'We\'re in! ...This office has a LOT of label makers.' },
        K: { t: 'broken', kind: 'safe', id: 'safe7', label: 'Crack (hold)', say: [['theo', 'Safe\'s open! The combination was his wedding date.'], ['priya', 'Aww. And also: terrible security.']] },
        F: { t: 'hideout', kind: 'plant' },
        R: { t: 'hideout', kind: 'coatrack' },
        W: { t: 'watcher', look: 'holloway', from: -5, to: 5, range: 6, speed: 0.55, dance: 420, voice: 'holloway',
          lines: ['WHO is in my office?!', 'Rule 2! My office is MY office!', 'Not near the fern! Never near the fern!'],
          danceLines: ['Not the samba! Anything but the samba!', 'Oh, my hips are filing a complaint.', 'Roz is going to LOVE this story.'] },
        B: { t: 'lever', kind: 'book', w: 2, id: 'rule', cond: 'safe7', label: 'Add Rule 9½', say: 'Rule 9½: iguanas named Sarge are PERMITTED. Signed... "B. Holloway."' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'The plan: sneak in, open the safe, add ONE tiny rule to the rulebook.'], ['theo', 'Rule 9½. Iguanas named Sarge are permitted.'], ['mila', 'That\'s forgery.'], ['priya', 'It\'s CREATIVE ADMINISTRATION.']], hintKeys: H_KEYS('PRIYA: talk to Roz (E).', 'PRIYA: talk to Roz (E).') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['benny', 'Holloway\'s pacing in front of the desk!'], ['juno', 'Fern. Coat rack. Or one cha-cha. Your call.']], hintKeys: H_KEYS('THEO cracks the safe. Then sneak to the desk: hide (E), dance (JUNO) or send BENNY.', 'THEO cracks the safe. Then sneak to the desk: hide, dance (JUNO) or send BENNY.') },
      },
      goal: 'rule',
    },
  ],
  endLine: 'INSPECTION SURVIVED!',
});
