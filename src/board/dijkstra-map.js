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
} from "./piece.js";

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

    assignNeighbors(index, value) {
      if (this.map[index] !== value) {
        return;
      }

      const neighbors = this.findNeighbors(index);

      for (const neighbor of neighbors) {
        if (this.map[neighbor] > value + 1) {
          this.map[neighbor] = value + 1;
        }
      }
    }
  
    flood(iterations) {
      for (let value = 0; value < iterations; value++) {
        for (let index = 0; index < this.area; index++) {
            this.assignNeighbors(index, value);
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

  export { DijkstraMap };