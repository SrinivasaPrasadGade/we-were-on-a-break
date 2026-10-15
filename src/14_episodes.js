// ---------------------------------------------------------------------------
// Episodes: rooms (maps + entity legends). Map chars anchor at bottom-left.
// '#' solid  '=' shelf/one-way  'H' ladder  'M' drainpipe (Mila)  'D' duct
// '^' hazard  'I' ice  '{' '}' conveyors  '@' spawn  'c' cup  '*' golden mug
// 'k' checkpoint  'X' exit door  lowercase = decor  UPPERCASE/digits = legend
// ---------------------------------------------------------------------------
const H_KEYS = (keys, touch) => ({ keys, touch });
const EPISODES = [];

// =============================================================================
// S1E1  The Tutorial Move-In
// =============================================================================
EPISODES.push({
  season: 1, num: 1, title: 'The Tutorial Move-In', music: 'funk',
  blurb: 'A new neighbor, a grand piano, a broken elevator.',
  rooms: [
    {
      name: 'Larkspur Street', slug: 'EXT. LARKSPUR STREET - DAY', theme: 'street', cast: ['dex'], start: 'dex', shot: 'building_day', openTop: true,
      map: [
// 0000000000111111111122222222223333333333444444444455555555556666
        // 0123456789012345678901234567890123456789012345678901234567890123
        '................................................................', // 0
        '................................................................', // 1
        '........................................B.c...........c...c.....', // 2
        '.......................................======M.....#############', // 3
        '.............................................M.....#############', // 4
        '.............................................M.....#############', // 5
        '......................................c..c...M.....#############', // 6
        '.....................................=========.....#############', // 7
        '...................................................#############', // 8
        '...................................................#############', // 9
        '.................................R..c.....c...X..c.#############', // 10
        '....c..c....c.......c............###############################', // 11
        '...======...##...................###############################', // 12
        '.P@.......c.##..c.......c.A..c...###############################', // 13
        '###################...##########################################', // 14
        '###################...##########################################', // 15
        '###################...##########################################', // 16
      ],
      ents: {
        A: { t: 'crate', kind: 'box' },
        B: { t: 'lever', id: 'buzz', kind: 'button', say: 'BZZZT! The front door is open!' },
        X: { t: 'exit', link: 'buzz', lockedMsg: 'LOCKED! BUZZ IT FROM UPSTAIRS' },
        P: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'Roz\'s stuff goes up. My back stays down here.'], ['dex', 'Who parks a moving truck on a hill?']], hintKeys: H_KEYS('Walk: ←/→ or A/D    Jump: ↑, W or SPACE', 'Walk with the arrows. Tap JUMP to jump.') },
        R: { t: 'trigger', w: 3, h: 4, join: 'mila', joinAt: [41, 10], lines: [['mila', 'MILA! On a bike! Fashionably early!'], ['dex', 'Door\'s locked. The buzzer\'s upstairs.'], ['mila', 'Fire escape? Please. Watch and learn.']], hintKeys: H_KEYS('Press 2 (or Q) to play as MILA. Press JUMP again in midair to double-jump!', 'Tap MILA\'s portrait. Tap JUMP again in midair to double-jump!') },
      },
      extra: [
        { t: 'deco', kind: 'truck', x: 2, y: 13, w: 7, h: 2, back: true },
        { t: 'trigger', x: 23, y: 13, w: 2, h: 3, lines: [['dex', 'A moving box. Heavy stuff is my department.']], hintKeys: H_KEYS('DEX pushes heavy things. Just walk into them!', 'DEX pushes heavy things. Just walk into them!') },
        { t: 'trigger', x: 43, y: 6, w: 3, h: 3, hintKeys: H_KEYS('MILA climbs drainpipes: hold ↑ on the pipe.', 'MILA climbs drainpipes: hold ↑ on the pipe.') },
        { t: 'trigger', x: 41, y: 2, w: 2, h: 2, hintKeys: H_KEYS('Press E to use things, like the buzzer.', 'Tap E to use things, like the buzzer.') },
        { t: 'trigger', x: 44, y: 10, w: 3, h: 3, cond: 'buzz', any: true, lines: [['dex', 'We\'re in! Everybody inside!']], hintKeys: H_KEYS('Press ↑ at the door for the next scene. F makes the gang follow you.', 'Press ↑ at the door for the next scene.') },
      ],
    },
    {
      name: 'The Bellweather Lobby', slug: 'INT. THE BELLWEATHER LOBBY - DAY', theme: 'lobby', cast: ['dex', 'mila'], start: 'dex', shot: 'building_day',
      map: [
// 0000000000111111111122222222223333333333
        // 0123456789012345678901234567890123456789
        '########################################', // 0
        '########################################', // 1
        '..........................#..........###', // 2
        '..........................#.........c###', // 3
        '..........................D.........=###', // 4
        '..........................Vc.........###', // 5
        '...........................#.........###', // 6
        '..X..c..c...c...c...c..L..G#..c......###', // 7
        '##################################...###', // 8
        '##################################...###', // 9
        '...................................c.###', // 10
        '.....................................###', // 11
        '.....................................###', // 12
        '.@..cm...c...c.B..c...c...c.T.c..KE..###', // 13
        '########################################', // 14
        '########################################', // 15
        '########################################', // 16
      ],
      ents: {
        V: { t: 'grate', id: 'vent' },
        G: { t: 'door', link: 'lev', h: 2 },
        L: { t: 'lever', id: 'lev', say: 'Door\'s open! Ta-da! ...I mean, you\'re welcome.' },
        X: { t: 'exit' },
        E: { t: 'platform', w: 3, path: [[0, 0], [0, -6]], dy: 6, link: 'elev', mode: 'cycle', speed: 0.9, wait: 80, cableTop: 2 },
        K: { t: 'broken', kind: 'elevator', id: 'elev' },
        B: { t: 'trigger', w: 2, h: 3, join: 'benny', joinAt: [6, 13], lines: [['benny', 'Ta-da! It is I, the Great Benny! From... the mail slot.'], ['dex', 'Benny. Did you sleep in the mailbox again?'], ['benny', 'It\'s roomier than my apartment.']], hintKeys: H_KEYS('BENNY is small: he crawls through vents and opens grates.', 'BENNY is small: he crawls through vents and opens grates.') },
        T: { t: 'trigger', w: 2, h: 3, join: 'theo', joinAt: [31, 13], lines: [['theo', 'Did somebody say "broken elevator"? My favorite words!'], ['mila', 'Nobody said that.'], ['theo', 'I heard it in my heart.']], hintKeys: H_KEYS('THEO fixes broken things: hold E next to them.', 'THEO fixes broken things: hold E next to them.') },
      },
      extra: [
        { t: 'trigger', x: 29, y: 7, w: 3, h: 3, lines: [['dex', 'Locked from the other side. Great.'], ['benny', 'A vent! This is my moment!']], hintKeys: H_KEYS('Jump on the cabinet as BENNY (5) and press E at the vent.', 'Jump on the cabinet as BENNY and tap E at the vent.') },
      ],
    },
    {
      name: '5th Floor Hallway', slug: 'INT. 5TH FLOOR HALLWAY - DAY', theme: 'hall', cast: FRIENDS, start: 'priya', shot: 'building_day',
      labels: ['5B', '5C'],
      map: [
// 0000000000111111111122222222223333333333444444444455555555
        // 0123456789012345678901234567890123456789012345678901234567
        '##########################################################', // 0
        '##########################################################', // 1
        '...............................####.....#................#', // 2
        '...............................####.....#................#', // 3
        '...............................####.....#................#', // 4
        '.........l...............l.....####.l...#.......w........#', // 5
        '...............................####.....#................#', // 6
        '...............................####.....#................#', // 7
        '..................................#.....#................#', // 8
        '.............................ccY.*#.....#................#', // 9
        '............................====###.....#.........c......#', // 10
        '....c...................................#................#', // 11
        '.........................................................#', // 12
        '.@..J.d.c...P...c.dQc.F..c.........cU.c.S...cb..c...c..Z.#', // 13
        '##########################################################', // 14
        '##########################################################', // 15
        '##########################################################', // 16
      ],
      ents: {
        P: { t: 'crate', kind: 'piano' },
        F: { t: 'npc', look: 'fenwick', solve: 'talk', id: 'fenwick', moveTo: -3, vanish: true, face: -1, voice: 'npc', name: 'MR. FENWICK',
          block: 'No moving after 6 PM! Bylaw 9. Look it up.',
          talk: {
            q: 'It\'s 6:01. Nobody moves a piano past my door at 6:01.',
            opts: [
              { t: 'I know a guy who can make you disappear.', ok: false, r: 'Was that a THREAT? I\'m writing that down.' },
              { t: 'Mr. Fenwick! Is that robe silk? You look like a movie star.', ok: true, r: '...It IS silk. Fine. Five minutes. I\'m timing you.' },
              { t: 'Look! Behind you! A distraction!', ok: false, r: 'I\'m not turning around. I\'ve lived here 40 years.' },
            ],
          } },
        Y: { t: 'sounddoor', id: 'secret', h: 2 },
        S: { t: 'sounddoor', id: 'rozdoor', h: 2 },
        Z: { t: 'plate', w: 2, heavy: true, mark: true, id: 'mark' },
        J: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Priya, real estate. I found Roz this apartment. You\'re welcome, world.'], ['juno', 'And I\'m Juno. I bring the music. ♪ Ba-dum! ♪'], ['dex', 'Somebody bring my spine.']] },
        Q: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'Mr. Fenwick is guarding the hallway again.']], hintKeys: H_KEYS('PRIYA talks past grumpy people: switch to PRIYA (4) and press E.', 'PRIYA talks past grumpy people: tap PRIYA, then E.') },
        U: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Roz\'s door only opens to music. She\'s an opera singer.'], ['juno', 'Say no more. I take requests.']], hintKeys: H_KEYS('JUNO\'s tunes open sound doors: switch to JUNO (6) and press E nearby.', 'JUNO\'s tunes open sound doors: tap JUNO, then E nearby.') },
      },
      extra: [
        { t: 'trigger', x: 41, y: 13, w: 2, h: 3, cond: 'rozdoor', any: true, lines: [['dex', 'Okay, piano. You and me. One last dance.'], ['mila', 'Push it onto the X, Dex!']], hint: 'Push the piano onto the X (DEX).' },
      ],
      goal: 'mark',
    },
  ],
  endLine: 'PIANO DELIVERED!',
});

// =============================================================================
// S1E2  The Iguana Has Left the Building
// =============================================================================
EPISODES.push({
  season: 1, num: 2, title: 'The Iguana Has Left the Building', music: 'sneaky',
  blurb: 'Sarge is loose. Holloway is on patrol. Rule 9: no reptiles.',
  rooms: [
    {
      name: '3rd Floor Hallway', slug: 'INT. 3RD FLOOR HALLWAY - NIGHT', theme: 'hall', shot: 'building_night', labels: ['3A', '3B', '3C'],
      map: [
        // 0000000000111111111122222222223333333333444444444455555555556666
        // 0123456789012345678901234567890123456789012345678901234567890123
        '################################################################', // 0
        '################################################################', // 1
        '..........................................................#.....', // 2
        '..........................................................#.....', // 3
        '..........................................................#.....', // 4
        '........l.............l........cc*......l.............l...#.....', // 5
        '..............................M####.......................#.....', // 6
        '..............................M...........................#.....', // 7
        '..............................M.................................', // 8
        '..............................M................w..........G.....', // 9
        '.........................i....M.....................c..c..V.LcX.', // 10
        '..............................M.............c.....##############', // 11
        '......c.......................M...................##############', // 12
        '..@.Ad...S.c..k.cdB..c..c..cW.M..c..dc..c.k.R.....##############', // 13
        '################################################################', // 14
        '################################################################', // 15
        '################################################################', // 16
      ],
      ents: {
        S: { t: 'runner', kind: 'sarge', path: [[9, 13], [20, 13], [46, 13], [54, 10], [59, 10]], vanish: true, near: 4, taunts: ['*hiss*', '*smug tongue flick*', '*iguana noises*'] },
        W: { t: 'watcher', look: 'holloway', from: -5, to: 5, range: 6, voice: 'holloway',
          lines: ['Rule 14! No loitering!', 'Is that a REPTILE? Back to your apartment!', 'I see you, 3A!', 'Rule 9: No iguanas! Rule 10: No iguana accomplices!'],
          danceLines: ['Is that... a cha-cha? I LOVE a cha-cha.', 'My hips! They\'re breaking Rule 31!', 'Ooh. Ooh! Don\'t tell anyone about this.'] },
        R: { t: 'crate', kind: 'dresser' },
        G: { t: 'door', link: 'lev', h: 2, kind: 'door' },
        V: { t: 'grate', id: 'vent' },
        L: { t: 'lever', id: 'lev', say: 'Door\'s open! The Great Benny strikes again!' },
        X: { t: 'exit' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'Sarge! Come back! You don\'t even LIKE hallways!'], ['mila', 'He\'s fast. I respect that.'], ['priya', 'If Holloway sees him, that\'s Rule 9. No reptiles.']] },
        B: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'Holloway\'s on patrol. If he sees us, we\'re toast.'], ['juno', 'Nobody can resist my bossa nova. Watch.']], hintKeys: H_KEYS('Watchers send you back if they spot you. BENNY is too small to notice. JUNO\'s music makes them dance!', 'Watchers send you back if they spot you. BENNY is too small to notice. JUNO\'s music makes them dance!') },
      },
      extra: [
        { t: 'trigger', x: 51, y: 10, w: 3, h: 3, any: true, lines: [['benny', 'Sarge went UNDER the door. Under!'], ['benny', 'That\'s my move. He stole my move.']], hintKeys: H_KEYS('BENNY: open the grate under the door (E), then crawl through.', 'BENNY: open the grate under the door (E), then crawl through.') },
        { t: 'trigger', x: 40, y: 13, w: 2, h: 3, lines: [['dex', 'Who leaves a DRESSER in a hallway?'], ['mila', 'Fenwick. It\'s his "decorative" dresser.']] },
      ],
    },
    {
      name: 'The Laundry Room', slug: 'INT. BASEMENT LAUNDRY ROOM - NIGHT', theme: 'laundry', shot: 'building_night',
      map: [
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '....................................................#.......', // 2
        '....................................................#.......', // 3
        '......................c.c.c.........................#.......', // 4
        '....................M======.........................#.......', // 5
        '.........v..........M...............v...............#.......', // 6
        '....................M...............................#.......', // 7
        '....................M.......................................', // 8
        '....................M.......................................', // 9
        '....................M...............cr..rc..Src.r.c.U..c.X..', // 10
        '.........c..c.......M.............##########################', // 11
        '....................M.............##########################', // 12
        '..@.cx.K..Z.....cTxcM...C.x.c.kc..##########################', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
      ],
      ents: {
        K: { t: 'broken', kind: 'pump', id: 'washer', say: [['theo', 'Fixed! The secret was a sock. It\'s always a sock.']] },
        Z: { t: 'hazard', kind: 'suds', w: 5, link: 'washer' },
        C: { t: 'crate', kind: 'washer' },
        S: { t: 'runner', kind: 'sarge', path: [[44, 10], [51, 10], [56, 10]], vanish: true, near: 6, taunts: ['*splish*', '*tiny victory hiss*'] },
        U: { t: 'shutter', h: 3, lift: 2 },
        X: { t: 'exit' },
        T: { t: 'trigger', w: 2, h: 3, lines: [['juno', '♪ Bubbles, bubbles, toil and trouble ♪'], ['theo', 'That washer\'s been broken since the Bronze Age. Let me at it.']], hintKeys: H_KEYS('THEO: hold E at the broken washer to stop the suds.', 'THEO: hold E at the broken washer to stop the suds.') },
      },
      extra: [
        { t: 'trigger', x: 46, y: 10, w: 2, h: 3, any: true, lines: [['dex', 'He went under the boiler room shutter. Of course he did.'], ['dex', 'Stand back. Heavy lifting is a lifestyle.']], hintKeys: H_KEYS('DEX lifts heavy shutters (E) and holds them while you switch friends.', 'DEX lifts heavy shutters (E) and holds them while you switch friends.') },
      ],
    },
    {
      name: 'Roz\'s Roof Garden', slug: 'EXT. ROOFTOP GREENHOUSE - SUNSET', theme: 'roof', shot: 'roof_sunset', openTop: true,
      map: [
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '.......................................................#', // 0
        '.......................................................#', // 1
        '.......................#################################', // 2
        '.......................................................#', // 3
        '.......................................................#', // 4
        '.............................................c.S.c.....#', // 5
        '............................................======.....#', // 6
        '.......................................c.c.............#', // 7
        '......................................=====............#', // 8
        '.................................c.c...............c.c.#', // 9
        '................................=====.............====.#', // 10
        '...........................c.c.........................#', // 11
        '..........................=====........................#', // 12
        '..@.A.c.f.c...f.c...R...B...................c.....c....#', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
      ],
      ents: {
        R: { t: 'npc', look: 'roz', solve: 'talk', id: 'roz', moveTo: -4, face: -1, voice: 'roz', name: 'ROZ', expr: 'smug',
          block: 'Darling, NOBODY enters my greenhouse in outside shoes.',
          after: ['Find that lizard before he eats my begonias!', 'My orchids are watching you.'],
          talk: {
            q: 'My orchids are very sensitive. Why should I let you in?',
            opts: [
              { t: 'We\'ll take our shoes off!', ok: false, r: 'And expose my orchids to Dex\'s FEET? Never.' },
              { t: 'I know a guy who does orchid therapy.', ok: false, r: 'Orchid THERAPY? ...Get me his number. But still no.' },
              { t: 'Roz, sing to them while we search. Your voice makes roses bloom.', ok: true, r: 'Flattery! My one weakness. Go, go! ♪ La-la-LAAA ♪' },
            ],
          } },
        S: { t: 'runner', kind: 'sarge', path: [[47, 5], [47, 13]], near: 0, lovesMusic: true, catchable: true, goal: true, id: 'caught',
          lureSay: [['juno', '♪ Sarge, Sarge, come down from there, I\'ve got lettuce and a comfy chair ♪'], ['theo', 'It\'s working! He\'s dancing! He\'s... surprisingly good.']],
          say: [['theo', 'GOT HIM! Sarge, you are SO grounded.'], ['benny', 'Technically he\'s still on the roof.']] },
        A: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'There! On Roz\'s top shelf!'], ['theo', 'Sarge LOVES music. Juno, play his favorite!'], ['juno', 'His favorite is my jingle about him.']] },
        B: { t: 'trigger', w: 2, h: 3, hintKeys: H_KEYS('Climb the shelves with JUNO and play (E) near Sarge.', 'Climb the shelves with JUNO and play (E) near Sarge.') },
      },
      extra: [
        { t: 'deco', kind: 'greenhouse', x: 23, y: 13, w: 32, h: 11, back: true },
      ],
      goal: 'caught',
    },
  ],
  endLine: 'IGUANA SECURED!',
});

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
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '########################################################', // 0
        '########################################################', // 1
        '........................................................', // 2
        '........................................................', // 3
        '..............l...............l...............l.........', // 4
        '........................................................', // 5
        '........................................................', // 6
        '........................................................', // 7
        '........................................................', // 8
        '......w...............................c.c...............', // 9
        '.........................c............====..............', // 10
        '............c.c................c...........c.c..........', // 11
        '....c.......====....c......................===..........', // 12
        '..@.A.c...C.....tcZ..#.E..S.cB.t..P............f.c..X...', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
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
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '...............................................#...........#', // 2
        '...............................................#...........#', // 3
        '...............................................#DDDDD......#', // 4
        '...............................................#D...D......#', // 5
        '......o..................l...........l.......D.#D..*D......#', // 6
        '..............................................DDD.DD.......#', // 7
        '..............................................V....D.......#', // 8
        '.............................................DDDDD.#########', // 9
        '............c.......#########..............c...#...........#', // 10
        '.........c...cc................c..c.c.....===..#...........#', // 11
        '............====.................====......................#', // 12
        '..@.Ac...^..^.x.c.K.F.c.B.c...c.......T.c......G..c.xL.c.X.#', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
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
        // 0000000000111111111122222222223333333333444444444455555555
        // 0123456789012345678901234567890123456789012345678901234567
        '##########################################################', // 0
        '##########################################################', // 1
        '............................................#............#', // 2
        '............................................#............#', // 3
        '............................................#............#', // 4
        '............................................#............#', // 5
        '.......................................c....#............#', // 6
        '........................c.c.c.........===...#............#', // 7
        '........................=====...............#............#', // 8
        '......................c.....................#............#', // 9
        '.....................##...............c.....#............#', // 10
        '..................c..##............c.####................#', // 11
        '..................##.##............#.####................#', // 12
        '..@.cA..x.c.N..Bc.##.##..c...x.c.x.#.####.T.U..cx..c.F.c.#', // 13
        '##########################################################', // 14
        '##########################################################', // 15
        '##########################################################', // 16
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

