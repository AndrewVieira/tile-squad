class MainMenuScene extends Phaser.Scene {
  playButton;

  constructor() {
    super("MainMenuScene");
  }

  preload() {}

  create() {
    this.playButton = this.add.text(100, 100, "Play!", { fill: "#0f0" });
    this.playButton.setInteractive();

    this.playButton.on("pointerdown", () => {
      this.scene.start("PuzzleScene");
    });
  }

  update(time, delta) {}
}

export default MainMenuScene;
