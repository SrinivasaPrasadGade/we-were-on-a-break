// Touch controls, pause menu, settings, controls, title + boot screens
module.exports = async ({ page, shot }) => {
  const step = async (name, fn, arg) => { await page.evaluate(fn, arg); await shot(name); };
  await step('ui_touch', () => {
    const G = window.__gang; G.Game.manual = true;
    G.Save.data.settings.touch = 'on'; G.Input.touchUI = true;
    const L = new G.LevelScene(3, { room: 0, noMusic: true });
    G.Game.setScene(L);
    for (let i = 0; i < 40; i++) G.Game.update();
    G.Input.touchHeld.right = true;
    for (let i = 0; i < 20; i++) G.Game.update();
    G.Game.draw(); G.present();
  });
  await step('ui_pause', () => {
    const G = window.__gang; G.Input.touchHeld.right = false;
    G.Game.openPause(G.Game.scene);
    for (let i = 0; i < 20; i++) G.Game.update();
    G.Game.draw(); G.present();
  });
  await step('ui_settings', () => {
    const G = window.__gang; const P = G.Game.overlay;
    P.menu.items.find(i => i.label === 'Settings').action();
    for (let i = 0; i < 20; i++) G.Game.update();
    G.Game.draw(); G.present();
  });
  await step('ui_controls', () => {
    const G = window.__gang; const P = G.Game.overlay;
    P.mode = 'controls';
    for (let i = 0; i < 20; i++) G.Game.update();
    G.Game.draw(); G.present();
  });
  await step('ui_title', () => {
    const G = window.__gang; G.Game.overlay = null;
    G.Game.setScene(new G.TitleScene());
    for (let i = 0; i < 200; i++) G.Game.update();
    G.Game.draw(); G.present();
  });
};
