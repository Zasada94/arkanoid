import "./startPage.css";
import { gamePage } from "../gamePage.js";
import { scorePage } from "./scorePage.js";

let app = document.getElementById("app");
app.innerHTML = `
<div id="startContainer">
		<button id="startButton">
			<img id="startButtonImg" src="./public/img/01/button_01_1.png">
		</button>
</div>
`;

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", gamePage);
