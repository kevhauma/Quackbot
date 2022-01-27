import { MessageEmbed } from "discord.js";
import { client } from "../index.js";

export function deleteMessage(msg) {
	if (msg.channel.type !== "dm") msg.delete().catch(err => console.error(err));
}


export function getMessageDetails(msg) {
	let args = msg.content.split(" ").filter(w => !w.startsWith("<@"));
	const firstWord = args.shift();

	let mentionOrAuthor = msg.mentions.members?.array()[0]?.user ?? msg.author;
	let hasMentions = msg.mentions.members?.array().lenght > 0;
	let isOwner = msg.guild?.ownerID !== msg.author.id;

	return {
		args,
		firstWord,
		mentionOrAuthor,
		isOwner,
		hasMentions
	};
}

export function createEmbed(data) {
	let embed = new MessageEmbed(data);
	embed.setDescription(data.description.substr(0,2000));
	embed.setAuthor(client.user.username, client.user.avatarURL(), "https://github.com/kevhauma/Quackbot");
	embed.setFooter(`${data.footer ? `${data.footer}\n` : ""}Made by ${process.env.OWNER}, go bother him if something is broken.`,data.footerImage??null);
    
	embed.setImage(data.thumbnail ?? null);

	return embed;
}