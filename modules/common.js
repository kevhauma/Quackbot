export function deleteMessage(msg) {
    if (msg.channel.type !== 'dm') msg.delete().catch(err=>console.error(err));
}


export function getMessageDetails(msg){
    let args = msg.content.split(" ").filter(w => !w.startsWith("<@"));
    const firstWord = args.shift();

    let mentionOrAuthor = msg.mentions.members?.array()[0]?.user ?? msg.author;    

    return {
        args,
        firstWord,
        mentionOrAuthor,
    }
}