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
        @@r1@@
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
        @@r2@@
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
        @@r3@@
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
