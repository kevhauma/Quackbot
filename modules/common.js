import { EmbedBuilder } from "discord.js";

import { client } from "../discord/client.js";

export function createEmbed(data) {
	let embed = new EmbedBuilder(data);
	embed.setDescription(data.description.substr(0,2000));
	embed.setAuthor({name:client.user.username,iconURL: client.user.avatarURL(),url: "https://github.com/kevhauma/Quackbot"});
	embed.setFooter({text:`${data.footer ? `${data.footer}\n` : ""}Made by ${process.env.OWNER}, go bother him if something is broken.`,iconURL:data.footerImage??null});
    
	embed.setImage(data.thumbnail ?? null);

	return {embeds:[embed.toJSON()]};
}