import { PieceType, Piece, Direction, Board } from "../src/board.js";

test("piece constructor", () => {
  const piece = new Piece(PieceType.Wizard, 2, 4);
  expect(piece.type).toBe(PieceType.Wizard);
  expect(piece.x).toBe(2);
  expect(piece.y).toBe(4);
});

test("board constructor", () => {
  const board = new Board(4, 7);
  expect(board.width).toBe(4);
  expect(board.height).toBe(7);
  expect(board.allies.length).toBe(0);
  expect(board.enemies.length).toBe(0);
  expect(board.objects.length).toBe(0);
});

test("update board state after player inputs action", () => {
  const board = new Board(4, 6);
  board.addPiece(PieceType.Wall, 0, 2);
  board.addPiece(PieceType.Warrior, 0, 3);

  const ally = board.allies[0];

  board.updateBoardState(Direction.Up);
  expect(ally.x).toBe(0);
  expect(ally.y).toBe(3);

  board.updateBoardState(Direction.Left);
  expect(ally.x).toBe(0);
  expect(ally.y).toBe(3);

  board.updateBoardState(Direction.Right);
  expect(ally.x).toBe(1);
  expect(ally.y).toBe(3);

  board.updateBoardState(Direction.Down);
  expect(ally.x).toBe(1);
  expect(ally.y).toBe(4);
});

test("add a piece to board", () => {
  const board = new Board(4, 6);
  board.addPiece(PieceType.Thief, 2, 5);

  expect(board.allies.length).toBe(1);

  let allyPiece = board.allies[0];
  expect(allyPiece.type).toBe(PieceType.Thief);
  expect(allyPiece.x).toBe(2);
  expect(allyPiece.y).toBe(5);

  board.addPiece(PieceType.Wizard, -1, -1);
  expect(board.allies.length).toBe(1);

  board.addPiece(PieceType.Skeleton, 2, 5);
  expect(board.enemies.length).toBe(0);

  board.addPiece(PieceType.Warrior, 2, 5);
  allyPiece = board.allies[0];
  expect(board.allies.length).toBe(1);
  expect(allyPiece.type).toBe(PieceType.Thief);

  board.addPiece(PieceType.Warrior, 1, 1);
  expect(board.allies.length).toBe(2);

  allyPiece = board.allies[1];
  expect(allyPiece.type).toBe(PieceType.Warrior);
  expect(allyPiece.x).toBe(1);
  expect(allyPiece.y).toBe(1);
});

test("remove a piece from board", () => {
  const board = new Board(4, 6);
  board.addPiece(PieceType.Thief, 2, 5);
  board.addPiece(PieceType.Skeleton, 3, 3);
  board.addPiece(PieceType.Wall, 2, 1);

  board.removePiece(0, 0);
  expect(board.allies.length).toBe(1);
  expect(board.enemies.length).toBe(1);
  expect(board.objects.length).toBe(1);

  board.removePiece(2, 5);
  expect(board.allies.length).toBe(0);

  board.removePiece(3, 3);
  expect(board.enemies.length).toBe(0);

  board.removePiece(2, 1);
  expect(board.objects.length).toBe(0);
});
