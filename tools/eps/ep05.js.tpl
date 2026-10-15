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
        @@r1@@
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
        @@r2@@
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
        @@r3@@
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
