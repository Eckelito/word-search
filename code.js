const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function coordinateToPos(c) {
    return ((c - 1) * 10 + 5) + "%";
}

function isAligned(c1, c2) {
    let [x1, y1] = c1;
    let [x2, y2] = c2;
    let distX = x2 - x1;
    let distY = y2 - y1;
    return (Math.abs(distX) == Math.abs(distY) || Boolean(distY == 0 ^ distX == 0));
}

function setRandLetterCell(cell) {
    cell.innerHTML = letters[Math.floor(Math.random() * letters.length)];
}

let cells = document.getElementsByClassName("cell");

window.onload = function () {
    let x1, x2, y1, y2;
    let state = 1;
    let line = document.getElementById("line1");


    function drawLine() {
        line.setAttribute("x1", coordinateToPos(x1));
        line.setAttribute("y1", coordinateToPos(y1));
        line.setAttribute("x2", coordinateToPos(x2));
        line.setAttribute("y2", coordinateToPos(y2));
    }

    function lineInitiate(e) {
        if (state == 1) {
            let x = Number(e.target.dataset.x);
            let y = Number(e.target.dataset.y);
            [x1, y1] = [x, y];
            [x2, y2] = [x, y];
            state = 2;
            drawLine();
        }
    }

    function lineUpdate(e) {
        if (state == 2) {
            let x = Number(e.target.dataset.x);
            let y = Number(e.target.dataset.y);
            [x2, y2] = [x, y];
            drawLine();
            if (isAligned([x1, y1], [x, y])) {
                line.dataset.state = "aligned";
            }
            else{
                line.dataset.state = "notAligned";
            }
        }
    }

    function lineClear(e) {
        line.dataset.state = "off";
        state = 1;
    }

    for (let cell of cells) {
        setRandLetterCell(cell);
        cell.addEventListener('mousedown', lineInitiate, false);
        cell.addEventListener('mouseover', lineUpdate, false);
        cell.addEventListener('mouseup', lineClear, false);
    }
}