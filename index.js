const UI = require("../ui");
const bodyParser = require("../ui/node_modules/body-parser");

module.exports = function GuiFix(mod) {
	const ui = UI(mod);
	let title = null;
	let body = null;

	ui.use(bodyParser.urlencoded({ "extended": true }));
	ui.use(UI.static(`${__dirname}/ui`));

	mod.hook("S_ANNOUNCE_UPDATE_NOTIFICATION", 1, { "filter": { "fake": null } }, event => {
		title = event.title;
		body = event.body;
		ui.open();
		return false;
	});

	ui.post("/getTitle", (_, response) => {
		response.json({ title });
		title = null;
	});

	ui.post("/getBody", (_, response) => {
		response.json({ body });
		body = null;
	});

	ui.post("/adminCommand", (request, response) => {
		mod.send("C_ADMIN", 1, { "command": request.body.command });
		response.json({});
	});
};