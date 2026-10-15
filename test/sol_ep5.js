window.__sol = window.__sol || {};
window.__sol[4] = [
  // R1 fire escape: Mila drops the ladder, Priya charms Mrs. Petrakis, Benny slips under the roof gate
  (B) => {
    const toB = () => {
      B.walkTo(3 * 16 + 8, { tol: 1 }); B.climb(-1);            // drop ladder to platform A
      B.walkTo(7 * 16 + 8, { tol: 1 }); B.climb(-1);            // up to platform B
      if (B.pos().row !== 15) B.fail('not on platform B');
    };
    B.as('dex');
    B.walkTo(12 * 16 + 8); B.walkTo(15 * 16 + 8); B.walkTo(20 * 16 + 8); B.walkTo(25 * 16 + 8);   // street cups
    B.as('mila');
    B.walkTo(9 * 16 + 8, { tol: 1 });
    B.climb(-1);                                                 // up the drainpipe
    B.walkTo(8 * 16 + 8);
    B.walkTo(5 * 16 + 8); B.jumpTo(5 * 16 + 8);                 // cup 5,20
    B.use(); B.expectFlag('ladder5');
    B.walkTo(7 * 16 + 8, { tol: 1 }); B.climb(-1);
    B.walkTo(9 * 16 + 8);
    B.walkTo(12 * 16 + 8); B.jumpTo(12 * 16 + 8);               // cup 12,13
    B.as('priya');
    toB();
    B.walkTo(12 * 16 + 8, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('petrakis'), 30, 'petrakis charmed');
    B.step(120);
    B.as('mila');
    B.walkTo(17 * 16 + 8); B.walkTo(21 * 16 + 8); B.walkTo(26 * 16 + 8);
    B.walkTo(24 * 16 + 8, { tol: 1 }); B.climb(-1);             // up to platform C
    B.walkTo(26 * 16 + 8);
    B.walkTo(28 * 16 + 8, { tol: 1 }); B.climb(-1);             // cornice pipe: golden mug
    if (!B.L().mugGot) B.fail('no golden mug');
    B.climb(1);
    B.walkTo(22 * 16 + 8);
    B.walkTo(19 * 16 + 8); B.jumpTo(19 * 16 + 8);               // cup 19,6
    B.walkTo(16 * 16 + 8);
    B.as('benny');
    toB();
    B.walkTo(24 * 16 + 8, { tol: 1 }); B.climb(-1);
    B.walkTo(13 * 16 + 8, { max: 600 });                         // crawl under the bars
    B.walkTo(12 * 16 + 8, { tol: 3 }); B.jumpTo(12 * 16 + 8);   // cup 12,6
    B.use(); B.expectFlag('gate5');
    B.walkTo(9 * 16 + 8); B.walkTo(5 * 16 + 8);
    B.walkTo(6 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 roof: Juno lures Sarge off the grill, Dex pushes it to the X, Theo lights it
  (B) => {
    B.as('juno');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(9 * 16 + 8, { tol: 3 });
    B.use(); B.step(40);
    B.waitFor(() => B.flag('sargeoff'), 60, 'sarge lured');
    B.step(30);
    B.as('dex');
    B.walkTo(11 * 16 + 1, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 30 * 16);
    B.waitFor(() => B.flag('grillspot'), 30, 'grill on the spot');
    B.as('theo');
    B.walkTo(18 * 16 + 8); B.jumpTo(18 * 16 + 8);               // cup 18,11
    B.walkTo(29 * 16 + 6, { tol: 2 });
    B.holdUse(80); B.expectFlag('grill5');
    B.step(30);
    B.jumpTo(33 * 16 + 8);                                       // hop the grill
    B.walkTo(36 * 16 + 8); B.jumpTo(36 * 16 + 8);               // cup 36,11
    B.walkTo(38 * 16 + 8); B.jumpTo(40 * 16 + 8); B.walkTo(41 * 16 + 8);   // AC unit
    B.walkTo(43 * 16 + 8, { tol: 4 });
    B.walkTo(44 * 16 + 8); B.jumpTo(46 * 16 + 8);               // skylight
    B.walkTo(49 * 16 + 8); B.jumpTo(49 * 16 + 8);               // cup 49,11
    B.walkTo(51 * 16 + 8, { tol: 1 }); B.climb(-1);             // ladder to the raised roof
    B.walkTo(53 * 16 + 8);
    B.walkTo(55 * 16 + 8); B.jumpTo(55 * 16 + 8);               // cup 55,8
    B.walkTo(59 * 16 + 8);
    B.walkTo(61 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 water tower: Juno sets Holloway dancing, Dex pushes the cooler, Theo wires the party lights
  (B) => {
    const W = () => B.ent(e => e.constructor.name === 'Watcher');
    const serenade = () => {
      B.as('juno');
      B.waitFor(() => W().danceT <= 0 && W().x <= W().x1 + 10, 900, 'holloway near the party end');
      B.use(); B.step(30);
      if (W().danceT <= 0) B.fail('holloway did not dance');
    };
    B.as('juno');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(13 * 16 + 8, { tol: 2 });
    B.as('dex');
    B.walkTo(13 * 16 + 8, { tol: 2 });
    serenade();
    B.as('dex');
    B.walkTo(36 * 16 + 8); B.jumpTo(36 * 16 + 8);               // cup 36,11
    B.walkTo(39 * 16 + 1, { tol: 2 });
    if (B.L().takes > 1) B.fail('dex got caught');
    B.pushTo(B.ent(e => e.crate), 47 * 16);
    B.jumpTo(49 * 16 + 8);                                       // hop the cooler
    B.walkTo(53 * 16 + 8); B.walkTo(54 * 16 + 8); B.jumpTo(54 * 16 + 8);   // cups 53,13 54,10
    B.walkTo(50 * 16 + 8);
    B.as('theo');
    B.walkTo(13 * 16 + 8, { tol: 2 });
    serenade();
    B.as('theo');
    B.walkTo(39 * 16 + 8);
    if (B.L().takes > 1) B.fail('theo got caught');
    B.walkTo(46 * 16 + 8, { tol: 3 });
    B.jumpTo(47 * 16 + 8);                                       // onto the cooler
    B.jumpClimb();                                               // grab the ladder, up to the catwalk
    if (B.pos().row !== 6) B.fail('theo not on the catwalk');
    B.walkTo(49 * 16 + 8); B.walkTo(51 * 16 + 8);
    B.walkTo(44 * 16 + 8);
    B.walkTo(45 * 16 + 8, { tol: 3 });
    B.holdUse(80);
    B.waitFor(() => B.flag('lights5'), 10, 'party lights wired');
  },
];
