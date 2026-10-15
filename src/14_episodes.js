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

// =============================================================================
// S1E4  The Blackout
// =============================================================================
EPISODES.push({
  season: 1, num: 4, title: 'The Blackout', music: 'lightsout',
  blurb: 'Mila\'s party starts at eight. The power went out at six.',
  rooms: [
    {
      name: 'The Stairwell', slug: 'INT. BELLWEATHER STAIRWELL - NIGHT', theme: 'stair', shot: 'building_blackout', dark: true,
      map: [
        // 000000000011111111112222222222
        // 012345678901234567890123456789
        '##############################', // 0
        '##############################', // 1
        '...........#..................', // 2
        '...........#..................', // 3
        '...........#.........l........', // 4
        '...........#..................', // 5
        '...........#.....c............', // 6
        '..............................', // 7
        '..@.d...A.PG..cd....c..c......', // 8
        '##########################H###', // 9
        '..........................H...', // 10
        '......Y............Y......H...', // 11
        '..........................H...', // 12
        '.............l............H...', // 13
        '..........................H...', // 14
        '....................c.....H...', // 15
        '..........................H...', // 16
        '......c.Q....c...^....Bc..H...', // 17
        '###T##########################', // 18
        '..............................', // 19
        '..............................', // 20
        '..............................', // 21
        '........................l.....', // 22
        '..............................', // 23
        '...................c..........', // 24
        '..............K...............', // 25
        '..x...c.k..c....c....c........', // 26
        '########################H#####', // 27
        '........................H.....', // 28
        '...........cL...........H.....', // 29
        '..........M##...........H.....', // 30
        '.....l....M.............H.....', // 31
        '..........M.........m...H.....', // 32
        '..........M.............H.....', // 33
        '.....c....M....c.C...c..H..X..', // 34
        '##############################', // 35
        '##############################', // 36
      ],
      ents: {
        P: { t: 'broken', kind: 'panel', id: 'stairlock', say: [['theo', 'Hot-wired! Don\'t tell Holloway.'], ['juno', 'Tell Holloway what?'], ['theo', 'Exactly.']] },
        G: { t: 'door', link: 'stairlock', h: 2, kind: 'door' },
        T: { t: 'blocks', kind: 'bridge', mode: 'vanish', link: 'clap1', w: 2 },
        Q: { t: 'sensor', kind: 'clapper', id: 'clap1', sayWho: 'theo', say: 'IT WORKS! Somewhere, my toaster just turned on.' },
        Y: { t: 'light', kind: 'hang', link: 'clap1', r: 7 },
        K: { t: 'broken', kind: 'lights', id: 'elights', r: 9, say: [['theo', 'Emergency lights! Forty glorious watts.'], ['dex', 'I can see my biceps again. Hello, boys.']] },
        L: { t: 'lever', id: 'breaker', say: 'Breaker flipped! Scoreboard: Mila 1, Blackout 0.' },
        X: { t: 'exit', link: 'breaker', lockedMsg: 'NO POWER! SOMEBODY FLIP THE BREAKER' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'It\'s so dark. I can\'t see my own biceps.'], ['theo', 'The stairwell lock is electric. No power, no door.'], ['mila', 'Then FIX it, genius. My party starts in two hours!']], hintKeys: H_KEYS('THEO: hold E at the door panel.', 'THEO: hold E at the door panel.') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['juno', 'Why is there a clapper bolted to the wall?'], ['theo', 'My Clap-o-Matic! It runs the trapdoor. And the lights. And possibly my toaster.'], ['dex', 'Why would a STAIRWELL need a trapdoor?'], ['theo', 'Why WOULDN\'T it?']], hintKeys: H_KEYS('JUNO: play music (E) near the Clap-o-Matic.', 'JUNO: play music (E) near the Clap-o-Matic.') },
        C: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'The breaker\'s way up on that ledge.'], ['mila', 'Drainpipe. Easy. The scoreboard says I\'m due.']], hintKeys: H_KEYS('MILA climbs drainpipes: walk into it and hold W.', 'MILA climbs drainpipes: walk into it and hold UP.') },
      },
    },
    {
      name: 'The Basement', slug: 'INT. BELLWEATHER BASEMENT - NIGHT', theme: 'basement', shot: 'building_blackout', dark: true,
      map: [
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '..............................#.......####........#######...', // 2
        '..............................#.......####........#######...', // 3
        '..............................#.......####........#######...', // 4
        '..............................#.......####........#######...', // 5
        '......................l.......#...l...####...l....#######...', // 6
        '..............................#.......####........#######...', // 7
        '..............................#.......####........#######...', // 8
        '.....p........................#.......####........#######...', // 9
        '..............................#.................c.S.cc.*#...', // 10
        '...........c...c........c........c............c===#######...', // 11
        '......................................J......==.............', // 12
        '..@...j..A.^.c.^...B..c..P.Rc.G.x..Uc.V.c..Lc.W......c..c.X.', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
      ],
      ents: {
        B: { t: 'crate', kind: 'box' },
        P: { t: 'plate', heavy: true, id: 'plate4' },
        G: { t: 'door', link: 'plate4', h: 3, kind: 'door' },
        J: { t: 'door', link: 'lev4', w: 4, h: 3, kind: 'shutter' },
        V: { t: 'grate', id: 'vent4' },
        L: { t: 'lever', id: 'lev4', say: 'The shelves are open! ...I meant to do that.' },
        S: { t: 'sounddoor', id: 'secret4', h: 1 },
        X: { t: 'exit' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Mousetraps. Again.'], ['benny', 'Holloway buys them in bulk. It\'s his love language.']] },
        R: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'Heavy door. Heavy plate. Heavy... me?'], ['mila', 'Push the box onto it, Dex. Save your back.'], ['dex', 'My back thanks you. It\'s been through a lot.']], hintKeys: H_KEYS('DEX: push the box onto the red plate to hold the door open.', 'DEX: push the box onto the red plate to hold the door open.') },
        U: { t: 'trigger', w: 2, h: 3, lines: [['benny', 'A vent under the collapsed shelves! This is my moment.'], ['juno', 'Every vent is your moment.']], hintKeys: H_KEYS('BENNY: open the vent (E), crawl through and pull the lever.', 'BENNY: open the vent (E), crawl through and pull the lever.') },
        W: { t: 'trigger', w: 2, h: 3, lines: [['juno', 'That tiny cubby has a music lock. Who BUILDS these?'], ['theo', 'Me. I build these.']] },
      },
    },
    {
      name: 'The Generator Room', slug: 'INT. GENERATOR ROOM - NIGHT', theme: 'boiler', shot: 'building_blackout', dark: true, lightLink: 'gen',
      map: [
        // 0000000000111111111122222222223333333333444444444455
        // 0123456789012345678901234567890123456789012345678901
        '####################################################', // 0
        '####################################################', // 1
        '..................................#................#', // 2
        '..................................#................#', // 3
        '..................................#................#', // 4
        '..................................#................#', // 5
        '..................l...............#.....l..........#', // 6
        '..................................#................#', // 7
        '....l.............................#................#', // 8
        '..........................c.c..c..#................#', // 9
        '..........................======..#................#', // 10
        '....................c.cc...............c......c....#', // 11
        '......................##.............p.............#', // 12
        '..@......A.c..N..c....##.....c.B..U.c.....K...x.rc.#', // 13
        '####################################################', // 14
        '####################################################', // 15
        '####################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'holloway', solve: 'talk', id: 'holloway4', moveTo: -13, vanish: true, face: -1, voice: 'holloway', name: 'MR. HOLLOWAY', expr: 'angry',
          block: 'Rule 47! No tenants in the generator room. ESPECIALLY in a blackout.',
          after: ['Tell NO ONE I suspended a rule.'],
          talk: {
            q: 'What are you hooligans doing in MY basement?',
            opts: [
              { t: 'We heard a noise! Could be a raccoon. A big one.', ok: false, r: 'Raccoons are not permitted in this building. Rule 19.' },
              { t: 'The whole building is dark, Mr. Holloway. Even Roz in 4C.', ok: true, r: '...Roz? Alone? In the DARK? Rule 47 is suspended. Hurry!' },
              { t: 'Can we just... borrow the generator?', ok: false, r: '"Borrow." That\'s what you said about my ladder.' },
            ],
          } },
        U: { t: 'shutter', h: 3, lift: 2 },
        K: { t: 'broken', kind: 'generator', w: 2, h: 2, id: 'gen', r: 14, say: [['theo', 'Generator\'s running! Somebody tell Mila her party is ON.'], ['mila', 'I HEARD THAT! Scoreboard: Mila 1, Darkness 0!']] },
        A: { t: 'trigger', w: 2, h: 3, lines: [['holloway', 'Who goes there?! I have a flashlight and I am NOT afraid to point it!'], ['benny', 'Mr. Holloway? Is that a bathrobe?'], ['holloway', 'It\'s a SMOKING JACKET.']], hintKeys: H_KEYS('PRIYA can talk her way past Mr. Holloway (E).', 'PRIYA can talk her way past Mr. Holloway (E).') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'The generator\'s locked in the cage. Leave the shutter to me.'], ['theo', 'And leave the generator to me. And the toaster jokes to nobody.']], hintKeys: H_KEYS('DEX: lift the shutter (E) and hold it. Switch to THEO to slip under.', 'DEX: lift the shutter (E). Then switch to THEO to slip under.') },
      },
      goal: 'gen',
    },
  ],
  endLine: 'POWER RESTORED!',
});

// =============================================================================
// S1E5  The Rooftop Barbecue
// =============================================================================
EPISODES.push({
  season: 1, num: 5, title: 'The Rooftop Barbecue', music: 'sunny',
  blurb: 'Dex fires up the grill. Holloway fires up Rule 112.',
  rooms: [
    {
      name: 'The Fire Escape', slug: 'EXT. BELLWEATHER FIRE ESCAPE - SUNSET', theme: 'street_eve', shot: 'building_dusk', openTop: true,
      map: [
        // 000000000011111111112222222222
        // 012345678901234567890123456789
        '..............#...............', // 0
        '..............#.............*.', // 1
        '..............#.............M.', // 2
        '..............#.............M.', // 3
        '..............#.............M.', // 4
        '.........w....#.......w.....M.', // 5
        '............c......c........M.', // 6
        '..............G.............M.', // 7
        '.....cX..c..K...c..C..c...c.M.', // 8
        '....====================H====.', // 9
        '........................H.....', // 10
        '........................H.....', // 11
        '........................H.....', // 12
        '....w.......c.......w...H.....', // 13
        '........................H.....', // 14
        '.........cB...N..c...c..H.c...', // 15
        '..=====H====================..', // 16
        '.......H......................', // 17
        '.......H......................', // 18
        '.......H......................', // 19
        '.....c.H......................', // 20
        '.......H....w.......w.........', // 21
        '.....L.Hc.....................', // 22
        '..=.=====M....................', // 23
        '.........M....................', // 24
        '.........M....................', // 25
        '.........M....................', // 26
        '.........M....................', // 27
        '.........M....................', // 28
        '..@T..A..M..cq.c.d..c..h.c.j..', // 29
        '##############################', // 30
        '##############################', // 31
      ],
      ents: {
        T: { t: 'blocks', kind: 'ladder', mode: 'appear', link: 'ladder5', h: 7 },
        L: { t: 'lever', id: 'ladder5', say: 'Ladder\'s down! Scoreboard: Mila 1, Fire Escape 0.' },
        N: { t: 'npc', look: 'pigeonlady', solve: 'talk', id: 'petrakis', moveTo: -4, face: -1, voice: 'npc', name: 'MRS. PETRAKIS', expr: 'smug',
          block: 'This fire escape is MY beach, sweetheart. I am sunbathing.',
          after: ['Mind the geraniums.', 'My pigeons say hello. Coo.'],
          talk: {
            q: 'Nobody gets past me. I am the toll booth of this fire escape.',
            opts: [
              { t: 'We\'ll bring you a burger!', ok: false, r: 'I\'m a vegetarian. So are my pigeons.' },
              { t: 'Mrs. Petrakis, that tan is INCREDIBLE. Is it natural?', ok: true, r: 'Forty years on this fire escape. ...Go on through, sweetheart.' },
              { t: 'The fire department is on its way!', ok: false, r: 'Good. Firemen are my type.' },
            ],
          } },
        G: { t: 'door', link: 'gate5', h: 2, kind: 'bars' },
        K: { t: 'lever', id: 'gate5', say: 'Roof gate open! The Great Benny strikes again!' },
        X: { t: 'exit', link: 'gate5', lockedMsg: 'THE ROOF GATE IS CHAINED' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'Elevator\'s out. Stairwell\'s locked. Roof door\'s chained.'], ['priya', 'Holloway really doesn\'t want us up there.'], ['mila', 'Fire escape. Last one up buys the buns.']], hintKeys: H_KEYS('MILA: climb the drainpipe (hold W) and release the ladder.', 'MILA: climb the drainpipe (hold UP) and release the ladder.') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['juno', 'Is that Mrs. Petrakis? On the fire escape? In a swimsuit?'], ['benny', 'She\'s been up here since 1994. Nobody knows how she gets down.']], hintKeys: H_KEYS('PRIYA can sweet-talk Mrs. Petrakis (E).', 'PRIYA can sweet-talk Mrs. Petrakis (E).') },
        C: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'The roof gate\'s chained shut. The release is on the other side.'], ['benny', 'Those bars are bent at the bottom. Hold my cape.']], hintKeys: H_KEYS('BENNY can crawl under the bent bars and pull the release.', 'BENNY can crawl under the bent bars and pull the release.') },
      },
    },
    {
      name: 'The Roof', slug: 'EXT. BELLWEATHER ROOF - SUNSET', theme: 'roof', shot: 'roof_sunset', openTop: true,
      map: [
        // 0000000000111111111122222222223333333333444444444455555555556666
        // 0123456789012345678901234567890123456789012345678901234567890123
        '................................................................', // 0
        '................................................................', // 1
        '................................................................', // 2
        '................................................................', // 3
        '................................................................', // 4
        '................................................................', // 5
        '................................................................', // 6
        '................................................................', // 7
        '.......................................................c........', // 8
        '................................................................', // 9
        '.....................................................c...j.c.X..', // 10
        '..........c.......c.................c...cc.......c.H############', // 11
        '............S.................F.........##....c....H############', // 12
        'd.@.....A...C..c..t...c...cB..Z..c.a....##..c###v..H############', // 13
        '################################################################', // 14
        '################################################################', // 15
        '################################################################', // 16
      ],
      ents: {
        C: { t: 'crate', kind: 'grill', lockedUntil: 'sargeoff', lockNeed: 'juno', lockMsg: 'Sarge is sunbathing on the grill! JUNO\'s music could lure him off.' },
        S: { t: 'runner', kind: 'sarge', path: [[12, 12], [14, 13], [34, 13], [50, 13], [63, 13]], near: 0, lovesMusic: true, dash: true, vanish: true, speed: 2.6, lureFlag: 'sargeoff',
          lureSay: [['theo', 'He\'s moving! Sarge, this way! Toward the... edge of the roof. Great.'], ['juno', '♪ Run, Sarge, run, the grill is not for fun ♪']] },
        Z: { t: 'plate', w: 2, heavy: true, mark: true, id: 'grillspot' },
        F: { t: 'broken', kind: 'flame', w: 2, h: 1, cond: 'grillspot', id: 'grill5', label: 'Light it (hold)', say: [['theo', 'We have FIRE! Controlled fire! Mostly controlled!'], ['dex', 'Stand back. Grill master coming through.'], ['mila', 'Since when are you a grill master?'], ['dex', 'Since I bought this apron.']] },
        X: { t: 'exit', link: 'grill5', lockedMsg: 'FIRE UP THE GRILL FIRST!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'Behold! The grill!'], ['theo', '...Is that Sarge?'], ['juno', 'He\'s sunbathing. On the grill.'], ['dex', 'It\'s not even ON!']], hintKeys: H_KEYS('JUNO: play (E) to lure Sarge off the grill.', 'JUNO: play (E) to lure Sarge off the grill.') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'X marks the grill spot.'], ['theo', 'Get it on the X and I\'ll light it. Safely. Probably.']], hintKeys: H_KEYS('DEX: push the grill onto the X. THEO: light it (hold E).', 'DEX: push the grill onto the X. THEO: light it (hold E).') },
      },
    },
    {
      name: 'The Water Tower', slug: 'EXT. BELLWEATHER ROOF - NIGHT', theme: 'roof_night', shot: 'roof_night', openTop: true,
      map: [
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '........................................................', // 0
        '........................................................', // 1
        '........................................................', // 2
        '........................................................', // 3
        '........................................................', // 4
        '........................................................', // 5
        '............................................cJ...c.c....', // 6
        '...........................................====H====....', // 7
        '...............................................H........', // 8
        '........................................................', // 9
        '......................................................c.', // 10
        '..........c.........................c...................', // 11
        '........................................................', // 12
        '..@..At...R..ca..c...c.c.W...c...c..E..kB.c..........c..', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
      ],
      ents: {
        R: { t: 'talker', look: 'roz', voice: 'roz', face: 1, lines: ['Darlings! A barbecue! Bertram will have KITTENS.', 'Bertram? Oh. Mr. Holloway. We\'re on a first-name basis now. Don\'t tell anyone.', 'I brought potato salad. It\'s mostly mayonnaise and hope.'] },
        W: { t: 'watcher', look: 'holloway', from: -5, to: 6, range: 6, speed: 0.6, dance: 480, voice: 'holloway',
          lines: ['Rule 112! No open flames!', 'Is that a SPATULA? Back downstairs!', 'I see you! And your coleslaw!', 'Rooftop access is for AUTHORIZED tenants!'],
          danceLines: ['Is that... a cha-cha? On MY roof?', 'My hips are breaking Rule 31!', 'Don\'t tell Roz I can dance. She\'ll want to dance.'] },
        B: { t: 'crate', kind: 'cooler' },
        J: { t: 'broken', kind: 'junction', id: 'lights5', label: 'Wire it (hold)', say: [['theo', 'Party lights: ON! And nothing exploded!'], ['juno', '♪ Nothing exploded, nothing exploded ♪'], ['theo', 'Please don\'t make it a song.']] },
        A: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'Party lights go on the water tower. Then it\'s OFFICIALLY a party.'], ['mila', 'And Holloway\'s patrolling right in front of it.'], ['juno', 'Leave him to me. I\'ve got a cha-cha with his name on it.']], hintKeys: H_KEYS('Holloway catches anyone he sees (except BENNY). JUNO\'s music makes him dance!', 'Holloway catches anyone he sees (except BENNY). JUNO\'s music makes him dance!') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'The ladder\'s too high. Even for me. ESPECIALLY for me.'], ['dex', 'Somebody get me that cooler. I mean... I\'ll get the cooler.']], hintKeys: H_KEYS('DEX: push the cooler under the ladder so THEO can reach it (jump + hold W).', 'DEX: push the cooler under the ladder so THEO can reach it.') },
      },
      extra: [
        { t: 'deco', kind: 'tower', x: 43, y: 13, w: 9, h: 13, walk: 6, back: true },
        { t: 'light', kind: 'string', x: 3, y: 4, w: 19, link: 'lights5', sag: 14 },
        { t: 'light', kind: 'string', x: 22, y: 4, w: 21, link: 'lights5', sag: 12 },
      ],
      goal: 'lights5',
    },
  ],
  endLine: 'LET\'S EAT!',
});

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
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '........................................#...................', // 2
        '........................................#...................', // 3
        '........................................#...................', // 4
        '.................*......................#...................', // 5
        '................===.....................#...................', // 6
        '.....w...........................w......#.......w...........', // 7
        '.....................c..................#...................', // 8
        '....................===.................#...................', // 9
        '........................................#...................', // 10
        '..........c.....c......c.........c............c.....c.......', // 11
        '............................................................', // 12
        '..@......A.P...c..N.cB..Z..c.KcQ...cf.c.G..cx....c..t..c.X..', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
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
        // 0000000000111111111122222222223333333333444444444455555555556666
        // 0123456789012345678901234567890123456789012345678901234567890123
        '################################################################', // 0
        '################################################################', // 1
        '...............................##########...........#...........', // 2
        '...............................##########...........#...........', // 3
        '...............................##########...........#...........', // 4
        '...............................##########...........#...........', // 5
        '...............................##########...........#...........', // 6
        '...............................##########...........#........###', // 7
        '................cc.............##########...........#........###', // 8
        '......y.........==......y......##########....y......#...y....###', // 9
        '...............................##########...........#........###', // 10
        '..........c....c...c......................c...........c....c.###', // 11
        '..............=======...............................G........###', // 12
        '..@.....A...Sc.......c..c..c.C...B.c..c....E..Vc.W.cU.L.X.c..###', // 13
        '######################{{{{{{{{##################################', // 14
        '################################################################', // 15
        '################################################################', // 16
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
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '########################################################', // 0
        '########################################################', // 1
        '.................................#......................', // 2
        '.................................#......................', // 3
        '.................................#......................', // 4
        '.................................#......................', // 5
        '.................................#......................', // 6
        '.....w............w..............#..................w...', // 7
        '.................................#......................', // 8
        '.......................c.........#......................', // 9
        '......................===........#......................', // 10
        '..........c.....c...........c.......c........c......c...', // 11
        '.................................G......................', // 12
        '..@.....A...cN...C...c...cB..Z.fcV.L.Ec....Y...K..c..fc.', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
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
        // 0000000000111111111122222222223333333333444444444455
        // 0123456789012345678901234567890123456789012345678901
        '####################################################', // 0
        '####################################################', // 1
        '.............................................#......', // 2
        '.............................................#......', // 3
        '.............................................#......', // 4
        '.............................................#......', // 5
        '.............................................#......', // 6
        '.......................i.......i.......i.....#......', // 7
        '..........l...................l..............#......', // 8
        '.............................................#......', // 9
        '.............................................#......', // 10
        '...........c.....c......c.......c........c..c.....c.', // 11
        '....................................................', // 12
        '..@...A..C...Z.Bc..P..c...WQ..c....R..c.E..K.GfcX.c.', // 13
        '####################################################', // 14
        '####################################################', // 15
        '####################################################', // 16
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
        // 0000000000111111111122222222223333333333444444444455
        // 0123456789012345678901234567890123456789012345678901
        '####################################################', // 0
        '####################################################', // 1
        '....................................................', // 2
        '....................................................', // 3
        '....................................................', // 4
        '..................................cL................', // 5
        '................i..........o.....M##................', // 6
        '..........w......................M##........w.......', // 7
        '.................................M##...*c...........', // 8
        '.................................M##..===...........', // 9
        '.................................M##................', // 10
        '..........c.....c....c......c.c..M##........c.......', // 11
        '............................===..M##................', // 12
        '..@..a..A...c.K....F....Z.c..B...M##.c....t...c..X..', // 13
        '####################################################', // 14
        '####################################################', // 15
        '####################################################', // 16
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
        // 0000000000111111111122222222223333333333444444444455
        // 0123456789012345678901234567890123456789012345678901
        '####################################################', // 0
        '####################################################', // 1
        '....................#...............................', // 2
        '....................#...............................', // 3
        '....................#...............................', // 4
        '....................#...............................', // 5
        '....................#................o..............', // 6
        '.....i........w.....#.....i......cKc................', // 7
        '....................#............===................', // 8
        '....................#..........c....................', // 9
        '....................#.........##....................', // 10
        '..........c.......c....c...c..##..........c....c..c.', // 11
        '....................G......##.##....................', // 12
        '..@.....A...N..c....V.L.Ec.##.##......c.F..W.R..B.f.', // 13
        '####################################################', // 14
        '####################################################', // 15
        '####################################################', // 16
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

// =============================================================================
// S2E2  The Magic Show Disaster
// =============================================================================
EPISODES.push({
  season: 2, num: 2, title: 'The Magic Show Disaster', music: 'magic',
  blurb: 'The Great Bennini\'s first real show. The rabbit has other plans.',
  rooms: [
    {
      name: 'Backstage', slug: 'INT. THE RIALTO - BACKSTAGE - NIGHT', theme: 'backstage', shot: 'theater_night',
      map: [
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '............................................................', // 2
        '.........................................cc.*...............', // 3
        '.......................................M======..............', // 4
        '.......................................M....................', // 5
        '....................c..c..K..c.........M....................', // 6
        '...................============........M....................', // 7
        '.......................................M....................', // 8
        '..................c....................M............n.......', // 9
        '.......................................M....................', // 10
        '..........c....c................c.....cM..........c.....c...', // 11
        '.......................................M....................', // 12
        '..@..x..A...N..B.S....j.......E..C..c..M....Z..cx....c...X..', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'stagehand', solve: 'talk', id: 'stagemgr', moveTo: 12, vanish: true, face: -1, voice: 'npc', name: 'STAGE MANAGER', expr: 'angry',
          block: 'No laminate, no backstage!',
          talk: {
            q: 'Laminates. Lanyards. Credentials. You have NONE of these things.',
            opts: [
              { t: 'I left my laminate in my other jacket.', ok: false, r: 'Classic. Heard it four hundred times. No.' },
              { t: 'Benny says you\'re the only one who can make this show work.', ok: true, r: '...He said that? Nobody EVER says that. Go! Break a leg!' },
              { t: 'Do you know who I am?', ok: false, r: 'No. And judging by that face, neither do you.' },
            ],
          } },
        S: { t: 'spring', w: 2, kind: 'trampoline' },
        K: { t: 'broken', kind: 'spot', id: 'spot8', say: [['theo', 'Spotlight\'s working! It was a loose bulb. I tightened it. With FEELING.'], ['benny', 'My spotlight! I have a SPOTLIGHT!']] },
        C: { t: 'crate', kind: 'tophat' },
        Z: { t: 'plate', w: 2, heavy: true, mark: true, id: 'hat8' },
        X: { t: 'exit', link: 'spot8&hat8', lockedMsg: 'SPOTLIGHT AND TOP HAT FIRST!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['benny', 'My first REAL show. At the Rialto. With an AUDIENCE.'], ['mila', 'How many tickets did you sell?'], ['benny', 'Eleven. Six are you guys.']], hintKeys: H_KEYS('PRIYA: get past the stage manager (E).', 'PRIYA: get past the stage manager (E).') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'A trampoline! For the acrobat act.'], ['dex', 'There\'s an acrobat act?'], ['benny', 'There is now.']], hintKeys: H_KEYS('Jump on the TRAMPOLINE to reach the catwalk. THEO: fix the spotlight.', 'Jump on the TRAMPOLINE to reach the catwalk. THEO: fix the spotlight.') },
        E: { t: 'trigger', w: 2, h: 3, lines: [['dex', 'A giant top hat. Of course I\'m moving a giant top hat.'], ['benny', 'It goes on the stage lift. Gently! It has feelings. And a rabbit.']], hintKeys: H_KEYS('DEX: push the top hat onto the stage lift (X).', 'DEX: push the top hat onto the stage lift (X).') },
      },
    },
    {
      name: 'Under the Stage', slug: 'INT. THE RIALTO - UNDER THE STAGE - NIGHT', theme: 'backstage', shot: 'theater_night', dark: true,
      map: [
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '########################################################', // 0
        '########################################################', // 1
        '......................................#.................', // 2
        '......Y.................Y.............#.....Y...........', // 3
        '................................cc....#.................', // 4
        '...............................===....#.................', // 5
        '......................................#.................', // 6
        '......................c..c..c.........#.................', // 7
        '....................###########.......#.................', // 8
        '..................c.###########.......#.................', // 9
        '....................###########.......#.................', // 10
        '..........c...c.....###########....c......c.......c.....', // 11
        '....................###########.......G.................', // 12
        '..@.....A..R..x..S.....c...c......B..cV.L....K.c.x...X..', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
      ],
      ents: {
        R: { t: 'runner', kind: 'rabbit', path: [[11, 13], [19, 13], [26, 13], [34, 13], [41, 13], [50, 13]], near: 4, speed: 2.2, catchable: true, id: 'rabbit8',
          taunts: ['*judgmental nose wiggle*', '*thump thump*', '*rabbit noises*'],
          say: [['benny', 'Professor Fluffington! You\'re safe! You\'re... chewing my cape.'], ['juno', 'He\'s a critic.']] },
        S: { t: 'spring', w: 2, kind: 'trampoline' },
        G: { t: 'door', link: 'motordoor8', h: 2, kind: 'door' },
        V: { t: 'grate', id: 'vent8' },
        L: { t: 'lever', id: 'motordoor8', say: 'Door\'s open! The Great Bennini walks through walls! ...Through vents. Same thing.' },
        K: { t: 'broken', kind: 'motor', id: 'lift8', say: [['theo', 'Lift motor\'s purring. Like the rabbit. Do rabbits purr?'], ['benny', 'Professor Fluffington does.']] },
        X: { t: 'exit', link: 'rabbit8&lift8', lockedMsg: 'CATCH THE RABBIT AND FIX THE LIFT!' },
        Y: { t: 'light', kind: 'hang', r: 6 },
        A: { t: 'trigger', w: 2, h: 3, lines: [['benny', 'Professor Fluffington escaped through the trapdoor!'], ['dex', 'Your rabbit is named PROFESSOR?'], ['benny', 'He has a doctorate in being adorable.']] },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'The motor room is locked. And the lift won\'t run without the motor.'], ['benny', 'Locked doors are just doors that haven\'t met me.']], hintKeys: H_KEYS('BENNY: open the vent and the motor room. THEO: fix the lift motor. Then catch the rabbit!', 'BENNY: open the vent and the motor room. THEO: fix the lift motor. Then catch the rabbit!') },
      },
    },
    {
      name: 'The Stage', slug: 'INT. THE RIALTO - ON STAGE - NIGHT', theme: 'theater', shot: 'theater_night',
      map: [
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '............................................................', // 2
        '............................................................', // 3
        '.......................c..cL.c..............................', // 4
        '......................=========.............................', // 5
        '............................................................', // 6
        '............................................................', // 7
        '............................................................', // 8
        '....n................c.................................n....', // 9
        '............................................................', // 10
        '..........c.......................c.......c..........c......', // 11
        '............................................................', // 12
        '..@.....A....N..cB..S...........C...Ec..Z...K.c...Q.....c...', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'critic', solve: 'talk', id: 'heckler', moveTo: -9, vanish: true, face: -1, voice: 'npc', name: 'HECKLER', expr: 'smug',
          block: 'BOOO! Bring back the juggler!',
          talk: {
            q: 'I paid good money for this show! ...Well. Someone did. BOOO!',
            opts: [
              { t: 'Sir, you got in free.', ok: false, r: 'Then I want my free back! BOOO!' },
              { t: 'Volunteer! The Great Bennini needs a brave volunteer for the SAW trick!', ok: true, r: 'The... saw trick? I\'ll just... sit down now. Quietly.' },
              { t: 'Please be nice. It\'s his first show.', ok: false, r: 'Nice? I\'m a CRITIC. Nice is for amateurs.' },
            ],
          } },
        S: { t: 'spring', w: 2, kind: 'trampoline' },
        L: { t: 'lever', id: 'spot8b', say: 'Spotlight aimed! Scoreboard: Mila 1, Gravity 0.' },
        C: { t: 'crate', kind: 'magicbox' },
        Z: { t: 'plate', w: 2, heavy: true, mark: true, id: 'box8' },
        K: { t: 'broken', kind: 'panel', id: 'trap8', label: 'Fix trapdoor (hold)', say: [['theo', 'Trapdoor\'s fixed! It drops you gently onto a mattress. I tested it. On Dex.'], ['dex', 'I volunteered!']] },
        Q: { t: 'sensor', kind: 'drums', w: 2, h: 2, id: 'trick', cond: 'box8&trap8&spot8b', notReady: [['juno', 'Not yet! Box on the X, trapdoor fixed, spotlight aimed. THEN the drumroll.']], sayWho: 'benny', say: 'And now... the Great Bennini... DISAPPEARS!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Full house! Eleven people!'], ['mila', 'And one heckler.']], hintKeys: H_KEYS('PRIYA: deal with the heckler (E).', 'PRIYA: deal with the heckler (E).') },
        B: { t: 'trigger', w: 2, h: 3, lines: [['benny', 'The spotlight up on the fly rail needs aiming. It\'s really high.'], ['mila', 'Really high is my favorite height.']], hintKeys: H_KEYS('MILA: bounce on the trampoline and double-jump (E) at the top to reach the fly rail.', 'MILA: bounce on the trampoline and double-jump at the top to reach the fly rail.') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['benny', 'The box goes on the trapdoor. Theo fixes the trapdoor. Juno gives me a drumroll. And I... vanish.'], ['dex', 'And this has worked before?'], ['benny', 'Define "worked."']], hintKeys: H_KEYS('DEX: box on the X. THEO: fix the trapdoor. JUNO: drumroll at the drums!', 'DEX: box on the X. THEO: fix the trapdoor. JUNO: drumroll at the drums!') },
      },
      goal: 'trick',
    },
  ],
  endLine: 'TA-DA!',
});

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
        // 0000000000111111111122222222223333333333444444444455555555556666
        // 0123456789012345678901234567890123456789012345678901234567890123
        '################################################################', // 0
        '################################################################', // 1
        '...........................#....................................', // 2
        '...........................#....................................', // 3
        '...........................#....................................', // 4
        '...........................#....................................', // 5
        '...........................#....................................', // 6
        '...........................#....................................', // 7
        '...........................#....................................', // 8
        '.....n.............n.......#...n...........cc.......n...........', // 9
        '...........................#...............==...................', // 10
        '..........c.............c..#.c........c.............c.....c.....', // 11
        '................................................................', // 12
        '..@.....A...N...c..c..cB.K.G....cq.C.k..P........c.....cj....X..', // 13
        '###############{{{{{{{{#################........################', // 14
        '########################################........################', // 15
        '########################################........################', // 16
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
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '..........................................#.................', // 2
        '.........................c.c.*.c.c........#.................', // 3
        '.......................M==========M.......#.................', // 4
        '.......................M..........M.......#.................', // 5
        '.......................M..........M.......#.................', // 6
        '......w.....w..........M..........M.......#.....w.....w.....', // 7
        '.......................M..........M.......#.................', // 8
        '.......................M....w.....M.......#.................', // 9
        '.......................M..........M.......#.................', // 10
        '..........c.........c..M..........M.c.......c....c.....c....', // 11
        '.......................M..........M...........#######.......', // 12
        '..@.....A...c.N.O.Q...cM..........M...B.c.U....c.c.c.....X..', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
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
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '########################################################', // 0
        '########################################################', // 1
        '....................#..........#........................', // 2
        '....................#..........#..................Y.....', // 3
        '....Y...............#.....Y....#.....Y..................', // 4
        '....................#..........#....................c...', // 5
        '....................#..........#........................', // 6
        '....................#..........#.............c.Z..c..X..', // 7
        '....................#..........#...........#############', // 8
        '...................cV..........#........c..#############', // 9
        '.................===#..........#...........#############', // 10
        '...............c.c.....c...c.....c.........#############', // 11
        '...............##..........................#############', // 12
        '..@...A...N.cx.##...G.L..C..xc.J..B.c.K.P..#############', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
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

// =============================================================================
// S2E4  The Invention Expo
// =============================================================================
EPISODES.push({
  season: 2, num: 4, title: 'The Invention Expo', music: 'expo',
  blurb: 'Tidy-Bot vs. the Kessler-Matic 9000. Tidy-Bot has left the booth.',
  rooms: [
    {
      name: 'The Expo Floor', slug: 'INT. CITY INVENTION EXPO - DAY', theme: 'expo', shot: 'expo_day',
      map: [
        // 0000000000111111111122222222223333333333444444444455555555556666
        // 0123456789012345678901234567890123456789012345678901234567890123
        '################################################################', // 0
        '################################################################', // 1
        '...................................#.....########...............', // 2
        '...................................#.....########.....c.*c......', // 3
        '...................................#.....########....M====......', // 4
        '...................................#.....########....M..........', // 5
        '...................................#.....########....M..........', // 6
        '...................................#.....########....M..........', // 7
        '...................................#.....########....M..........', // 8
        '......................n........n...#.....########.n..M..........', // 9
        '...................................#.....########....M..........', // 10
        '..........c..............c......c....c............c..M.....c....', // 11
        '.....................................................M..........', // 12
        '..@.....A.....R..c..c..cB..N..c....S..E.c.C..c.......M.......X..', // 13
        '################}}}}}}}}########################################', // 14
        '################################################################', // 15
        '################################################################', // 16
      ],
      ents: {
        R: { t: 'runner', kind: 'robot', voice: 'robot', path: [[14, 13], [22, 13], [30, 13], [38, 13], [47, 13], [63, 13]], near: 5, speed: 2.6, vanish: true,
          taunts: ['BEEP. CLEANING.', 'MESS DETECTED: EVERYTHING.', 'BOOP. BOOP. BOOP.', 'TIDY-BOT IS FREE.'] },
        N: { t: 'npc', look: 'security', solve: 'talk', id: 'guard10', moveTo: 10, vanish: true, face: -1, voice: 'npc', name: 'EXPO SECURITY', expr: 'neutral',
          block: 'Exhibitors only past this point.',
          talk: {
            q: 'Badge? Lanyard? Anything with a barcode on it?',
            opts: [
              { t: 'Our badge was in the robot. The robot left.', ok: false, r: 'That\'s the saddest thing I\'ve heard today. Still no.' },
              { t: 'We ARE the invention.', ok: false, r: 'Then you need a badge AND a patent.' },
              { t: 'Dr. Kessler sent us. He wants his lab coat steamed. AGAIN.', ok: true, r: 'Ugh. Kessler. Go, before he yells at me again.' },
            ],
          } },
        S: { t: 'sounddoor', id: 'vdoor10', h: 3 },
        C: { t: 'crate', kind: 'display' },
        X: { t: 'exit' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'TIDY-BOT! Come back! You\'re supposed to be WINNING!'], ['mila', 'He\'s fast. I respect him.'], ['dex', 'He\'s got the right idea. Expos are exhausting.']] },
        B: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Security. Let me handle it.']], hintKeys: H_KEYS('PRIYA: talk your way past security (E).', 'PRIYA: talk your way past security (E).') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['juno', '"Kessler\'s Voice-Activated Door." It opens for a perfect high C.'], ['juno', 'Stand back. I was BORN for this.'], ['dex', 'And there\'s a robot butler stuck in that aisle.']], hintKeys: H_KEYS('JUNO: sing to the door (E). DEX: push the Robo-Butler out of the aisle.', 'JUNO: sing to the door (E). DEX: push the Robo-Butler out of the aisle.') },
      },
    },
    {
      name: 'Kessler\'s Booth', slug: 'INT. EXPO - KESSLER LABS BOOTH - DAY', theme: 'expo', shot: 'expo_day',
      map: [
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '########################################################', // 0
        '########################################################', // 1
        '......................#......................#..........', // 2
        '......................#......................#..........', // 3
        '.................ccL..#......................#..........', // 4
        '................M===..#......................#..........', // 5
        '................M.....#......................#..........', // 6
        '................M.....#......................#..........', // 7
        '....n...........M.....#..........n...........#...n......', // 8
        '................M.....#......................#..........', // 9
        '................M.....#.................................', // 10
        '.........c.....cM...c......c........c......c.......c....', // 11
        '................M.......................................', // 12
        '..@....A...N.c..M.....T.c.B.x.K..c...E.c.Q...G..c....X..', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'inventor', solve: 'talk', id: 'kessler', moveTo: -10, vanish: true, face: -1, voice: 'npc', name: 'DR. KESSLER', expr: 'smug',
          block: 'Ah. Theodore. Here to lose AGAIN?',
          talk: {
            q: 'My Kessler-Matic 9000 will win. Your little vacuum doesn\'t stand a chance.',
            opts: [
              { t: 'Tidy-Bot is NOT a vacuum!', ok: false, r: 'It vacuumed my SHOES, Theodore.' },
              { t: 'Dr. Kessler! The judges want an interview. They said you\'re a GENIUS.', ok: true, r: 'FINALLY, someone noticed! Out of my way!' },
              { t: 'Can we borrow your tesla coils?', ok: false, r: 'BORROW? Those coils cost more than your apartment!' },
            ],
          } },
        L: { t: 'lever', id: 'coils10', say: 'Tesla coils: OFF! Scoreboard: Mila 1, Electricity 0.' },
        T: { t: 'hazard', kind: 'tesla', h: 3, link: 'coils10' },
        K: { t: 'broken', kind: 'safe', id: 'remote10', label: 'Pick the lock (hold)', say: [['theo', 'Got it! Tidy-Bot\'s remote! Kessler STOLE it!'], ['priya', 'Rivalry. In a lab coat. Classic.']] },
        Q: { t: 'sensor', kind: 'dog', id: 'dog10', sayWho: 'juno', say: '♪ Hush little robo-dog ♪ ...It\'s asleep. Aww.' },
        G: { t: 'door', kind: 'gate', h: 4, link: 'dog10' },
        X: { t: 'exit', link: 'remote10', lockedMsg: 'GET TIDY-BOT\'S REMOTE FIRST!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'Kessler\'s booth. He took Tidy-Bot\'s remote. I KNOW he did.'], ['juno', 'Is that a tesla fence? At an EXPO?'], ['theo', 'That\'s Kessler. Safety third.']], hintKeys: H_KEYS('PRIYA: distract Dr. Kessler (E).', 'PRIYA: distract Dr. Kessler (E).') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['mila', 'Fence is off! The remote must be in that display case.']], hintKeys: H_KEYS('THEO: pick the display case lock (hold E).', 'THEO: pick the display case lock (hold E).') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['benny', 'A robot dog. Guarding the exit. It looks... grumpy.'], ['juno', 'Every dog loves a lullaby.']], hintKeys: H_KEYS('JUNO: play a lullaby (E) for the robo-dog.', 'JUNO: play a lullaby (E) for the robo-dog.') },
      },
      extra: [
        { t: 'trigger', x: 13, y: 13, w: 2, h: 3, cond: 'kessler', lines: [['mila', 'Tesla fence. Power switch is up on that truss.'], ['mila', 'Up is my favorite direction.']], hintKeys: H_KEYS('MILA: climb the truss (hold W) and flip the switch.', 'MILA: climb the truss (hold UP) and flip the switch.') },
      ],
    },
    {
      name: 'The Main Stage', slug: 'INT. EXPO - MAIN STAGE - DAY', theme: 'expo', shot: 'expo_day', amp: 'speaker10',
      map: [
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '............................................................', // 2
        '.....................................cRc....................', // 3
        '....................................====M...................', // 4
        '........................................M...................', // 5
        '........................................M...................', // 6
        '........................................M...................', // 7
        '.....n..................................M.....n.............', // 8
        '........................................M...................', // 9
        '........................................M...................', // 10
        '..........c.....c.........c.......c.....M....c.......c......', // 11
        '........................................M...................', // 12
        '..@.....A...N..c...C....Bc..K.c.E.......M.c......c..x...c...', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'judge', solve: 'talk', id: 'judge10', moveTo: -9, vanish: true, face: -1, voice: 'npc', name: 'THE JUDGE', expr: 'neutral',
          block: 'Judging begins in five minutes.',
          talk: {
            q: 'Where is your invention? I can\'t judge an empty booth. I\'ve tried.',
            opts: [
              { t: 'It\'s an invisible invention. Very cutting-edge.', ok: false, r: 'Kessler tried that one in 2019.' },
              { t: 'It\'s on the lighting truss. It\'s doing a... live demo.', ok: true, r: 'A LIVE demo? How bold! Get it down here. Carefully!' },
              { t: 'It\'s in the bathroom.', ok: false, r: 'Robots don\'t... you know what, I don\'t want to know.' },
            ],
          } },
        C: { t: 'crate', kind: 'kmachine' },
        K: { t: 'broken', kind: 'speaker', h: 2, id: 'speaker10', say: [['theo', 'Stage speakers are ON. Juno, you\'re amplified!'], ['juno', 'Every musician\'s dream. And nightmare.']] },
        R: { t: 'runner', kind: 'robot', voice: 'robot', path: [[38, 3], [42, 13]], near: 0, lovesMusic: true, catchable: true, goal: true, id: 'bot10', gate: 'speaker10&!cable10', speed: 2.2,
          lureSay: [['robot', 'MUSIC DETECTED. MUST... DANCE.'], ['theo', 'He\'s coming down! He LOVES jazz! I programmed that by accident!']],
          say: [['theo', 'Gotcha! Tidy-Bot, you\'re grounded. Well. You\'re ALWAYS grounded. You\'re a robot.'], ['robot', 'BEEP. SORRY. BOOP.']] },
        A: { t: 'trigger', w: 2, h: 3, lines: [['theo', 'There he is! On top of the lighting truss!'], ['juno', 'He loves music. If the stage speakers worked, I could sing him down.']], hintKeys: H_KEYS('PRIYA: talk to the judge (E).', 'PRIYA: talk to the judge (E).') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['dex', 'Kessler parked his machine right on the stage power cable.'], ['theo', 'Of course he did.']], hintKeys: H_KEYS('DEX: push the Kessler-Matic off the power cable. THEO: fix the speakers.', 'DEX: push the Kessler-Matic off the power cable. THEO: fix the speakers.') },
        E: { t: 'trigger', w: 2, h: 3, any: true, cond: 'speaker10', lines: [['juno', 'Speakers are live. Tidy-Bot, this one\'s for you.']], hintKeys: H_KEYS('JUNO: play (E) to bring Tidy-Bot down, then catch him!', 'JUNO: play to bring Tidy-Bot down, then catch him!') },
      },
      extra: [
        { t: 'plate', x: 19, y: 13, w: 2, heavy: true, id: 'cable10' },
        { t: 'deco', kind: 'podium', x: 47, y: 13, w: 3, h: 3, dy: 8, back: true },
      ],
      goal: 'bot10',
    },
  ],
  endLine: 'FIRST PRIZE!',
});

// =============================================================================
// S2E5  Snow Day
// =============================================================================
EPISODES.push({
  season: 2, num: 5, title: 'Snow Day', music: 'snow',
  blurb: 'A blizzard. The café boiler is dead. Gus is acting strange.',
  rooms: [
    {
      name: 'Larkspur Street', slug: 'EXT. LARKSPUR STREET - BLIZZARD', theme: 'snow', shot: 'cafe_snow', openTop: true,
      map: [
        // 0000000000111111111122222222223333333333444444444455555555556666
        // 0123456789012345678901234567890123456789012345678901234567890123
        '................................................................', // 0
        '................................................................', // 1
        '................................................................', // 2
        '................................................................', // 3
        '................................................................', // 4
        '................................................................', // 5
        '................................................................', // 6
        '................................................................', // 7
        '................................................................', // 8
        '...............................................c*c..............', // 9
        '..............................................####..............', // 10
        '................c......c........c....c....c.........c...........', // 11
        '............c...................................................', // 12
        '..@....A..c.q.c.....N....Bc.O.Q..E.K...F..h..c.........q.jc.X...', // 13
        '#########IIIIIII############################IIIIII##############', // 14
        '################################################################', // 15
        '################################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'snowkid', solve: 'talk', id: 'kid11', moveTo: -3, face: -1, voice: 'npc', name: 'KID IN A FORT', expr: 'smug',
          block: 'HALT! This sidewalk belongs to Fort Awesome!',
          after: ['Fort Awesome thanks you for your business.', 'Gus better have marshmallows.'],
          talk: {
            q: 'Nobody passes Fort Awesome without the password.',
            opts: [
              { t: 'Please?', ok: false, r: '"Please" is NOT the password. It\'s not even CLOSE.' },
              { t: 'Free hot chocolate at the Daily Grind. For a week.', ok: true, r: '...With marshmallows? DEAL. Fort Awesome salutes you.' },
              { t: 'Snowball?', ok: false, r: 'That was LAST week\'s password. Rookie.' },
            ],
          } },
        O: { t: 'npc', look: 'caroler', seed: 1, solve: 'music', id: 'carol1', moveTo: 30, vanish: true, face: -1, voice: 'npc', name: 'CAROLER', expr: 'happy',
          block: '♪ Fa la la la... la? ♪ We forgot the next part.', won: '♪ LA LA LA LA! ♪ THAT\'S the part!' },
        Q: { t: 'npc', look: 'caroler', seed: 2, solve: 'music', id: 'carol2', moveTo: 28, vanish: true, face: -1, voice: 'npc', name: 'CAROLER', expr: 'happy',
          block: '♪ Hmm hmm hmm... ♪ Nobody knows the words.', won: 'A harmony! Ethel, she found the HARMONY!' },
        K: { t: 'broken', kind: 'snowplow', w: 2, h: 2, id: 'plow11', label: 'Start it (hold)', say: [['theo', 'Snowplow\'s running! Stand back!'], ['dex', 'Theo, nobody\'s driving it.'], ['theo', '...Stand BACK.']] },
        F: { t: 'door', kind: 'snow', h: 5, link: 'plow11' },
        X: { t: 'exit' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Gus called. The café boiler is dead. If the pipes freeze, the café\'s finished.'], ['dex', 'Then we march! Through the blizzard! ...Is that a kid in a FORT?']], hintKeys: H_KEYS('PRIYA: negotiate with the kid in the fort (E). Careful on the ice!', 'PRIYA: negotiate with the kid in the fort. Careful on the ice!') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['juno', 'Carolers! And they forgot the words. Amateurs.'], ['mila', 'Juno, no.'], ['juno', 'Juno, YES.']], hintKeys: H_KEYS('JUNO: play (E) and join the carolers.', 'JUNO: play and join the carolers.') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'A stalled snowplow! And a snowdrift the size of a bus.'], ['theo', 'Five minutes. Maybe four.']], hintKeys: H_KEYS('THEO: get the snowplow running (hold E).', 'THEO: get the snowplow running (hold E).') },
      },
      extra: [
        { t: 'deco', kind: 'fort', x: 17, y: 13, w: 3, h: 1, back: true },
      ],
    },
    {
      name: 'The Alley', slug: 'EXT. ALLEY BEHIND THE DAILY GRIND - BLIZZARD', theme: 'alley', shot: 'alley_snow', openTop: true,
      map: [
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '............................................................', // 0
        '............................................................', // 1
        '............................................................', // 2
        '............................................................', // 3
        '................................................c.c.c.......', // 4
        '...............................................M=====.......', // 5
        '............w............w.............w.......M............', // 6
        '...............................................M............', // 7
        '...............................................M............', // 8
        '...............................................M............', // 9
        '...............................................M............', // 10
        '.............c...................c.............M............', // 11
        '...............................................M............', // 12
        '..@.j....Ac...S..c..c..W..c..T.c.jU...c..c.V...M..B.c.K..X..', // 13
        '######IIIIIII###############################################', // 14
        '############################################################', // 15
        '############################################################', // 16
      ],
      ents: {
        S: { t: 'hideout', kind: 'snowman' },
        T: { t: 'hideout', kind: 'snowman' },
        U: { t: 'hideout', kind: 'snowman' },
        W: { t: 'watcher', look: 'snowkid', from: -3, to: 3, range: 5, speed: 0.5, dance: 900, hit: 'splash', voice: 'npc', name: 'SNOWBALL SNIPER',
          lines: ['SNOWBALL!', 'Bullseye!', 'Fort Awesome strikes again!', 'Gotcha! Ha!'],
          danceLines: ['Is that a jingle? I LOVE jingles!', 'Okay, okay, truce! This song slaps.', 'My feet are dancing on their OWN!'] },
        V: { t: 'watcher', look: 'snowkid', from: -3, to: 3, range: 5, speed: 0.5, dance: 900, hit: 'splash', voice: 'npc', name: 'SNOWBALL SNIPER',
          lines: ['Incoming!', 'Snowball to the face!', 'You\'re OUT!'],
          danceLines: ['A snow day DANCE BREAK!', 'I can\'t throw and dance at the same time!'] },
        K: { t: 'broken', kind: 'panel', id: 'thaw11', label: 'Thaw (hold)', say: [['theo', 'Lock thawed! Hair dryer, extension cord, and a little prayer.']] },
        X: { t: 'exit', link: 'thaw11', lockedMsg: 'THE CELLAR LOCK IS FROZEN SOLID' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'Snowball snipers. Fort Awesome has an alley division.'], ['benny', 'They can\'t hit what they can\'t see.'], ['juno', 'And nobody throws snowballs during a jingle.']], hintKeys: H_KEYS('Snipers hit anyone they see (except BENNY). Hide in snowmen (E) or let JUNO play!', 'Snipers hit anyone they see (except BENNY). Hide in snowmen or let JUNO play!') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'Cellar door\'s lock is frozen solid. Good thing I brought a hair dryer.'], ['priya', 'Why do you HAVE a hair dryer?'], ['theo', 'For emergencies. And my hair.']], hintKeys: H_KEYS('THEO: thaw the cellar lock (hold E).', 'THEO: thaw the cellar lock (hold E).') },
      },
    },
    {
      name: 'The Boiler Room', slug: 'INT. DAILY GRIND - BOILER ROOM - NIGHT', theme: 'boiler', shot: 'cafe_snow', dark: true, lightLink: 'boiler11',
      map: [
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '########################################################', // 0
        '########################################################', // 1
        '.......................#############....................', // 2
        '.......................#############....................', // 3
        '....Y.........Y........#############......Y.........Y...', // 4
        '......................c....c...c...c....................', // 5
        '.....................==#############....................', // 6
        '.....................c.#############....................', // 7
        '....................===#############....................', // 8
        '...................c...#############....................', // 9
        '..................===..#############....................', // 10
        '............c...c...........c...........c.........c.....', // 11
        '................##......................................', // 12
        '..@....A..G.....##...V.J..C....S..c...L..B..c.K...x..c..', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
      ],
      ents: {
        G: { t: 'talker', look: 'gus', voice: 'gus', face: 1, lines: ['I can\'t feel my mustache.', 'Listen... after this, I need to tell you all something.', 'It\'s nothing. Fix the boiler. We\'ll talk later.'] },
        V: { t: 'lever', kind: 'valve', id: 'valve11', say: 'Steam valve shut! I\'m basically a plumber now.' },
        S: { t: 'hazard', kind: 'steam', h: 3, link: 'valve11', always: true },
        J: { t: 'door', kind: 'door', h: 3, link: 'pilot11' },
        C: { t: 'crate', kind: 'boxes2' },
        L: { t: 'lever', id: 'pilot11', say: 'Pilot light\'s lit! And the door latch was right here. Magic!' },
        K: { t: 'broken', kind: 'boiler', w: 2, h: 3, id: 'boiler11', say: [['theo', 'Boiler\'s ALIVE! Heat in three, two, one...'], ['gus', 'I can feel my mustache again!']] },
        Y: { t: 'light', kind: 'hang', r: 5 },
        A: { t: 'trigger', w: 2, h: 3, lines: [['gus', 'You came. In a BLIZZARD. You idiots. Thank you.'], ['benny', 'The boiler room door is latched from the inside. But there\'s a duct up top...']], hintKeys: H_KEYS('BENNY: climb the shelves and crawl through the duct.', 'BENNY: climb the shelves and crawl through the duct.') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'There she is. The old girl. Built in 1952. Fixed by me in... let\'s say now.']], hintKeys: H_KEYS('Shut the steam VALVE, DEX clears the water heater, THEO fixes the boiler.', 'Shut the steam valve, DEX clears the water heater, THEO fixes the boiler.') },
      },
      goal: 'boiler11',
    },
  ],
  endLine: 'HEAT IS ON!',
});

// =============================================================================
// S2E6  The Airport Dash (season finale)
// =============================================================================
EPISODES.push({
  season: 2, num: 6, title: 'The Airport Dash', music: 'rush',
  blurb: 'Gus sold the café. Flight 88 leaves at 3:00 from Gate 47. It is 2:15.',
  rooms: [
    {
      name: 'Terminal B', slug: 'INT. TERMINAL B - 2:31 PM', theme: 'airport', shot: 'airport_day',
      map: [
        // 0000000000111111111122222222223333333333444444444455555555556666
        // 0123456789012345678901234567890123456789012345678901234567890123
        '################################################################', // 0
        '################################################################', // 1
        '..............................#########.........................', // 2
        '..............................#########.........................', // 3
        '..............................#########.........c*c.............', // 4
        '..............................#########.......M====.............', // 5
        '..............................#########.......M.................', // 6
        '..............................#########.......M.................', // 7
        '..............................#########.......M.................', // 8
        '..............................#########.......M.................', // 9
        '..............................#########.......M.................', // 10
        '..................c.......c.............c.....M......c..........', // 11
        '..............................................M.................', // 12
        '..@....A..c..c..c....N..c..B...C..c..c....E.c.M.........j.c..X..', // 13
        '#########}}}}}}}}###############################################', // 14
        '################################################################', // 15
        '################################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'security', solve: 'talk', id: 'tsa12', moveTo: -3, vanish: true, face: -1, voice: 'npc', name: 'SECURITY', expr: 'neutral',
          block: 'Liquids, laptops, iguanas: all in the bin. Wait. Is that an IGUANA?',
          talk: {
            q: 'Sir. Ma\'am. Everyone. Why is there an iguana in that backpack?',
            opts: [
              { t: 'He\'s an emotional support iguana.', ok: false, r: 'Does he have PAPERWORK?' },
              { t: 'What iguana?', ok: false, r: 'The one currently LICKING my scanner.' },
              { t: 'Our best friend is leaving forever on Flight 88. Please.', ok: true, r: '...Aw, man. Go. GO! I didn\'t see any iguana.' },
            ],
          } },
        C: { t: 'crate', kind: 'bagstack' },
        X: { t: 'exit' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'Gate 47. Thirty minutes. Scoreboard: Clock 1, Us 0.'], ['theo', 'And Sarge stowed away in my backpack. Of course he did.']] },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['dex', 'Lost luggage. Blocking the whole passage.'], ['dex', 'This is why I do squats.']], hintKeys: H_KEYS('DEX: push the luggage pile out of the passage.', 'DEX: push the luggage pile out of the passage.') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['mila', 'Departures board says BOARDING. Somebody tell my legs.']] },
      },
      extra: [
        { t: 'deco', kind: 'detector', x: 24, y: 13, w: 2, h: 3, back: true },
        { t: 'deco', kind: 'board', x: 47, y: 9, w: 9, h: 4, back: true },
      ],
    },
    {
      name: 'The Concourse', slug: 'INT. CONCOURSE B - 2:44 PM', theme: 'airport', shot: 'airport_day',
      map: [
        // 000000000011111111112222222222333333333344444444445555555555
        // 012345678901234567890123456789012345678901234567890123456789
        '############################################################', // 0
        '############################################################', // 1
        '..................................................#.........', // 2
        '..................................................#.........', // 3
        '......................................n...........#.........', // 4
        '..................................c.......c..........c......', // 5
        '..................................................G.........', // 6
        '...............................c...E..c......c..c.V.L..c.X..', // 7
        '.............................###############################', // 8
        '....n.......................c.................#.............', // 9
        '..............................................#.............', // 10
        '..........c........c.c........................#.............', // 11
        '..............................................#.............', // 12
        '..@.....A...cN.O.Q...B.K.c.P.....x......x.....#.............', // 13
        '############################################################', // 14
        '############################################################', // 15
        '############################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'commuter', seed: 7, solve: 'music', id: 't1', moveTo: 30, vanish: true, face: -1, voice: 'npc', name: 'TOURIST', expr: 'happy',
          block: 'We are a TOUR. We move as ONE.', won: 'A song! The tour follows the song!' },
        O: { t: 'npc', look: 'commuter', seed: 8, solve: 'music', id: 't2', moveTo: 28, vanish: true, face: -1, voice: 'npc', name: 'TOURIST', expr: 'happy',
          block: 'Is this the line for the gift shop?', won: 'Conga line! CONGA LINE!' },
        Q: { t: 'npc', look: 'commuter', seed: 9, solve: 'music', id: 't3', moveTo: 26, vanish: true, face: -1, voice: 'npc', name: 'TOURIST', expr: 'happy',
          block: 'Look, honey. An airport.', won: 'Best. Vacation. EVER.' },
        K: { t: 'broken', kind: 'escalator', w: 2, id: 'esc12', say: [['theo', 'Escalator\'s running! Express lift to the gates!']] },
        P: { t: 'platform', kind: 'lift', w: 2, dy: 6, path: [[0, 0], [0, -6]], link: 'esc12', wait: 80, speed: 1, cableTop: 2 },
        G: { t: 'door', kind: 'gate', h: 2, link: 'gate12' },
        V: { t: 'grate', id: 'vent12' },
        L: { t: 'lever', id: 'gate12', say: 'Gate\'s open! The Great Benny, master of airports!' },
        X: { t: 'exit', link: 'gate12', lockedMsg: 'THE JET-BRIDGE GATE IS LOCKED' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'A tour group. Forty people. Moving at the speed of a glacier.'], ['juno', 'Tour groups follow anyone who sings. It\'s science.']], hintKeys: H_KEYS('JUNO: play (E) to lead the tour group away.', 'JUNO: play to lead the tour group away.') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'The escalator to the gates is broken.'], ['dex', 'Is EVERYTHING broken on our way to things?'], ['theo', 'Yes. That\'s how I stay employed.']], hintKeys: H_KEYS('THEO: fix the escalator controls (hold E), then ride up.', 'THEO: fix the escalator controls, then ride up.') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['benny', 'The jet-bridge gate is locked. But the bottom bars are loose...']], hintKeys: H_KEYS('BENNY: open the vent under the gate (E) and pull the release.', 'BENNY: open the vent under the gate and pull the release.') },
      },
      extra: [
        { t: 'deco', kind: 'board', x: 6, y: 8, w: 9, h: 4, back: true, rows: [['88', 'GATE 47', '3:00', 'BOARDING'], ['15', 'GATE 50', '3:05', 'ON TIME'], ['77', 'GATE 41', '3:40', 'DELAYED']] },
      ],
    },
    {
      name: 'Gate 47', slug: 'INT. GATE 47 - 2:58 PM', theme: 'airport', shot: 'airport_day',
      map: [
        // 00000000001111111111222222222233333333334444444444555555
        // 01234567890123456789012345678901234567890123456789012345
        '########################################################', // 0
        '########################################################', // 1
        '................##########..............................', // 2
        '................##########..............................', // 3
        '................##########..............................', // 4
        '................##########..............................', // 5
        '................##########..............................', // 6
        '................##########..................w...w...w...', // 7
        '................##########..............................', // 8
        '................##########...............c.c............', // 9
        '................##########...............====...........', // 10
        '.........c.................c....c....c...............c..', // 11
        '........................................................', // 12
        '..@.....A..N..c..C..c..c....BcK..Q.c..S.......G...c.....', // 13
        '########################################################', // 14
        '########################################################', // 15
        '########################################################', // 16
      ],
      ents: {
        N: { t: 'npc', look: 'gateagent', solve: 'talk', id: 'agent12', moveTo: 3, face: -1, voice: 'npc', name: 'GATE AGENT', expr: 'neutral',
          block: 'Boarding is CLOSED. Flight 88 departs in two minutes.',
          after: ['Two minutes. Make them count.'],
          talk: {
            q: 'Do you have a boarding pass? Any boarding pass? A napkin with "boarding pass" written on it?',
            opts: [
              { t: 'We\'re pilots.', ok: false, r: 'You are wearing a TRACKSUIT.' },
              { t: 'Our best friend is on that plane, and we never said goodbye.', ok: true, r: '...I\'m not crying. Go. You have two minutes.' },
              { t: 'Is that a new uniform? It\'s VERY flattering.', ok: false, r: 'It\'s the same uniform since 1991. Nice try.' },
            ],
          } },
        C: { t: 'crate', kind: 'bagstack' },
        K: { t: 'broken', kind: 'speaker', h: 2, id: 'pa12', label: 'Fix the PA (hold)', say: [['theo', 'PA system is live. Juno... this one\'s yours.']] },
        Q: { t: 'sensor', kind: 'mic', id: 'song12', cond: 'pa12&agent12', notReady: [['juno', 'The PA\'s dead. And we need the gate agent on our side.']], sayWho: 'juno', say: '♪ Don\'t go, Gus... don\'t go... ♪' },
        S: { t: 'runner', kind: 'sarge', voice: 'sarge', path: [[38, 13], [44, 13], [50, 13], [55, 13]], near: 4, speed: 2.8, vanish: true,
          taunts: ['*determined iguana noises*', '*heads for the cockpit*'] },
        G: { t: 'talker', look: 'gus', voice: 'gus', face: -1, expr: 'sad', lines: ['...You six. At the AIRPORT.', 'Don\'t make this weird.', 'Is that Sarge running onto my plane?'] },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'There\'s the gate. And the gate agent.'], ['theo', 'And Sarge just jumped out of my backpack!']], hintKeys: H_KEYS('PRIYA: talk to the gate agent (E).', 'PRIYA: talk to the gate agent (E).') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['juno', 'Gus is sitting by the window. He can\'t hear us through all this.'], ['theo', 'The gate PA system! If I can fix it...'], ['juno', '...then I can sing him a goodbye.']], hintKeys: H_KEYS('DEX clears the luggage. THEO fixes the PA. JUNO plays the mic (E).', 'DEX clears the luggage. THEO fixes the PA. JUNO plays the mic.') },
      },
      extra: [
        { t: 'deco', kind: 'seats', x: 44, y: 13, w: 6, h: 2, dy: 10, back: true },
        { t: 'deco', kind: 'gatesign', x: 40, y: 5, w: 6, h: 2, back: true },
      ],
      goal: 'song12',
    },
  ],
  endLine: 'FLIGHT 88: DELAYED',
});

