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

function initApp(){
	theCanvas = document.getElementById("gamescreen");
	ctx = theCanvas.getContext("2d");
	
	ctx.canvas.height  = 650;
	ctx.canvas.width = ctx.canvas.height;
	

	// theCanvas.addEventListener("mousedown", mouseDownHandler);
	// intervalID = window.setInterval(mainGameLoop, 125);
	lineInterval = Math.floor(ctx.canvas.width / LINES);
	drawGameBoard();
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
		ctx.strokeRect(allSquares[sqCount].top,allSquares[sqCount].left,
            allSquares[sqCount].size,allSquares[sqCount].size);
	}

}

function drawGameBoard() {
	ctx.globalAlpha = 1;
	// fill the canvas background with white
	ctx.fillStyle="white";
	ctx.fillRect(0,0,ctx.canvas.height,ctx.canvas.width);
	
	// draw the blue grid background
	for (var lineCount=0;lineCount<LINES;lineCount++)
	{
		ctx.fillStyle=gridColor;
		ctx.fillRect(0,lineInterval*(lineCount+1),ctx.canvas.width,2);
		ctx.fillRect(lineInterval*(lineCount+1),0,2,ctx.canvas.width);
	}
}

function robot (r){
	this.x = r.x || 200;
	this.y = r.y || 200;
	this.color = r.color || "black";
	this.size = r.size || 10;
	this.maxSize = r.maxSize || null;
	this.maxAge = r.maxAge || null;
	this.isSelected = r.isSelected || false;
	this.age = r.age || 1;
	this.isAlive = true;
	this.globalAlpha = r.globalAlpha || 1;
	this.offGridCount = 0;
	
	this.calculatePosition = function(){
		var flag = genRandomNumber(2);
		var addFlag = genRandomNumber(2);
		//console.log(flag);
		if (flag > 1){
			if (addFlag > 1){
				this.x += genRandomNumber(4) + genRandomNumber(3);
				}else{
				this.x -= genRandomNumber(4) + genRandomNumber(3);
				}
			}
		else{
			if (addFlag > 1){
			this.y += genRandomNumber(4) + genRandomNumber(3);
			}
			else{
				this.y -= genRandomNumber(4) + genRandomNumber(3);
			}
		}
		if (this.x >= 650 || this.x <= 0 || this.y >= 650 || this.y <=0)
		{
			this.offGridCount +=1;
		}
		if (this.offGridCount >=2){
			this.isAlive = false;
		}
		//console.log ("x : " + this.x + " y : " + this.y);
	}
	this.advanceAge = function() {
		// console.log("advanceAge...");
		if (this.age >= this.maxAge){
			this.isAlive = false;
			return;
		} 
		this.age +=1;
		// console.log("this.age : " + this.age);
		this.grow();
	}
	this.grow = function() {
		if (this.age % 100 == 0){
			if (this.maxSize == null || this.size < this.maxSize){
				this.size +=1;
			}
		}
		if (this.age % 200 == 0){
			this.globalAlpha -= .1;
			if (this.globalAlpha <= .2){
				this.isAlive = false;
			}
		}
	}
	this.drawRobotHighlight = function(){
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.arc(this.x, this.y,this.size + 7,0,2*Math.PI);
		ctx.strokeStyle = "black";
		ctx.globalAlpha = 1;
		ctx.stroke();
	}
	this.drawRobot = function (){
		//console.log("robot size : " + allRobots[idx].size);
		ctx.fillStyle = this.color;
		ctx.strokeStyle= this.color;
		if (this.isSelected) {
			this.drawRobotHighlight();
		}
		ctx.globalAlpha = this.globalAlpha;
		ctx.beginPath();
		ctx.arc(this.x, this.y,this.size,0,2*Math.PI);
		ctx.stroke();
		ctx.fill();
		// reset opacity
		ctx.globalAlpha = 1;
	}
	this.initRobot = function(){
		this.maxSize = this.calcMaxSize();
		//console.log("maxSize : " + this.maxSize);
		this.calcMaxAge();
	}
	this.calcMaxSize = function(){
		return genRandomNumber(15) + 10;
	}
	this.calcMaxAge = function (){
		this.maxAge = genRandomNumber (40000) + 10000;
		//console.log ("maxAge : " + this.maxAge);
	}
	
	this.initRobot();
}

function mainGameLoop(){
	for (var idx = allRobots.length-1; idx >= 0;idx--){
		if (!allRobots[idx].isAlive){
			console.log("died at: " + allRobots[idx].age);
			if (allRobots[idx].isSelected){
				selectedCount--;
			}
			allRobots.splice(idx,1);
			if (masterRobot != null){
				if (!masterRobot.isAlive){
					masterRobot = null;
				}
			}
		} 
		allRobots[idx].advanceAge();
		allRobots[idx].calculatePosition();
	}
	if (allRobots.length < 48){
		allRobots.push(new robot({x:genRandomNumber(600),y:genRandomNumber(600),color:getRandomColor()}));
	}
	drawGameBoard();
	drawRobots();
	if (masterRobot != null){
		drawConnectedRobots();
	}
}


function drawConnectedRobots(){
	for (var i = 0; i < allRobots.length;i++){
		masterRobot.isSelected = true;
		if (masterRobot.color == allRobots[i].color){
			drawLine(masterRobot, allRobots[i], masterRobot.color); 
		}
	}
}

function drawRobots(){
	for (var i = 0; i < allRobots.length;i++)
	{
		allRobots[i].drawRobot();
	}
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