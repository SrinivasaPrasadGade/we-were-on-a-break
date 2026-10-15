window.__sol = window.__sol || {};
window.__sol[10] = [
  // R1 blizzard street: Priya and the fort kid, Juno joins the carolers, Theo starts the plow, Mila's bus-stop mug
  (B) => {
    B.as('priya');
    B.walkTo(8 * 16 + 8);
    B.walkTo(16 * 16 + 8, { tol: 4 }); B.jumpTo(16 * 16 + 8);   // across the ice, cup 16,11
    B.walkTo(18 * 16 + 8, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('kid11'), 30, 'fort kid charmed');
    B.step(60);
    B.walkTo(23 * 16 + 8); B.jumpTo(23 * 16 + 8);
    B.as('juno');
    B.walkTo(8 * 16 + 8); B.walkTo(17 * 16 + 8, { tol: 4 });
    B.walkTo(25 * 16 + 8, { tol: 3 });
    B.use(); B.step(40);
    B.waitFor(() => B.flag('carol1') && B.flag('carol2'), 60, 'carolers singing along');
    B.step(240);
    B.as('theo');
    B.walkTo(8 * 16 + 8); B.walkTo(17 * 16 + 8, { tol: 4 });
    B.walkTo(26 * 16 + 8);
    B.walkTo(32 * 16 + 8); B.jumpTo(32 * 16 + 8);
    B.walkTo(34 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('plow11');
    B.step(30);
    B.as('mila');
    B.walkTo(8 * 16 + 8); B.walkTo(17 * 16 + 8, { tol: 4 });
    B.walkTo(37 * 16 + 8); B.jumpTo(37 * 16 + 8);
    B.walkTo(42 * 16 + 8); B.jumpTo(42 * 16 + 8);
    B.walkTo(51 * 16 + 8, { tol: 4 });                           // across the ice (cup 45,13)
    B.walkTo(52 * 16 + 8); B.jumpTo(52 * 16 + 8);
    B.walkTo(50 * 16 + 8, { tol: 3 });
    B.jumpTo(48 * 16 + 8, { double: true, delaySteer: 16 });   // bus shelter roof: golden mug
    B.walkTo(47 * 16 + 8, { tol: 3 }); B.walkTo(49 * 16 + 8, { tol: 3 });
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(51 * 16 + 8, { max: 300, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'mila down');
    B.walkTo(58 * 16 + 8);
    B.walkTo(60 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 alley: Juno sets the snipers dancing (V from inside a snowman), Theo thaws the lock, Mila climbs to the landing
  (B) => {
    const W = () => B.ent(e => e.constructor.name === 'Watcher' && e.tx === 23);
    const V = () => B.ent(e => e.constructor.name === 'Watcher' && e.tx === 43);
    const caught = () => { if (B.L().takes > 1) B.fail('hit by a snowball'); };
    B.as('juno');
    B.walkTo(5 * 16 + 8); B.walkTo(13 * 16 + 8, { tol: 4 });   // across the ice
    B.jumpTo(13 * 16 + 8);                                       // cup 13,11
    B.walkTo(14 * 16 + 4, { tol: 3 });
    B.waitFor(() => W().danceT <= 0 && W().alertT <= 0 && W().x <= W().x1 + 14, 1200, 'sniper W near');
    B.use(); B.step(25);
    if (W().danceT <= 0) B.fail('W did not dance');
    B.waitFor(() => B.f().state !== 'play', 80, 'song done');
    B.walkTo(34 * 16 + 8, { tol: 2 });
    B.use();                                                     // hide in snowman U
    if (B.f().state !== 'hide') B.fail('juno not hidden');
    B.as('theo');
    B.walkTo(5 * 16 + 8); B.walkTo(17 * 16 + 8, { tol: 4 }); B.walkTo(26 * 16 + 8);
    B.walkTo(32 * 16 + 4, { tol: 3 });
    caught();
    B.as('mila');
    B.walkTo(5 * 16 + 8); B.walkTo(20 * 16 + 8, { tol: 4 }); B.walkTo(31 * 16 + 8);
    B.walkTo(33 * 16 + 4, { tol: 3 }); B.jumpTo(33 * 16 + 4);   // cup 33,11
    caught();
    B.as('juno');
    B.waitFor(() => V().danceT <= 0 && V().alertT <= 0 && V().x <= V().x1 + 14, 1500, 'sniper V near');
    B.use(); B.step(25);                                         // serenade from inside the snowman
    if (V().danceT <= 0) B.fail('V did not dance');
    if (B.f().state !== 'hide') B.fail('juno left her hiding spot');
    B.as('theo');
    B.walkTo(38 * 16 + 8); B.walkTo(41 * 16 + 8);
    B.walkTo(52 * 16 + 8);
    B.walkTo(53 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('thaw11');
    caught();
    B.as('mila');
    B.walkTo(47 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the icy drainpipe
    B.walkTo(48 * 16 + 8); B.walkTo(52 * 16 + 8);
    caught();
    B.as('theo');
    B.walkTo(57 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 boiler room: valve, Benny through the duct, Dex clears the heater, Theo fixes the boiler
  (B) => {
    B.as('priya');
    B.walkTo(12 * 16 + 8); B.jumpTo(12 * 16 + 8);
    B.walkTo(15 * 16 + 4, { tol: 3 }); B.jumpTo(16 * 16 + 8);  // onto the crates (cup 16,11)
    B.walkTo(19 * 16 + 8, { max: 200, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'priya down');
    B.walkTo(21 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('valve11');
    B.as('benny');
    B.walkTo(15 * 16 + 4, { tol: 3 }); B.jumpTo(17 * 16 + 4);
    B.jumpTo(19 * 16 + 8);                                       // shelf 1
    B.jumpTo(21 * 16 + 8);                                       // shelf 2
    B.jumpTo(22 * 16 + 4);                                       // shelf 3, at the duct mouth
    B.walkTo(36 * 16 + 8, { max: 900 });                         // crawl the duct
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 200, 'benny in the boiler room');
    B.walkTo(38 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('pilot11');
    B.as('dex');
    B.walkTo(15 * 16 + 4, { tol: 3 }); B.jumpTo(16 * 16 + 8);
    B.walkTo(19 * 16 + 8, { max: 200, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'dex down');
    B.walkTo(25 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 40 * 16);
    B.as('theo');
    B.walkTo(15 * 16 + 4, { tol: 3 }); B.jumpTo(16 * 16 + 8);
    B.walkTo(19 * 16 + 8, { max: 200, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'theo down');
    B.walkTo(28 * 16 + 8); B.jumpTo(28 * 16 + 8);               // cup 28,11 (in the corridor)
    B.walkTo(38 * 16 + 8, { tol: 4 }); B.jumpTo(40 * 16 + 8);   // onto the heater (cup 40,11)
    B.walkTo(42 * 16 + 8, { max: 200, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'theo off the heater');
    B.walkTo(44 * 16 + 8);
    B.walkTo(50 * 16 + 8); B.jumpTo(50 * 16 + 8);
    B.walkTo(53 * 16 + 8);
    B.walkTo(45 * 16 + 4, { tol: 3 });
    B.holdUse(80);
    B.waitFor(() => B.flag('boiler11'), 10, 'boiler fixed');
  },
];
