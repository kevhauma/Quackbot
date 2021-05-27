import axios from 'axios'
import { MessageEmbed } from 'discord.js';
import { parse } from 'node-html-parser'
import he from 'he'
import { deleteMessage } from '../common.js'

const deleteTags = /<[^>]*>/gim
const wotdURL = "https://www.dictionary.com/e/word-of-the-day/"

const help = "usage: `d!wotd`"
export default {
    name: "wotd",
    run: handle,
    help
}

async function handle(msg, msgDetails) {
    const sendResultTo = msgDetails.mentionOrAuthor
    try {
        console.log(`d!wotd: ${msg.author.username} searched for wotd`);

        let { data } = await axios.get(`${wotdURL}`)
        let htmlDOM = parse(data)

        let wordDOM = htmlDOM.querySelector(".otd-item-headword__word")
        let wordString = he.decode(wordDOM.toString().replace(deleteTags, "").trim())

        let pronDOM = htmlDOM.querySelector(".otd-item-headword__pronunciation")
        let pronString = he.decode(pronDOM.toString().replace(deleteTags, "").trim())

        let meaningDOM = htmlDOM.querySelector(".otd-item-headword__pos")
        let meaningString = he.decode(meaningDOM.toString().replace(deleteTags, "").trim())
        let meaningParts = meaningString.split(" ").filter(c => c && !/\s/m.test(c))
        let pos = meaningParts.shift()
        let meaning = meaningParts.join(" ")      


        const embed = new MessageEmbed()
            .setTitle(`d!wotd: ${wordString}`)
            .setDescription(`${pronString}\n__\n${pos}\n\`\`\`${meaning}\`\`\`\n[Web Page](${wotdURL})`)
            .setColor("#4E5D94")
            .setFooter("Made by MrJunior717, go bother him if something's broken, Results provided by Dictionary.com");

        sendResultTo.send(embed);



    } catch (e) {



        msg.author.send("something has fatally wrong, please contact MrJunior717")
        console.error(e)
    }

}