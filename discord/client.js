import discord from "discord.js";
import { getAllCommands } from "../modules/index.js";
const { Client } = discord;

export const client = new Client({
	intents: [1]
});

const commands = getAllCommands();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

export const handleWebSockets = () => {
	client.on("interactionCreate", async (interaction) => {
		if (!interaction.isCommand()) return;

		commands.forEach(async (module)=>{
			if(interaction.commandName  === module.name)
				return await module.handle(interaction);
		});
	});
};

client.login(process.env.BOT_TOKEN);
