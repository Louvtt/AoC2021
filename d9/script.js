const all = (arr) => {
    for(let v of arr)
        if(!v) return false;
    return true;
}

const readData = (txt) => {
    let data = {map: [], size: {w: 0, h: 0}};

    let lines = txt.split("\n");
    data.size.h = lines.length;
    data.size.w = lines[0].length;

    for(let line of lines) {
        let values = [...line].map(v => { return parseInt(v); });
        data.map.push(values);
    }

    // console.log("Data map: ", data.map);
    // console.log("Data size: {w:", data.size.w, ",h:", data.size.h, "}.");
    
    return data;
}

let bassinI = -1;
const showData = (data, ctx) => {
    // clear
    ctx.fillStyle = "#FF4422";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // show map
    const cellSize = ctx.canvas.width / Math.max(data.size.w, data.size.h);
    for(let y = 0; y < data.size.h; ++y) {
        for(let x = 0; x < data.size.w; ++x) {
            let color = (data.map[y][x] / 9.) * 255.; // map to [0; 1] => [0; 255]
            ctx.fillStyle = (data.droplets[y][x])? `rgb(0,0,255)` : `rgb(${color},${color}, ${color})`;
            ctx.fillRect(
                cellSize *  x   , cellSize *  y,
                cellSize, cellSize
            );
        }
    }

    const de = (ee) => {
        let s = ee.split('-');
        return {
            x: parseInt(s[0]) ?? 0,
            y: parseInt(s[1]) ?? 0
        }
    }

    // return;
    for(let bassin_i in data.bassins) {
        if(bassinI != -1 && bassin_i != bassinI) continue;
        let bassin = data.bassins[bassin_i];
        for(let cellstr of bassin) {
            let cell = de(cellstr);
            let color = ((data.map[cell.y][cell.x] + 2) / 9.) * 255.; // map to [0; 1] => [0; 255]
            ctx.fillStyle = `rgb(0,0,${color})`;
            ctx.fillRect(
                cellSize * cell.x, cellSize * cell.y,
                cellSize, cellSize
            )
        }
    }
}

const getDirs = (data, x, y) => {
    let dirs = [
        {x:  0, y: -1}, // top
        {x:  0, y:  1}, // bottom
        {x: -1, y:  0}, // left
        {x:  1, y:  0}, // right
    ]
    return dirs.filter(v => {
        if(x + v.x >= 0 && x + v.x < data.size.w
        && y + v.y >= 0 && y + v.y < data.size.h) 
            return true;
        return false;
    });
}

const spawnDroplets = (data) => {
    data.droplets = new Array(data.size.h);
    // spawn droplets
    // console.log("Spawning droplets");
    for(let y = 0; y < data.size.h; ++y) {
        data.droplets[y] = new Array(data.size.w);
        for(let x = 0; x < data.size.w; ++x) {
            if(data.map[y][x] == 9) // top
                 data.droplets[y][x] = true;
            else data.droplets[y][x] = false;
        }
    }
    return data;
}

const simulateDroplets = (data, iterations = 0) => {
    // droplet simulation
    console.log("Simulating droplets for", iterations, " iterations.");
    for(let i = 0; i < iterations; ++i) {
        let droplets = [...data.droplets]; // copy data
        // loop throught map & droplets
        for(let y = 0; y < data.size.h; ++y) {
            for(let x = 0; x < data.size.w; ++x) {
                if(data.droplets[y][x]) { // is there a droplet ?
                    // check neighbours
                    let dirs = getDirs(data, x, y);
                    let ch = data.map[y][x];
                    let n9 = [];
                    for(let dir of dirs) {
                        let xx = x + dir.x;
                        let yy = y + dir.y;
                        if(data.map[yy][xx] < ch) {
                            droplets[yy][xx] = true;
                            droplets[y ][x ] = false; // fallen
                        }

                        n9.push(data.map[yy][xx] == 9)
                    }
                    
                    if(all(n9)) droplets[y][x] = false;
                }
            }
        }

        data.droplets = [...droplets];
    }
    return data;
} 

const simulateBassins = (data) => {
    // check bassin
    data.bassins = [];
    for(let y = 0; y < data.size.h; ++y) {
        for(let x = 0; x < data.size.w; ++x) {
            if(data.droplets[y][x]) { // if droplets proceed floodfill
                data.bassins.push(floodFill(data, x, y));
            }
        }
    }
    return data;
}

const floodFill = (data, x, y) => {
    const t      = 2;
    const iLimit = 100;
    
    // encode and decode
    const e = (x, y) => {
        return `${x}-${y}`;
    }
    const de = (ee) => {
        let s = ee.split('-');
        return {
            x: parseInt(s[0]),
            y: parseInt(s[1])
        }
    }

    // process flood fill with a hashed queue of cell
    let bassin = [e(x,y)];
    let queue  = [e(x,y)];
    let i = 0;
    while(i < iLimit) {
        let d = de(queue.shift());

        let v    = data.map[d.y][d.x];
        let dirs = getDirs(data, d.x, d.y);
        for(let dir of dirs) {
            let xx = d.x + dir.x;
            let yy = d.y + dir.y;
            if(data.map[yy][xx] == 9) continue;

            // tolerance test
            let diff = data.map[yy][xx] - v;
            if(diff <= t) {
                let p = e(xx, yy);
                if(queue.includes(p) ) continue;
                if(bassin.includes(p)) continue;
                queue .push(p);
                bassin.push(p);
            }
        }
        ++i;

        if(queue.length == 0) break;
    }

    return bassin;
}

const processData = (data, iterations = 0) => {
    data = spawnDroplets(data);

    data = simulateDroplets(data, iterations);

    if(iterations > 10) {
        data = simulateBassins(data);
    }

    const bassinsSize = [];
    for(let bassin of data.bassins) {
        bassinsSize.push(bassin.length);
    }
    bassinsSize.sort((a, b) => a - b);
    let s = 1;
    for(let i = 0; i < 3; i++)
    {
        let v = bassinsSize.pop();
        s *= v;
        console.log(v);
    }
    console.log("Sum:", s);

    return data;
}


const sumDropletsHeights = (data) => {
    let s = 0;
    for(let y = 0; y < data.size.h; ++y) {
        for(let x = 0; x < data.size.w; ++x) {
            if(data.droplets[y][x]) { // is there a droplet ?
                s += data.map[y][x] + 1;
            }
        }
    }
    return s;
}

const main = () => {
    const out   = document.getElementById("out");
    const outS  = document.getElementById("outS");
    const ctx   = out.getContext("2d");
    const datan = document.getElementById("datan");
    const datas = document.getElementById("datas");

    const animIterations = false;
    const datai = document.getElementById("datai");
    const maxi = 100;

    let data = readData((datan.value == "rdata")? rdata : rtestdata);

    const update = () => {
        data  = readData((datan.value == "rdata")? rdata : rtestdata);
    
        data = processData(data, parseInt(datai.value));
        showData(data, ctx);

        const sum = sumDropletsHeights(data);
        outS.textContent = "Sum: " + sum.toString();
    }

    const solve = () => {
        data  = readData((datan.value == "rdata")? rdata : rtestdata);
    
        data = processData(data, maxi);
        showData(data, ctx);

        const sum = sumDropletsHeights(data);
        outS.text = "Sum: " + sum.toString();
    }

    update();
    datan.addEventListener("change", update);
    datai.addEventListener("change", update);

    datas.addEventListener("click", solve);

    const anim = () => {
        if(bassinI != -1) {
            bassinI += 1;
            if(bassinI >= data.bassins.length) bassinI = 0;
            showData(data, ctx);
        }
        if(animIterations) {
            datai.value = parseInt(datai.value) + 1;
            if(datai.value > maxi) datai.value = 0;
            showData(data, ctx);
        }
    }
    setInterval(anim, 500);
}


window.onload = main;