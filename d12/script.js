const readData = (txt) => {
    let data = {
        paths: {}
    };

    const addPath = (a, b) => {
        if(data.paths[a]) {
            data.paths[a].connected.push(b);
            return;
        }
        data.paths[a] = {
            connected: [b],
            type: (a.toLowerCase() == a) ? "small" : "big"
        };
    }

    const lines = txt.split('\n');
    for(let line of lines) {
        let [id, target] = line.split('-');
        // console.log(id, target);
        addPath(id, target);
        addPath(target, id);
    }

    return data;
}

const showData = (data, ctx) => {
    const center = {
        x: ctx.canvas.width  * .5,
        y: ctx.canvas.height * .5
    };
    const dist = 140;
    
    let points = [];
    let lines  = [];

    // scatter around a circle
    let pKeys = Object.keys(data.paths);
    let a = pKeys.length / (2.*Math.PI);
    for(let p in pKeys) {
        let path = data.paths[pKeys[p]];
        let x = Math.cos(a * p) * dist + center.x;
        let y = Math.sin(a * p) * dist + center.y;
        points.push({x: x, y: y, oldX: x, oldY: y, text: pKeys[p], lock: (pKeys.path == "start")});
        for(let c of path.connected) {
            let a = p;
            let b = pKeys.indexOf(c);
            lines.push([a, b]);
        }
    }
    for(let l_i in lines) {
        let p1 = lines[l_i][0];
        let p2 = lines[l_i][1];
        lines[l_i] = [points[p1], points[p2]];
    }

    let v = new VelvetIntegration(points, lines, ctx, dist);
    const u = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        v.update();
    }
    for(let i = 0; i < 50; ++i)
        u();
}

// Array.prototype.count = function(obj){
//     var count = this.length;
//     if(typeof(obj) !== "undefined"){
//         var array = this.slice(0), count = 0; // clone array and reset count
//         for(i = 0; i < array.length; i++){
//            if(array[i] == obj){ count++ }
//         }
//     }
//     return count;
// }
const arr_count = (arr, it) => {
    let cnt = 0;
    for(let i = 0; i < arr.length; ++i)
        cnt += (arr[i] == it)? 1 : 0;
    return cnt;
}

const processData = (data) => {
    let possiblePaths = [];
    let startNode = data.paths["start"];

    
    let pathCount = 0;
    const traverse = (node, currentPath=[], visitedTwice = false) => {
        for(let p of node.connected) {
            let pNode = data.paths[p];
            if (pNode.type == "big") {
                let path = [...currentPath, p];
                let r = traverse(pNode, path, visitedTwice);
                if(r[r.length - 1] == "end") possiblePaths.push(r);
                continue;
            }
            if(pNode.type == "small"){
                switch(p) {
                    case "start": continue;
                    case "end":
                        currentPath.push("end");
                        // return currentPath;
                        break;
                    default:
                        const count = arr_count(currentPath, p);
                        if(count == 0) {
                            let path = [...currentPath, p];
                            let r = traverse(pNode, path, visitedTwice);
                            if(r[r.length - 1] == "end") possiblePaths.push(r);
                            break;
                        }
                        if(!visitedTwice && count < 2) {
                            let path = [...currentPath, p];
                            let r = traverse(pNode, path, true);
                            if(r[r.length - 1] == "end") possiblePaths.push(r);
                        }
                        break;
                }
            }
        }
        if(currentPath[currentPath.length - 1] == "end")
            pathCount+=1;
        return currentPath;
    }

    traverse(startNode, ["start"]);
    // filter
    // let fpaths = [];
    // for(let path of possiblePaths) {
    //     let str = path.join(",");
    //     if(!fpaths.includes(str) && path[path.length - 1] == "end") {
    //         fpaths.push(str);
    //     }
    // }
    // console.log(fpaths.length);
    // console.log(fpaths);

    // outP2_1 = fpaths;
    console.log(pathCount);
    return pathCount;
}

const generateSelect = (obj) => {
    for(let d in datasets) {
        obj.innerHTML += `<option value="${d}">${d}</option>`
    }
}

const main = () => {
    const canvas = document.querySelector("#canvas0");
    const ctx    = canvas.getContext("2d");
    const datan  = document.querySelector("#datan");
    generateSelect(datan);
    let data = readData(datasets[datan.value]);

    const update = () => {
        data = readData(datasets[datan.value]);
        out.textContent = processData(data);

        showData(data, ctx);
    }

    update();
    datan.addEventListener("change", update);
}

window.onload = main;