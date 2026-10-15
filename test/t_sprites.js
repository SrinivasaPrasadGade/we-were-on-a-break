// sprite sheet test
const Save = { data: { settings: { touch: 'auto' } } };
const Game = { touchControlsActive: () => false };
resizeScreen();
fill(0, 0, W, H, '#6a5a7a');
fill(0, 135, W, 135, '#4a3a5a');
const anims = ['idle', 'walk', 'jump', 'fall', 'push', 'climb', 'hold', 'fix', 'play', 'talk', 'magic', 'cheer'];
FRIENDS.forEach((who, i) => {
  anims.forEach((a, j) => {
    const pose = { anim: a, t: j * 7 + 3, expr: j === 0 ? 'happy' : undefined, quirk: null };
    blitPerson(ctx, friendSpecId(who, 0), friendSpecFn(who, 0), pose, 22 + j * 38, 44 + i * 44, {});
  });
});
// outfits row on the right? Draw extra row of expressions at the bottom right
drawText("The Gang's All Here  ★ ♪ café é 0123456789", 4, 2, '#fff', { shadow: '#000' });
present();
