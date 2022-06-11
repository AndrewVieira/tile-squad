import MainMenuScene from "./scenes/main-menu.js";

const config = {
  type: Phaser.AUTO,
  background: "#000000",
  render: {
    pixelArt: true,
  },
  scale: {
    //mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 360,
    parent: "game",
  },
  scene: [MainMenuScene],
};

const game = new Phaser.Game(config);
