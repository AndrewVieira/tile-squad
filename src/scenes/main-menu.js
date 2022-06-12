class MainMenuScene extends Phaser.Scene {
  playButton;

  constructor() {
    super("MainMenuScene");
  }

  preload() {}

  create() {
    this.playButton = this.add.text(100, 100, "Play!", { fill: "#0f0" })
    .setInteractive()
    .on("pointerdown", () => {
      this.scene.start("PuzzleScene");
    })
    .on("pointerover", () => {
      this.playButton.setStyle({ fill: "#ff0" });
    })
    .on("pointerout", () => {
      this.playButton.setStyle({ fill: "#0f0" });
    });
  }

  update(time, delta) {}
}

export default MainMenuScene;
