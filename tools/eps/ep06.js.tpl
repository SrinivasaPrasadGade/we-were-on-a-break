// =============================================================================
// S1E6  The Wedding Gig (season finale)
// =============================================================================
EPISODES.push({
  season: 1, num: 6, title: 'The Wedding Gig', music: 'wedding',
  blurb: 'Roz and Holloway tie the knot. Juno\'s "band" plays. Sarge carries the rings.',
  rooms: [
    {
      name: 'The Grand Ballroom', slug: 'INT. THE PARAMOUNT HOTEL BALLROOM - DAY', theme: 'ballroom', shot: 'hotel_day',
      map: [
        @@r1@@
      ],
      ents: {
        P: { t: 'crate', kind: 'pianobig' },
        N: { t: 'npc', look: 'planner', solve: 'talk', id: 'planner', moveTo: 16, vanish: true, face: -1, voice: 'npc', name: 'GWENDOLYN', expr: 'angry',
          block: 'The band is LATE. And who are YOU people?',
          talk: {
            q: 'I have a ceremony in one hour, no band, and a groom who keeps quoting bylaws. Talk fast.',
            opts: [
              { t: 'Relax. Have you tried yoga?', ok: false, r: 'I do yoga FOUR times a day. This IS me relaxed.' },
              { t: 'We ARE the band! "Juno and the Couch."', ok: true, r: '...Worst band name I\'ve ever heard. You\'re hired. GO.' },
              { t: 'I know a guy who plans weddings.', ok: false, r: 'Is it Gerald? I HATE Gerald.' },
            ],
          } },
        Z: { t: 'plate', w: 3, heavy: true, mark: true, id: 'piano' },
        K: { t: 'broken', kind: 'speaker', h: 2, id: 'speaker6', say: [['theo', 'Speaker\'s working! I replaced a fuse with a paperclip. Tell no one.'], ['juno', 'Paperclip rock. I love it.']] },
        Q: { t: 'sensor', kind: 'mic', id: 'soundcheck', cond: 'speaker6', notReady: [['juno', 'Testing? Hello? ...The speaker\'s dead. THEO!']], sayWho: 'juno', say: '♪ Check one, two! ♪ We are LIVE, people!' },
        G: { t: 'door', kind: 'curtain', h: 3, link: 'piano&soundcheck' },
        X: { t: 'exit' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['juno', 'Roz and Holloway\'s wedding. MY band. My big break.'], ['dex', 'We\'re not a band, Juno.'], ['juno', 'Tonight we are. Dex, you\'re on piano. Moving it, not playing it.']], hintKeys: H_KEYS('PRIYA: talk to the wedding planner (E).', 'PRIYA: talk to the wedding planner (E).') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'The piano goes on the bandstand. Of course it does.'], ['theo', 'And the speaker\'s dead. Of course it is.']], hintKeys: H_KEYS('DEX: piano onto the X. THEO: fix the speaker. JUNO: sound check at the mic.', 'DEX: piano onto the X. THEO: fix the speaker. JUNO: sound check at the mic.') },
      },
      extra: [
        { t: 'deco', kind: 'chandelier', x: 20, y: 9, w: 3, chain: 112 },
        { t: 'deco', kind: 'chandelier', x: 16, y: 6, w: 3, chain: 64 },
        { t: 'deco', kind: 'banner', x: 23, y: 5, w: 14, h: 2, text: 'ROZ & BERTRAM', back: true },
      ],
    },
    {
      name: 'The Hotel Kitchen', slug: 'INT. PARAMOUNT HOTEL KITCHEN - DAY', theme: 'kitchen', shot: 'hotel_day',
      map: [
        @@r2@@
      ],
      ents: {
        S: { t: 'runner', kind: 'sarge', path: [[12, 13], [16, 11], [27, 13], [37, 13], [45, 13], [55, 13], [62, 6], [59, 13]], near: 4, speed: 2.4,
          lovesMusic: true, catchable: true, id: 'rings', taunts: ['*jingle jingle*', '*smug ring-bearer hiss*', '*iguana noises, but fancy*'],
          lureSay: [['juno', '♪ Sarge, Sarge, bring the rings, I\'ll give you lettuce and other things ♪']],
          say: [['theo', 'GOT HIM! And the rings! Sarge, you are the WORST ring bearer.'], ['benny', 'Technically, he bore them. Far away. But he bore them.']] },
        B: { t: 'crate', kind: 'boxes2' },
        V: { t: 'hazard', kind: 'steam', h: 3, phase: 0 },
        W: { t: 'hazard', kind: 'steam', h: 3, phase: 60 },
        G: { t: 'door', link: 'pantry6', h: 2, kind: 'door' },
        U: { t: 'grate', id: 'vent6' },
        L: { t: 'lever', id: 'pantry6', say: 'Pantry\'s open! Sarge, you\'re surrounded. By soup.' },
        X: { t: 'exit', link: 'rings', lockedMsg: 'FIND THE RINGS FIRST!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'Sarge was the ring bearer. WAS. He has the rings and he is GONE.'], ['priya', 'Who made the IGUANA the ring bearer?'], ['theo', 'Roz! She said he has "presence."']] },
        C: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'A stack of boxes. In a corridor. Classic hotel.'], ['benny', 'Sarge went under them. Everything goes under.']], hintKeys: H_KEYS('DEX: push the boxes out of the corridor.', 'DEX: push the boxes out of the corridor.') },
        E: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'Dishwasher steam! Time it right.'], ['juno', '♪ Hot, hot, HOT ♪']], hintKeys: H_KEYS('Steam vents puff on and off. Wait for a gap!', 'Steam vents puff on and off. Wait for a gap!') },
      },
      extra: [
        { t: 'trigger', x: 50, y: 13, w: 2, h: 3, lines: [['benny', 'Pantry door\'s locked. But there\'s a vent...'], ['juno', 'Of course there is.']], hintKeys: H_KEYS('BENNY: open the vent (E) and crawl under the door.', 'BENNY: open the vent (E) and crawl under the door.') },
        { t: 'trigger', x: 55, y: 13, w: 2, h: 3, cond: 'pantry6', lines: [['juno', 'He\'s on top of the fridge! Good thing he loves my music.']], hintKeys: H_KEYS('JUNO: play (E) to lure Sarge down, then grab him.', 'JUNO: play (E) to lure Sarge down, then grab him.') },
      ],
    },
    {
      name: 'The Ceremony', slug: 'INT. PARAMOUNT HOTEL CHAPEL - DAY', theme: 'ballroom', shot: 'hotel_day',
      map: [
        @@r3@@
      ],
      ents: {
        N: { t: 'npc', look: 'commuter', solve: 'talk', id: 'photog', moveTo: -9, vanish: true, face: -1, voice: 'npc', name: 'PHOTOGRAPHER', expr: 'smug',
          block: 'Nobody crosses my shot!',
          talk: {
            q: 'I\'ve got the PERFECT angle on the... wall. Nobody moves.',
            opts: [
              { t: 'Can you take OUR picture?', ok: false, r: 'I only shoot weddings. And sunsets. And once, a ferret.' },
              { t: 'Move or I sneeze on your lens.', ok: false, r: '...Rude. Effective, but rude. Still no.' },
              { t: 'The bride wants photos by the cake. The light there is GORGEOUS.', ok: true, r: 'Gorgeous light?! Say no more. Light waits for no one!' },
            ],
          } },
        C: { t: 'crate', kind: 'cakecart' },
        Z: { t: 'plate', w: 2, heavy: true, mark: true, id: 'cake6' },
        G: { t: 'door', link: 'vestry6', h: 2, kind: 'door' },
        V: { t: 'grate', id: 'vent6b' },
        L: { t: 'lever', id: 'vestry6', say: 'Vestry\'s open! Ta-da! ...Please clap.' },
        Y: { t: 'talker', look: 'groom', voice: 'holloway', lines: ['I\'m not nervous. I\'m sweating BY THE RULES.', 'Rule 1 of marriage: always agree with Roz. I wrote it myself.', 'Do I look all right? Don\'t answer. Rule 77.'] },
        K: { t: 'broken', kind: 'organ', w: 2, h: 2, id: 'organ6', say: [['theo', 'Organ\'s fixed! A mouse was living in the low C.'], ['benny', 'Can I keep him?'], ['theo', 'No.']] },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Places, people! Ceremony in five!'], ['mila', 'The photographer is hogging the aisle.'], ['priya', 'Leave him to me.']], hintKeys: H_KEYS('PRIYA: talk the photographer out of the way (E).', 'PRIYA: talk the photographer out of the way (E).') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'The cake goes on the X. Five tiers. No pressure.'], ['benny', 'I could make it disappear.'], ['dex', 'NO.']], hintKeys: H_KEYS('DEX: push the cake onto the X. BENNY: the vestry has a vent.', 'DEX: push the cake onto the X. BENNY: the vestry has a vent.') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'The organ\'s dead. Leave it to me.'], ['juno', 'Then I play them down the aisle. This is my moment!']], hintKeys: H_KEYS('THEO fixes the organ. Then JUNO plays it (E)!', 'THEO fixes the organ. Then JUNO plays it (E)!') },
      },
      extra: [
        { t: 'sensor', x: 47, y: 13, w: 2, h: 2, kind: 'organkeys', invisible: true, id: 'march', cond: 'organ6&cake6', notReady: [['juno', 'Not yet! Organ fixed? Cake on the X? THEN we play.']], sayWho: 'juno', say: '♪ Here comes the bride! ♪' },
        { t: 'deco', kind: 'chandelier', x: 22, y: 10, w: 3, chain: 128 },
        { t: 'deco', kind: 'arch', x: 41, y: 13, w: 4, h: 7, back: true },
      ],
      goal: 'march',
    },
  ],
  endLine: 'JUST MARRIED!',
});
