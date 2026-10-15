// =============================================================================
// THE GRAND REOPENING (series finale)
// =============================================================================
EPISODES.push({
  season: 2, num: 7, title: 'The Grand Reopening', music: 'finale', finale: true,
  blurb: 'One hundred customers by Friday, or the Daily Grind becomes Vance Lofts.',
  rooms: [
    {
      name: 'Larkspur Street', slug: 'EXT. LARKSPUR STREET - THURSDAY NIGHT', theme: 'street_night', shot: 'cafe_night', openTop: true, music: 'finale',
      map: [
        @@r1@@
      ],
      ents: {
        T: { t: 'blocks', kind: 'ladder', mode: 'appear', link: 'ladder16', h: 5 },
        L: { t: 'lever', id: 'ladder16', say: 'Ladder\'s down! Just like the fire escape. Scoreboard: Mila, all-time champion.' },
        K: { t: 'broken', kind: 'sign', w: 3, id: 'sign16', label: 'Fix the sign (hold)', say: [['theo', 'O-P-E-N. Every letter. Even the E.'], ['dex', 'ESPECIALLY the E.']] },
        U: { t: 'shutter', h: 3, lift: 2 },
        X: { t: 'exit', link: 'sign16', lockedMsg: 'FIX THE SIGN FIRST. A CAFÉ NEEDS A SIGN.' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'Tomorrow, the Daily Grind needs a hundred customers. Tonight, it needs us.'], ['mila', 'The OPEN sign\'s busted. The awning\'s too high. And Vance put a SHUTTER on the door.'], ['dex', 'Leave the shutter to me. I\'ve been training my whole life for this. Literally.']], hintKeys: H_KEYS('MILA: climb the drainpipe and drop the ladder. THEO: fix the neon sign.', 'MILA: climb the drainpipe and drop the ladder. THEO: fix the neon sign.') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'The OPEN sign says "OP N." Somebody stole the E.'], ['benny', 'It wasn\'t me. ...This time.']], hintKeys: H_KEYS('DEX: hold up the shutter (E) and let someone through.', 'DEX: hold up the shutter and let someone through.') },
      },
    },
    {
      name: 'The Daily Grind', slug: 'INT. THE DAILY GRIND - THURSDAY NIGHT', theme: 'cafe', shot: 'cafe_night', music: 'funk',
      map: [
        @@r2@@
      ],
      ents: {
        P: { t: 'npc', look: 'pigeons', solve: 'music', id: 'pigeons16', moveTo: 8, vanish: true, voice: 'npc', name: 'PIGEONS',
          block: 'Coo. (They\'re back. They heard there\'s a party.)', won: 'COO! (One last jazz brunch, for old times\' sake.)' },
        C: { t: 'crate', kind: 'couch' },
        Z: { t: 'plate', w: 3, heavy: true, mark: true, id: 'couch16' },
        E: { t: 'broken', kind: 'espresso', w: 2, h: 2, id: 'esp16', label: 'Fix Old Faithful (hold)', say: [['theo', 'Old Faithful LIVES! One more time, old girl.'], ['gus', 'You\'re crying.'], ['theo', 'It\'s the STEAM, Gus.']] },
        S: { t: 'hazard', kind: 'steam', w: 1, h: 3, link: 'esp16', always: true },
        L: { t: 'lever', id: 'clipA', say: 'Lights, clip one! Scoreboard: Mila 1, Darkness 0.' },
        Y: { t: 'lever', id: 'clipB', say: 'Clip two! LET THERE BE TWINKLE.' },
        X: { t: 'exit', link: 'couch16&esp16&clipA&clipB&pigeons16', lockedMsg: 'GET THE CAFÉ READY FIRST!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['gus', 'You six. Again. In my café. At midnight.'], ['juno', 'And the pigeons. Again.'], ['gus', 'Of COURSE the pigeons.']], hintKeys: H_KEYS('JUNO: the pigeons. DEX: the couch to its spot. THEO: Old Faithful. MILA: the string lights.', 'JUNO: pigeons. DEX: couch. THEO: espresso. MILA: lights.') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['dex', 'The couch goes right here. Where it belongs. Where WE belong.'], ['mila', 'Dex, are you crying at a couch?'], ['dex', 'It\'s a very good couch.']] },
        F: { t: 'trigger', w: 2, h: 3, any: true, lines: [['mila', 'String lights. Two clips. Up high. Obviously, me.']] },
      },
      extra: [
        { t: 'light', kind: 'string', x: 3, y: 4, w: 26, link: 'clipA&clipB', sag: 12 },
        { t: 'light', kind: 'string', x: 30, y: 4, w: 28, link: 'clipA&clipB', sag: 10 },
        { t: 'talker', look: 'gus', voice: 'gus', x: 45, y: 13, face: -1, lines: ['A hundred customers. I\'ve never had a hundred customers.', 'I\'ve had YOU six for four years. That\'s worse.', 'Thank you. Don\'t tell anybody I said that.'] },
      ],
    },
    {
      name: 'The Kitchen', slug: 'INT. DAILY GRIND KITCHEN - 3:00 AM', theme: 'kitchen', shot: 'cafe_night', music: 'panic',
      map: [
        @@r3@@
      ],
      ents: {
        C: { t: 'crate', kind: 'mixer' },
        Z: { t: 'plate', heavy: true, mark: true, id: 'mixer16' },
        S: { t: 'hazard', kind: 'steam', h: 3, phase: 0 },
        T: { t: 'hazard', kind: 'steam', h: 3, phase: 60 },
        G: { t: 'door', link: 'pantry16', h: 2, kind: 'door' },
        V: { t: 'grate', id: 'vent16' },
        L: { t: 'lever', id: 'pantry16', say: 'Pantry\'s open! Eggs, butter, and... why is there a bowling ball in here?' },
        F: { t: 'lever', id: 'flour16', say: 'Flour drop! ...Most of it went in the bowl.' },
        K: { t: 'broken', kind: 'oven', w: 2, h: 2, id: 'oven16', label: 'Fire up the oven (hold)', say: [['theo', 'Oven\'s HOT! One hundred muffins, coming up!'], ['benny', 'And for my next trick: one hundred muffins DISAPPEAR.'], ['priya', 'Benny, NO.']] },
        X: { t: 'exit', link: 'mixer16&pantry16&flour16&oven16', lockedMsg: 'MIXER, PANTRY, FLOUR, OVEN!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['priya', 'A hundred customers need a hundred muffins.'], ['dex', 'I\'ll get the mixer to its station.'], ['theo', 'And the oven? Built in 1961. I LOVE a challenge.']], hintKeys: H_KEYS('DEX: the mixer onto its mark. BENNY: the pantry vent. MILA: the flour. THEO: the oven.', 'DEX: mixer. BENNY: pantry vent. MILA: flour. THEO: oven.') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['juno', 'Dish conveyor. Steam vents. Just like the wedding.'], ['mila', 'Time the steam. Then go.']] },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['mila', 'The flour\'s on the top shelf. Of course it is.']] },
      },
    },
    {
      name: 'The Rooftop', slug: 'EXT. BELLWEATHER ROOF - FRIDAY, DUSK', theme: 'roof_night', shot: 'roof_night', openTop: true, music: 'wedding',
      map: [
        @@r4@@
      ],
      ents: {
        N: { t: 'npc', look: 'pigeonlady', solve: 'talk', id: 'petrakis16', moveTo: -5, face: -1, voice: 'npc', name: 'MRS. PETRAKIS', expr: 'smug',
          block: 'I\'m MOON-bathing, sweetheart.',
          after: ['A grand reopening! I\'ll bring the pigeons.'],
          talk: {
            q: 'You again. What do you want THIS time?',
            opts: [
              { t: 'Your moon tan is incredible.', ok: false, r: 'Flattery worked LAST time. I\'ve built up an immunity.' },
              { t: 'The café needs a hundred customers tonight. Will you come?', ok: true, r: 'Will I come? Sweetheart. I\'ll bring my bridge club. All forty of them.' },
              { t: 'We need the roof. For science.', ok: false, r: 'Theo said that in 1997. Something exploded.' },
            ],
          } },
        R: { t: 'talker', look: 'roz', voice: 'roz', face: 1, lines: ['Darlings! Bertram and I wouldn\'t miss it.', 'I made my potato salad. It\'s mostly mayonnaise and hope.'] },
        W: { t: 'talker', look: 'holloway', voice: 'holloway', face: -1, lines: ['I have suspended Rules 1 through 112 for the evening.', 'Rule 113: everybody comes to the reopening.', 'Don\'t tell anyone I\'m excited. I am EXTREMELY excited.'] },
        Q: { t: 'sensor', kind: 'karaoke', w: 2, id: 'karaoke16', sayWho: 'juno', say: '♪ Come on down to the Daily Grind! ♪ The whole block can hear this!' },
        S: { t: 'spring', w: 2, kind: 'trampoline' },
        K: { t: 'broken', kind: 'spot', id: 'search16', label: 'Fix the searchlight (hold)', say: [['theo', 'Searchlight is ON! The whole city can see it!'], ['holloway', 'Is that... allowed?'], ['roz', 'Bertram.'], ['holloway', 'It\'s allowed.']] },
        L: { t: 'lever', id: 'banner16', say: 'Banner\'s up! GRAND REOPENING! Visible from three boroughs!' },
        X: { t: 'exit', link: 'karaoke16&search16&banner16&petrakis16', lockedMsg: 'LIGHT, SOUND, BANNER... AND MRS. PETRAKIS!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['mila', 'The roof is the best billboard in the neighborhood.'], ['juno', 'Searchlight, banner, and a karaoke machine for the whole block.']], hintKeys: H_KEYS('PRIYA: Mrs. Petrakis. JUNO: karaoke. THEO: trampoline to the searchlight. MILA: the antenna banner.', 'PRIYA, JUNO, THEO and MILA all have a job up here.') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['theo', 'The searchlight\'s on the water tower. Trampoline time.'], ['dex', 'Why is there ALWAYS a trampoline?'], ['benny', 'Leftover from my show.']] },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['mila', 'The banner rope ties off at the top of that antenna. Say no more.']] },
      },
      extra: [
        { t: 'deco', kind: 'tower', x: 31, y: 13, w: 11, h: 13, walk: 6, back: true },
        { t: 'light', kind: 'string', x: 2, y: 4, w: 26, link: 'karaoke16', sag: 12 },
      ],
    },
    {
      name: 'The Grand Reopening', slug: 'INT. THE DAILY GRIND - FRIDAY NIGHT', theme: 'cafe', shot: 'cafe_night', music: 'finale',
      map: [
        @@r5@@
      ],
      ents: {
        N: { t: 'npc', look: 'vance', solve: 'talk', id: 'vance16', moveTo: -6, face: -1, voice: 'npc', name: 'MR. VANCE', expr: 'smug',
          block: 'Ninety-nine customers so far. Tick tock.',
          after: ['One hundred. Then we\'ll talk.'],
          talk: {
            q: 'Charming. Rustic. Smells like a sock. Why should I sell it back?',
            opts: [
              { t: 'Because a deal is a deal, Mr. Vance.', ok: false, r: 'And the deal says ONE HUNDRED. I count ninety-nine.' },
              { t: 'Look around. Lofts don\'t do this. Only the Daily Grind does this.', ok: true, r: '...Hm. It IS rather lively. Go on, then. Show me.' },
              { t: 'I know a guy who\'ll pay double.', ok: false, r: 'I AM the guy who pays double.' },
            ],
          } },
        O: { t: 'npc', look: 'critic', solve: 'talk', id: 'critic16', moveTo: -7, face: -1, voice: 'npc', name: 'THE CRITIC', expr: 'smug',
          block: 'I review cafés. Mostly badly.',
          talk: {
            q: 'Impress me. I have been unimpressed since 1989.',
            opts: [
              { t: 'Try the muffins. We baked a hundred at 3 AM.', ok: true, r: 'Three in the morning? That\'s either love or madness. I\'ll stay.' },
              { t: 'We have free Wi-Fi!', ok: false, r: 'Everybody has free Wi-Fi. NEXT.' },
              { t: 'Our espresso machine is older than you.', ok: false, r: 'Nothing is older than me. I reviewed the Pyramids. Two stars.' },
            ],
          } },
        P: { t: 'crate', kind: 'pianobig' },
        Z: { t: 'plate', w: 3, heavy: true, mark: true, id: 'piano16' },
        L: { t: 'lever', id: 'bannerL', say: 'Banner, left side!' },
        Y: { t: 'lever', id: 'bannerR', say: 'Banner, right side! GRAND REOPENING!' },
        K: { t: 'broken', kind: 'panel', id: 'lights16', label: 'Fix the stage lights (hold)', say: [['theo', 'Stage lights: PERFECT. I didn\'t even need duct tape.'], ['theo', 'Okay, I needed a LITTLE duct tape.']] },
        G: { t: 'door', link: 'deed16', h: 2, kind: 'door' },
        V: { t: 'grate', id: 'vent16b' },
        J: { t: 'lever', kind: 'book', id: 'deed16', label: 'Grab the deed', say: 'Got the deed! TA-DA! For real this time!' },
        Q: { t: 'sensor', kind: 'mic', id: 'show16', cond: 'piano16&bannerL&bannerR&lights16&deed16&vance16&critic16', notReady: [['juno', 'Not yet! Piano, banner, lights, the deed, and Vance AND the critic. THEN the show.']], sayWho: 'juno', say: '♪ The gang\'s all here! ♪ Ladies and gentlemen... the Daily Grind is OPEN!' },
        A: { t: 'trigger', w: 2, h: 3, lines: [['gus', 'Ninety-nine people. NINETY-NINE. I\'ve never seen so many people in here.'], ['priya', 'Vance and the critic first. Leave them to me.']], hintKeys: H_KEYS('PRIYA: talk to Mr. Vance AND the critic (E).', 'PRIYA: talk to Mr. Vance and the critic.') },
        B: { t: 'trigger', w: 2, h: 3, any: true, lines: [['dex', 'Piano to the stage. Like the very first day.'], ['mila', 'And the banner. Two clips. You know who.'], ['benny', 'And I\'ve got a trick for Mr. Vance. The deed is in his briefcase in the back office...']], hintKeys: H_KEYS('DEX: piano. MILA: banner clips. THEO: stage lights. BENNY: the deed. Then JUNO: the show!', 'DEX: piano. MILA: banner. THEO: lights. BENNY: deed. Then JUNO!') },
        E: { t: 'trigger', w: 2, h: 3, any: true, lines: [['benny', 'Vance\'s briefcase is in the back office. Locked, of course.'], ['benny', 'Good thing I\'m small, sneaky, and VERY dramatic.']] },
      },
      extra: [
        { t: 'deco', kind: 'banner', x: 19, y: 4, w: 14, h: 2, text: 'GRAND REOPENING', back: true },
      ],
      goal: 'show16',
    },
  ],
  endLine: 'WE\'RE OPEN!',
});
