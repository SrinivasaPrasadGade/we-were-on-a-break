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
        @@r1@@
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
        @@r2@@
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
        @@r3@@
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
