/**
 * Send a user a link to their avatar
 */

// Import the discord.js module
const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

// Create an instance of a Discord client
const bot = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
bot.on('ready', () => {
    console.log('LEGENDBOT ONLINE');
});

// Create an event listener for messages
bot.on('message', message => {
    const {content} = message;
    if (content.substring(0, 1) == '!') {
        let args = content.substring(1).split(' ');
        const cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            case 'ping':
                message.channel.send('Pong!');
                break;
            case 'weather':
                console.log(args);
                const city = args[0];
                const country = args[1];
                axios
                    .get(
                        `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&APPID=${config.weatherkey}`
                    )
                    .then(res => {
                        console.log(res);
                        message.channel.send(JSON.stringify(res));
                    });
                break;
        }
    }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
bot.login(config.discordkey);
