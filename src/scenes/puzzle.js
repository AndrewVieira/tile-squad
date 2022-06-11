import { PieceType, Direction, Piece, Board } from "./../board.js";

class PuzzleScene extends Phaser.Scene {
  board;

  graphics;
  rectangles;
  pieceRects;

  menuButton;

  constructor() {
    super("PuzzleScene");
  }

  preload() {}

  create() {
    this.board = new Board(8, 4);
    this.board.addPiece(PieceType.Warrior, 2, 2);
    this.board.addPiece(PieceType.Thief, 1, 1);
    this.board.addPiece(PieceType.Wall, 4, 3);

    this.graphics = this.add.graphics({
      lineStyle: { width: 2, color: 0x00ff00 },
      fillStyle: { color: 0xff0000 },
    });
    this.rectangles = [];

    for (let x = 0; x < this.board.width; x++) {
      for (let y = 0; y < this.board.height; y++) {
        this.rectangles.push(
          new Phaser.Geom.Rectangle(16 + x * 32, 16 + y * 32, 32, 32)
        );
      }
    }

    this.input.keyboard.on("keyup-UP", (event) => {
      this.board.updateBoardState(Direction.Up);
      console.log("up");
    });

    this.input.keyboard.on("keyup-DOWN", (event) => {
      this.board.updateBoardState(Direction.Down);
      console.log("down");
    });

    this.input.keyboard.on("keyup-LEFT", (event) => {
      this.board.updateBoardState(Direction.Left);
      console.log("left");
    });

    this.input.keyboard.on("keyup-RIGHT", (event) => {
      this.board.updateBoardState(Direction.Right);
      console.log("right");
    });

    this.menuButton = this.add.text(300, 20, "Return to Menu", {
      fill: "#0f0",
    });
    this.menuButton.setInteractive();

    this.menuButton.on("pointerdown", () => {
      this.scene.start("MainMenuScene");
    });
  }

  update(time, delta) {
    this.graphics.clear();

    this.pieceRects = [];

    for (let i = 0; i < this.rectangles.length; i++) {
      this.graphics.strokeRectShape(this.rectangles[i]);
    }

    for (let i = 0; i < this.board.allies.length; i++) {
      const target = this.board.allies[i];
      this.pieceRects.push(
        new Phaser.Geom.Rectangle(
          24 + 32 * target.x,
          24 + 32 * target.y,
          16,
          16
        )
      );
    }

    for (let i = 0; i < this.board.objects.length; i++) {
      const target = this.board.objects[i];
      this.pieceRects.push(
        new Phaser.Geom.Rectangle(
          24 + 32 * target.x,
          24 + 32 * target.y,
          16,
          16
        )
      );
    }

    for (let i = 0; i < this.pieceRects.length; i++) {
      this.graphics.strokeRectShape(this.pieceRects[i]);
    }
  }
}

export default PuzzleScene;
