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
        @@r1@@
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
        @@r2@@
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
        @@r3@@
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
