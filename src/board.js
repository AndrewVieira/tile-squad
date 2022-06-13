import { tuplify } from "./Tuple.js";

const PieceType = {
  OffBoard: 0,
  Empty: 1,
  Wall: 2,

  Warrior: 3,
  Thief: 4,
  Wizard: 5,

  Skeleton: 6,

  Treasure: 7,
};

const AllySet = new Set([PieceType.Warrior, PieceType.Thief, PieceType.Wizard]);
const EnemySet = new Set([PieceType.Skeleton]);

const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
};

const MoveMapX = {};
MoveMapX[Direction.Up] = 0;
MoveMapX[Direction.Down] = 0;
MoveMapX[Direction.Left] = -1;
MoveMapX[Direction.Right] = 1;

const MoveMapY = {};
MoveMapY[Direction.Up] = -1;
MoveMapY[Direction.Down] = 1;
MoveMapY[Direction.Left] = 0;
MoveMapY[Direction.Right] = 0;

const Interaction = {
  None: 0,
  Move: 1,
  Kill: 2,
  Dies: 3,
  Wins: 4,
};

const InteractionTable = {};
InteractionTable[tuplify(PieceType.Warrior, PieceType.Empty)] =
  Interaction.Move;
InteractionTable[tuplify(PieceType.Warrior, PieceType.Skeleton)] =
  Interaction.Kill;
InteractionTable[tuplify(PieceType.Warrior, PieceType.Treasure)] =
  Interaction.Wins;

InteractionTable[tuplify(PieceType.Thief, PieceType.Empty)] = Interaction.Move;
InteractionTable[tuplify(PieceType.Thief, PieceType.Skeleton)] =
  Interaction.Dies;
InteractionTable[tuplify(PieceType.Thief, PieceType.Treasure)] =
  Interaction.Wins;

InteractionTable[tuplify(PieceType.Wizard, PieceType.Empty)] = Interaction.Move;
InteractionTable[tuplify(PieceType.Wizard, PieceType.Skeleton)] =
  Interaction.Dies;
InteractionTable[tuplify(PieceType.Wizard, PieceType.Treasure)] =
  Interaction.Wins;

InteractionTable[tuplify(PieceType.Skeleton, PieceType.Empty)] =
  Interaction.Move;
InteractionTable[tuplify(PieceType.Skeleton, PieceType.Warrior)] =
  Interaction.Dies;
InteractionTable[tuplify(PieceType.Skeleton, PieceType.Thief)] =
  Interaction.Kill;
InteractionTable[tuplify(PieceType.Skeleton, PieceType.Wizard)] =
  Interaction.Kill;

class Piece {
  type;
  x;
  y;

  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

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

class Board {
  width;
  height;

  allies;
  enemies;
  objects;

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.allies = [];
    this.enemies = [];
    this.objects = [];
  }

  updateBoardState(direction) {
    this.updateAllies(direction);
    this.updateEnemies(direction);
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
        [PieceType.Wall, PieceType.Skeleton]
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

        console.log(index);
        console.log(target);

        if (target > -1) {
          const enemyDirection = map.getDirection(index, target);
          console.log("Direction:", enemyDirection);
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
        break;

      default:
        break;
    }
  }

  addPiece(pieceType, x, y) {
    const cell = this.getCell(x, y);
    if (cell !== PieceType.Empty || cell === PieceType.OffBoard) {
      return;
    }

    let piece = new Piece(pieceType, x, y);

    if (AllySet.has(pieceType)) {
      this.allies.push(piece);
    } else if (EnemySet.has(pieceType)) {
      this.enemies.push(piece);
    } else {
      this.objects.push(piece);
    }
  }

  removePiece(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }

    for (let i = 0; i < this.allies.length; i++) {
      const ally = this.allies[i];
      if (ally.x === x && ally.y === y) {
        this.allies.splice(i);
        return;
      }
    }

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (enemy.x === x && enemy.y === y) {
        this.enemies.splice(i);
        return;
      }
    }

    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      if (object.x === x && object.y === y) {
        this.objects.splice(i);
        return;
      }
    }
  }
}

export { PieceType, AllySet, EnemySet, Direction, Piece, DijkstraMap, Board };
