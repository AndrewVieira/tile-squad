import { tuplify } from "./../tuple.js";

const PieceType = {
  OffBoard: 0,
  Empty: 1,
  Wall: 2,

  Warrior: 3,
  Thief: 4,
  Wizard: 5,

  Skeleton: 6,
  Slime: 7,

  Treasure: 8,
};

const AllySet = new Set([PieceType.Warrior, PieceType.Thief, PieceType.Wizard]);
const EnemySet = new Set([PieceType.Skeleton, PieceType.Slime]);

const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
  UpLeft: 4,
  UpRight: 5,
  DownLeft: 6,
  DownRight: 7,
};

const MoveMapX = {};
MoveMapX[Direction.Up] = 0;
MoveMapX[Direction.Down] = 0;
MoveMapX[Direction.Left] = -1;
MoveMapX[Direction.Right] = 1;
MoveMapX[Direction.UpLeft] = -1;
MoveMapX[Direction.UpRight] = 1;
MoveMapX[Direction.DownLeft] = -1;
MoveMapX[Direction.DownRight] = 1;

const MoveMapY = {};
MoveMapY[Direction.Up] = -1;
MoveMapY[Direction.Down] = 1;
MoveMapY[Direction.Left] = 0;
MoveMapY[Direction.Right] = 0;
MoveMapY[Direction.UpLeft] = 1;
MoveMapY[Direction.UpRight] = 1;
MoveMapY[Direction.DownLeft] = -1;
MoveMapY[Direction.DownRight] = -1;

const StandardMoveSet = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];
const DiagonalMoveSet = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
  Direction.UpLeft,
  Direction.UpRight,
  Direction.DownLeft,
  Direction.DownRight,
];

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
InteractionTable[tuplify(PieceType.Warrior, PieceType.Slime)] =
  Interaction.Kill;
InteractionTable[tuplify(PieceType.Warrior, PieceType.Treasure)] =
  Interaction.Wins;

InteractionTable[tuplify(PieceType.Thief, PieceType.Empty)] = Interaction.Move;
InteractionTable[tuplify(PieceType.Thief, PieceType.Skeleton)] =
  Interaction.Dies;
InteractionTable[tuplify(PieceType.Thief, PieceType.Slime)] = Interaction.Dies;
InteractionTable[tuplify(PieceType.Thief, PieceType.Treasure)] =
  Interaction.Wins;

InteractionTable[tuplify(PieceType.Wizard, PieceType.Empty)] = Interaction.Move;
InteractionTable[tuplify(PieceType.Wizard, PieceType.Skeleton)] =
  Interaction.Dies;
InteractionTable[tuplify(PieceType.Wizard, PieceType.Slime)] = Interaction.Dies;
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
InteractionTable[tuplify(PieceType.Skeleton, PieceType.Treasure)] =
  Interaction.Move;

class Piece {
  type;
  sprite;
  x;
  y;

  constructor(type, x, y, sprite = null) {
    this.type = type;
    this.sprite = sprite;
    this.x = x;
    this.y = y;
  }
}

export {
  PieceType,
  AllySet,
  EnemySet,
  Direction,
  MoveMapX,
  MoveMapY,
  Interaction,
  InteractionTable,
  Piece,
};
