import axios from "axios";

import { createEmbed } from "../../common.js";

export const japaneseSearch = async (word) => {
	let entries = [];
	try {
		const response = await axios.get(
			`https://jisho.org/api/v1/search/words?keyword=${encodeURI(word)}`
		);
		entries = response.data.data.splice(0, 3);
	} catch (ex) {
		console.log(`${ex}`);
		return {
			error: `Could not fetch data for Japanese query: ${word}`,
		};
	}

	if (entries.length == 0)
		return {
			error: `${word} has no entry in this dictionary,... or are you sure you spelled it right?`,
		};

	let descrString = "";
	entries.forEach((en) => {
		descrString += "\n*____*\n";
		descrString += en.senses
			.map((sens) => sens["parts_of_speech"].join(", "))
			.join(", ");
		descrString += `${en.japanese
			.map((jap) => `\`\`\`${jap.word} (${jap.reading})\`\`\``)
			.join("")}`;
		descrString += en.senses
			.map((sens) => sens["english_definitions"].join(", "))
			.join(", ");
	});

	const embedData = {
		title: `Explain ${word}`,
		url: `https://jisho.org/search/${encodeURI(word)}`,
		description: descrString,
		color: "#4E5D94",
		footer: "Results provived by Jisho.org",
		footerImage: "https://avatars.githubusercontent.com/u/12574115?s=280&v=4",
	};

	const embed = createEmbed(embedData);
	return [embed];
};
