const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;


const CELL_SIZE = Math.min(
    canvas.width / 30,
    canvas.height / 30
);


let grid = [];
const gridWidth = canvas.width / CELL_SIZE;
const gridHeight = canvas.width / CELL_SIZE;

let play = false;
let isMouseDown = false;
let intervalID = null;

let startX = 0;
let startY = 0;

for (let row = 0; row < gridHeight+2; row++) {
    let currentRow = [];
    for (let col = 0; col < gridWidth + 2; col++) {
        currentRow.push(false);
    }
    grid.push(currentRow);
}

function sumOfArray(arr) {
    let sum = 0;
    for(let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    return sum;
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 1; row < grid.length - 1; row++) {
        for (let col = 1; col < grid[row].length - 1; col++) {
            if (grid[row][col]) {
                ctx.fillStyle = "#d6e3ee";
                ctx.fillRect((col - 1) * CELL_SIZE, (row - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                ctx.fillStyle = "#d6e3ee";
                ctx.strokeRect((col - 1) * CELL_SIZE, (row - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function nextStep() {
    let newGrid = JSON.parse(JSON.stringify(grid));

    for (let row = 1; row < grid.length - 1; row++) {
        for (let col = 1; col < grid[row].length - 1; col++) {
            let neighbors = [grid[row + 1][col - 1], grid[row + 1][col], grid[row + 1][col + 1], grid[row][col - 1], grid[row][col + 1], grid[row - 1][col - 1], grid[row - 1][col], grid[row - 1][col + 1]];
            
            if (!grid[row][col]) {
                let numOfNeighbors = sumOfArray(neighbors);
                if (numOfNeighbors === 3) {
                    newGrid[row][col] = true;
                }
            } else {
                let numOfNeighbors = sumOfArray(neighbors);
                if (numOfNeighbors < 2 || numOfNeighbors > 3) {
                    newGrid[row][col] = false;
                }
            }
            
        }
    }

    grid = newGrid;
}

function playGrid() {
    if(play) {
        if(!intervalID)
            intervalID = setInterval(function() {nextStep(); drawGrid();}, 250);
    } else {
        clearInterval(intervalID);
        intervalID = null;
    }
}

document.addEventListener("keydown", function(e) {
    if(e.key == "ArrowRight") {
        nextStep();
        drawGrid();
    }

    if(e.key == "c") {
        for (let row = 0; row < gridHeight + 2; row++) {
            for (let col = 0; col < gridWidth + 2; col++) {
                grid[row][col] = false;
            }
        }
        drawGrid();
    }

    if(e.key == " "){
        play = !play;
        playGrid();
    }
});

canvas.addEventListener("mousedown", function(e) {
    isMouseDown = true;
    startX = (Math.floor((e.clientX - canvas.offsetLeft) / CELL_SIZE)) + 1;
    startY = (Math.floor( (e.clientY - canvas.offsetTop) / CELL_SIZE)) + 1;

    grid[startY][startX] = !grid[startY][startX];
    drawGrid();
});

canvas.addEventListener("mouseup", function() {
    isMouseDown = false;
});

canvas.addEventListener("mousemove", function(e) {
    if (isMouseDown) {
        const endX = (Math.floor((e.clientX - canvas.offsetLeft) / CELL_SIZE)) + 1;
        const endY = (Math.floor((e.clientY - canvas.offsetTop) / CELL_SIZE)) + 1;
        drawLine(startX, startY, endX, endY);
        startX = endX;
        startY = endY;
        drawGrid();
    }
});

function drawLine(x1, y1, x2, y2) {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = x1 < x2 ? 1 : -1;
    let sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        grid[y1][x1] = true;
        if (x1 === x2 && y1 === y2) break;
        let e2 = err * 2;
        if (e2 > -dy) { 
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) { 
            err += dx;
            y1 += sy;
        }
    }
}

drawGrid();