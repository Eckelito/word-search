import {alphabet, wordData} from './parseInput.js';
const cells = document.getElementsByClassName("cell");

class wordC {
    isFound = false;

    constructor(word, startC, endC, index) {
        this.index = index;
        this.wordStr = word;
        [this.startX, this.startY] = startC;
        [this.endX, this.endY] = endC;
        [this.xDir, this.yDir] = direction(startC, endC);
    }
}

const wordObjs = [];
for (let entry of wordData) {
    wordObjs.push(new wordC(...entry));
}


function coordinateToCSSPos(c) {
    return ((c - 1) * 10 + 5) + "%";
}

function distance(c1, c2) {
    let [x1, y1] = c1;
    let [x2, y2] = c2;
    let distX = x2 - x1;
    let distY = y2 - y1;
    return [distX, distY];
}

function direction(c1, c2) {
    let [distX, distY] = distance(c1, c2);
    return [Math.sign(distX), Math.sign(distY)];
}

function isAligned(c1, c2) {
    let [distX, distY] = distance(c1, c2);
    return (Math.abs(distX) == Math.abs(distY) || Boolean(distY == 0 ^ distX == 0));
}

function setRandLetter(cell) {
    cell.innerHTML = alphabet[Math.floor(Math.random() * alphabet.length)];
}

function getCell(c) {
    let [x, y] = c;
    return document.querySelector(`[data-x='${x}'][data-y='${y}']`)
}

function getWordLabel(word) {
    return document.querySelector(`#wordList :nth-child(${word.index})`)
}

function setWord(word) {
    let [x, y] = [word.startX, word.startY];
    for (let i = 0; i < word.wordStr.length; i++) {
        let cell = getCell([x, y]);
        cell.innerHTML = word.wordStr[i];
        x += word.xDir;
        y += word.yDir;
    }

    getWordLabel(word).innerHTML = word.wordStr;

}

function getElementByTouch(e) {
    let targetTouch = e.targetTouches[0];
    return document.elementFromPoint(targetTouch.clientX, targetTouch.clientY);
}

window.onload = function () {
    let x1, x2, y1, y2;
    let x2Valid, y2Valid;
    let state = 1;
    let wordsFound = 0;
    let lines = document.getElementsByClassName("WSLine");
    let line = lines[0];

    function drawLine() {
        line.setAttribute("x1", coordinateToCSSPos(x1));
        line.setAttribute("y1", coordinateToCSSPos(y1));
        line.setAttribute("x2", coordinateToCSSPos(x2));
        line.setAttribute("y2", coordinateToCSSPos(y2));
    }

    function lineInitiate(e) {
        if (state == 1) {
            let x = Number(e.target.dataset.x);
            let y = Number(e.target.dataset.y);
            [x1, y1] = [x, y];
            [x2, y2] = [x, y];
            line.dataset.state = "on";
            drawLine();
            state = 2;
        }
    }

    function lineUpdateTouch(e) {
        if (state == 2) {
            let el = getElementByTouch(e);
            if (el.className == "cell") {
                let x = Number(el.dataset.x);
                let y = Number(el.dataset.y);
                [x2, y2] = [x, y];
                if (isAligned([x1, y1], [x, y])) {
                    [x2Valid, y2Valid] = [x2, y2];
                    drawLine();
                }
            }
        }
    }

    function lineUpdate(e) {
        if (state == 2) {
            let x = Number(e.target.dataset.x);
            let y = Number(e.target.dataset.y);
            [x2, y2] = [x, y];
            if (isAligned([x1, y1], [x, y])) {
                [x2Valid, y2Valid] = [x2, y2];
                drawLine();
            }
        }
    }

    function lineFinish(e) {
        for (let word of wordObjs) {
            if (((word.startX == x1 && word.endX == x2Valid) ||
                (word.startX == x2Valid && word.endX == x1)) &&
                ((word.startY == y1 && word.endY == y2Valid) ||
                    (word.startY == y2Valid && word.endY == y1))) {
                if (!word.isFound) {
                    word.isFound = true;
                    line.dataset.state = "found";
                    wordsFound++;
                    line = lines[wordsFound];
                    let label = getWordLabel(word);
                    label.dataset.found = "true";
                }
            }
        }
        line.dataset.state = "off";
        state = 1;
    }

    for (let cell of cells) {
        setRandLetter(cell);
        cell.addEventListener('mousedown', lineInitiate, false);
        cell.addEventListener('touchstart', lineInitiate, false);
        cell.addEventListener('mouseover', lineUpdate, false);
    }

    document.addEventListener('touchmove', lineUpdateTouch, false);
    document.body.addEventListener('mouseup', lineFinish, false);
    document.body.addEventListener('touchend', lineFinish, false);

    wordObjs.forEach(setWord);
}