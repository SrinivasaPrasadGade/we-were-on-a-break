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
        @@r1@@
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
        @@r2@@
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
        @@r3@@
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
