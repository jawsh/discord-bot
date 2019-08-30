const Discord = require('discord.js');
const config = require('./config.json');

const {handleWeather} = require('./helpers/weather-helpers');
const {handleCommand} = require('./helpers/bot-helpers');

const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('LEGENDBOT ONLINE');
    bot.user.setPresence({
        game: {
            name: 'my code',
            type: 'WATCHING',
        },
        status: 'online',
    });
});

bot.on('message', message => {
        const {cmd, args} = handleCommand(message) || {};
        switch (cmd) {
            case 'ping':
                message.channel.send('Pong!');
                break;
            case 'weather':
                handleWeather(message, args);
                break;
        }
    });

bot.login(config.discordkey);
