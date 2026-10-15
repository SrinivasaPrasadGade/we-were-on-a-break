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
        @@r1@@
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
        @@r2@@
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
        @@r3@@
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
