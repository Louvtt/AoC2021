const readData = (txt) => {
    let data = {

    };

    return data;
}

const processData = (data) => {

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