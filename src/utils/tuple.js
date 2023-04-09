function tuplify() {
  const values = [];

  for (let i = 0; i < arguments.length; i++) {
    values[i] = arguments[i];
  }

  return "(" + values.join(",") + ")";
}

class Tuple {
  constructor() {
    for (let i = 0; i < arguments.length; i++) {
      this[i] = arguments[i];
    }

    this.length = arguments.length;
    this.string = this.toString();
  }

  toString() {
    const values = [];

    for (let i = 0; i < this.length; i++) {
      values[i] = this[i];
    }

    return "(" + values.join(",") + ")";
  }

  equals(target) {
    return this.string === target.string;
  }
}

export { tuplify, Tuple };
