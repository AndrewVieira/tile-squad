import { TextButton } from "../gui/text-button.js";

class MainMenuScene extends Phaser.Scene {
  playButton;

  constructor() {
    super("MainMenuScene");
  }

  preload() {}

  create() {
    this.playButton = new TextButton(this, "Play!", 200, 200, 200, 50).on(
      "pointerdown",
      () => {
        this.scene.start("PuzzleScene");
      }
    );
  }

  update(time, delta) {}
}

export default MainMenuScene;
