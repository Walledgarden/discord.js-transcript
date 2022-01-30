const { Client, Guild } = require('discord.js');

const createElementFromHTML = (document, htmlString) => {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

/**
 * 
 * @param {String} text 
 * @param {Guild} guild
 * @param {Client} client 
 */
const parseMentions = (text, guild, client) => {
    text = text.replaceAll(/<@!?(\d+)>/g, (f, o = '$1') => { return `<span class="mention">@${client.users.cache.find(u => u.id === o)?.username}</span>`; }); // User Mentions
    text = text.replaceAll(/<@&(\d+)>/g, (f, o = '$1') => { return `<span class="mention" style="background: ${guild.roles.cache.find(g => g.id === o)?.hexColor}33; color: ${guild.roles.cache.find(g => g.id === o)?.hexColor}">@${guild.roles.cache.find(g => g.id === o)?.name}</span>`; }); // Role Mentions
    text = text.replaceAll(/<a:(.+):(\d+)>/g, (f, b, o) => { return `<img src="https://cdn.discordapp.com/emojis/${o}.gif?size=96&quality=lossless" width="${(/^<a:(.+):(\d+)>$/).test(text) ? '48px' : '22px'}" height="${(/^<a:(.+):(\d+)>$/).test(text) ? '48px' : '22px'}">`; }); // Animted Emotes
    text = text.replaceAll(/<:(.+):(\d+)>/g, (f, b, o) => { return `<img src="https://cdn.discordapp.com/emojis/${o}.webp?size=96&quality=lossless" width="${(/^<:(.+):(\d+)>$/).test(text) ? '48px' : '22px'}" height="${(/^<:(.+):(\d+)>$/).test(text) ? '48px' : '22px'}">`; }); // Normal Emotes
    text = text.replaceAll(/\*\*\*(.+)\*\*\*/g, '<i><b>$1</b></i>'); // Bold Italic
    text = text.replaceAll(/\*\*(.+)\*\*/g, '<b>$1</b>'); // Bold
    text = text.replaceAll(/\*(.\n+)\*/g, '<i>$1</i>'); // Italic
    text = text.replaceAll(/\`\`\`(.+)?\n([\s\S]*)\n\`\`\`/g, (a, b, c = '$2') => { return `<div class="codeblock" style="font-size: 11px; white-space:pre-wrap;">${c.replaceAll(/\n/g, '<br>').replaceAll(/\t/g, '&#09;')}</div>` }); // Code Block
    text = text.replaceAll(/\`(.+)\`/g, '<code style="background: rgb(47, 49, 54); color: white;">$1</code>'); // Inline Code
    text = text.replaceAll(/<:(.+):(\d+)>/g, (f, b, o) => { return `<img src="https://cdn.discordapp.com/emojis/${o}.webp?size=96&quality=lossless" width="${(/^<:(.+):(\d+)>$/).test(text) ? '48px' : '22px'}" height="${(/^<:(.+):(\d+)>$/).test(text) ? '48px' : '22px'}">`; }); // Code
    return text;
}

/**
 * 
 * @param {Array} messages 
 * @param {Client} client 
 * @returns 
 */
module.exports.fetchTranscript = (messages, client) => {
    const Templates = require('./src/templates');

    if (typeof messages !== "object") messages = JSON.parse(messages);

    const jsdom = require('jsdom');
    const { JSDOM } = jsdom;
    const fs = require('fs');
    const path = require('path');
    const dom = new JSDOM(fs.readFileSync(path.resolve(__dirname, './src/template.html')));
    
    const document = dom.window.document;

    const messagesd = document.createElement('div');
    messagesd.classList.add('messages');

    const guild = client.guilds.cache.find(g => g.id === messages[0].guildId);
    const channel = client.channels.cache.find(c => c.id === messages[0].channelId);

    for (const message of messages) {
        document.querySelector('#channel__name').innerHTML = channel.name;
        document.querySelector('#channel__description').innerHTML = channel.topic;

        const messageboxd = document.createElement('div');
        messageboxd.classList.add('message-box');
        messageboxd.style.display = 'flex';
        messageboxd.style.flexDirection = 'row';

        const profilepicture = document.createElement('img');
        profilepicture.src = client.users.cache.find(u => u.id === message.authorId)?.displayAvatarURL();
        profilepicture.setAttribute('height', '38px');
        profilepicture.setAttribute('width', '38px');
        profilepicture.style.borderRadius = "50%";
        profilepicture.style.margin = "0 18px 0 0";

        messageboxd.appendChild(profilepicture);

        const messaged = document.createElement('div');
        messaged.classList.add('message');
        messaged.style.display = 'flex';
        messaged.style.flexDirection = 'column';

        const author_ts = document.createElement('div');
        author_ts.innerHTML = `<span style="font-size: 16px; font-weight: 600;">${client.users.cache.find(u => u.id === message.authorId)?.username}</span> <span style="opacity: 0.6; font-size: 10px">${new Date(message.createdTimestamp).toLocaleDateString()} ${new Date(message.createdTimestamp).toLocaleTimeString()}</span>`;
        messaged.appendChild(author_ts);

        if (message.content !== null) {
            const tn = document.createElement('p');
            tn.style.fontSize = "14px";
            tn.innerHTML = parseMentions(message.content, guild, client);
            messaged.appendChild(tn);
        }

        for (const embed of message.embeds) {
            embed.description = parseMentions(embed.description, guild, client);
            embed.fields = embed.fields.map(r => {
                return {
                    name: r.name,
                    value: parseMentions(r.value, guild, client)
                }
            });
            messaged.appendChild(
                createElementFromHTML(
                    document,
                    Templates.embed({
                        author_name: embed.author?.name || undefined,
                        author_image: embed.author?.avatarURL || undefined,
                        author_url: embed.author?.url || undefined,
                        title: (embed.title === null ? undefined : embed.title),
                        url: (embed.url === null ? undefined : embed.url),
                        description: (embed.description === null ? undefined : embed.description),
                        fields: embed.fields,
                        footer: embed.footer?.text || undefined,
                        color: embed.color || 0xFFFFFF
                    })
                )
            );
        }

        for (const sticker of message.stickers) {
            messaged.appendChild(
                createElementFromHTML(document, `<img src="https://media.discordapp.net/stickers/${sticker}.webp?size=160" width="160px" height="160px">`)
            );
        }


        messageboxd.appendChild(messaged)
        messagesd.appendChild(messageboxd);
    }

    document.body.appendChild(messagesd);

    return dom.serialize().toString();
}
