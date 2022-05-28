function letterToNum(l){
    return l.toLowerCase().charCodeAt(0) - 96;
}

window.onload = function () {
    let cells = document.getElementsByClassName("cell");

    for (let cell of cells) {
        cell.onclick = function () {
            let coo = cell.classList[1];
            let x = letterToNum(coo[0]);
            let y = Number(coo.substring(1));
            let circle = document.getElementsByClassName("circle")[0];
            circle.setAttribute("style", "grid-area: " + y + " / " + x + "; visibility: visible");
            
        };
    }       
};  