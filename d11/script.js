const readData = (txt) => {
    let data = {
        map: [],
        size: {w: 10, h: 10} // static size
    };

    let lines = txt.split('\n');
    for(let line of lines)
        data.map.push([...line].map(v => parseInt(v)));

    console.log(data);
    return data;
}

const showData = (data) => {
    const ctx = data.ctx;
    const rgb = (v) => {
        let c = (v+1) * 25.5;
        if(v < 10) return `rgb(${c}, ${c * .1}, ${c * .07})`;
        return `#fff`; // flash
    }

    const cellSize = ctx.canvas.width / 10;
    for(let y = 0; y < data.size.h; ++y) {
        for(let x = 0; x < data.size.w; ++x) {
            ctx.fillStyle = rgb(data.map[y][x]);
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

            if(data.dbg) {
                ctx.fillStyle = (data.map[y][x] > 3)? "#000": "#fff";
                ctx.fillText(data.map[y][x].toString(), (x+.5) * cellSize , (y+.5) * cellSize);
                if(data.hasFlash.includes(e(x,y)))
                    ctx.fillText("f", x * cellSize, (y+.3) * cellSize);
            }
        }
    }
}

// hash pos
const e  = (x,y) => {return `${x}-${y}`};
const de = (v  ) => {return v.split('-').map(v=>parseInt(v))};

const getDirs = (data, x, y) => {
    let dirs = [
        {x:  0, y: -1}, // top
        {x:  0, y:  1}, // bottom
        {x: -1, y:  0}, // left
        {x:  1, y:  0}, // right
        // diagonals
        {x: -1, y: -1}, // top-left
        {x: -1, y:  1}, // bottom-left
        {x:  1, y:  1}, // bottom-right
        {x:  1, y: -1}, // top-right
    ]
    return dirs.filter(v => {
        if(x + v.x >= 0 && x + v.x < data.size.w
        && y + v.y >= 0 && y + v.y < data.size.h) 
            return true;
        return false;
    });
}

const flash = (data, x, y) => {
    if(data.hasFlash.includes(e(x,y))) return data; // already flashed this turn
    if(data.map[y][x] > 9) { // should flash
        data.hasFlash.push(e(x,y));
        data.flashCount += 1;
        data.map[y][x] = 0;

        // propagate
        {
            let dirs = getDirs(data, x, y);
            for(let dir of dirs) {
                let xx = x + dir.x;
                let yy = y + dir.y;
                if(data.hasFlash.includes(e(xx,yy))) continue;
                data.map[yy][xx]+=1;
            }

            showData(data);
            for(let dir of dirs) {
                let xx = x + dir.x;
                let yy = y + dir.y;
                data = flash(data, xx, yy);
            }
        }
    }
    return data;
}

const animDuration = 10 * 1000; // milliseconds
const iterations   = 300;
const processData = (data, ctx) => {
    data.ctx = ctx;
    data.flashCount = 0;

    let i = 0;
    const next = () => {
        // energy up
        for(let y = 0; y < data.size.h; ++y) {
            for(let x = 0; x < data.size.w; ++x) {
                data.map[y][x]+=1;
            }
        }
        
        // propagate
        data.hasFlash = [];
        for(let y = 0; y < data.size.h; ++y) {
            for(let x = 0; x < data.size.w; ++x) {
                data = flash(data, x, y);
            }
        }

        if(data.hasFlash.length == data.size.w * data.size.h) {
            console.log("All flashed at:", i+1);
        }

        // show step value
        showData(data);
        // run next if not finished state
        out.textContent = `${i}: ${data.flashCount}`;
        i++;
        if(i < iterations)
            setTimeout(next, animDuration / iterations) // 1000 / 100 = 10 (seconds / iterations)
    }

    next();
    console.log(data);
}


const main = () => {
    const canvas = document.querySelector("#canvas0");
    const ctx    = canvas.getContext("2d");
    const datan  = document.querySelector("#datan");
    const out    = document.querySelector("#out");
    const dbgV   = document.querySelector("#dbgV");
    let data = readData(datan.value == "rtestdata" ? rtestdata : rdata);

    const update = () => {
        data = readData(datan.value == "rtestdata" ? rtestdata : rdata);
        data.out = out;
        data.dbg = dbgV.checked;
        processData(data, ctx);
    }

    update();
    datan.addEventListener("change", update);

    dbgV.addEventListener("change", () => data.dbg = this.checked);
}

window.onload = main;