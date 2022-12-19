import "./rankPage.css";
import { gamePage } from "../gamePage";
import { queue } from "./startPage";
import { sendStats } from "./sendStats";

var counter = 0;

export function rankPage(score, nickValue) {
	sendStats("04rankPage");
	// startCounting();
	app.innerHTML = `
<section class="rankContainer" id="rankContainer">
<button id="againButton">
</button>
<ul id='list'>
<li id=1></li>
<li id=2></li>
<li id=3></li>
<li id=4></li>
<li id=5></li>
<li id=6></li>
<li id=7></li>
<li id=8></li>
<li id=9></li>
<li id=10></li>
<img
id="divider"
src="./public/img/04/belka_w_rankingu.png"
alt="divider"
/>
<li id=11></li>
</ul>
</section>
`;
	const list = document.getElementById("list");
	const rankContainer = document.getElementById("rankContainer");
	// var bg_05 = queue.getResult("bg_05");
	// rankContainer.appendChild(bg_05);

	const againButton = document.getElementById("againButton");
	// var button5 = queue.getResult("button5");
	// againButton.appendChild(button5);

	const li1 = document.getElementById("1");
	const li2 = document.getElementById("2");
	const li3 = document.getElementById("3");
	const li4 = document.getElementById("4");
	const li5 = document.getElementById("5");
	const li6 = document.getElementById("6");
	const li7 = document.getElementById("7");
	const li8 = document.getElementById("8");
	const li9 = document.getElementById("9");
	const li10 = document.getElementById("10");
	const li11 = document.getElementById("11");

	const liArray = [li1, li2, li3, li4, li5, li6, li7, li8, li9, li10];

	var bg_04 = queue.getResult("bg_04");
	rankContainer.appendChild(bg_04);
	var button41 = queue.getResult("button41");
	againButton.appendChild(button41);
	againButton.onclick = function () {
		// timeP5 = parseInt(getTimeSpentOnSite() / 1000).toString();
		gamePage();
	};

	sendData();

	function sendData() {
		// sendStats("05rankPage");
		const dataUrl =
			"https://poststickerapps.com/custom/2022/block-breaker/ranking.php";
		let data = new FormData();
		const options = {
			method: "POST",
			body: data,
		};
		data.append("nick", nickValue);
		if (score != undefined) {
			data.append("score", score);
			counter++;
		} else {
			data.append("score", score);
		}

		let rankArray;
		fetch(dataUrl, options)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				rankArray = json;
				const sortedData = rankArray.sort((a, b) => b[2] - a[2]);
				for (let j = 0; j < liArray.length; j++) {
					if (sortedData[j] != undefined) {
						liArray[j].innerHTML = `<span id="number_rows">${
							j + 1
						}.</span> <span id="nickSpan">${sortedData[
							j
						][1].toUpperCase()} </span> <span id="scoreSpan">${
							sortedData[j][2]
						}</span>`;
						liArray[j].style.marginBottom = "1%";
					}
				}
				for (let i = sortedData.length - 1; i >= 0; i--) {
					if (sortedData[i][1] == nickValue) {
						li11.innerHTML = `<span id="number_rows">${
							i + 1
						}.</span> <span id="nickSpan">PLAYER ${sortedData[
							i
						][1].toUpperCase()}</span> <span id="scoreSpan">${
							sortedData[i][2]
						} </span>`;
					}
				}
			})
			.catch((err) => console.log(err));
	}
	const body = document.getElementById("body");

	let windowWidth = body.offsetWidth;
	let pageWidth = rankContainer.offsetWidth;

	const responsiveFont = () => {
		windowWidth = body.offsetWidth;
		pageWidth = rankContainer.offsetWidth;
		if (pageWidth >= windowWidth) {
			list.classList.add("active");
		} else {
			list.classList.remove("active");
		}
	};
	responsiveFont();
	window.addEventListener("resize", responsiveFont);
}
