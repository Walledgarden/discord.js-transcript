# Introduction

This package is a simple Discord.JS transcript generator. It supports, embed, mentions, codeblocks, italic/bold textes, emote and message content. It it comptaible with Discord.JS v13+.

# How to install?

You can install this package using npm!

```bash
npm install discord.js-transcript
```
<br>

# How to use?

Import the package using require or import. TypeScript types are included.

Common JS Import
```js
const { fetchTranscript } = require('discord.js-transcript');
```

```ts
import { fetchTranscript } from 'discord.js-transcript';
```

The Messages are required to be passed as stringified JSON. Preferably, make your application fetch the guild members before the transcript generation, to include non-cached user names in the messages for mentions.

*The function is not asynchronous.*

**The result will be returned as stringified HTML Markdown.**

```js
const transcript_html = fetchTranscript(messages, client);
```
<br>


# Example usage

**This example fetches the transcript for a channel you select. Dont forget to replace the token!**

```js
const { fetchTranscript } = require('discord.js-transcript');
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

client.on('ready', async () => {
    const channel = client.channels.cache.find(c => c.id === "CHANNEL_ID") || await client.channels.fetch("CHANNEL_ID");
    let messages = await channel?.messages.fetch();
    // The below two lines are required to put the transcript in the right order
    messages = messages?.map(r => r);
    messages.reverse();
    
    const transcript = fetchTranscript(JSON.stringify(messages), client);

    fs.writeFileSync(path.resolve(__dirname, './transcript.html'), transcript)
})

client.login('YOUR_TOKEN').then();
```
<br>


# Issues

*Please report issues on the linked Github repository*
<br>


# Donating

*If you like the project and want to donate to support the further development you can do that with crypto currencies.*

**`Bitcoin: bc1qh0nvlv38d6xw9smgemzcgh0p9y75556y05g57k`**

**`Stellar: GCP6BJSOQOATRJQQOQMO67IZFPZD4O5CQNDYWEBNAJ4KYHHXS2OXFQSD`**

**`Binance Coin / Ethereum / Polygon: 0x2e43c797877b7B8d1154a849Ca13485436149378`**

**`Dogecoin: DPhJJp212STvnknCEjYHtuvcG3K1g1pHzw`**

**`Ripple: r9FVzxWL5kgxncPLkgwNvpXyznzntjSFHi`**