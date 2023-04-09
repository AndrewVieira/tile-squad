function parseCSV(source, delimiter) {
    if (typeof(source) !== "string") {
        return [];
    }

    if (typeof(delimiter) !== "string") {
        return [];
    }

    const result = [];
    const lines = source.split("\n");
    
    for (let line = 0; line < lines.length; line++) {
        const tokens = lines[line].split(delimiter);
        result.push(tokens);
    }

    return result;
}

export { parseCSV };