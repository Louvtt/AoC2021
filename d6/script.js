const readData = (txt) => {
    return txt.split(",").map(v => { return parseInt(v) });
}

const processData = (data, day) =>
{
    let buf = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    for(let v of data) buf[v] += 1;

    for(let d = 1; d < day + 1; ++d)
    {
        let tmp = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        for(let v in buf)
        {
            if(v == 0) 
            {
                tmp[6] += buf[0];
                tmp[8] += buf[0];
                continue;
            }
            tmp[v - 1] += buf[v];
        }
        buf = [ ...tmp ];
    }
    return buf;
}

const getTotal = (buf) => {
    let tot = 0;
    for(let v of buf)
        tot += v;
    return tot;
}

const main = () => {
    const data = readData(rdata);
    const out  = document.getElementsByClassName("out");
    const InDay = document.getElementById("day");

    console.log("Initial state:", data);
    const update = () => {
        console.log("Trying for", InDay.value, " day(s)");
        let buf = processData(data, parseInt(InDay.value));
        console.log(buf);
        out[1].textContent = `Total lanterfish: ${getTotal(buf)}`;
    };
    update();
    InDay.addEventListener("change", update);
}
window.onload = main;
