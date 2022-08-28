import { DijkstraMap, Board } from "../src/board.js";

import { PieceType, Piece, Direction } from "../src/constants/piece.js";

import PuzzleScene from "../src/scenes/puzzle.js";

scene;

beforeEach(() => {
  const config = {
    type: Phaser.AUTO,
    background: "#000000",
    render: {
      pixelArt: true,
    },
    scale: {
      //mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 640,
      height: 360,
      parent: "game",
    },
    callbacks: {
      postBoot: function () {
        game.loop.stop();
        scene = game.scene.getScene("PuzzleScene");
      },
    },
    scene: [PuzzleScene],
  };

  const game = new Phaser.Game(config);
});

afterEach(() => {
  game.destroy(true, true);
  game.runDestroy();
});

test("piece constructor", () => {
  const piece = new Piece(PieceType.Wizard, 2, 4);
  expect(piece.type).toBe(PieceType.Wizard);
  expect(piece.x).toBe(2);
  expect(piece.y).toBe(4);
});

test("board constructor", () => {
  const board = new Board(scene, 4, 7);
  expect(board.width).toBe(4);
  expect(board.height).toBe(7);
  expect(board.allies.length).toBe(0);
  expect(board.enemies.length).toBe(0);
  expect(board.objects.length).toBe(0);
});

test("update board state after player inputs action", () => {
  const board = new Board(scene, 4, 6);
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
  const board = new Board(scene, 4, 6);
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
  const board = new Board(scene, 4, 6);
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

test("make a dijkstra map to target", () => {
  const solution = [
    [7, 6, 7, 6],
    [6, 5, -1, 5],
    [5, 4, 3, 4],
    [4, 3, 2, 3],
    [3, 2, 1, 2],
    [2, 1, 0, 1],
  ];

  const board = new Board(scene, 4, 6);

  board.addPiece(PieceType.Thief, 2, 5);
  board.addPiece(PieceType.Skeleton, 3, 3);
  board.addPiece(PieceType.Wall, 2, 1);

  const map = new DijkstraMap(
    board,
    [PieceType.Warrior, PieceType.Thief, PieceType.Wizard],
    [PieceType.Wall]
  );
  expect(map.map.join(",")).toBe(solution.join(","));
});
