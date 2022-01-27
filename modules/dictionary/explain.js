import axios from "axios";

import { createEmbed, deleteMessage } from "../common.js";
import { embedDescriptionLimit } from "../globals.js";

const languages = ["en_GB", "fr", "ja", "hi", "es", "ru", "en_US", "de", "it", "ko", "pt-BR", "ar", "tr"];
const language = languages[0];

const help = "usage: `d!explain <word> [language] [@mention]";
export default { name:"explain", run: handle, help};


async function handle(msg, msgDetails) {

	const sendResultTo = msgDetails.mentionOrAuthor;
	const word = msgDetails.args[0];
	const chosenLang = msgDetails.args[1] ?? language;

	console.log(`d!explain: ${msg.author.username} searched for ${word} in ${chosenLang}, sending to ${sendResultTo.username}`);

	if(!word){
		msg.author.send(help);
		return deleteMessage(msg);
	}
	
	if(msgDetails.hasMentions && !msgDetails.isOwner){
		msg.author.send(`You're not allowed to send \`${word}\` to ${msg.mentions.members.toJSON()[0].user.username}`);
		return deleteMessage(msg);
	}
	
	if (!languages.includes(chosenLang)) {
		msg.author.send(`\`${chosenLang}\` is not an available languages, choose one of the following: ${languages.join(", ")}`);
		return deleteMessage(msg);
	}

	let response;
	if (chosenLang == "ja")
		response = await japaneseSearch(word);
	else
		response = await otherSearch(word, chosenLang);

	if (response.error) {
		msg.author.send(response.error);
		return deleteMessage(msg);
	}

	if (sendResultTo.id === msg.author.id)
		msg.author.send(`You asked for the definition of \`${word}\`, let's see them`);
	else {
		sendResultTo.send(`${msg.author.username} thought you wanted to know what \`${word}\` means, here you have it.`);
		msg.author.send(`I have sent the definition of \`${word}\` to ${sendResultTo.username}.`);
	}

	response.forEach((r, i) => {
		setTimeout(() => {
			sendResultTo.send({
				embed: r
			});
		}, i * 500);
	});
	deleteMessage(msg);
}


async function otherSearch(word, lang) {
	let data;
	try {
		const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURI(word)}`);
		data = res.data;
	} catch (ex) {
		return {
			error: `${word} has no entry in this dictionary,... or are you sure you spelled it right?`,
		};
	}

	let responses = [];

	data.forEach(entry => {
		let descrString = `${entry.phonetics.map(ph=>ph.text).join(" | ")}\n`;
		entry.meanings.splice(0, 3).forEach(meaning => {
			descrString += "*__*\n";
			descrString += `**${meaning.partOfSpeech}**\n`;
			meaning.definitions.forEach(def => {
				let tempString = `${descrString}\`\`\`${def.definition}\`\`\`${def.example ? `\`Example:\` ${def.example} \n`:""}  ${def.synonyms ? `\`Synonyms:\` ${def.synonyms.splice(0,8).join(", ")}\n\n`: "\n"}`;
				if(tempString.length < embedDescriptionLimit)
					descrString = tempString;
			});
		});

		const embedData = {
			title:`d!explain ${entry.word} - ${lang}`,
			url:`https://www.dictionary.com/browse/${word})`,            
			description: descrString,
			color:"#4E5D94",
			footer:"Results provided by DictionaryAPI",
			footerImage: "https://findicons.com/files/icons/2595/leopard_graphite/512/dictionary.png"
		};

		const embed = createEmbed(embedData);            

		responses.push(embed);
	});
	return responses;
}

async function japaneseSearch(word) {
	let entries = [];
	try {
		const response = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${encodeURI(word)}`);
		entries = response.data.data.splice(0, 3);
	} catch (ex) {
		return {
			error: `Could not fetch data for Japanese query: ${word}`,
		};
	}

	if (entries.length == 0)
		return {
			error: `${word} has no entry in this dictionary,... or are you sure you spelled it right?`,
		};


	let descrString = "";
	entries.forEach(en => {
		descrString += "\n*____*\n";
		descrString += en.senses.map(sens => sens["parts_of_speech"].join(", ")).join(", ");
		descrString += `${en.japanese.map(jap=>`\`\`\`${jap.word} (${jap.reading})\`\`\``).join("")}`;
		descrString += en.senses.map(sens => sens["english_definitions"].join(", ")).join(", ");
	});

	const embedData = {
		title:`d!explain ${word}`,
		url:`https://jisho.org/search/${encodeURI(word)}`,            
		description: descrString,
		color:"#4E5D94",
		footer:"Results provived by Jisho.org",
		footerImage: "https://avatars.githubusercontent.com/u/12574115?s=280&v=4"
	};

	const embed = createEmbed(embedData);
	return [embed];
}