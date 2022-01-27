
import { Client } from "discord.js";

export const client = new Client();

import { getMessageDetails } from "./modules/common.js";

import dictionary from "./modules/dictionary/dictionary.js";

let modules = [dictionary];

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async msg => {
	let details = getMessageDetails(msg);

	modules.forEach(mod => {
		if (!details.firstWord.toLowerCase().startsWith(mod.prefix.toLowerCase())) return;
		mod.commands.forEach(command => {
			if (`${mod.prefix}${command.name}`.toLowerCase() !== details.firstWord.toLowerCase()) return;
			command.run(msg, details).catch(e=>{console.error(e);});
		});
	});

});
console.log(process.env);
client.login(process.env.BOT_TOKEN);