class Snake{
	constructor(x, y){
		this.xdir = 0;
		this.ydir = 0;
		this.body = [new Square(x, y)];
		// this.head = this.body[0];
	}

	show(){
		for (let i=0; i<this.body.length; i++)
			this.body[i].show(i);
	}

	moveSnake(event){
		this.changeDir(event);
	}

	move(){
		// for (let i=0; i<this.body.length; i++){
		// 	if (i === 0) cells[this.body[i].pos].classList.remove("snake-head");
		// 	cells[this.body[i].pos].classList.remove("snake");
		// }

		cells[this.body[0].pos].classList.remove("snake-head");
		cells[this.body[this.body.length - 1].pos].classList.remove("snake");

		// for (let i=this.body.length-1; i>0; i--){
		// 	this.body[i].x = this.body[i-1].x;
		// 	this.body[i].y = this.body[i-1].y;
		// }

		this.body.push(new Square(this.body[0].x + this.xdir, this.body[0].y + this.ydir))
		this.body.pop();

		// this.head.x += this.xdir;
		// this.head.y += this.ydir;

		// for (let i=0; i<this.body.length; i++){
		// 	if (this.body[i].x >= nrows) this.body[i].x = 0;
		// 	else if (this.body[i].x < 0) this.body[i].x = nrows-1;
		// 	else if (this.body[i].y >= ncols) this.body[i].y = 0;
		// 	else if (this.body[i].y < 0) this.body[i].y = ncols-1;
		// }

		if (this.body[0].x >= nrows) this.body[0].x = 0;
		else if (this.body[0].x < 0) this.body[0].x = nrows-1;
		else if (this.body[0].y >= ncols) this.body[0].y = 0;
		else if (this.body[0].y < 0) this.body[0].y = ncols-1;

		//VERY IMPORTANT was stuck to solve this for very long time
		// for (let i=0; i<this.body.length; i++){
		// 	this.body[i].pos = this.body[i].x * ncols + this.body[i].y;
		// }

		this.checkCollision();
		this.eatFood();
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
			this.show();
			food.show();	
		}
	}

	add(){
		let currEnd = this.body[this.body.length-1]
		if (this.xdir === 1)  this.body.push(new Square(currEnd.x-1,currEnd.y));
		if (this.xdir === -1) this.body.push(new Square(currEnd.x+1,currEnd.y));
		if (this.ydir === 1)  this.body.push(new Square(currEnd.x,currEnd.y-1));
		if (this.ydir === -1) this.body.push(new Square(currEnd.x,currEnd.y+1));
	}

	eatFood(){
		if (this.body[0].pos === food.pos){
			this.add();
			food.updateLocation();
		}
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
		this.body = [new Square(10, 10)];
		// this.head = this.body[0];
		this.xdir = 0;
		this.ydir = 0;
		food.updateLocation();
	}
}

class Square{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.pos = this.x*ncols + this.y;
	}

	show(i){
		if (i == 0) cells[this.pos].classList.add("snake-head");
		cells[this.pos].classList.add("snake");
	}
}

class Food{
	constructor(){
		this.x = 10;
		this.y = 10;
		this.pos = this.x * ncols + this.y;
	}

	updateLocation(){
		cells[this.pos].classList.remove("food");
		this.x = Math.floor(Math.random()*nrows);
		this.y = Math.floor(Math.random()*ncols);
		this.pos = this.x * ncols + this.y
	}

	show(){
		cells[this.pos].classList.add("food");
	}
}

let grid = document.querySelector(".grid");

let nrows = Math.floor((Math.min(window.innerWidth, window.innerHeight) - 100)/30);
let ncols = Math.floor((Math.min(window.innerWidth, window.innerHeight) - 100)/30);

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

cells = document.querySelectorAll(".cell");

let snake = new Snake(5, 10);

let food = new Food();

let game = setInterval(function(){
	snake.move();
	snake.show();
	food.show();
},180);

window.addEventListener("keydown", function(event){
	clearInterval(game);
	snake.moveSnake(event.key);
	game = setInterval(function(){
		snake.move();
		snake.show();
		food.show();
	},180); 
})

window.addEventListener("resize", function(){
		location.reload();
	}
);