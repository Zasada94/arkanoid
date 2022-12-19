let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

export {
	drawCircle,
	drawPng,
	drawRectangle,
	drawText,
	drawStick,
	getCos,
	getSin,
	drawPaddle,
};

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
	context.fillStyle = color;
	context.fill();
};

var drawPaddle = function (x1, y1, x2, y2, color) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.fillStyle = color;
	context.fill();
};

var drawRectangle = function (x, y, width, height, color) {
	context.beginPath();
	context.moveTo(x, y + height / 2);
	context.lineTo(x + width, y + height / 2);
	context.lineWidth = height;
	context.fillStyle = color;
	context.fill();
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
