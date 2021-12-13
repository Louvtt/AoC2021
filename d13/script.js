const readData = (txt) => {
    let data = {
        points: [],
        folds:  [],
        size: { w: 0, h: 0 }
    };

    let part = 0;
    let lines = txt.split('\n');
    for(let line of lines) {
        let token = line.split(" ")[0];
        switch(token) {
            case "":     break;
            case "fold": 
                let o = line.split(" ").pop();
                let [ax, v] = o.split("=");
                data.folds.push({axis: ax, value: parseInt(v)});
                break;
            default:
                let s = line.split(",");
                let p = {
                    x: parseInt(s[0]),
                    y: parseInt(s[1])
                };

                data.size.w = Math.max(data.size.w, p.x);
                data.size.h = Math.max(data.size.h, p.y);

                data.points.push(p);
                break;
        }
        
    }

    data.size.w += 1;
    data.size.h += 1;

    console.log(data);

    return data;
}

const showData = (data, foldI) => {
    data.ctx.clearRect(0,0,data.ctx.canvas.width, data.ctx.canvas.height);

    data.ctx.canvas.width  = data.size.w;
    data.ctx.canvas.height = data.size.h;
    
    data.ctx.fillStyle = "#000";
    data.ctx.fillRect(0,0,data.size.w,data.size.h);

    data.ctx.fillStyle = "#fff";
    for(const p of data.points) {
        data.ctx.fillRect(p.x, p.y, 1, 1);
    }

    if(foldI != -1) {
        let f = data.folds[foldI];
        if(!f) return str;
        data.ctx.strokeStyle = "#F00";
        if(f.axis == "x") {
            data.ctx.moveTo(f.value, 0);
            data.ctx.lineTo(f.value, data.size.h);
            data.ctx.stroke();
        }
        if(f.axis == "y")  {
            data.ctx.moveTo(0,           f.value);
            data.ctx.lineTo(data.size.w, f.value);
            data.ctx.stroke();
        }
    }
}

const buf2str = (data, foldI = -1) => {
    let str = "";
    for(let i = 0; i < data.size.h; ++i) {
        for(let j = 0; j < data.size.w; ++j) {
            str += "."
        }
        str += "\n";
    }

    const str_set = (idx, char) => {
        str = str.substring(0, idx) + char + str.substring(idx+char.length);
    }
    const addPt = (p) => str_set(p.x + p.y * (data.size.w+1), "#");
    const addLh = (y) => {
        for(let x = 0; x < data.size.w; ++x)
            str_set(x + y * (data.size.w+1), "-");
    }
    const addLv = (x) => {
        for(let y = 0; y < data.size.h; ++y)
            str_set(x + y * (data.size.w+1), "|");
    }
    
    // show pts
    for(const p of data.points) {
        addPt(p);
    }

    if(foldI != -1) {
        let f = data.folds[foldI];
        if(!f) return str;
        if(f.axis == "x") addLv(f.value);
        if(f.axis == "y") addLh(f.value);
    }

    return str;
}

const interval = 100;
const processData = (data) => {
    // data.paper.value = buf2str(data, 0);
    showData(data, 0);
    
    let i = 0;
    let loop;
    let nextFold = () => {
        console.log("Fold ", i+1, "/", data.folds.length);

        // fold
        let fold = data.folds[i];
        let points  = [];
        let hashPos = [];
        for(let p_i = 0; p_i < data.points.length; ++p_i)
        {
            let p = data.points[p_i];
            if(fold.axis == "x" && p.x > fold.value)
                p.x = 2*fold.value - p.x;
            if(fold.axis == "y" && p.y > fold.value)
                p.y = 2*fold.value - p.y;

            let h = `${p.x}-${p.y}`;
            if(!hashPos.includes(h)) {
                points.push(p);
                hashPos.push(h);
            }
        }
        data.points = [...points];

        
        if(fold.axis == "x") data.size.w = fold.value;
        if(fold.axis == "y") data.size.h = fold.value;

        // show fold result
        showData(data, i);
        console.log(data.size);
        out.textContent = "Points: " + data.points.length;

        // end
        ++i;
        if(i >= data.folds.length) {
            clearInterval(loop);
            setTimeout(()=>{
                showData(data, -1);
            },interval);
        }
    }
    loop = setInterval(nextFold, interval);
    
}

const generateSelect = (obj) => {
    for(let d in datasets) {
        obj.innerHTML += `<option value="${d}">${d}</option>`
    }
}

const main = () => {
    const paper = document.querySelector("#paper");
    const out   = document.querySelector("#out");
    const ctx   = document.querySelector("#canvas0").getContext("2d");
    canvas0.style.imageRendering = "crisp-edges";
    const datan = document.querySelector("#datan");
    generateSelect(datan);
    let data = readData(datasets[datan.value]);

    const update = () => {
        data = readData(datasets[datan.value]);
        data.paper = paper;
        data.out = out;
        data.ctx= ctx;

        processData(data);
    }

    update();
    datan.addEventListener("change", update);
}

window.onload = main;