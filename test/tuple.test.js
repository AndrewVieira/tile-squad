import { tuplify, Tuple } from "../src/utils/tuple.js";

test("create tuple string with tuplify", () => {
  const tuple = tuplify(1, 2, 3);
  expect(tuple).toEqual("(1,2,3)");
});

test("create tuple object", () => {
  const tuple = new Tuple("apple", 55);

  expect(tuple[0]).toBe("apple");
  expect(tuple[1]).toBe(55);
  expect(tuple.length).toBe(2);
  expect(tuple.string).toBe("(apple,55)");
});

test("compare two tuple objects", () => {
  const tuple1 = new Tuple("apple", 55);
  const tuple2 = new Tuple("pear", 55);
  const tuple3 = new Tuple("apple", 55);

  expect(tuple1.equals(tuple2)).toBe(false);
  expect(tuple1.equals(tuple3)).toBe(true);
  expect(tuple1.equals(72)).toBe(false);
});
