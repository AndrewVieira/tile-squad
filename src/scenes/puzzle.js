import { PieceType, EnemySet, Direction, Piece, Board } from "./../board.js";
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
    this.pieceGraphicsMap = {};
    this.pieceGraphicsMap[PieceType.OffBoard] = 0x000000;
    this.pieceGraphicsMap[PieceType.Empty] = 0x000000;
    this.pieceGraphicsMap[PieceType.Wall] = 0x00ff00;
    this.pieceGraphicsMap[PieceType.Warrior] = 0x0000ff;
    this.pieceGraphicsMap[PieceType.Thief] = 0x00ffff;
    this.pieceGraphicsMap[PieceType.Wizard] = 0xff8800;
    this.pieceGraphicsMap[PieceType.Skeleton] = 0xff0000;
    this.pieceGraphicsMap[PieceType.Slime] = 0xff0000;
    this.pieceGraphicsMap[PieceType.Treasure] = 0xffff00;
  }

  create() {
    this.board = new Board(8, 4);
    this.board.addPiece(PieceType.Thief, 1, 1);
    this.board.addPiece(PieceType.Wall, 4, 3);
    this.board.addPiece(PieceType.Skeleton, 7, 3);
    this.board.addPiece(PieceType.Wizard, 2, 0);
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

    this.gridOverlay = new Phaser.Geom.Rectangle(16, 16, 32 * this.board.width - 1, 32 * this.board.height);

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
    this.drawPieces();

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

  drawPieces() {
    this.pieceRects = [];

    this.prepareDrawingPieces(this.board.objects);
    this.prepareDrawingPieces(this.board.allies);
    this.prepareDrawingPieces(this.board.enemies);

    for (const piece of this.pieceRects) {
      this.graphics.fillStyle(this.pieceGraphicsMap[piece.type]);
      this.graphics.fillRectShape(piece.rect);
    }
  }

  prepareDrawingPieces(pieces) {
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