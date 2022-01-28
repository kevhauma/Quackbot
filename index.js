//import dotenv from 'dotenv';
//dotenv.config();
import { Client, Intents } from "discord.js";

const intents = new Intents();
intents.add(
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_BANS,
	Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Intents.FLAGS.GUILD_INTEGRATIONS,
	Intents.FLAGS.GUILD_WEBHOOKS,
	Intents.FLAGS.GUILD_INVITES,
	Intents.FLAGS.GUILD_VOICE_STATES,
	Intents.FLAGS.GUILD_PRESENCES,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_MESSAGE_TYPING,
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	Intents.FLAGS.DIRECT_MESSAGE_TYPING,
	Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
);
console.log(intents);
export const client = new Client({ intents: intents });

import { getMessageDetails } from "./modules/common.js";

import dictionary from "./modules/dictionary/dictionary.js";

let modules = [dictionary];

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on("messageCreate", async msg => {
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
