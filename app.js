class Snake{
	constructor(x, y){
		this.xdir = 0;
		this.ydir = 0;
		this.body = [new Square(x, y), new Square(x, y-1), new Square(x, y-2), new Square(x, y-3)];
		cells[this.body[0].pos].classList.add("snake-head");
		for(let i=0; i<this.body.length; i++)
			cells[this.body[i].pos].classList.add("snake");
	}

	move(){
		if (this.xdir === 0 && this.ydir === 0) return;

		cells[this.body[0].pos].classList.remove("snake-head");
		cells[this.body[this.body.length - 1].pos].classList.remove("snake");

		this.body.unshift(new Square(this.body[0].x + this.xdir, this.body[0].y + this.ydir))

		if (this.body[0].x >= nrows) this.body[0].x = 0;
		else if (this.body[0].x < 0) this.body[0].x = nrows-1;
		else if (this.body[0].y >= ncols) this.body[0].y = 0;
		else if (this.body[0].y < 0) this.body[0].y = ncols-1;
		this.body[0].pos = this.body[0].x * ncols + this.body[0].y;

		cells[this.body[0].pos].classList.add("snake");
		cells[this.body[0].pos].classList.add("snake-head");

		this.eatFood();
		this.checkCollision();
	}

	changeDir(e){
		let flag = false;

		if (e === "ArrowLeft" && this.ydir === 0) {
			this.ydir = -1;
			this.xdir = 0;
			flag = true;
		}
		else if (e === "ArrowRight" && this.ydir === 0){ 
			this.ydir = 1;
			this.xdir = 0;
			flag = true;
		}
		else if (e === "ArrowUp" && this.xdir === 0) {
			this.xdir = -1;
			this.ydir = 0;
			flag = true;
		}
		else if (e === "ArrowDown" && this.xdir === 0) {
			this.xdir = 1;
			this.ydir = 0;
			flag = true;
		}

		if (flag){
			this.move();
			food.show();	
		}
	}

	eatFood(){
		if (this.body[0].pos === food.pos) {
			food.updateLocation();
			currentScore.textContent = parseInt(currentScore.textContent) + 1;
		}
		else 
			this.body.pop();
	}

	checkCollision(){
		for (let i=1; i<this.body.length; i++){
			if (this.body[0].pos === this.body[i].pos){
				this.resetGame();
				break;
			}
		}
	}

	resetGame(){
		//Checking if current score is a highscore.
		// for (let i=0; i<blurItems.length; i++){
		// 	blurItems[i].style.filter = "blur(3px)";
		// }
		overlayDiv.classList.add("dark");
		play = false;
		stats.style.display = "block";
		let presentScore = parseInt(currentScore.textContent);
		statsScore.textContent = presentScore;
		
		if (presentScore > localStorage.getItem("highscore") || localStorage.getItem("highscore") === null){
			highscore.textContent = presentScore;
			localStorage.setItem("highscore", presentScore);
			newHighScore.textContent = "NEW HIGHSCORE!";
		}else{
			newHighScore.textContent = "";
		}

		statsHighScore.textContent = localStorage.getItem("highscore");


		cells[this.body[0].pos].classList.remove("snake-head");
		for (let i=0; i<this.body.length; i++){
			cells[this.body[i].pos].classList.remove("snake");
		}

		let x = Math.floor(nrows/2);
		let y = Math.floor(ncols/2);

		this.body = [new Square(x, y), new Square(x, y-1), new Square(x, y-2), new Square(x, y-3)];
		cells[this.body[0].pos].classList.add("snake-head");
		for(let i=0; i<this.body.length; i++)
			cells[this.body[i].pos].classList.add("snake");

		this.xdir = 0;
		this.ydir = 0;
		currentScore.textContent = 0;
		food.updateLocation();
	}
}

class Square{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.pos = this.x*ncols + this.y;
	}
}

class Food{
	constructor(){
		this.x = Math.floor(nrows/3);
		this.y = Math.floor(ncols/3);
		this.pos = this.x * ncols + this.y;
	}

	updateLocation(){
		cells[this.pos].classList.remove("food");
		while (true) {
			let flag = true;
			this.x = Math.floor(Math.random()*nrows);
			this.y = Math.floor(Math.random()*ncols);
			this.pos = this.x * ncols + this.y;
			for (let i=0; i<snake.body.length; i++){
				if (snake.body[i].pos === this.pos) 
					flag = false;
			}
			if (flag) 
				break;
		}
	}

	show(){
		cells[this.pos].classList.add("food");
	}
}

let play = true;
let grid = document.querySelector(".grid");

let nrows = Math.floor((Math.min(window.innerWidth, window.innerHeight) - 200)/30);
let ncols = Math.floor((Math.min(window.innerWidth, window.innerHeight) - 200)/30);

for (let i=0; i<nrows; i++){
	let row = document.createElement("div");
	row.classList.add("row");
	for (let j=0; j<ncols; j++){
		let cell = document.createElement("div");
		cell.classList.add("cell");
		row.appendChild(cell);
	}
	grid.appendChild(row);
}
scoreboard = document.querySelector(".scoreboard");
scoreboard.style.width = `${ncols*30 + 60}px`;

currentScore = document.querySelector(".current-score span");

highscore = document.querySelector(".highscore span");
if (localStorage.getItem("highscore")){
	highscore.textContent = localStorage.getItem("highscore");
}

cells = document.querySelectorAll(".cell");

for (let i=0; i<nrows; i++){
	for (let j=0; j<ncols; j++){
		if ((i+j) % 2)
			cells[i*ncols+j].classList.add("first-color");
		else
			cells[i*ncols+j].classList.add("second-color");
	}
}

let snake = new Snake(Math.floor(nrows/2), Math.floor(ncols/2));
let food = new Food();

let game = setInterval(function(){
	snake.move();
	food.show();
},200);


let instruction = document.querySelector(".instruction");
let hand = document.querySelector(".hand");

window.addEventListener("keydown", function(event){
	if (!play) return;

	instruction.style.display = "none";
	hand.style.display = "none";
	snake.changeDir(event.key);
})

window.addEventListener("resize", function(){
		location.reload();
	}
);


//END GAME Things
const stats = document.querySelector(".stats");
const statsScore = document.querySelector(".stats-score span");
const statsHighScore = document.querySelector(".stats-highscore span");
const newHighScore = document.querySelector(".new-highscore");
const playBtn = document.querySelector(".checks button");

// blurItems = document.querySelectorAll("body > *:not(.stats)");
const overlayDiv = document.querySelector(".overlay");

playBtn.addEventListener("click", function(){
	play = true;
	stats.style.display = "none";
	overlayDiv.classList.remove("dark");
});