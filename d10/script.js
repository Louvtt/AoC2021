const readData = (txt) => {
    let data = {
        block: txt.split('\n')
    };

    return data;
}

const processData = (data) => {
    let scoringRules = {
        ')': 3,    ']': 57,
        '}': 1197, '>': 25137
    }
}