import axios from "axios";

import { embedDescriptionLimit } from "../../globals.js";
import { createEmbed } from "../../common.js";

export const wordSearch = async (word, lang) => {
	let data;
	try {
		const res = await axios.get(
			`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURI(word)}`
		);
		data = res.data;
	} catch (ex) {
		console.log(ex.code, ex.status, ex.message, ex.data, `${ex}`);
		return {
			error: `${word} has no entry in this dictionary,... or are you sure you spelled it right?`,
		};
	}

	let responses = [];

	data.forEach((entry) => {
		let descrString = `${entry.phonetics.map((ph) => ph.text).join(" | ")}\n`;
		entry.meanings.splice(0, 3).forEach((meaning) => {
			descrString += "*__*\n";
			descrString += `**${meaning.partOfSpeech}**\n`;
			meaning.definitions.forEach((def) => {
				let tempString = `${descrString}\`\`\`${def.definition}\`\`\`${
					def.example ? `\`Example:\` ${def.example} \n` : ""
				}  ${
					def.synonyms
						? `\`Synonyms:\` ${def.synonyms.splice(0, 8).join(", ")}\n\n`
						: "\n"
				}`;
				if (tempString.length < embedDescriptionLimit) descrString = tempString;
			});
		});

		const embedData = {
			title: `Explain ${entry.word} - ${lang}`,
			url: `https://www.dictionary.com/browse/${word}`,
			description: descrString,
			color: 16760576,
			footer: "Results provided by DictionaryAPI",
			footerImage:
        "https://findicons.com/files/icons/2595/leopard_graphite/512/dictionary.png",
		};

		const embed = createEmbed(embedData);

		responses.push(embed);
	});
	return responses;
};
