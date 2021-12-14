const readData = (txt) => {
    let data = {
        input: "",
        pairs: {}
    };

    let lines = txt.split("\n");
    data.input = lines[0];

    for(let i = 2; i < lines.length; ++i)
    {
        let [pair, elmt] = lines[i].split(" -> ");
        data.pairs[pair] = elmt;
    }


    return data;
}

const it = 40;
const processData = (data) => {
    console.log(data);
    data.rinput = data.input;

    // convert input into hashed pairs
    data.input  = {};
    for(let i = 0; i < data.rinput.length - 1; ++i)
    {
        let pair = data.rinput[i] + data.rinput[i+1];
        if(!data.input[pair])
            data.input[pair] = 0;
        data.input[pair] += 1;
    }
    console.log(data.input);

    const processInput = () => {
        let tmp = {};
        for(let pair in data.input)
        {
            let c = data.pairs[pair];
            let p1 = pair[0] + c,
                p2 = c + pair[1];
            // console.log(pair, c, "=>", p1, p2);

            let nb = data.input[pair];
            const kk = Object.keys(tmp);
            if(!kk.includes(p1)) tmp[p1] = 0;
            if(!kk.includes(p2)) tmp[p2] = 0;
            tmp[p1] += nb;
            tmp[p2] += nb;
        }
        data.input = {...tmp};
    }

    const countElements = () => {
        let counts = {};
        let kk = Object.keys(data.input);
        for(let c of kk)
        {
            if(!counts[c[0]]) counts[c[0]] = 0;
            counts[c[0]] += data.input[c];
        }
        console.log(counts);
        
        let k = Object.keys(counts)[0];
        let min = counts[k]
            max = counts[k];
        for(let c in counts) {
            min = Math.min(min, counts[c]);
            max = Math.max(max, counts[c]);
        }

        console.log(`min: ${min}, max: ${max}, result: ${max - min + 1}`);
    }

    for(let i = 0; i < it; ++i)
    {
        processInput();
        console.log("After step", i+1, ":", data.input);
    }

    countElements();
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