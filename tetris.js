const can = document.getElementById("tetris");
const context = can.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE";

function drawSquare(x,y,color){
	context.fillStyle = color;
	context.fillRect(x*SQ,y*SQ,SQ,SQ);

	context.strokeStyle = "BLACK";
	context.strokeRect(x*SQ,y*SQ,SQ,SQ);	
}

let board = [];
for(r=0; r<ROW; r++){
	board[r] = [];
	for(c=0; c<COL; c++){
		board[r][c] = VACANT;
	}
}

function drawBoard(){
	for(r=0; r<ROW; r++){
		for(c=0; c<COL; c++){
			drawSquare(c,r,board[r][c]);
		}	
	}
}
drawBoard();

const FIGURES = [
	[I,"magenta"],
	[J,"cyan"],
	[L,"yellow"],
	[O,"red"],
	[S,"blue"],
	[T,"green"],
	[Z,"grey"]	
];

function randomFigure(){
	let r = randomN = Math.floor(Math.random()*FIGURES.length);
	return new Figure (FIGURES[r][0], FIGURES[r][1]);
}

let fig = randomFigure();

function Figure(tetromino, color){
	this.tetromino = tetromino;
	this.color = color;
	
	this.tetrominoN = 0; 
	this.activeTetromino = this.tetromino[this.tetrominoN];
	
	this.x = 3;
	this.y = -2;
}

Figure.prototype.fill = function(color){
	for(r=0; r<this.activeTetromino.length; r++){
		for(c=0; c<this.activeTetromino.length; c++){
			if(this.activeTetromino[r][c]){
				drawSquare(this.x+c,this.y+r, color);
			}
		}	
	}
}

Figure.prototype.draw = function(){
	this.fill(this.color);
}

Figure.prototype.unDraw = function(){
	this.fill(VACANT);
}

Figure.prototype.moveDown = function(){
	if(!this.collision(0,1,this.activeTetromino)){
		this.unDraw();
		this.y++;
		this.draw();
	}else{
		this.lock();
		fig = randomFigure();
	}	
}

Figure.prototype.moveRight = function(){
	if(!this.collision(1,0,this.activeTetromino)){	
		this.unDraw();
		this.x++;
		this.draw();
	}
}

Figure.prototype.moveLeft = function(){
	if(!this.collision(-1,0,this.activeTetromino)){	
		this.unDraw();
		this.x--;
		this.draw();
	}
}

Figure.prototype.rotate = function(){
	let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
	let kick = 0;
	
	if(this.collision(0,0,nextPattern)){
		if(this.x > COL/2){
			kick = -1; 
		}else{
			kick = 1; 
		}
	}
	
	if(!this.collision(kick,0,nextPattern)){	
		this.unDraw();
		this.x += kick;
		this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; 
		this.activeTetromino = this.tetromino[this.tetrominoN];
		this.draw();
	}
}

let score = 0;
Figure.prototype.lock = function(){
	for(r=0; r<this.activeTetromino.length; r++){
		for(c=0; c<this.activeTetromino.length; c++){
			if(!this.activeTetromino[r][c]){
				continue;
			}
			if(this.y + r < 0){
				alert("Game Over");
				gameOver = true;
				break;
			}
			board[this.y+r][this.x+c] = this.color;			
		}	
	}
	for(r=0; r<ROW; r++){
		let isRowFull = true;
		for(c=0; c<COL; c++){
			isRowFull = isRowFull && (board[r][c] != VACANT);
		}
		if(isRowFull){
			for(y=r; y>1; y--){
				for(c=0; c<COL; c++){
					board[y][c] = board[y-1][c];
				}
			}
			for (c = 0; c<COL; c++){
				board[0][c] = VACANT;
			}
			score += 10;
		}		
	}
	drawBoard();
	
	scoreElement.innerHTML = score;
	
}

Figure.prototype.collision = function(x, y, figure){
	for(r=0; r<figure.length; r++){
		for(c=0; c<figure.length; c++){
			if(!figure[r][c]){
				continue;
			}
			let newX = this.x + c + x;
			let newY = this.y + r + y;
			if(newX < 0 || newX >= COL || newY >= ROW){
				return true;
			}
			if(newY < 0){
				continue;
			}
			if(board[newY][newX] != VACANT){
				return true;
			}
		}	
	}
	return false;
}

document.addEventListener("keydown", CONTROL);

function CONTROL(event){
	if(event.keyCode == 37){
		fig.moveLeft();
		dropStart = Date.now();
	}else if(event.keyCode == 38){
		fig.rotate();
		dropStart = Date.now();
	}else if(event.keyCode == 39){
		fig.moveRight();
		dropStart = Date.now();
	}else if(event.keyCode == 40){
		fig.moveDown();
		dropStart = Date.now();
	}
	else if(event.keyCode == 80){
		pause();
	}
	else if(event.keyCode == 83){
		getTime(1000);
	}
	else if(event.keyCode == 78){
		getTime(500);
	}
	else if(event.keyCode == 70){
		getTime(250);
	}
}

let isPaused = false;
function pause(){

	let text;
	if(!isPaused)	{
		text = "PLAY";
		isPaused = true;
	}	
	else	{
		text = "PAUSE";
		isPaused = false;
	}			
	document.getElementById("submitPause").innerHTML = text;
}

let time = 1000;
function getTime(t){
	time = t;
	if(time==1000){
		slow.style.fontWeight = "bold";
		normal.style.fontWeight = "normal";
		fast.style.fontWeight = "normal";
	}
	else if(time==500){
		slow.style.fontWeight = "normal";
		normal.style.fontWeight = "bold";
		fast.style.fontWeight = "normal";
	}
	else if(time==250){
		slow.style.fontWeight = "normal";
		normal.style.fontWeight = "normal";
		fast.style.fontWeight = "bold";
	}
}
let dropStart = Date.now();
let gameOver = false;
function drop(){
	let now = Date.now();
	let delta = now - dropStart;
	if(delta > time && !isPaused){
		fig.moveDown();
		dropStart = Date.now();
	}
	if(!gameOver){
		requestAnimationFrame(drop);
	}	
}
drop();

