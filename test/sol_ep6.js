window.__sol = window.__sol || {};
window.__sol[5] = [
  // R1 ballroom: Priya hires the band, Dex moves the piano, Theo fixes the speaker, Juno sound-checks
  (B) => {
    const overPiano0 = () => { B.walkTo(10 * 16 + 4, { tol: 3 }); B.jumpTo(12 * 16 + 8); B.walkTo(15 * 16 + 8); };
    B.as('priya');
    overPiano0();
    B.walkTo(17 * 16 + 4, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('planner'), 30, 'planner charmed');
    B.step(60);
    B.as('dex');
    B.walkTo(10 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 24 * 16);
    B.waitFor(() => B.flag('piano'), 30, 'piano on the bandstand');
    B.jumpTo(23 * 16 + 9);                                       // cup 23,11
    const overPiano = () => { B.walkTo(23 * 16 + 4, { tol: 3 }); B.jumpTo(25 * 16 + 8); B.walkTo(27 * 16 + 8); };
    B.as('theo');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(16 * 16 + 8); B.jumpTo(16 * 16 + 8);               // cup 16,11
    overPiano();
    B.walkTo(28 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('speaker6');
    B.as('juno');
    overPiano();
    B.walkTo(30 * 16 + 8, { tol: 3 });
    B.use(); B.step(40);
    B.expectFlag('soundcheck');
    B.as('mila');
    B.walkTo(23 * 16 + 4, { tol: 3 }); B.jumpTo(25 * 16 + 8);  // onto the piano
    B.jumpTo(21 * 16 + 8, { double: true });                     // chandelier 1
    if (B.pos().row !== 8) B.fail('mila not on chandelier 1');
    B.jumpTo(17 * 16 + 8, { double: true });                     // chandelier 2: golden mug
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(15 * 16 + 8, { max: 200, tol: 6 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 200, 'mila back on the floor');
    B.as('juno');
    B.walkTo(33 * 16 + 8); B.jumpTo(33 * 16 + 8);               // cup 33,11
    B.walkTo(38 * 16 + 8); B.walkTo(43 * 16 + 8);
    B.walkTo(46 * 16 + 8); B.jumpTo(46 * 16 + 8);
    B.walkTo(49 * 16 + 8);
    B.walkTo(52 * 16 + 8); B.jumpTo(52 * 16 + 8);
    B.walkTo(55 * 16 + 8);
    B.walkTo(57 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 kitchen: chase Sarge (the ring bearer) through the kitchen, Benny opens the pantry, Juno lures him down
  (B) => {
    const V = () => B.ent(e => e.constructor.name === 'Hazard' && e.tx === 46);
    const Wv = () => B.ent(e => e.constructor.name === 'Hazard' && e.tx === 49);
    const steam = () => {
      B.walkTo(41 * 16 + 4, { tol: 3 }); B.jumpTo(42 * 16 + 8); B.walkTo(44 * 16 + 8, { tol: 4 });   // over the boxes
      B.walkTo(45 * 16 + 4, { tol: 2 });
      B.waitFor(() => (V().t % 120) === 74, 200, 'vent 1 off');
      B.walkTo(48 * 16, { tol: 2 });
      if (B.L().takes > 1) B.fail('steamed');
      B.waitFor(() => (Wv().t % 120) === 74, 200, 'vent 2 off');
      B.walkTo(50 * 16 + 8, { tol: 3 });
    };
    B.as('dex');
    B.walkTo(10 * 16 + 8);
    B.walkTo(13 * 16 + 8);
    B.walkTo(21 * 16 + 8); B.walkTo(24 * 16 + 8); B.walkTo(27 * 16 + 8);   // across the conveyor
    B.walkTo(32 * 16 + 1, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 42 * 16);
    B.jumpTo(42 * 16 + 8);                                       // onto the boxes (cup 42,11)
    B.walkTo(44 * 16 + 8, { tol: 4 });
    B.as('mila');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(14 * 16 + 8); B.jumpTo(15 * 16 + 8);               // prep table
    B.walkTo(19 * 16 + 8);
    B.jumpTo(17 * 16 + 8, { double: true });                     // high shelf
    if (B.pos().row !== 8) B.fail('mila not on the shelf');
    B.walkTo(16 * 16 + 8, { tol: 3 });
    B.as('benny');
    B.walkTo(21 * 16 + 8); B.walkTo(30 * 16 + 8);
    steam();
    B.walkTo(51 * 16 + 10, { tol: 2 });
    B.use(); B.expectFlag('vent6');
    B.walkTo(54 * 16 + 8, { max: 400, tol: 3 });
    B.use(); B.expectFlag('pantry6');
    B.walkTo(54 * 16 + 8); B.jumpTo(54 * 16 + 8);               // cup 54,11
    B.walkTo(58 * 16 + 8);
    B.as('juno');
    B.walkTo(21 * 16 + 8); B.walkTo(30 * 16 + 8);
    steam();
    B.walkTo(59 * 16 + 8, { tol: 2 });
    B.jumpTo(59 * 16 + 8);                                       // cup 59,11
    B.waitFor(() => B.ent(e => e.constructor.name === 'Runner').i >= 6 && !B.ent(e => e.constructor.name === 'Runner').moving, 300, 'sarge on the fridge');
    B.use(); B.step(40);
    B.waitFor(() => B.flag('rings'), 200, 'caught sarge');
    B.step(60);
    B.walkTo(56 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 chapel: Priya moves the photographer, Dex the cake, Benny the vestry, Theo the organ, Juno the march
  (B) => {
    const overCake = () => { B.walkTo(28 * 16 + 4, { tol: 3 }); B.jumpTo(29 * 16 + 8); B.walkTo(31 * 16 + 8); };
    B.as('priya');
    B.walkTo(12 * 16 + 4, { tol: 3 });
    B.use(); B.choose(2);
    B.waitFor(() => B.flag('photog'), 30, 'photographer moved');
    B.step(160);
    B.as('dex');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(16 * 16 + 9, { tol: 2 });
    B.jumpTo(16 * 16 + 9);                                       // cup 16,11
    B.pushTo(B.ent(e => e.crate), 29 * 16);
    B.waitFor(() => B.flag('cake6'), 30, 'cake on the mark');
    B.jumpTo(28 * 16 + 9);                                       // cup 28,11
    B.as('mila');
    B.walkTo(23 * 16 + 8); B.jumpTo(23 * 16 + 8, { double: true });   // chandelier cup
    B.walkTo(21 * 16 + 8, { max: 200, tol: 6 });
    B.as('benny');
    overCake();
    B.walkTo(32 * 16 + 10, { tol: 2 });
    B.use(); B.expectFlag('vent6b');
    B.walkTo(35 * 16 + 8, { max: 400, tol: 3 });
    B.use(); B.expectFlag('vestry6');
    B.walkTo(36 * 16 + 8); B.jumpTo(36 * 16 + 8);               // cup 36,11
    B.walkTo(38 * 16 + 8);
    B.as('theo');
    overCake();
    B.walkTo(45 * 16 + 8); B.jumpTo(45 * 16 + 8);               // cup 45,11
    B.walkTo(50 * 16 + 8); B.walkTo(52 * 16 + 8); B.jumpTo(52 * 16 + 8); B.walkTo(54 * 16 + 8);
    B.walkTo(46 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('organ6');
    B.as('juno');
    overCake();
    B.walkTo(46 * 16 + 4, { tol: 3 });
    B.use(); B.step(40);
    B.waitFor(() => B.flag('march'), 30, 'wedding march');
  },
];
