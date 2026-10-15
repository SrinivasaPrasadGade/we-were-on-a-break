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
