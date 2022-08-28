import { PieceType, EnemySet, Direction, Piece } from "./../constants/piece.js";
import { Board } from "./../board.js";
import { TextButton } from "../gui/text-button.js";

class PuzzleScene extends Phaser.Scene {
  board;

  graphics;
  grid;
  pieceRects;

  menuButton;
  pieceGraphicsMap;

  gridOverlay;
  victoryMessage;
  defeatMessage;

  constructor() {
    super("PuzzleScene");
    this.puzzleState = "loading";
  }

  preload() {
    // this.load.image('sprites', 'rsc/images/fantasy-tileset.png');
    this.load.spritesheet("sprites", "rsc/images/fantasy-tileset.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    //this.add.image(0, 0, "sprites");
    this.board = new Board(this, 8, 4);
    this.board.addPiece(PieceType.Thief, 1, 1);
    this.board.addPiece(PieceType.Wall, 4, 3);
    this.board.addPiece(PieceType.Skeleton, 7, 3);
    this.board.addPiece(PieceType.Wizard, 2, 0);
    this.board.addPiece(PieceType.Warrior, 3, 0);
    this.board.addPiece(PieceType.Treasure, 7, 0);
    this.board.addPiece(PieceType.Slime, 0, 0);

    this.grid = [];

    this.graphics = this.add.graphics({
      lineStyle: { width: 2, color: 0x00ff00 },
      fillStyle: { color: 0xff0000 },
    });

    for (let x = 0; x < this.board.width; x++) {
      for (let y = 0; y < this.board.height; y++) {
        this.grid.push(
          new Phaser.Geom.Rectangle(16 + x * 32, 16 + y * 32, 32, 32)
        );
      }
    }

    this.gridOverlay = new Phaser.Geom.Rectangle(
      16,
      16,
      32 * this.board.width - 1,
      32 * this.board.height
    );

    this.victoryMessage = this.add
      .text(20, 20, "You Win!", { fill: "#fff", align: "center" })
      .setDepth(1)
      .setVisible(false);

    this.defeatMessage = this.add
      .text(20, 20, "You Lost!", { fill: "#fff", align: "center" })
      .setDepth(1)
      .setVisible(false);

    this.input.keyboard.on("keyup-UP", (event) => {
      this.board.updateBoardState(Direction.Up);
    });

    this.input.keyboard.on("keyup-DOWN", (event) => {
      this.board.updateBoardState(Direction.Down);
    });

    this.input.keyboard.on("keyup-LEFT", (event) => {
      this.board.updateBoardState(Direction.Left);
    });

    this.input.keyboard.on("keyup-RIGHT", (event) => {
      this.board.updateBoardState(Direction.Right);
    });

    this.menuButton = new TextButton(
      this,
      "Return to Menu",
      300,
      20,
      200,
      50
    ).on("pointerdown", () => {
      this.scene.start("MainMenuScene");
    });

    this.puzzleState = "playing";
  }

  update(time, delta) {
    this.graphics.clear();

    this.drawGrid();

    const state = this.board.getState();

    if (state === "defeat") {
      this.drawDefeatMessage();
    } else if (state === "victory") {
      this.drawVictoryMessage();
    }
  }

  drawGrid() {
    this.graphics.lineStyle(2, 0x00ff00);

    for (let i = 0; i < this.grid.length; i++) {
      this.graphics.strokeRectShape(this.grid[i]);
    }
  }

  drawDefeatMessage() {
    this.graphics.fillStyle(0xff0000);
    this.graphics.fillRectShape(this.gridOverlay);
    this.defeatMessage.setVisible(true);
  }

  drawVictoryMessage() {
    this.graphics.fillStyle(0x0000ff);
    this.graphics.fillRectShape(this.gridOverlay);
    this.victoryMessage.setVisible(true);
  }
}

export default PuzzleScene;
