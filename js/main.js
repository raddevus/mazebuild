// main.js

var ctx = null;
var theCanvas = null;
window.addEventListener("load", initApp);
var LINES = 20;
var lineInterval = 0;
var gridColor = "lightgreen";
var allRobots = [];
var intervalID = null;
var selectedCount = 0;
var masterRobot = null;
let mainGrid = null;

function initApp(){
	theCanvas = document.getElementById("gamescreen");
	ctx = theCanvas.getContext("2d");
	
	ctx.canvas.height  = 650;
	ctx.canvas.width = ctx.canvas.height;
	

	// theCanvas.addEventListener("mousedown", mouseDownHandler);
	// intervalID = window.setInterval(mainGameLoop, 125);
	lineInterval = Math.floor(ctx.canvas.width / LINES);
	drawGrid();
}

class GridSquare{
	constructor(size,top,right,bottom,left){
		this.size = size;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
		this.left = left;
	}
}

class Grid{
	// numberOfGridSquares * gridSquare.Size = total size of Grid
	
	constructor(squareSize, squareCount, offset){
		// this needs to be true so grid is a square --> Math.sqrt(squareCount)%2 == 0
        this.rowSize = Math.ceil(Math.sqrt(squareCount));
		this.offset = offset;
        this.squareCount = squareCount;
        this.squareSize = squareSize;
		this.allSquares = [];
		this.initializeSquares(squareSize);
	}

	initializeSquares(){
		console.log("initializeSquares...");
		console.log(`total size will be size*count*offset: ${this.squareSize*this.squareCount+this.offset}`);
        let row = 0;
        let col = 0;
		for (let i = 0;i<this.rowSize;i++){
            row = (i % this.rowSize);
            console.log(`row : ${row}`);
            for (let j = 0;j<this.rowSize;j++){
                col = (j%this.rowSize);
                let gs = new GridSquare(this.squareSize,this.squareSize*row,(col+1)*this.squareSize,(row+1)*this.squareSize,this.squareSize*col);
                this.allSquares.push(gs);
            }

		}
	}
}

function drawSquares(allSquares){
    ctx.globalAlpha = 1;
	// fill the canvas background with white
	ctx.fillStyle="red";
	console.log("in drawSquares");
	// draw the blue grid background
	for (var sqCount=0;sqCount < allSquares.length;sqCount++)
	{
        console.log("filling squares...");
		ctx.strokeRect(allSquares[sqCount].left,allSquares[sqCount].top,
            allSquares[sqCount].size,allSquares[sqCount].size);
	}

}

function fillSquare(square, color){
    ctx.globalAlpha = 1;
	// fill the canvas background with white
    ctx.fillStyle = color;
    ctx.fillRect(square.left,square.top,square.size,square.size);
}



function removeLeft(square){
    ctx.globalAlpha = 1;
	    
	console.log(`begin path`)
    ctx.beginPath();
    ctx.moveTo(square.left,square.top );
    ctx.lineTo(square.left,square.bottom);
    ctx.lineWidth=5;
    ctx.strokeStyle="white";
    ctx.stroke();
}

function removeTop(square){
    ctx.globalAlpha = 1;
	    
	console.log(`begin path`)
    ctx.beginPath();
    ctx.moveTo(square.left,square.top );
    ctx.lineTo(square.right,square.top);
    ctx.lineWidth=5;
    ctx.strokeStyle="white";
    ctx.stroke();
}

function drawGrid() {
	ctx.globalAlpha = 1;
	// fill the canvas background with white
	ctx.fillStyle="white";
	ctx.fillRect(0,0,ctx.canvas.height,ctx.canvas.width);
	mainGrid = new Grid(60,64,15);
    drawSquares(mainGrid.allSquares);
	
}

function getMousePos(evt) {
	
	var rect = theCanvas.getBoundingClientRect();
	var currentPoint = {};
	currentPoint.x = evt.clientX - rect.left;
	currentPoint.y = evt.clientY - rect.top;
	return currentPoint;
}

function drawLine(p, p2, color){
	ctx.beginPath();
	var currentStrokeStyle = ctx.strokeStyle;
	ctx.strokeStyle = color;
	ctx.globalAlpha = .5;
	ctx.moveTo(p.x,p.y);
	ctx.lineTo(p2.x, p2.y);
	// console.log ("p.x : " + p.x + " p.y : " + p.y + " p2.x : " + p2.x + " p2.y : " +  p2.y);
	ctx.stroke();
	ctx.strokeStyle = currentStrokeStyle;
	ctx.globalAlpha = 1;
}

function hitTest(p, pointArray){
	// iterate through all points
	for (var x = 0;x<pointArray.length;x++){
		if ((Math.abs(p.x - pointArray[x].x) <= pointArray[x].size) && Math.abs(p.y - pointArray[x].y) <= pointArray[x].size){
			return x;
		}
	}
}

function mouseDownHandler(event){
	
	if (event.ctrlKey || $("#masterRobot").attr('checked') || $("#masterRobot").prop('checked')) {
		var idx = hitTest(getMousePos(event), allRobots);
		masterRobot = allRobots[idx];
		return;
	}
	
	if (selectedCount < 3){
		var robotIdx = hitTest(getMousePos(event), allRobots);
		if ( robotIdx >= 0 && !allRobots[robotIdx].isSelected){
			allRobots[robotIdx].isSelected = true;
			selectedCount++;
			allRobots[robotIdx].drawRobot();
		}
	}
	
	console.log("mouseDown");
	if (intervalID != null){
		clearInterval(intervalID);
		intervalID = null;
		console.log("frozen");
	}
	else{
		intervalID = window.setInterval(mainGameLoop, 125);
		console.log("interval set again");
	}
}

function genRandomNumber(end){
	return Math.floor(Math.random() * end) +1;
}

function getRandomColor(){
	switch (genRandomNumber(5)){
		case 1 :{
			return  "red";
		}
		case 2 : {
			return  "darkgreen";
		}
		case 3: {
			return "purple";
		}
		case 4: {
			return "blue";
		}
		case 5 :{
			return "yellow";
		}
	}
}