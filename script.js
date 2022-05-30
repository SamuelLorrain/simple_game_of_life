document.body.onload = draw;

const canvas = document.querySelector("canvas");
const playBtn = document.querySelector(".play");
playBtn.onclick = start;
const pauseBtn = document.querySelector(".pause");
pauseBtn.onclick = stop;
const checkerBoardBtn = document.querySelector(".checker");
checkerBoardBtn.onclick = checkerBoard;
const ctx = canvas.getContext("2d");
const xElements = 32;
const yElements = 32;
const size = 25;

const colors = {
    0: '#fff',
    1: '#000'
}
let map = new Uint8Array(xElements*yElements);
let newMap = new Uint8Array(xElements*yElements);
let intervalHandler = undefined;

function start() {
    if(!intervalHandler) {
        intervalHandler = setInterval(updateCells, 500);
    }
}
function stop() {
    clearInterval(intervalHandler);
}
function checkerBoard() {
    for(let i = 0; i < xElements; i++) {
        for(let j = 0; j < yElements; j++) {
            if((i%2 == 0 && j%2 == 0) || (i%2 == 1 && j%2 == 1)) {
                map[j*xElements+i] = 1;
            }
        }
    }
    draw();
}

canvas.onmousedown = onMouseDown;
canvas.width = xElements*size;
canvas.height = yElements*size;

function onMouseDown(e) {
    let canvasX = Math.floor(e.offsetX/size);
    let canvasY = Math.floor(e.offsetY/size);
    map[canvasY*xElements+canvasX] = map[canvasY*xElements+canvasX] == 1 ? 0 : 1;
    draw();
}

function draw() {
    for(let j = 0; j < yElements; j++) {
        for(let i = 0; i < xElements; i++) {
            ctx.fillStyle = colors[map[j*xElements+i]];
            ctx.fillRect(
                i*size,
                j*size,
                size,
                size
            );
        }
    }
}

function xyFromIndex(index) {
    let y = Math.floor(index/xElements);
    let x = index-(y*xElements);
    return [
        x,
        y
    ];
}

function indexFromXY(a) {
    let x = a[0];
    let y = a[1];
    return [y*xElements+x];
}

function adjacents(index) {
    let [x,y] = xyFromIndex(index);
    return {
        left: indexFromXY([x-1, y]),
        right: indexFromXY([x+1, y]),
        up: indexFromXY([x, y-1]),
        down: indexFromXY([x, y+1]),
        upLeft: indexFromXY([x-1, y-1]),
        upRight: indexFromXY([x+1, y-1]),
        downLeft: indexFromXY([x-1, y+1]),
        downRight: indexFromXY([x+1, y+1]),
    };
}

function aliveInNextGen(index) {
    let current = map[index];
    let neighbours = adjacents(index);

    // by convention, if the index
    // of the neighbour is outside of the map,
    // it is equal to 0
    let aliveNeighbours = 0;
    aliveNeighbours += isLegit(neighbours.left) ? map[neighbours.left] : 0;
    aliveNeighbours += isLegit(neighbours.right) ? map[neighbours.right] : 0;
    aliveNeighbours += isLegit(neighbours.up) ? map[neighbours.up] : 0;
    aliveNeighbours += isLegit(neighbours.down) ? map[neighbours.down] : 0;
    aliveNeighbours += isLegit(neighbours.upLeft) ? map[neighbours.upLeft] : 0;
    aliveNeighbours += isLegit(neighbours.upRight) ? map[neighbours.upRight] : 0;
    aliveNeighbours += isLegit(neighbours.downLeft) ? map[neighbours.downLeft] : 0;
    aliveNeighbours += isLegit(neighbours.downRight) ? map[neighbours.downRight] : 0;

    if (current) {
        if (aliveNeighbours == 2 || aliveNeighbours == 3) {
            return true;
        }
        return false;
    }
    else {
        if (aliveNeighbours == 3) {
            return true;
        }
    }
    return false;
}

function isLegit(index) {
    let [x,y] = xyFromIndex(index);
    isInRange = !!(index >= 0 && index < xElements*yElements);
    return isInRange && x >= 0 && x < xElements-1 && y >= 0 && y < yElements-1;
}

function updateCells() {
    for(let i = 0; i < xElements*yElements; i++) {
        if (aliveInNextGen(i)) {
            newMap[i] = 1;
        } else {
            newMap[i] = 0;
        }
    }
    map.set(newMap);
    draw();
}
