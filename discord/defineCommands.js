import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { getAllCommands } from "../modules/index.js";



const commands = getAllCommands().map(module=>module.command);


const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

export const defineCommands = async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
			body: commands,
		});
	} catch (error) {
		console.error(error);
	}
};
