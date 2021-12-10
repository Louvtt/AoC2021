const readData = (data) => {
    return data;
}

const processData = (data, pos) =>
{
    let fuelCost = 0;
    for(let crab of data)
    {
        let cost = Math.abs(crab - pos);
        let c = 0;
        for(let i = 0; i < cost + 1; ++i)
            c += i;
        fuelCost += c;
    }
    return fuelCost;
}

const findLeast = (data) => {
    let max = Math.max(...data);
    console.log(max);
    let v   = processData(data, 0);
    let p   = 0;
    for(let i = 1; i < max + 1; ++i)
    {
        let vv = processData(data, i);
        if(vv < v)
        {
            v = vv;
            p = i;
        }
    }
    return [v, p];
}

const main = () =>
{
    const data  = readData(rdata);
    const out   = document.getElementsByClassName("out");
    out[0].value = "";
    const InPos = document.getElementById("pos");
    const LeastBt = document.getElementById("findL");

    const update = () => {
        out[0].value += "For pos " + InPos.value.toString() + " : " + processData(data, InPos.value) + " fuelPt\n";
    };
    InPos.addEventListener("change", update);
    update();


    LeastBt.addEventListener("click", () => {
        let res = findLeast(data);
        out[0].value = `The least cost is ${res[0]} for ${res[1]}.\n`;
    });
}


window.onload = main;