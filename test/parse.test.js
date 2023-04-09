import { parseCSV } from "../src/utils/parse.js";

test("convert a csv string to a 2d array", () => {
    const expected = [
        ["test1", "1", "2", "3"],
        ["test2", "4", "5", "6"],
        ["test3", "7", "8"]
    ];

    const source = "test1,1,2,3\ntest2,4,5,6\ntest3,7,8";

    const result = parseCSV(source, ",");
    expect(result).toEqual(expected);
});

test("check if parsing valid string", () => {
    const expected = [];
    const result = parseCSV(404, ",");
    expect(result).toEqual(expected);
});

test("check if parsing with valid delimiter", () => {
    const expected = [];

    const source = "test1,1,2,3\ntest2,4,5,6\ntest3,7,8";

    const result = parseCSV(source, 404);
    expect(result).toEqual(expected);
});