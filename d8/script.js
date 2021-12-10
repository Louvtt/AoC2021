const readData = (txt) => {
    const data = {
        signals: []
    };

    const lines = txt.split("\n");
    for(let l of lines)
    {
        let splitted = l.split("|");
        let signal = {
            in : splitted[0].split(" ").filter(v => { return !!v; }),
            out: splitted[1].split(" ").filter(v => { return !!v; })
        };
        data.signals.push(signal);
    }

    console.table(data);
    return data;
} 

const is1478 = (entry, v=-1) =>
{
    switch(v)
    {
        case 1:
            return entry.length == 2;
        case 4:
            return entry.length == 4;
        case 7:
            return entry.length == 3;
        case 8:
            return entry.length == 7; 
        default: 
            return (entry.length <= 4 
                || entry.length == 7);
    }
    return false; // assure that it returns something
}

const getValue = (entry) => {
    switch(entry.length)
    {
        case 1:  return -1;
        case 2:  return  1;
        case 3:  return  7;
        case 4:  return  4;
        case 5:  return  235;
        case 6:  return  690;
        case 7:  return  8;
        default: return -1;
    }
}

const getSegments = (value) => {
    switch(value)
    {
        case 0:  return "abcefg";
        case 1:  return "cf";
        case 2:  return "acdeg";
        case 3:  return "acdfg";
        case 4:  return "bcdf";
        case 5:  return "abdfg";
        case 6:  return "abdefg";
        case 7:  return "acf";
        case 8:  return "abcdefg";
        case 9:  return "abcdfg";
        default: return "";
    }
}

const processData = (data) =>
{
    let outvalues = [];
    for(let v of data.signals) {
        let displaySignal = {
            1: [], 4: [], 7: [], 8: [], // simple deduction
            235: [],                  // length of 5
            690: []                   // length of 6
        };
        // read inputs
        for(let input of v.in) {
            let s = [...input].sort().join('');
            let v = getValue(s);
            if(v != -1 && !displaySignal[v].includes(s))
                displaySignal[v].push(...s);
        }
        for(let output of v.out) {
            let s = [...output].sort().join('');
            let v = getValue(s);
            if(v != -1 && !displaySignal[v].includes(s))
                displaySignal[v].push(...s);
        }

        // console.log(displaySignal);
        // deduction
        let displaymapping = { 
            a:[], 
            b:[], c:[],
            d:[],
            e:[], f:[],
            g:[]
        }; // abcdefg order

        // right signals
        if(displaySignal[1]) {
            displaymapping.c.push(...displaySignal[1]);
            displaymapping.f.push(...displaySignal[1]);
        }

        // top signal
        if(displaySignal[1] && displaySignal[7]) {
            for(let s of displaySignal[7])
                if(!displaySignal[1].includes(s)) 
                    displaymapping.a = s;
        }

        // middle + left top signal
        if(displaySignal[1] && displaySignal[4]) {
            for(let s of displaySignal[4]) {
                if(!displaySignal[1].includes(s)) {
                    displaymapping.b.push(s);
                    displaymapping.d.push(s);
                }
            }
        }

        // bottom + left bot
        if(displaySignal[8] && displaySignal[4] && displaySignal[7]) {
            for(let s of displaySignal[8]) {
                if(!displaySignal[4].includes(s)
                && !displaySignal[7].includes(s)) {
                    displaymapping.e.push(s);
                    displaymapping.g.push(s);
                }
            }
        }

        console.log(displaymapping);

        // if entry has the segment in it
        const has = (v, segment, all = false) => {
            let vv = [...v];
            if(segment == "a") return vv.includes("a");
            if(!all)
            {
                for(let s of displaymapping[segment])
                    if(vv.includes(s)) return true;
                return false;
            }
            for(let s of displaymapping[segment])
                if(!vv.includes(s)) return false;
            return true;
        }

        // what is the ouput
        const deduct = (v) => {
            switch(v.length) {
                case 2: return 1;
                case 3: return 7;
                case 4: return 4;
                case 7: return 8;
                case 5: // 235
                    if(has(v, 'c', true) && has(v, 'f', true)) return 3;
                    if(has(v, 'e', true)) return 2;
                    return 5;
                case 6: // 690
                    if(!has(v, 'c', true) && !has(v, 'f', true)) return 6;
                    if(has(v, 'd', true) && has(v, 'b', true)) return 9;
                    return 0;
                default: return;
            }
        }

        let outval = "";
        for(let output of v.out)
        {
            outval += deduct(output);
        }
        outvalues.push(parseInt(outval));
    }
    console.log(outvalues);

    let tot = 0;
    for(let v of outvalues)
        tot += v;
    console.log(tot);
    return tot;
}


const main = () =>
{
    const data = readData(rdata);
    processData(data);
}


window.onload = main;