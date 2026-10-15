window.__sol = window.__sol || {};
window.__sol[8] = [
  // R1 station: Priya handles Marge, Theo fixes the turnstile, ride the maintenance cart across the tracks
  (B) => {
    const cart = () => B.ent(e => e.constructor.name === 'Platform');
    const boardCart = () => {
      B.walkTo(39 * 16 + 4, { tol: 3 });
      B.waitFor(() => cart().x <= 640.5 && cart().wait > 25, 900, 'cart at the near platform');
      B.walkTo(41 * 16, { tol: 3 });
      if (B.f().groundEnt !== cart()) B.fail('not on the cart');
    };
    B.as('priya');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(11 * 16 + 2, { tol: 3 });
    B.use(); B.choose(2);
    B.waitFor(() => B.flag('marge'), 30, 'marge charmed');
    B.step(80);
    B.as('theo');
    B.walkTo(24 * 16 + 8); B.jumpTo(24 * 16 + 8);               // across the broken escalator walkway, cup 24,11
    B.walkTo(25 * 16 + 4, { tol: 3 });
    B.holdUse(80); B.expectFlag('turn9');
    B.walkTo(29 * 16 + 8); B.jumpTo(29 * 16 + 8);
    B.walkTo(32 * 16 + 8);
    B.walkTo(38 * 16 + 8); B.jumpTo(38 * 16 + 8);
    B.as('mila');
    B.walkTo(29 * 16 + 8);
    boardCart();
    B.waitFor(() => Math.abs(cart().x - (43 * 16 - 8)) < 3, 600, 'cart under the signal ledge');
    B.jumpTo(43 * 16 + 8, { double: true });                     // the signal ledge
    if (B.pos().row !== 9) B.fail('mila not on the ledge');
    B.walkTo(44 * 16 + 8, { tol: 3 });
    B.jumpTo(48 * 16 + 8);                                       // down to the far platform
    B.walkTo(49 * 16 + 8);
    B.walkTo(52 * 16 + 8); B.jumpTo(52 * 16 + 8);
    B.walkTo(55 * 16 + 8);
    B.walkTo(58 * 16 + 8); B.jumpTo(58 * 16 + 8);
    B.walkTo(61 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R2 the train: Juno moves the commuters, Mila climbs to the luggage rack, Dex holds the car door, Benny goes on
  (B) => {
    B.as('juno');
    B.walkTo(10 * 16 + 8); B.jumpTo(10 * 16 + 8);               // cup 10,11
    B.walkTo(11 * 16 + 8, { tol: 3 });
    B.use(); B.step(30);
    B.waitFor(() => B.flag('c1') && B.flag('c2') && B.flag('c3'), 60, 'commuters dancing');
    B.step(260);
    B.walkTo(12 * 16 + 8);
    B.as('mila');
    B.walkTo(20 * 16 + 8); B.jumpTo(20 * 16 + 8);
    B.walkTo(22 * 16 + 8);
    B.walkTo(23 * 16 + 8, { tol: 1 }); B.climb(-1);             // up the grab pole
    B.walkTo(25 * 16 + 8); B.walkTo(29 * 16 + 8);
    if (!B.L().mugGot) B.fail('no golden mug');
    B.walkTo(33 * 16 + 8);
    B.walkTo(36 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 200, 'mila on the floor');
    B.jumpTo(36 * 16 + 8);                                       // cup 36,11
    B.as('dex');
    B.walkTo(40 * 16 + 8);
    B.walkTo(42 * 16 - 7, { tol: 2 });
    B.use();
    B.waitFor(() => B.ent(e => e.constructor.name === 'Shutter').lift >= 1, 60, 'door up');
    B.as('benny');
    B.walkTo(44 * 16 + 8); B.jumpTo(44 * 16 + 8);
    B.walkTo(53 * 16 + 8, { max: 600 });                         // crawl under the bench
    B.walkTo(53 * 16 + 4, { tol: 3 }); B.jumpTo(51 * 16 + 8);   // onto the bench
    B.walkTo(49 * 16 + 8);
    B.walkTo(54 * 16 + 8, { max: 300, tol: 4 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'benny on the floor');
    B.walkTo(55 * 16 + 8); B.jumpTo(55 * 16 + 8);
    B.walkTo(57 * 16 + 8, { tol: 3 });
    B.enter();
  },
  // R3 storage: Priya, Benny through the vent, Dex pushes the crate onto the freight lift, Theo powers it
  (B) => {
    const lift = () => B.ent(e => e.constructor.name === 'Platform');
    B.as('priya');
    B.walkTo(9 * 16 + 2, { tol: 3 });
    B.use(); B.choose(1);
    B.waitFor(() => B.flag('storageguy'), 30, 'storage guy convinced');
    B.step(120);
    B.walkTo(12 * 16 + 8);
    B.walkTo(14 * 16 + 8);
    B.as('benny');
    B.walkTo(14 * 16 + 8); B.jumpTo(15 * 16 + 8);               // box stack (cup 15,11)
    B.jumpTo(18 * 16 + 8);                                       // shelf
    B.walkTo(19 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('vent9');
    B.walkTo(22 * 16 + 8, { max: 400, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'benny inside the unit');
    B.walkTo(22 * 16 + 8, { tol: 3 });
    B.use(); B.expectFlag('unit9');
    B.as('dex');
    B.walkTo(14 * 16 + 8); B.jumpTo(15 * 16 + 8);
    B.walkTo(18 * 16 + 8, { max: 200, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'dex past the stack');
    B.walkTo(24 * 16 + 9, { tol: 2 });
    B.pushTo(B.ent(e => e.crate), 41 * 16);
    if (B.f().groundEnt !== lift()) B.fail('dex not on the lift');
    B.as('theo');
    B.walkTo(14 * 16 + 8); B.jumpTo(15 * 16 + 8);
    B.walkTo(18 * 16 + 8, { max: 200, tol: 3 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'theo past the stack');
    B.jumpTo(17 * 16 + 8);                                       // cup 17,11 (lands on the shelf)
    B.walkTo(20 * 16 + 8, { max: 200, tol: 6 });
    B.waitFor(() => B.f().onGround && B.pos().row === 13, 120, 'theo on the floor');
    B.walkTo(23 * 16 + 8); B.jumpTo(23 * 16 + 8);
    B.walkTo(27 * 16 + 8); B.jumpTo(27 * 16 + 8);
    B.walkTo(29 * 16 + 8);
    B.walkTo(33 * 16 + 8); B.jumpTo(33 * 16 + 8);
    B.walkTo(36 * 16 + 8);
    B.walkTo(37 * 16 + 8, { tol: 3 });
    B.holdUse(80); B.expectFlag('lift9');
    B.as('dex');
    B.waitFor(() => Math.abs(lift().y - (14 * 16 - 96)) < 0.5, 600, 'lift at the dock');
    B.pushTo(B.ent(e => e.crate), 47 * 16);
    B.waitFor(() => B.flag('botup'), 30, 'crate on the dock');
    B.jumpTo(49 * 16 + 8);
    B.walkTo(50 * 16 + 8);
    B.walkTo(52 * 16 + 8); B.jumpTo(52 * 16 + 8);
    B.walkTo(53 * 16 + 8, { tol: 3 });
    B.enter();
  },
];
