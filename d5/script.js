const readData = (txt) =>
{
    let rawLines = txt.split("\n");

    let data = {
        lines: [],
        size : {w: 0, h: 0}
    };
    const v2 = (arr) => { return {x: parseInt(arr[0]), y: parseInt(arr[1])}; };

    for(let line of rawLines)
    {
        if(line == "") continue;
        let rpos = line.split("->");
        let pos1 = v2(rpos[0].split(","));
        let pos2 = v2(rpos[1].split(","));
        let nLine = {
            pos1,
            pos2
        };
        data.size.w = Math.max(data.size.w, pos1.x);
        data.size.w = Math.max(data.size.w, pos2.x);

        data.size.h = Math.max(data.size.h, pos1.y);
        data.size.h = Math.max(data.size.h, pos2.y);

        data.lines.push(nLine);
    }

    data.size.w += 1;
    data.size.h += 1;

    console.log(data);
    console.log(data.lines.length)
    return data;
}

const updateLineBuffer = (data, line_i) =>
{
    const buffer = [];
    for(let y = 0; y < data.size.h; ++y)
    {
        buffer.push([]);
        for(let x = 0; x < data.size.w; ++x)
            buffer[y].push(0);
    }
    for(let l = 0; l < parseInt(line_i) + 1; ++l)
    {
        let line = data.lines[l];

        let dy = line.pos2.y - line.pos1.y;
        let dx = line.pos2.x - line.pos1.x;
        if(Math.abs(dx) >= Math.abs(dy))
        {
            for(let s = 0; s < Math.abs(dx) + 1; ++s)
            {
                let x = line.pos1.x + Math.sign(dx) * s;
                let y = line.pos1.y + Math.sign(dy) * s;
                buffer[y][x] += 1;
            }
        } else {
            for(let s = 0; s < Math.abs(dy) + 1; ++s)
            {
                let x = line.pos1.x + Math.sign(dx) * s;
                let y = line.pos1.y + Math.sign(dy) * s;
                buffer[y][x] += 1;
            }
        }
    }

    return buffer;
}

const maxLineCross = (buf) =>
{
    let m = 0;
    for(let line of buf)
        for(let v of line)
            m = Math.max(m, v);
    return m;
}

const buffer2str = (buf) =>
{
    let txt = "";
    for(let y = 0; y < buf.length; ++y)
    {
        for(let x = 0; x < buf[y].length; ++x)
        {
            txt += (buf[y][x] == 0)? '.' : `${buf[y][x]}`;
        }
        txt += '\n';
    }
    return txt;
}

const lineCrossPt = (buf, n) =>
{
    let ptnb = 0;
    for(let line of buf)
        for(let v of line)
            if(v >= n) ptnb += 1;
    return ptnb;
}

const main = () =>
{
    let line_i = 0;
    const out        = document.getElementsByClassName("out");
    const nextLineBt = document.getElementById("nextLine");
    const lineIdx    = document.getElementById("linei");
    let data = readData(rdata);
    lineIdx.max = data.lines.length - 1;
    lineIdx.value = lineIdx.max;

    const updateOut = () =>
    {
        line_i += 1;
        if(line_i >= data.lines.length) line_i = 0;
        lineIdx.innerHTML = line_i;

        const buf        = updateLineBuffer(data, lineIdx.value);
        out[0].innerHTML = buffer2str(buf);
        out[1].innerHTML = `max line cross   : ${maxLineCross(buf)}`;
        out[2].innerHTML = `line cross points: ${lineCrossPt(buf, 2)}`;
    };

    nextLineBt.addEventListener("click", updateOut);
    lineIdx   .addEventListener("change", updateOut);
    
    updateOut();
}


window.onload = main;