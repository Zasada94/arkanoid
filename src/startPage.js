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
}

window.onload = () => {
	sendStats("01StartPage");
};
export { queue };
