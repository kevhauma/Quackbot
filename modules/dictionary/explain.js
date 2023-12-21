import { SlashCommandBuilder } from "discord.js";
import { japaneseSearch, wordSearch } from "./utils/index.js";

export const name = "explain";

export const command = new SlashCommandBuilder()
	.setName(name)
	.setDescription("get the definition of a word")
	.addStringOption((option) =>
		option.setName("word").setDescription("Word to define").setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("language")
			.setDescription("language of the word [default: EN/UK]")
			.addChoices(
				{ name: "🇬🇧 EN/UK", value: "en_GB" },
				{ name: "🇺🇸 EN/US", value: "en_US" },
				{ name: "🇯🇵 Japanese", value: "ja" },
				// { name: "French", value: "fr" },
				// { name: "Hindi", value: "hi" },
				// { name: "Spanish", value: "es" },
				// { name: "Russian", value: "ru" },
				// { name: "German", value: "de" },
				// { name: "Italian", value: "it" },
				// { name: "Korean", value: "ko" },
				// { name: "Portuguese", value: "pt-BR" }
			)
	)
	.addBooleanOption((option) =>
		option.setName("private").setDescription("I can only see the reply")
	);

const processCommand = async (word, language) => {
	const searchResult = language === "ja" ? await japaneseSearch(word) : await wordSearch(word, language || "en_GB");

	if (searchResult.error) {
		return [{content:`An error has occured: \`\`\`${searchResult.error}\`\`\``}];
	}

	const responses = [
		{ content: `You asked for the definition of \`${word}\`, let's see them` },
		...searchResult,
	];

	return responses;
};

export const handle = async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const word = interaction.options.getString("word");
	const language = interaction.options.getString("language");
	const ephemeral = interaction.options.getBoolean("private");

	await interaction.deferReply({ ephemeral });

	const responses = await processCommand(word, language);

	const firstResponse = responses.shift();
	
	interaction.editReply({ ...firstResponse, ephemeral });

	responses.forEach((r, i) => {
		setTimeout(() => interaction.followUp({ ...r, ephemeral }), i + 2 * 500);
	});
};
