// import {
// 	drawCircle,
// 	drawPng,
// 	drawRectangle,
// 	drawText,
// 	drawStick,
// 	getCos,
// 	getSin,
// } from "./src/drawingTools";

import { colors, levels } from "./src/levels";
import { sounds, playSound } from "./src/sound";

// canvas
let app = document.getElementById("app");
app.innerHTML = `
<div id="gameContainer"
></div><canvas id="canvas"></canvas>
`;

let canvas = document.getElementById("canvas");
let body = document.getElementById("body");
let context = canvas.getContext("2d");

var drawCircle = function (x, y, radius, color) {
	context.beginPath();
	context.arc(x + radius, y + radius, radius, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
};

var drawStick = function (x1, y1, x2, y2, width, color) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineWidth = width;
	context.strokeStyle = color;
	context.stroke();
};

var drawRectangle = function (x, y, width, height, color) {
	context.beginPath();
	context.moveTo(x, y + height / 2);
	context.lineTo(x + width, y + height / 2);
	context.lineWidth = height;
	context.strokeStyle = color;
	context.stroke();
};

var drawText = function (text, color, font, x, y) {
	context.fillStyle = color;
	context.font = font;
	context.fillText(text, x, y);
};

var drawPng = function (path, x, y) {
	let drawing = new Image();
	drawing.src = path;
	context.drawImage(drawing, x, y);
	return drawing;
};

function getSin(degree) {
	return parseFloat(Math.sin((Math.PI * degree) / 180).toFixed(3));
}
function getCos(degree) {
	return parseFloat(Math.cos((Math.PI * degree) / 180).toFixed(3));
}

let colorOfBoxes = {
	narrowMovableStick: "#a1636a",
	expandMovableStick: "#e38c95",
	speedUp: "#00ff00",
	speedDown: "#008f00",
	killBall: "#222",
	superBall: "#ffd700",
	threeBalls: "#c1cf94",
};

class Box {
	constructor(x, y, func) {
		this.func = func;
		this.width = 10;
		this.height = 10;
		this.x1 = x;
		this.y1 = y;
		this.x2 = x + this.width;
		this.y2 = y + this.height;
		this.color = colorOfBoxes[func.name];
		this.speed = 1;
		this.indexInBoxList = boxList.length;
		boxList[this.indexInBoxList] = this;
	}
	draw() {
		drawRectangle(this.x1, this.y1, this.width, this.height, this.color);
		this.fall();
	}
	fall() {
		this.y1 += this.speed;
		this.y2 = this.y1 + this.height; // must be updated for vertical control
		if (this.y1 + this.height > height * 0.99) {
			this.removeInBoxList();
		} else if (this.y2 > 0.9 * height && this.y1 < 0.91 * height) {
			// vertical control (3 is height of movableStick)
			if (
				(this.x2 > movableStick.x1 && this.x2 < movableStick.x2) ||
				(this.x1 > movableStick.x1 && this.x1 < movableStick.x2)
			) {
				// horizontal control
				this.func();
				this.removeInBoxList();
			}
		}
	}
	removeInBoxList() {
		boxList[this.indexInBoxList] = null;
	}
}

function clearBoxList() {
	boxList = [];
}

function speedOfBoxes(speed) {
	for (var i = 0; i < boxList.length; i++) {
		if (boxList[i]) {
			boxList[i].speed = speed;
		}
	}
}

// all functions
function narrowMovableStick() {
	if (movableStick.width > 25) {
		movableStick.width -= 10; // I didn't control this
	}
}

function expandMovableStick() {
	if (movableStick.width < 115) {
		movableStick.width += 10; // I didn't control this
	}
}

function speedUp() {
	for (var i = 0; i < ballList.length; i++) {
		if (ballList[i] && ballList[i].speed < 5 && !ballList[i].readyToGo) {
			// max 5
			ballList[i].speed += 1;
			ballList[i].updateRoute();
		}
	}
}

function speedDown() {
	for (var i = 0; i < ballList.length; i++) {
		if (ballList[i] && ballList[i].speed > 1 && !ballList[i].readyToGo) {
			// min 1
			ballList[i].speed -= 1;
			ballList[i].updateRoute();
		}
	}
}

function killBall() {
	playSound("negative");
	mainBall.reset();
}

function superBall(trueOrFalse = true) {
	for (var i = 0; i < ballList.length; i++) {
		if (ballList[i]) {
			ballList[i].superBall = trueOrFalse;
		}
	}
}

function threeBalls() {
	let len = ballList.length; // to prevent the infinite loop
	for (var i = 0; i < len; i++) {
		if (ballList[i] && ballList[i].speed) {
			let leftBall = new Ball(
				ballList[i].coordinate.x,
				ballList[i].coordinate.y
			);
			leftBall.go(ballList[i].angle + 45, ballList[i].speed);
			leftBall.readyToGo = false;

			let rightBall = new Ball(
				ballList[i].coordinate.x,
				ballList[i].coordinate.y
			);
			rightBall.go(ballList[i].angle - 45, ballList[i].speed);
			rightBall.readyToGo = false;
		}
	}
}

let ballList = []; // ball list in the canvas
let stickList = [];
let blockList = []; // block index list
let boxList = [];

let mapGrid = new Array(1000);
for (var i = 0; i < mapGrid.length; i++) {
	mapGrid[i] = new Array(1000);
}

function clearMapGrid() {
	for (var i = 0; i < mapGrid.length; i++) {
		for (var j = 0; j < mapGrid[i].length; j++) {
			mapGrid[i][j] = null;
		}
	}
}

function clearBallList() {
	//ballList = [ballList[0]]    // clear list of ball but the main ball is excluding
	// ^ this code not stable for the game. I don't know how do it, maybe one day I will solve it

	for (var i = 1; i < ballList.length; i++) {
		ballList[i] = null;
	}
}

function gameLoop() {
	// clear
	context.clearRect(0, 0, canvas.width, canvas.height);

	drawMain();
	drawBar();

	window.requestAnimationFrame(gameLoop);
}

window.onload = function () {
	window.requestAnimationFrame(gameLoop);
};

let height;
let width;
let widthInt = parseInt(width);
let windowWidth;
let windowHeight;
width = gameContainer.offsetWidth;
height = gameContainer.offsetHeight;
windowWidth = body.offsetWidth;
windowHeight = body.offsetHeight;
let ballWidth = 0.02 * width;
let paddleHeight = 0.036 * width;
let blockWidth = width / 9;
let blockHeight = (width / 9) * 0.62;
canvas.setAttribute("height", height);
canvas.setAttribute("width", width);

const playerImg = new Image();
playerImg.src = "./public/img/slajder.png";
const block1Img = new Image();
block1Img.src = "./public/img/klocek_1.png";
const block2Img = new Image();
block2Img.src = "./public/img/klocek_2.png";
const block3Img = new Image();
block3Img.src = "./public/img/klocek_3.png";

class Stick {
	// cross stick is not now :(
	constructor(x1, y1, x2, y2, stickWidth, color) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.stickWidth = stickWidth;
		this.color = color;
		this.angle = (Math.atan2(y2 - y1, x2 - x1) * 180.0) / Math.PI;
		this.assets = [];
		this.getAsset();
	}
	draw() {
		drawStick(this.x1, this.y1, this.x2, this.y2, this.stickWidth, this.color);
	}
	getAsset() {
		stickList.push([this, this.angle]);
	}
}

// default
let topStick = new Stick(
	0.01 * width,
	0.01 * width,
	0.99 * width,
	0.01 * width,
	0.005 * width,
	"#638379"
);
let leftStick = new Stick(
	0.01 * width,
	0.01 * width,
	0.01 * width,
	0.99 * height,
	0.005 * width,
	"#638379"
);
let rightStick = new Stick(
	0.99 * width,
	0.01 * width,
	0.99 * width,
	0.99 * height,
	0.005 * width,
	"#638379"
);

let movableStick = new Stick(
	width / 2 - width / 12,
	0.9 * height,
	width / 2 + width / 12,
	0.9 * height,
	0.03 * width,
	"#ddd"
);

// movableStick.x1 = width / 2 - width / 12;
// movableStick.y1 = 0.9 * height;
// movableStick.x2 = width / 2 + width / 12;
// movableStick.y2 = 0.9 * height;
movableStick.width = width / 6;

let numberOfUnbrokenBlocks;
let numberOfBall;
let speedOfBall = 3;
let level;
let score;
let multipleBlock = 0;
let numberOfLiveBall = 0;
let paused = false;
let buffer;

// mouse position
let y;
let x;

// ball

class Ball {
	constructor(startX, startY) {
		this.coordinate = { x: startX, y: startY };
		this.route = { x: 0, y: 0 }; // distance per frame
		this.angle = 0; // degree
		this.blockIndex = { x1: 0, y1: 0, x2: 0, y2: 0 };
		// x1, y1, x2, y2 are not point, index
		this.speed = 0; // per frame
		this.color = "#c1cf94";
		this.addList();
		this.brokenBlock = new Array(); // this list for will be broken block
		this.readyToGo = true;
		this.superBall = false;
		this.isMain = false; // to control for main ball or secondary ball
		this.buffer = {
			x: this.route.x,
			y: this.route.y,
			speed: this.speed,
		};
		numberOfLiveBall++;
	}
	addList() {
		ballList.push(this);
	}

	removeList() {}
	draw() {
		let PlayerImage = context.drawImage(
			playerImg,
			movableStick.x1,
			0.89 * height,
			width / 6,
			paddleHeight
		);
		// to catch current block index
		// this.blockIndex.x1 = parseInt((this.coordinate.x - 13) / 20);

		// this.blockIndex.y1 = parseInt((this.coordinate.y - 13) / 11);

		// this.blockIndex.x2 = parseInt((this.coordinate.x - 13 + 10) / 20);

		// this.blockIndex.y2 = parseInt((this.coordinate.y - 13 + 10) / 11);
		// console.log(mainBall.startX, mainBall.startY);
		this.blockIndex.x1 = parseInt(
			((this.coordinate.x) 
		);
		this.blockIndex.y1 = parseInt((this.coordinate.y / widthInt) * 36);
		this.blockIndex.x2 = parseInt(
			((this.coordinate.x + widthInt * 0.02 + widthInt / 40) / widthInt) * 18
		);
		this.blockIndex.y2 = parseInt(
			((this.coordinate.y + widthInt * 0.02) / widthInt) * 36
		);
		// console.log(
		// 	"x1",
		// 	this.blockIndex.x1,
		// 	"y1",
		// 	this.blockIndex.y1,
		// 	"x2",
		// 	this.blockIndex.x2,
		// 	"y2",
		// 	this.blockIndex.x1
		// );
		// the diameter of the ball is 0.02 width

		// drawRectangle(
		//   13 + this.index.x * 20,
		//   13 + this.index.y * 11,
		//   19,
		//   10,
		//   this.color
		// );
		// drawRectangle(
		// 	this.index.x * parseInt(width / 18)-width/40,
		// 	this.index.y * parseInt(width / 36),
		// 	width / 20,
		// 	width / 40,
		// 	this.color
		// );

		drawCircle(this.coordinate.x, this.coordinate.y, 0.01 * width, this.color);
		this.coordinate.x += this.route.x;
		this.coordinate.y += this.route.y;
		if (this.coordinate.x > 0.97 * width && this.route.x > 0) {
			this.setAngle(180 - this.angle);
			playSound("click");
		} else if (this.coordinate.x < 0.01 * width && this.route.x < 0) {
			this.setAngle(180 - this.angle);
			playSound("click");
		}
		if (this.coordinate.y < 0.01 * height && this.route.y < 0) {
			this.setAngle(360 - this.angle);
			playSound("click");
		} else if (
			this.coordinate.y + width * 0.02 > height * 0.9 &&
			this.coordinate.y + width * 0.02 < height * 0.91 &&
			this.coordinate.x + width * 0.02 > movableStick.x1 &&
			this.coordinate.x < movableStick.x2
		) {
			let newDegree = Math.abs(
				((movableStick.x2 - this.coordinate.x + 5) * 150) / movableStick.width
			);
			if (newDegree > 170) {
				newDegree = 170;
			} else if (newDegree < 10) {
				newDegree = 10;
			}
			this.setAngle(newDegree);
			score += Math.pow(multipleBlock, 2);
			multipleBlock = 0;
			playSound("click");
		} else if (this.coordinate.y > height * 0.9) {
			this.route.x = this.route.y = this.speed = 0;
			this.coordinate.x = -10;
			this.coordinate.y = -10;
			numberOfLiveBall--;
			if (numberOfLiveBall == 0) {
				playSound("negative");
				this.reset();
			}
		}

		// horizontal block control
		if (this.route.x > 0) {
			// go right
			if (mapGrid[this.blockIndex.x2][this.blockIndex.y1]) {
				this.addBrokenBlock(this.blockIndex.x2, this.blockIndex.y1);
			}
			if (mapGrid[this.blockIndex.x2][this.blockIndex.y2]) {
				this.addBrokenBlock(this.blockIndex.x2, this.blockIndex.y2);
			}
		} else if (this.route.x < 0) {
			// go left
			if (mapGrid[this.blockIndex.x1][this.blockIndex.y1]) {
				this.addBrokenBlock(this.blockIndex.x1, this.blockIndex.y1);
			}
			if (mapGrid[this.blockIndex.x1][this.blockIndex.y2]) {
				this.addBrokenBlock(this.blockIndex.x1, this.blockIndex.y2);
			}
		}

		if (mapGrid[this.blockIndex.x1]) {
			// vertical block control
			if (this.route.y < 0) {
				// go up
				if (mapGrid[this.blockIndex.x1][this.blockIndex.y1]) {
					this.addBrokenBlock(this.blockIndex.x1, this.blockIndex.y1);
				}
				if (mapGrid[this.blockIndex.x2][this.blockIndex.y1]) {
					this.addBrokenBlock(this.blockIndex.x2, this.blockIndex.y1);
				}
			} else if (this.route.y > 0) {
				// go down
				if (mapGrid[this.blockIndex.x1][this.blockIndex.y2]) {
					this.addBrokenBlock(this.blockIndex.x1, this.blockIndex.y2);
				}
				if (mapGrid[this.blockIndex.x2][this.blockIndex.y2]) {
					this.addBrokenBlock(this.blockIndex.x2, this.blockIndex.y2);
				}
			}
		}
		if (this.brokenBlock.length == 3) {
			//     ## ##
			var degree = 135; //      * ##    --> there are 3 blocks
			if (this.route.y < 0) {
				// go up     //                 * is a ball
				// the index of corner block in brokenBlock is 0
				for (var i = 1; i < this.brokenBlock.length; i++) {
					mapGrid[this.brokenBlock[i].x][this.brokenBlock[i].y].explode();
				}
				if (this.route.x < 0) {
					degree = 205;
				}
			} else if (this.route.y > 0) {
				// go down
				// the index of corner block in brokenBlock is 1
				mapGrid[this.brokenBlock[0].x][this.brokenBlock[0].y].explode();
				mapGrid[this.brokenBlock[2].x][this.brokenBlock[2].y].explode();
				if (this.route.x > 0) {
					degree = 205;
				}
			}
			if (!this.superBall) {
				this.setAngle(degree * 2 - this.angle);
			}
		} else if (this.brokenBlock.length == 2) {
			//   *

			mapGrid[this.brokenBlock[0].x][this.brokenBlock[0].y].explode();
			mapGrid[this.brokenBlock[1].x][this.brokenBlock[1].y].explode();

			let topBlock = this.brokenBlock[0].y > this.brokenBlock[1].y ? 0 : 1;
			let botBlock = topBlock == 0 ? 1 : 0;

			if (
				this.blockIndex.y1 == this.brokenBlock[topBlock].y &&
				this.blockIndex.x1 == this.brokenBlock[botBlock].x
			) {
				if (!this.superBall) {
					this.setAngle(90 - this.angle);
				}
			} else if (
				this.blockIndex.y1 == this.brokenBlock[topBlock].y &&
				this.blockIndex.x2 == this.brokenBlock[botBlock].x
			) {
				if (!this.superBall) {
					this.setAngle(270 - this.angle);
				}
			} else if (this.brokenBlock[0].y == this.brokenBlock[1].y) {
				if (!this.superBall) {
					this.setAngle(360 - this.angle);
				}
			} else if (this.brokenBlock[0].x == this.brokenBlock[1].x) {
				if (!this.superBall) {
					this.setAngle(180 - this.angle);
				}
			}
		} else if (this.brokenBlock.length == 1) {
			mapGrid[this.brokenBlock[0].x][this.brokenBlock[0].y].explode();
			if (
				this.blockIndex.x1 == this.blockIndex.x2 &&
				this.blockIndex.y1 != this.blockIndex.y2
			) {
				if (!this.superBall) {
					this.setAngle(360 - this.angle);
				}
			} else if (
				this.blockIndex.x1 != this.blockIndex.x2 &&
				this.blockIndex.y1 == this.blockIndex.y2
			) {
				if (!this.superBall) {
					this.setAngle(180 - this.angle);
				}
			} else if (
				this.blockIndex.x1 != this.blockIndex.x2 &&
				this.blockIndex.y1 != this.blockIndex.y2
			) {
				if (
					(this.blockIndex.x1 == this.brokenBlock[0].x &&
						this.blockIndex.y2 == this.brokenBlock[0].y) ||
					(this.blockIndex.x2 == this.brokenBlock[0].x &&
						this.blockIndex.y1 == this.brokenBlock[0].y)
				) {
					if (!this.superBall) {
						this.setAngle(270 - this.angle);
					}
				} else {
					if (!this.superBall) {
						this.setAngle(90 - this.angle);
					}
				}
			}
		}
		this.brokenBlock = new Array();
	}

	go(degree, speed) {
		this.setAngle(degree);
		this.setSpeed(speed);
	}

	stop() {
		this.speed = 0;
		this.updateRoute();
	}

	setAngle(degree) {
		if (degree == 0) {
			degree = 5;
		} else if (degree == 180) {
			degree = 175;
		}
		this.angle = degree;
		this.updateRoute();
	}

	setSpeed(speed) {
		this.speed = speed;
		this.updateRoute();
	}

	updateRoute() {
		this.route.x = this.speed * getCos(this.angle);
		this.route.y = this.speed * getSin(this.angle) * -1; // coordinate system in canvas is reverse so I multiply -1
	}
	addBrokenBlock(x, y) {
		var bulundu = false;
		for (var i = 0; i < this.brokenBlock.length; i++) {
			if (this.brokenBlock[i].x == x && this.brokenBlock[i].y == y) {
				bulundu = true;
				break;
			}
		}
		if (!bulundu) {
			this.brokenBlock.push({ x: x, y: y });
		}
	}
	updatePositionOnMovableStick() {
		this.coordinate.x =
			movableStick.x1 + (movableStick.width - width * 0.02) / 2;
		this.coordinate.y = movableStick.y1 - 11;
	}

	reset() {
		mainBall.updatePositionOnMovableStick();
		mainBall.readyToGo = true;
		mainBall.stop();
		multipleBlock = 0;
		numberOfBall--;
		numberOfLiveBall = 1;
		clearBallList();

		// reset for new level and game
		movableStick.width = width / 6;
		superBall(false);
		// ^ reset for new level and game
		controlForGameOver();
	}
}

let mainBall = new Ball(
	movableStick.x1 + (movableStick.width - 10) / 2,
	movableStick.y1 - 0.02 * width
);
mainBall.isMain = true;

const CanvasResize = () => {
	width = gameContainer.offsetWidth;
	height = gameContainer.offsetHeight;
	widthInt = parseInt(width);
	windowWidth = body.offsetWidth;
	windowHeight = body.offsetHeight;
	canvas.setAttribute("height", height);
	canvas.setAttribute("width", width);
	topStick.x1 = 0.01 * width;
	topStick.y1 = 0.01 * width;
	topStick.x2 = 0.99 * width;
	topStick.y2 = 0.01 * width;
	leftStick.x1 = 0.01 * width;
	leftStick.y1 = 0.01 * width;
	leftStick.x2 = 0.01 * width;
	leftStick.y2 = 0.99 * height;
	rightStick.x1 = 0.99 * width;
	rightStick.y1 = 0.01 * width;
	rightStick.x2 = 0.99 * width;
	rightStick.y2 = 0.99 * height;
	movableStick.x1 = width / 2 - width / 12;
	movableStick.y1 = 0.9 * height;
	movableStick.x2 = width / 2 + width / 12;
	movableStick.y2 = 0.9 * height;
	movableStick.width = width / 6;
	mainBall.startX = movableStick.x1 + (movableStick.width - width * 0.02) / 2;
	mainBall.startY = movableStick.y1 - width * 0.02;
	mainBall.coordinate.x = mainBall.startX;
	mainBall.coordinate.y = mainBall.startY;
	ballWidth = 0.02 * width;
	paddleHeight = 0.036 * width;
	blockWidth = width / 9;
	blockHeight = (width / 9) * 0.62;
};

CanvasResize();
window.addEventListener("resize", CanvasResize);

class Block {
	constructor(xInd, yInd, color) {
		this.indexInBlockList = blockList.length;
		blockList.push(this);
		this.index = { x: xInd, y: yInd };
		this.color = color;
		this.typeOfTheBox = null;
		mapGrid[xInd][yInd] = this;
		numberOfUnbrokenBlocks++;
		this.tryYourChance();
	}
	draw() {
		context.drawImage(
			block1Img,
			(this.index.x * width) / 18,
			(this.index.y * height) / 26,
			blockWidth,
			blockHeight
		);
		// drawRectangle(
		// 	(this.index.x * widthInt) / 18 - widthInt / 40,
		// 	(this.index.y * widthInt) / 36,
		// 	widthInt / 20,
		// 	widthInt / 40,
		// 	this.color
		// );
	}

	// drawRectangle(
	//   13 + this.index.x * 20,
	//   13 + this.index.y * 11,
	//   19,
	//   10,
	//   this.color
	// );

	explode() {
		playSound("blockCrush");
		blockList[this.indexInBlockList] = null;
		mapGrid[this.index.x][this.index.y] = null;
		numberOfUnbrokenBlocks--;
		score += 10;
		multipleBlock++;
		controlForLevelUp();
		if (this.typeOfTheBox) {
			new Box(
				(this.index.x * widthInt) / 18 - widthInt / 80,
				(this.index.y * widthInt) / 36,
				this.typeOfTheBox
			);
		}
	}
	tryYourChance() {
		let toBeOrNotToBe = Math.floor(Math.random() * 100); // [0 - 99]
		let which = Math.floor(Math.random() * 7); // [0 - 6]
		let chanceforSuperBall = Math.floor(Math.random() * 3); // [0 - 2]  for superBall
		let yesOrNoForThreeBalls = Math.floor(Math.random() * 2); // [0 - 1]  for threeBalls
		if (toBeOrNotToBe < 15) {
			// 15%
			switch (which) {
				case 0:
					this.typeOfTheBox = narrowMovableStick;
					break;
				case 1:
					this.typeOfTheBox = expandMovableStick;
					break;
				case 2:
					this.typeOfTheBox = speedUp;
					break;
				case 3:
					this.typeOfTheBox = speedDown;
					break;
				case 4:
					this.typeOfTheBox = killBall;
					break;
				case 5:
					// superBall is excellent so I want to be rare it :d
					// this.typeOfTheBox = killBall;
					// if (chanceforSuperBall == 0) {
					this.typeOfTheBox = superBall;
					// }
					break;
				case 6:
					// this.typeOfTheBox = killBall;
					// if (yesOrNoForThreeBalls == 0) {
					this.typeOfTheBox = threeBalls;
					// }
					break;
			}
		}
	}
}

// other functions

function controlForLevelUp() {
	if (!numberOfUnbrokenBlocks) {
		levelUp();
	}
}

function controlForGameOver() {
	if (numberOfBall < 0) {
		drawMain = drawGameOver;
		drawBar = drawPlayButton;
		clearBoxList();
		playSound("gameOver");
	}
}

function start() {
	if (!paused && mainBall.readyToGo) {
		mainBall.readyToGo = false;
		mainBall.go(90, speedOfBall);
	}
}

function addToScore(point) {
	score += point;
}

function levelUp() {
	addToScore(100 * level + Math.pow(multipleBlock, 2));
	level++;
	numberOfBall++;
	mainBall.reset();
	if (levels[level]) {
		loadLevel(level);
	} else {
		drawMain = drawTheEnd;
		drawBar = drawPlayButton;
	}
}

function play() {
	numberOfBall = 2;
	level = 1;
	score = 0;
	loadLevel(0);
	drawMain = drawGame;
	drawBar = drawBoard;
}

function loadLevel(index) {
	playSound("levelUp");
	numberOfUnbrokenBlocks = 0;
	clearBoxList();
	clearMapGrid();
	clearBlockList();
	// to load for each block in the level
	for (var i = 0; i < levels[index].length; i++) {
		new Block(
			levels[index][i].xInd,
			levels[index][i].yInd,
			levels[index][i].color
		);
	}
}

function clearBlockList() {
	blockList = [];
}
// movableStick.x1 = width / 2 - width / 12;
// movableStick.x2 = width / 2 + width / 12;
function getCoor(e) {
	if (!paused) {
		x = e.clientX;
		y = e.clientY;
		let newX1 = x - (window.innerWidth - canvas.width + movableStick.width) / 2;
		let newX2 = newX1 + movableStick.width;
		movableStick.x1 = newX1;
		movableStick.x2 = newX2;
		if (newX1 < 10) {
			movableStick.x1 = 10;
			movableStick.x2 = movableStick.width + 10;
		} else if (newX2 > canvas.width - 10) {
			movableStick.x1 = canvas.width - 10 - movableStick.width;
			movableStick.x2 = canvas.width - 10;
		}

		if (mainBall.readyToGo) {
			mainBall.updatePositionOnMovableStick();
		}
	}
}

function addMobileHandlers() {
	body.addEventListener("touchstart", handleTouchEvent);
	body.addEventListener("touchmove", handleTouchEvent);
	body.addEventListener("touchend", handleTouchEvent);
	body.addEventListener("touchcancel", handleTouchEvent);
}
addMobileHandlers();
let oldX;
let newX;
let diffX;
let touch;
function handleTouchEvent(e) {
	if (e.touches.length === 0) return;
	if (!paused) {
		touch = e.touches[0];
		x = touch.pageX;
		let newX1 = x - (window.innerWidth - canvas.width + movableStick.width) / 2;
		let newX2 = newX1 + movableStick.width;
		movableStick.x1 = newX1;
		movableStick.x2 = newX2;
		if (newX1 < 10) {
			movableStick.x1 = 10;
			movableStick.x2 = movableStick.width + 10;
		} else if (newX2 > canvas.width - 10) {
			movableStick.x1 = canvas.width - 10 - movableStick.width;
			movableStick.x2 = canvas.width - 10;
		}
		if (mainBall.readyToGo) {
			mainBall.updatePositionOnMovableStick();
		}
	}
}

// draw
let drawMain;
let drawBar;

// main
function drawGame() {
	for (var i = 0; i < ballList.length; i++) {
		if (ballList[i]) {
			ballList[i].draw();
		}
	}

	for (var i = 0; i < stickList.length; i++) {
		stickList[i][0].draw();
	}

	for (var i = 0; i < blockList.length; i++) {
		if (blockList[i]) {
			blockList[i].draw();
		}
	}

	for (var i = 0; i < boxList.length; i++) {
		if (boxList[i]) {
			boxList[i].draw();
		}
	}
}

function drawWelcome() {
	drawText(
		"Arkanoid",
		"#d9effc",
		"50px Saira Stencil One",
		width / 4,
		height / 4
	);
}

function drawGameOver() {
	drawText("Game Over", "#f46f47", "32px Noto Sans", width / 4, height / 4);
	drawText("Score " + score, "#ddd", "24px Noto Sans", width / 4, height / 4);
}

function drawTheEnd() {
	drawText(
		"The End",
		"#61cdff",
		"50px Saira Stencil One",
		width / 4,
		height / 4
	);
	drawText("Score " + score, "#ddd", "24px Noto Sans", width / 4, height / 4);
}

// bar
function drawBoard() {
	// level
	drawText(
		"Level " + level + " / 12",
		"#eee",
		"16px Noto Sans",
		width * 0.7,
		height * 0.965
	);

	// number of ball
	drawCircle(width * 0.4, height * 0.95, width * 0.01, "#c1cf94");
	drawText(
		"x " + numberOfBall,
		"#eee",
		"16px Noto Sans",
		width * 0.5,
		height * 0.965
	);

	// score
	drawText(
		"Score " + score,
		"#eee",
		"16px Noto Sans",
		width * 0.1,
		height * 0.965
	);

	// pause
	if (paused) {
		drawPng("img/play.png", width * 0.9, height * 0.95);
		drawText("Paused", "#e38c95", "50px Noto Sans", 0.4 * width, 0.4 * height);
	} else {
		drawPng("img/pause.png", width * 0.9, height * 0.95);
	}
}

function drawPlayButton() {
	drawText("Play", "#ddd", "25px Noto Sans", width * 0.6, height * 0.6);
}

function toClick() {
	if (drawBar == drawPlayButton && x > width * 0.5 && y > height * 0.5) {
		play();
	} else if (drawMain == drawGame && y < height) {
		start();
	} else if (
		drawBar == drawBoard &&
		x > 370 + (window.innerWidth - canvas.width) / 2
	) {
		// pause button
		if (!paused) {
			for (var i = 0; i < ballList.length; i++) {
				if (ballList[i]) {
					ballList[i].buffer.x = ballList[i].route.x;
					ballList[i].buffer.y = ballList[i].route.y;
					ballList[i].buffer.speed = ballList[i].speed;
					ballList[i].stop();
				}
			}
			speedOfBoxes(0);
			paused = true;
		} else {
			for (var i = 0; i < ballList.length; i++) {
				if (ballList[i]) {
					ballList[i].route.x = ballList[i].buffer.x;
					ballList[i].route.y = ballList[i].buffer.y;
					ballList[i].speed = ballList[i].buffer.speed;
				}
			}
			speedOfBoxes(1);
			paused = false;
		}
	}
}

body.addEventListener("mousemove", (e) => {
	getCoor(e);
});
canvas.addEventListener("click", () => {
	toClick();
});

drawMain = drawWelcome;
drawBar = drawPlayButton;

// for animate
window.requestAnimationFrame(gameLoop);
