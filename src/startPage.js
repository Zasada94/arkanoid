import "./startPage.css";
import { gamePage } from "../gamePage.js";
import { scorePage } from "./scorePage.js";
import { rankPage } from "./rankPage.js";
import { sendStats } from "./sendStats";

let queue;
let app = document.getElementById("app");

function loadImage() {
	queue = new createjs.LoadQueue();
	queue.on("complete", init, this);
	queue.loadManifest([
		{ id: "bg_01", src: "./public/img/01/bg_01.png" },
		{ id: "button1", src: "./public/img/01/button_01_1.png" },
		{ id: "bg_03", src: "./public/img/03/bg_03.png" },
		{ id: "button31", src: "./public/img/03/button_03_1.png" },
		{ id: "button32", src: "./public/img/03/button_03_2.png" },
		{ id: "bg_04", src: "./public/img/04/bg_04.png" },
		{ id: "button41", src: "./public/img/04/button_04_1.png" },
	]);

	queue.addEventListener("progress", (event) => {
		let progress = Math.floor(event.progress * 100);
		app.innerHTML = `
    <div class="loader">Loading... ${progress}%</div>
    `;
		if (progress == 100) {
			init();
		}
	});
}
loadImage();

function init() {
	app.innerHTML = `
	<div id="startContainer">
			<button id="startButton">
			</button>
	</div>
	`;
	const startButton = document.getElementById("startButton");
	var bg_01 = queue.getResult("bg_01");
	const startContainer = document.getElementById("startContainer");
	startContainer.appendChild(bg_01);
	var button1 = queue.getResult("button1");
	startButton.appendChild(button1);

	startButton.addEventListener("click", () => {
		gamePage();
		sendStats("02gamePage");
	});

	// let gameWidth = Math.min(window.innerWidth, (window.innerHeight * 9) / 16);
	let gameHeight = Math.min(window.innerHeight, (window.innerWidth * 16) / 9);
	let gameWidth = Math.min(window.innerWidth, (window.innerHeight * 9) / 16);
	// let windowWidth = body.offsetWidth;
	// let windowHeight = body.offsetHeight;
	// app.style.width = `${gameWidth}px`;
	// app.style.height = `${gameHeight}px`;
	// app.style.maxWidth = `${gameHeight * 0.54}px`;
	// app.style.maxHeight = `${gameWidth * 1.77}px`;
	// startContainer.style.width = `${gameWidth}px`;
	// startContainer.style.height = `${gameHeight}px`;
	// startContainer.style.maxWidth = `${gameHeight * 0.54}px`;
	// startContainer.style.maxHeight = `${gameWidth * 1.77}px`;

	const startResize = () => {
		gameHeight = Math.min(window.innerHeight, (window.innerWidth * 16) / 9);
		gameWidth = Math.min(window.innerWidth, (window.innerHeight * 9) / 16);
		// 	windowWidth = body.offsetWidth;
		// 	windowHeight = body.offsetHeight;
		// 	if (gameWidth >= windowWidth) {
		// 		gameWidth = window.innerWidth;
		// 		gameHeight = (gameWidth * 16) / 9;
		// 	} else {
		// 		gameHeight = window.innerHeight;
		// 		gameWidth = (gameHeight * 9) / 16;
		// 	}
		// 	app.style.width = `${gameWidth}px`;
		// 	app.style.height = `${gameHeight}px`;
		// 	app.style.maxWidth = `${gameHeight * 0.54}px`;
		// 	app.style.maxHeight = `${gameWidth * 1.77}px`;
		// 	startContainer.style.width = `${gameWidth}px`;
		// 	startContainer.style.height = `${gameHeight}px`;
		// 	startContainer.style.maxWidth = `${gameHeight * 0.54}px`;
		// 	startContainer.style.maxHeight = `${gameWidth * 1.77}px`;
		startContainer.style.maxHeight = `${gameHeight}px`;
		app.style.maxHeight = `${gameHeight}px`;
		startContainer.style.maxWidth = `${gameWidth}px`;
		app.style.maxWidth = `${gameWidth}px`;
	};
	startResize();
	window.addEventListener("resize", startResize);

	window.onload = () => {
		sendStats("01StartPage");
	};
}
export { queue };
