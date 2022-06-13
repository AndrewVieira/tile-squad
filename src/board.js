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

  updateEnemies(direction) {}

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
        this.removePiece(x, y);
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

  makeDijsktaMap(targets, impassables) {
    let map = [];
    for (let row = 0; row < this.height; row++) {
      map.push([]);
      for (let col = 0; col < this.width; col++) {
        map[row].push(999);
      }
    }

    for (const ally of this.allies) {
      if (targets.includes(ally.type)) {
        map[ally.y][ally.x] = 0;
      } else if (impassables.includes(impassables)) {
        map[ally.y][ally.x] = -1;
      }
    }

    for (const enemy of this.enemies) {
      if (targets.includes(targets)) {
        map[enemy.y][enemy.x] = 0;
      } else if (impassables.includes(enemy.type)) {
        map[enemy.y][enemy.x] = -1;
      }
    }

    for (const object of this.objects) {
      if (targets.includes(targets)) {
        map[object.y][object.x] = 0;
      } else if (impassables.includes(object.type)) {
        map[object.y][object.x] = -1;
      }
    }

    const iterations = this.width + this.height;

    for (let i = 0; i < iterations; i++) {
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          if (map[row][col] === i) {
            if (row - 1 >= 0 && map[row - 1][col] > i + 1) {
              map[row - 1][col] = i + 1;
            }

            if (row + 1 < map.length && map[row + 1][col] > i + 1) {
              map[row + 1][col] = i + 1;
            }

            if (col - 1 >= 0 && map[row][col - 1] > i + 1) {
              map[row][col - 1] = i + 1;
            }

            if (col + 1 < map[row].length && map[row][col + 1] > i + 1) {
              map[row][col + 1] = i + 1;
            }
          }
        }
      }
    }

    return map;
  }
}

export { PieceType, Direction, Piece, Board };
