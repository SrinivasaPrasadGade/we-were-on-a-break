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
        @@r1@@
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
        @@r2@@
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
        @@r3@@
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
