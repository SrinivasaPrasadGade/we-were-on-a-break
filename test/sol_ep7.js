window.__sol = window.__sol || {};
window.__sol[6] = [
  // R1 hallway: terrarium into 3B, Juno's dance covers Theo's crossing, Priya tests a doorway hideout
  (B) => {
    const W = () => B.ent(e => e.constructor.name === 'Watcher');
    const atLeft = () => W().danceT <= 0 && W().alertT <= 0 && W().x <= W().x1 + 10;
    B.as('dex');
    B.walkTo(8 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 13 * 16);
    B.waitFor(() => B.flag('terra7'), 30, 'terrarium in 3B');
    B.as('juno');
    B.walkTo(11 * 16 + 8); B.jumpTo(11 * 16 + 8);               // cup 11,11
    B.walkTo(11 * 16 + 6, { tol: 2 });
    B.waitFor(atLeft, 1500, 'holloway near 3B');
    B.use(); B.step(25);
    if (W().danceT <= 0) B.fail('holloway did not dance');
    B.as('theo');
    B.walkTo(10 * 16 + 8); B.jumpTo(14 * 16 + 8);               // hop the terrarium
    B.walkTo(16 * 16 + 8); B.walkTo(22 * 16 + 8); B.walkTo(30 * 16 + 8); B.walkTo(38 * 16 + 8);
    B.walkTo(42 * 16 + 8, { tol: 3 });
    if (B.L().takes > 1) B.fail('theo was caught');
    B.holdUse(80); B.expectFlag('keypad7');
    B.walkTo(41 * 16 + 8); B.jumpTo(41 * 16 + 8);               // cup 41,11
    B.walkTo(44 * 16 + 8); B.jumpTo(44 * 16 + 8);
    B.walkTo(47 * 16 + 8); B.walkTo(50 * 16 + 8); B.jumpTo(50 * 16 + 8);
    B.as('juno');
    B.waitFor(atLeft, 1500, 'holloway near 3B again');
    B.use(); B.step(25);
    if (W().danceT <= 0) B.fail('holloway did not dance (2)');
    B.waitFor(() => B.f().state !== 'play', 80, 'juno done playing');
    B.walkTo(12 * 16 + 2, { tol: 3 }); B.jumpTo(15 * 16 + 8);   // hop the terrarium
    B.walkTo(17 * 16 + 8); B.jumpTo(17 * 16 + 8);
    B.walkTo(24 * 16 + 8); B.jumpTo(24 * 16 + 8);
    B.walkTo(32 * 16 + 8); B.jumpTo(32 * 16 + 8);
    B.walkTo(43 * 16 + 8);
    if (B.L().takes > 1) B.fail('juno was caught');
    // Priya hides in the 3C doorway while Holloway walks right past her
    B.as('priya');
    B.waitFor(() => W().face === 1 && W().x > W().x1 + 120 && W().danceT <= 0, 1500, 'holloway heading right');
    B.walkTo(10 * 16 + 8); B.jumpTo(14 * 16 + 8);
    B.walkTo(20 * 16, { tol: 2 });
    B.use();
    if (B.f().state !== 'hide') B.fail('priya did not hide');
    B.waitFor(() => W().face === -1 && W().x < 20 * 16 - 30, 2000, 'holloway walked past the doorway');
    if (B.L().takes > 1) B.fail('priya was seen while hiding');
    B.waitFor(() => W().face === 1 && W().x > 23 * 16, 2000, 'holloway walking away again');
    B.tap('KeyA', 1);                                            // come out
    if (B.f().state === 'hide') B.fail('priya still hiding');
    B.walkTo(15 * 16 + 8, { tol: 4 });
    B.as('theo');
    B.walkTo(48 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 apartment 3A: robot off (Theo), fridge over the hole (Dex), heat lamp (Mila), golden mug
  (B) => {
    B.as('theo');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);
    B.walkTo(13 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('bot7');
    B.as('dex');
    B.walkTo(16 * 16 + 8); B.jumpTo(16 * 16 + 8);               // cup 16,11
    B.walkTo(18 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 24 * 16);
    B.waitFor(() => B.flag('hole7'), 30, 'hole covered');
    B.as('mila');
    B.walkTo(21 * 16 + 8); B.jumpTo(21 * 16 + 8);               // cup 21,11
    B.walkTo(23 * 16 + 8, { tol: 3 }); B.jumpTo(25 * 16 + 8);   // over the fridge
    B.walkTo(27 * 16 + 8); B.jumpTo(28 * 16 + 8); B.walkTo(30 * 16 + 8);   // kitchen shelf
    B.walkTo(33 * 16 + 8, { tol: 1, max: 300 });
    B.waitFor(() => B.f().onGround, 60, 'landed');
    B.climb(-1);                                                 // up the bookshelf
    B.walkTo(34 * 16 + 8); B.walkTo(35 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('lamp7');
    B.jumpTo(39 * 16 + 8);                                       // treasure shelf: golden mug
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(40 * 16 + 8, { tol: 3 });
    B.walkTo(42 * 16 + 8, { max: 200, tol: 6 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 200, 'mila on the floor');
    B.walkTo(37 * 16 + 8);
    B.walkTo(44 * 16 + 8); B.jumpTo(44 * 16 + 8);
    B.walkTo(46 * 16 + 8);
    B.walkTo(49 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 office: Priya gets past Roz, Benny opens the office, Theo cracks the safe, Benny writes Rule 9½
  (B) => {
    B.as('priya');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(11 * 16 + 2, { tol: 3 });
    B.use(); B.choose(2);
    B.waitFor(() => B.flag('roz7'), 30, 'roz convinced');
    B.step(100);
    B.walkTo(15 * 16 + 8);
    B.walkTo(18 * 16 + 8); B.jumpTo(18 * 16 + 8);
    B.as('benny');
    B.walkTo(19 * 16 + 10, { tol: 2 });
    B.use(); B.expectFlag('vent7');
    B.walkTo(22 * 16 + 8, { max: 400, tol: 3 });
    B.use(); B.expectFlag('office7');
    B.as('theo');
    B.walkTo(23 * 16 + 8); B.jumpTo(23 * 16 + 8);
    B.walkTo(25 * 16 + 8);
    B.walkTo(26 * 16 + 8); B.jumpTo(27 * 16 + 8);               // cabinet A (cup 27,11)
    B.jumpTo(30 * 16 + 8); B.walkTo(31 * 16 + 8);               // cabinet B (cup 31,9)
    B.jumpTo(33 * 16 + 8);                                       // shelf
    B.walkTo(35 * 16 + 8); B.walkTo(34 * 16 + 8, { tol: 3 });
    if (B.L().takes > 1) B.fail('theo was caught');
    B.holdUse(80); B.expectFlag('safe7');
    B.as('benny');
    B.walkTo(26 * 16 + 8); B.jumpTo(27 * 16 + 8); B.jumpTo(30 * 16 + 8);   // over the cabinets
    B.walkTo(33 * 16 + 8, { max: 200, tol: 6 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'benny on the office floor');
    B.walkTo(38 * 16 + 8);
    B.walkTo(42 * 16 + 8); B.jumpTo(42 * 16 + 8);
    B.walkTo(47 * 16 + 8); B.jumpTo(47 * 16 + 8);
    B.walkTo(50 * 16 + 8); B.jumpTo(50 * 16 + 8);
    B.walkTo(49 * 16 + 0, { tol: 3 });
    B.use();
    B.waitFor(() => B.flag('rule'), 30, 'rule 9.5 written');
  },
];
