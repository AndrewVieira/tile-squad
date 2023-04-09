import { InteractionTable } from "../src/board/piece.js";

test("creation of interaction table data", () => {
    const expected = {
        '(3,1)': 1,
        '(3,6)': 2,
        '(3,7)': 2,
        '(3,8)': 4,
        '(4,1)': 1,
        '(4,6)': 3,
        '(4,7)': 3,
        '(4,8)': 4,
        '(5,1)': 1,
        '(5,6)': 3,
        '(5,7)': 3,
        '(5,8)': 4,
        '(6,1)': 1,
        '(6,3)': 3,
        '(6,4)': 2,
        '(6,5)': 2,
        '(6,8)': 1
      };

    expect(expected).toEqual(InteractionTable);
});