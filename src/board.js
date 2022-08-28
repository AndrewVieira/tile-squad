import { tuplify } from "./tuple.js";
import {
  PieceType,
  AllySet,
  EnemySet,
  Direction,
  MoveMapX,
  MoveMapY,
  Interaction,
  InteractionTable,
  Piece,
} from "./constants/piece.js";

class DijkstraMap {
  map;
  width;
  height;
  area;

  constructor(board, targets, impassables) {
    this.map = [];
    this.width = board.width;
    this.height = board.height;
    this.area = this.width * this.height;

    for (let index = 0; index < this.area; index++) {
      this.map.push(999);
    }

    this.markTargets(board.allies, targets, impassables);
    this.markTargets(board.enemies, targets, impassables);
    this.markTargets(board.objects, targets, impassables);

    const iterations = this.width + this.height;
    this.flood(iterations);
  }

  markTargets(pieces, targets, impassables) {
    for (const piece of pieces) {
      if (targets.includes(piece.type)) {
        this.map[this.getIndex(piece.x, piece.y)] = 0;
      } else if (impassables.includes(piece.type)) {
        this.map[this.getIndex(piece.x, piece.y)] = -1;
      }
    }
  }

  findNeighbors(index) {
    if (index < 0 || index >= this.area) {
      return [];
    }

    const neighbors = [];

    if (index - this.width >= 0) {
      neighbors.push(index - this.width);
    }

    if (index + this.width < this.map.length) {
      neighbors.push(index + this.width);
    }

    const x = index % this.width;

    if (x - 1 >= 0) {
      neighbors.push(index - 1);
    }

    if (x + 1 < this.width) {
      neighbors.push(index + 1);
    }

    return neighbors;
  }

  flood(iterations) {
    for (let i = 0; i < iterations; i++) {
      for (let index = 0; index < this.area; index++) {
        if (this.map[index] === i) {
          const neighbors = this.findNeighbors(index);
          for (const neighbor of neighbors) {
            if (this.map[neighbor] > i + 1) {
              this.map[neighbor] = i + 1;
            }
          }
        }
      }
    }
  }

  getIndex(x, y) {
    return y * this.width + x;
  }

  getCoords(index) {
    const coords = {};
    coords.x = index % this.width;
    coords.y = (index - coords.x) / this.width;
    return coords;
  }

  getDirection(origin, target) {
    const originCoords = this.getCoords(origin);
    const targetCoords = this.getCoords(target);

    if (originCoords.x + 1 === targetCoords.x) {
      return Direction.Right;
    }

    if (originCoords.x - 1 === targetCoords.x) {
      return Direction.Left;
    }

    if (originCoords.y + 1 === targetCoords.y) {
      return Direction.Down;
    }

    if (originCoords.y - 1 === targetCoords.y) {
      return Direction.Up;
    }
  }
}

class Board extends Phaser.Scene {
  scene;

  width;
  height;

  allies;
  enemies;
  objects;

  state;

  spriteSize = 32;
  spriteXOffset = 32;
  spriteYOffset = 32;

  constructor(scene, width, height) {
    super(scene);

    this.scene = scene;
    this.scene.add.existing(this);

    this.width = width;
    this.height = height;

    this.allies = [];
    this.enemies = [];
    this.objects = [];

    this.pieceGraphicsMap = new Map();
    this.pieceGraphicsMap.set(PieceType.OffBoard, null);
    this.pieceGraphicsMap.set(PieceType.Empty, null);
    this.pieceGraphicsMap.set(PieceType.Wall, 9);
    this.pieceGraphicsMap.set(PieceType.Warrior, 146);
    this.pieceGraphicsMap.set(PieceType.Thief, 144);
    this.pieceGraphicsMap.set(PieceType.Wizard, 151);
    this.pieceGraphicsMap.set(PieceType.Skeleton, 178);
    this.pieceGraphicsMap.set(PieceType.Slime, 169);
    this.pieceGraphicsMap.set(PieceType.Treasure, 32);

    this.state = "playing";
  }

  updateBoardState(direction) {
    if (this.state !== "playing") {
      return;
    }

    this.updateAllies(direction);
    this.updateEnemies(direction);

    if (this.allies.length === 0) {
      this.state = "defeat";
    }
  }

  updateAllies(direction) {
    for (const ally of this.allies) {
      this.movePiece(ally, direction);
    }
  }

  updateEnemies(direction) {
    for (const enemy of this.enemies) {
      const map = new DijkstraMap(
        this,
        [PieceType.Warrior, PieceType.Thief, PieceType.Wizard],
        [
          PieceType.Wall,
          PieceType.Skeleton,
          PieceType.Slime,
          PieceType.Treasure,
        ]
      );

      if (enemy.type === PieceType.Skeleton) {
        const index = map.getIndex(enemy.x, enemy.y);
        const neighbors = map.findNeighbors(index);

        let lowest = 999;
        let target = -1;

        for (const neighbor of neighbors) {
          if (map.map[neighbor] > -1 && map.map[neighbor] < lowest) {
            lowest = map.map[neighbor];
            target = neighbor;
          }
        }

        if (target > -1) {
          const enemyDirection = map.getDirection(index, target);
          this.movePiece(enemy, enemyDirection);
        }
      }
    }
  }

  getCell(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return PieceType.OffBoard;
    }

    for (const ally of this.allies) {
      if (ally.x === x && ally.y === y) {
        return ally.type;
      }
    }

    for (const enemy of this.enemies) {
      if (enemy.x === x && enemy.y === y) {
        return enemy.type;
      }
    }

    for (const object of this.objects) {
      if (object.x === x && object.y === y) {
        return object.type;
      }
    }

    return PieceType.Empty;
  }

  movePiece(piece, direction) {
    if (direction == undefined) {
      return;
    }

    const x = piece.x + MoveMapX[direction];
    const y = piece.y + MoveMapY[direction];

    const cell = this.getCell(x, y);

    const interaction = InteractionTable[tuplify(piece.type, cell)];

    switch (interaction) {
      case Interaction.Move:
        piece.x = x;
        piece.y = y;
        break;

      case Interaction.Kill:
        this.removePiece(x, y);
        piece.x = x;
        piece.y = y;
        break;

      case Interaction.Dies:
        this.removePiece(piece.x, piece.y);
        break;

      case Interaction.Wins:
        piece.x = x;
        piece.y = y;
        this.state = "victory";
        break;

      default:
        break;
    }

    if (piece.sprite === null) {
      return;
    }

    piece.sprite.x = piece.x * this.spriteSize + this.spriteXOffset;
    piece.sprite.y = piece.y * this.spriteSize + this.spriteYOffset;
  }

  addPiece(pieceType, x, y) {
    const cell = this.getCell(x, y);
    if (cell !== PieceType.Empty || cell === PieceType.OffBoard) {
      return;
    }

    const sprite = this.scene.add.sprite(
      x * this.spriteSize + this.spriteXOffset,
      y * this.spriteSize + this.spriteYOffset,
      "sprites",
      this.pieceGraphicsMap.get(pieceType)
    );
    let piece = new Piece(pieceType, x, y, sprite);

    if (AllySet.has(pieceType)) {
      this.allies.push(piece);
    } else if (EnemySet.has(pieceType)) {
      this.enemies.push(piece);
    } else {
      this.objects.push(piece);
      console.log(this.objects);
    }
  }

  removeSprite(piece) {
    if (piece.sprite !== null) {
      piece.sprite.destroy(true);
      piece.sprite = null;
    }
  }

  removePieceFromArray(x, y, pieces) {
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (piece.x === x && piece.y === y) {
        this.removeSprite(pieces[i]);
        pieces.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  removePiece(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }

    if (this.removePieceFromArray(x, y, this.allies)) {
      return;
    }
    if (this.removePieceFromArray(x, y, this.enemies)) {
      return;
    }
    if (this.removePieceFromArray(x, y, this.objects)) {
      return;
    }
  }

  getState() {
    return this.state;
  }
}

export { DijkstraMap, Board };
