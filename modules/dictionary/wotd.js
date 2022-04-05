import axios from "axios";
import htmlParser from "node-html-parser";
import he from "he";
import { deleteMessage, createEmbed } from "../common.js";
const { parse } = htmlParser;
const deleteTags = /<[^>]*>/gim;
const wotdURL = "https://www.dictionary.com/e/word-of-the-day/";

const help = "usage: `d!wotd`";
export default {
	name: "wotd",
	run: handle,
	help
};

async function handle(msg, msgDetails) {	
	const sendResultTo = msgDetails.mentionOrAuthor;
	console.log(sendResultTo);
	try {
		console.log(`d!wotd: ${msg.author.username} searched for wotd`);

		const { data } = await axios.get(`${wotdURL}`);
		let htmlDOM = parse(data);

		let wordDOM = htmlDOM.querySelector(".otd-item-headword__word");
		let wordString = he.decode(wordDOM.toString().replace(deleteTags, "").trim());

		let pronDOM = htmlDOM.querySelector(".otd-item-headword__pronunciation");
		let pronString = he.decode(pronDOM.toString().replace(deleteTags, "").trim());

		let meaningDOM = htmlDOM.querySelector(".otd-item-headword__pos");
		let meaningString = he.decode(meaningDOM.toString().replace(deleteTags, "").trim());
		let meaningParts = meaningString.split(" ").filter(c => c && !/\s/m.test(c));
		let pos = meaningParts.shift();
		let meaning = meaningParts.join(" ");

		const embedData = {
			title:`d!wotd: ${wordString}`,
			url:"https://www.dictionary.com/e/word-of-the-day/",            
			description: `${pronString}\n__\n${pos}\n\`\`\`${meaning}\`\`\`\n[Web Page](${wotdURL})`,
			color:"#4E5D94",
			footer:"Results provided by Dictionary.com",
			footerImage: "https://img.flaticon.com/icons/png/512/0/928.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF"
		};

		const embed = createEmbed(embedData);
		sendResultTo.send(embed);

	} catch (e) {
		msg.author.send("something has fatally wrong, please contact MrJunior717");
		console.error(e);
	}
	finally {
		deleteMessage(msg);
	}

}
