window.__sol = window.__sol || {};
window.__sol[9] = [
  // R1 expo floor: Priya past security, Juno sings the voice door open, Dex clears the aisle, Mila's truss mug
  (B) => {
    B.as('priya');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(25 * 16 + 8); B.jumpTo(25 * 16 + 8);               // across the walkway, cup 25,11
    B.walkTo(26 * 16 + 2, { tol: 3 });
    B.use(); B.choose(2);
    B.waitFor(() => B.flag('guard10'), 30, 'security convinced');
    B.step(160);
    B.as('juno');
    B.walkTo(30 * 16 + 8);
    B.walkTo(32 * 16 + 8); B.jumpTo(32 * 16 + 8);
    B.walkTo(34 * 16 + 8, { tol: 3 });
    B.use(); B.step(40);
    B.expectFlag('vdoor10');
    B.as('dex');
    B.walkTo(37 * 16 + 8); B.jumpTo(37 * 16 + 8);               // cup 37,11
    B.walkTo(41 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 50 * 16);
    B.as('mila');
    B.walkTo(49 * 16 + 4, { tol: 3 }); B.jumpTo(50 * 16 + 8);  // onto the Robo-Butler (cup 50,11)
    B.walkTo(52 * 16 + 8, { max: 200, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila down');
    B.walkTo(53 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the jumbotron truss
    B.walkTo(54 * 16 + 8); B.walkTo(57 * 16 + 8);
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(59 * 16 + 8, { max: 300, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila on the floor');
    B.jumpTo(59 * 16 + 8);
    B.walkTo(61 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 Kessler's booth: Priya, Mila's tesla switch, Theo cracks the case, Juno lulls the robo-dog
  (B) => {
    B.as('priya');
    B.walkTo(9 * 16 + 8); B.jumpTo(9 * 16 + 8);
    B.walkTo(10 * 16 + 2, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('kessler'), 30, 'kessler distracted');
    B.step(180);
    B.as('mila');
    B.walkTo(13 * 16 + 8);
    B.walkTo(15 * 16 + 8); B.jumpTo(15 * 16 + 8);
    B.walkTo(16 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the truss
    B.walkTo(17 * 16 + 8); B.walkTo(19 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('coils10');
    B.as('theo');
    B.walkTo(20 * 16 + 8); B.jumpTo(20 * 16 + 8);
    B.walkTo(24 * 16 + 8);
    if (B.L().takes > 1) B.fail('zapped');
    B.walkTo(27 * 16 + 8); B.jumpTo(27 * 16 + 8);
    B.walkTo(29 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('remote10');
    B.as('juno');
    B.walkTo(24 * 16 + 8); B.walkTo(33 * 16 + 8);
    B.walkTo(36 * 16 + 8); B.jumpTo(36 * 16 + 8);
    B.walkTo(39 * 16 + 8);
    B.walkTo(40 * 16 + 4, { tol: 3 });
    B.use(); B.step(40);
    B.expectFlag('dog10');
    B.step(40);
    B.walkTo(43 * 16 + 8); B.jumpTo(43 * 16 + 8);
    B.walkTo(48 * 16 + 8);
    B.walkTo(51 * 16 + 8); B.jumpTo(51 * 16 + 8);
    B.walkTo(53 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 main stage: judge (Priya), K-9000 off the cable (Dex), speakers (Theo), Mila's truss cups, Juno lures Tidy-Bot down
  (B) => {
    B.as('priya');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);
    B.walkTo(11 * 16 + 2, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('judge10'), 30, 'judge convinced');
    B.step(160);
    B.as('dex');
    B.walkTo(15 * 16 + 8);
    B.walkTo(16 * 16 + 8); B.jumpTo(16 * 16 + 8);
    B.walkTo(18 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 22 * 16);
    if (B.flag('cable10')) B.fail('cable still pressed');
    B.as('theo');
    B.walkTo(20 * 16 + 8, { tol: 4 }); B.jumpTo(22 * 16 + 8); B.walkTo(25 * 16 + 8);   // over the machine
    B.jumpTo(26 * 16 + 8);
    B.walkTo(27 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('speaker10');
    B.walkTo(30 * 16 + 8);
    B.walkTo(34 * 16 + 8); B.jumpTo(34 * 16 + 8);
    B.walkTo(45 * 16 + 8); B.jumpTo(45 * 16 + 8);
    B.walkTo(49 * 16 + 8);
    B.walkTo(53 * 16 + 8); B.jumpTo(53 * 16 + 8);
    B.walkTo(56 * 16 + 8);
    B.as('mila');
    B.walkTo(20 * 16 + 8, { tol: 4 }); B.jumpTo(22 * 16 + 8); B.walkTo(25 * 16 + 8);
    B.walkTo(40 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the lighting truss
    B.walkTo(39 * 16 + 8, { tol: 3 }); B.walkTo(37 * 16 + 8, { tol: 3 });
    B.walkTo(35 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila down');
    B.as('juno');
    B.walkTo(20 * 16 + 8, { tol: 4 }); B.jumpTo(22 * 16 + 8); B.walkTo(25 * 16 + 8);
    B.walkTo(42 * 16 + 8, { tol: 2 });
    B.use(); B.step(30);
    B.waitFor(() => B.flag('bot10'), 300, 'tidy-bot caught');
  },
];
