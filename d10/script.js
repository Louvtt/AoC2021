const readData = (txt) => {
    let data = {
        blocks: txt.split('\n')
    };

    return data;
}

const decodeData = (data) => {
    for(let block_i in data.blocks) {
        let block = data.blocks[block_i];
        let counters = {
            "()": 0, "[]": 0, "{}": 0, "<>": 0 
        };

        let currentChunkQueue = [];
        let chunks = ["()", "[]", "{}", "<>"];
        let corrupted     = false;
        let corruptedChar = "";
        for(let char of block) {
            for(let chunk of chunks) {
                if(chunk.includes(char)) {
                    let opening = !(chunk.indexOf(char));
                    counters[chunk] += opening ? 1 : -1;
                    if(!opening) {// check if correct char for closing
                        if(currentChunkQueue[currentChunkQueue.length -1] != chunk) {
                            // corrupted
                            corrupted     = true;
                            if(corruptedChar == "")
                                corruptedChar = chunk[1];
                        }
                        currentChunkQueue.pop();
                        // console.log("Pop", currentChunkQueue, char)
                        break;
                    }
                    currentChunkQueue.push(chunk);
                    // console.log("Push", currentChunkQueue, char)
                    break;
                }
            }
            // stop first corrupted chunk
            // if(corrupted) break;
        }
        data.blocks[block_i] = {
            str: block,
            corrupted: corrupted,
            illegalChar: corruptedChar,
            chunkToComplete: currentChunkQueue
        };
    }

    return data;
}

const partOne = (data) => {
    let scoringRules = {
        ')': 3,    ']': 57,
        '}': 1197, '>': 25137
    }
    
    // calculate score
    let corrupted =  data.blocks.filter(v => v.corrupted);
    let s = 0;
    for(let c of corrupted)
    {
        s += scoringRules[c.illegalChar];
    }
    // console.log(s);
}

const partTwo = (data) => {
    // console.log(data);
    let scoringRules = {
        ')': 1,    ']': 2,
        '}': 3, '>': 4
    }

    let incomplete = data.blocks.filter(v => !v.corrupted);

    // calculate score
    const calcBlockScore = (b) => {
        let s = 0;
        for(let i = b.chunkToComplete.length - 1; i >= 0; --i) {
            let cc = b.chunkToComplete[i];
            s *= 5;
            s += scoringRules[cc[1]]; // (score for closing char for chunk)
            // console.log("bs:", s, " - ", cc);
        }
        return s;
    }

    let scores = [];
    for(let b of incomplete) {
        scores.push(calcBlockScore(b));
    }
    scores.sort((a,b) => a - b);
    let middleIdx = Math.floor(scores.length * .5);
    console.log(scores.length, middleIdx);
    console.log(scores[middleIdx]);
}

const processData = (data) => {
    data = decodeData(data);

    partOne(data);

    partTwo(data);
}


const main = () => {
    const datan = document.querySelector("#datan");
    let data = readData(datan.value == "rtestdata" ? rtestdata : rdata);

    const update = () => {
        data = readData(datan.value == "rtestdata" ? rtestdata : rdata);
        processData(data);
    }

    update();
    datan.addEventListener("change", update);
}

window.onload = main;