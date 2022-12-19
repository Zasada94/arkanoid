var date = Date.now();
var uuid = date.valueOf();

export function sendStats(page) {
	var flash;
	var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	if (isMobile) {
		flash = 0;
	} else {
		flash = 1;
	}
	var namespace = "block-breaker?uuid=" + uuid;
	var statsUrl =
		"https://poststickerapps.com/app/index.php/pub/setstats/" +
		namespace +
		"&flash=" +
		flash +
		"&app_action=" +
		page;
	const options = {
		method: "GET",
	};
	fetch(statsUrl, options).then(() => {
		console.log("entries sent");
	});

	return;
}
export { uuid };
