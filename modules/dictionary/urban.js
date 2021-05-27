import axios from "axios";
import { parse } from "node-html-parser";
import he from "he";
import { createEmbed, deleteMessage } from "../common.js";
import { embedDescriptionLimit } from "../globals.js";

const deleteTags = /<[^>]*>/gim;
const urbanURL = "https://www.urbandictionary.com/define.php";

const help = "usage: `d!urban <word/sentence> [@mention]`";
export default {
	name: "urban",
	run: handle,
	help
};

async function handle(msg, msgDetails) {
	const sendResultTo = msgDetails.mentionOrAuthor;
	const word = msgDetails.args.join(" ");
	try {
		if (!word) {
			msg.author.send(help);
			return deleteMessage(msg);
		}

		console.log(`d!urban: ${msg.author.username} searched for ${word} sending to ${sendResultTo.username}`);

		let { data } = await axios.get(`${urbanURL}?term=${encodeURI(word)}`);

		let divs = parse(data).querySelectorAll(".def-panel");

		if (!divs) {
			msg.author.send(`${word} has no entry in the Urban Dictionary`);
			return deleteMessage(msg);
		}

		let filtereddivs = divs.filter(div => div.querySelector(".word").firstChild.rawText.toLowerCase() === word.toLowerCase());

		let meanings = filtereddivs.map(d => d.querySelector(".meaning").toString());

		let meaningStrings = meanings
			.map(d => d.replace("<br>","\n"))       
			.map(d => he.decode(d.replace(deleteTags, "")));    

		if (sendResultTo.id === msg.author.id)
			msg.author.send(`You asked for the definition of \`${word}\`, let's see them`);
		else {
			sendResultTo.send(`${msg.author.username} thought you wanted to know what \`${word}\` means, here you have it.`);
			msg.author.send(`I have sent the definition of \`${word}\` to ${sendResultTo.username}.`);
		}

		let descrString = "";
		meaningStrings.splice(0, 5).forEach(meaning => {
			if(`${descrString}*__*\n\`\`\`${meaning}\`\`\`\n`.length < embedDescriptionLimit)
				descrString += `*__*\n\`\`\`${meaning}\`\`\`\n`;
		});

		const embedData = {
			title:`d!urban: ${word}`,
			url:`${urbanURL}?term=${encodeURI(word)}`,            
			description: descrString,
			color:"#4E5D94",
			footer:"Results provided by Urban Dictionary",
			footerImage: "https://img.utdstc.com/icon/4af/833/4af833b6befdd4c69d7ebac403bfa087159601c9c129e4686b8b664e49a7f349:200"
		};

		const embed = createEmbed(embedData);    
           
		sendResultTo.send(embed);

	} catch (e) {
		//console.error(e)
		if(e.response.status === 404)
			msg.author.send(`${word} has no entry in the Urban Dictionary`);
		else
			msg.author.send("something has fatally wrong, please contact MrJunior717");        
	}
	finally {
		deleteMessage(msg);
	}

}