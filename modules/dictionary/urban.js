import axios from 'axios'
import { MessageEmbed } from 'discord.js';
import { parse } from 'node-html-parser'
import he from 'he'
import { deleteMessage } from '../common.js'

const deleteTags = /<[^>]*>/gim
const urbanURL = "https://www.urbandictionary.com/define.php"

const help = "usage: `d!urban <word/sentence> [@mention]`"
export default {
    name: "urban",
    run: handle,
    help
}

async function handle(msg, msgDetails) {
    const sendResultTo = msgDetails.mentionOrAuthor
    const word = msgDetails.args.join(" ")
    try {
        if (!word) {
            msg.author.send(help);
            return deleteMessage(msg);
        }

        console.log(`d!urban: ${msg.author.username} searched for ${word} sending to ${sendResultTo.username}`);

        let { data } = await axios.get(`${urbanURL}?term=${encodeURI(word)}`)

        let divs = parse(data).querySelectorAll(".def-panel")

        if (!divs) {
            msg.author.send(`${word} has no entry in the Urban Dictionary`)
            deleteMessage(msg)
        }

        let filtereddivs = divs.filter(div => div.querySelector(".word").firstChild.rawText.toLowerCase() === word.toLowerCase())

        let meanings = filtereddivs.map(d => d.querySelector(".meaning").toString())

        let meaningStrings = meanings.map(d => he.decode(d.replace(deleteTags, "")))       

        if (sendResultTo.id === msg.author.id)
            msg.author.send(`You asked for the definition of \`${word}\`, let's see them`);
        else {
            sendResultTo.send(`${msg.author.username} thought you wanted to know what \`${word}\` means, here you have it.`);
            msg.author.send(`I have sent the definition of \`${word}\` to ${sendResultTo.username}.`);
        }

        let descrString = ''
        meaningStrings.splice(0, 5).forEach(meaning => {
            descrString += `*__*\n`;
            descrString += `\`\`\`${meaning}\`\`\`\n`;
        });


        const embed = new MessageEmbed()
            .setTitle(`d!urban: ${word}`)
            .setDescription(`${descrString.substr(0,1950)}\n[Web Page](${urbanURL}?term=${encodeURI(word)})`)
            .setColor("#4E5D94")
            .setFooter("Made by MrJunior717, go bother him if something's broken, Results provided by Urban Dictionary");

        sendResultTo.send(embed);



    } catch (e) {
        //console.error(e)
        if(e.response.status === 404){
            msg.author.send(`${word} has no entry in the Urban Dictionary`)
            deleteMessage(msg)
        }

        else{
            msg.author.send("something has fatally wrong, please contact MrJunior717")
        }
    }

}