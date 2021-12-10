const readData = (dataset) =>
{
    let lines = dataset.split('\n');

    let data = {
        drawnNumbers: [],
        boards: []
    };

    let board = [];
    for(let i = 0; i < lines.length; ++i)
    {
        if(i == 0) {
            let splittedData = lines[i].split(",");
            data.drawnNumbers = splittedData;
            continue;
        }
        if(lines[i] == "") {
            if(board.length != 0) data.boards.push(board);
            board = [];
            continue;
        }
        let splittedData = lines[i].split(" ").filter((v, idx) => !!v);
        board.push(splittedData);
    }

    // flag board
    for(let b_i in data.boards)
    {
        let b = data.boards[b_i];
        for(let l_i in b)
        {
            for(let n_i in b[l_i])
            {
                b[l_i][n_i] = {
                    n: parseInt(b[l_i][n_i]),
                    f: false
                };
            }
        }
        data.boards[b_i] = b;
    }
    return data;
};

const bingo = (board) =>
{
    let columns = [];
    for(let i = 0; i < board[0].length; ++i) { columns.push(board[0][i].f); };

    for(let i = 0; i < board.length; ++i)
    {
        let lines  = board[i][0].f;
        for(let j = 1; j < board[i].length; ++j)
        {
            columns[j] = columns[j] && board[i][j].f
            lines      = lines && board[i][j].f;
        }
        if(lines) { return true; }
    }
    for(let c in columns)
        if(columns[c]) { return true; }
    return false;
}

const flagBoard = (board, number) =>
{
    for(let i = 0; i < board.length; ++i)
        for(let j = 0; j < board[i].length; ++j)
            if(!board[i][j].f)
                board[i][j].f = (board[i][j].n == number);
}

const boardSumUnmarked = (board) => 
{
    let sum = 0;
    for(let i = 0; i < board.length; ++i)
        for(let j = 0; j < board[i].length; ++j)
            if(!board[i][j].f)
                sum += board[i][j].n;
    return sum;
}

const processDrawn = (data, first = false) =>
{
    let wonBoards = {boards: [], drawn: []};
    for(let n of data.drawnNumbers)
    {
        for(let b_i in data.boards)
        {
            flagBoard(data.boards[b_i], n);
            if(bingo(data.boards[b_i]))
            {
                if(!wonBoards.boards.includes(b_i))
                {
                    console.log("Board", b_i, " is bingo. (", n, ").");
                    wonBoards.boards.push(b_i);
                    wonBoards.drawn.push(n);
                    if(wonBoards.boards.length == data.boards.length)
                        return [wonBoards.boards[wonBoards.boards.length - 1], wonBoards.drawn[wonBoards.drawn.length - 1]];
                }
                if(first) return [b_i, n];
            }
        }
    }

    return [0, 0];
}

const main = () =>
{
    let data = readData(rdata);
    let [fboard_i, fnumber] = processDrawn(data);
    console.log("res[boardidx, drawnb]:", [fboard_i, fnumber], "\nboard:", data.boards[fboard_i]);

    let sum = boardSumUnmarked(data.boards[fboard_i]);
    let f = sum * fnumber;
    console.log("boardsum  :", sum, "\nfinalvalue:", f);
}


window.onload = main;