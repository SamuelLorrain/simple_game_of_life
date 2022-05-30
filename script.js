document.body.onload = draw;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const xElements = 16;
const yElements = 16;
const size = 50;

const colors = {
    0: '#fff',
    1: '#000'
}
let map = new Uint8Array(xElements*yElements);
let newMap = new Uint8Array(xElements*yElements);
// for(let i = 0; i < xElements; i++) {
//     for(let j = 0; j < yElements; j++) {
//         if((i%2 == 0 && j%2 == 0) || (i%2 == 1 && j%2 == 1)) {
//             map[j*xElements+i] = 1;
//         }
//     }
// }

canvas.onmousedown = onMouseDown;
canvas.width = 16*size;
canvas.height = 16*size;

function onMouseDown(e) {
    let canvasX = Math.floor(e.offsetX/size);
    let canvasY = Math.floor(e.offsetY/size);
    map[canvasY*xElements+canvasX] = map[canvasY*xElements+canvasX] == 1 ? 0 : 1;
    console.log(canvasX, canvasY, canvasY*xElements+canvasX);
    draw();
}

function draw() {
    for(let j = 0; j < yElements; j++) {
        for(let i = 0; i < xElements; i++) {
            ctx.fillStyle = colors[map[j*xElements+i]];
            ctx.fillRect(i*size,j*size,size,size);
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
        left: {
            x:x-1,
            y:y,
            index: indexFromXY([x-1, y]),
        },
        right: {
            x:x+1,
            y:y,
            index: indexFromXY([x+1, y])
        },
        up: {
            x:x,
            y:y-1,
            index: indexFromXY([x, y-1]),
        },
        down: {
            x:x,
            y:y+1,
            index: indexFromXY([x, y+1])
        },
        upLeft: {
            x:x-1,
            y:y-1,
            index: indexFromXY([x-1, y-1])
        },
        upRight: {
            x:x+1,
            y:y-1,
            index: indexFromXY([x+1, y-1])
        },
        downLeft: {
            x:x-1,
            y:y+1,
            index: indexFromXY([x-1, y+1])
        },
        downRight: {
            x:x+1,
            y:y+1,
            index: indexFromXY([x+1, y+1])
        },
    };
}

function aliveInNextGen(index) {
    let current = map[index];
    let neighbours = adjacents(index);

    // by convention, if the index
    // of the neighbour is outside of the map,
    // it is equal to 0
    let aliveNeighbours = 0;

    aliveNeighbours += isLegit(neighbours.left.index) ? map[neighbours.left.index] : 0;
    aliveNeighbours += isLegit(neighbours.right.index) ? map[neighbours.right.index] : 0;
    aliveNeighbours += isLegit(neighbours.up.index) ? map[neighbours.up.index] : 0;
    aliveNeighbours += isLegit(neighbours.down.index) ? map[neighbours.down.index] : 0;
    aliveNeighbours += isLegit(neighbours.upLeft.index) ? map[neighbours.upLeft.index] : 0;
    aliveNeighbours += isLegit(neighbours.upRight.index) ? map[neighbours.upRight.index] : 0;
    aliveNeighbours += isLegit(neighbours.downLeft.index) ? map[neighbours.downLeft.index] : 0;
    aliveNeighbours += isLegit(neighbours.downRight.index) ? map[neighbours.downRight.index] : 0;

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
    return index >= 0 && index < xElements*yElements;
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
