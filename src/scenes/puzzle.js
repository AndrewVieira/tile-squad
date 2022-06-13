import { PieceType, EnemySet, Direction, Piece, Board } from "./../board.js";
import { TextButton } from "../gui/text-button.js";

class PuzzleScene extends Phaser.Scene {
  board;

  graphics;
  grid;
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
    this.board.addPiece(PieceType.Skeleton, 7, 3);

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
  }

  update(time, delta) {
    this.graphics.clear();

    this.drawGrid();
    this.drawPieces();
  }

  drawGrid() {
    this.graphics.lineStyle(2, 0x00ff00);

    for (let i = 0; i < this.grid.length; i++) {
      this.graphics.strokeRectShape(this.grid[i]);
    }
  }

  drawPieces() {
    this.pieceRects = [];

    this.preparePieces(this.board.allies);
    this.preparePieces(this.board.enemies);
    this.preparePieces(this.board.objects);

    for (const piece of this.pieceRects) {
      if (piece.type === PieceType.Wall) {
        this.graphics.fillStyle(0x00ff00);
      } else if (EnemySet.has(piece.type)) {
        this.graphics.fillStyle(0xff0000);
      } else {
        this.graphics.fillStyle(0x0000ff);
      }

      this.graphics.fillRectShape(piece.rect);
    }
  }

  preparePieces(pieces) {
    for (const piece of pieces) {
      const rect = {
        type: piece.type,
        rect: 0,
      };

      rect.rect = new Phaser.Geom.Rectangle(
        24 + 32 * piece.x,
        24 + 32 * piece.y,
        16,
        16
      );

      this.pieceRects.push(rect);
    }
  }
}

export default PuzzleScene;
