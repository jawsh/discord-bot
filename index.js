const Discord = require('discord.js');
const config = require('./config.json');

const {handleWeather} = require('./helpers/weather-helpers');
const {handleCommand, handleKick} = require('./helpers/bot-helpers');
const {handlePlayYouTube} = require('./helpers/youtube-helpers');

const bot = new Discord.Client();

bot.login(config.discordkey);

bot.once('ready', () => {
    console.log('LegendBot Ready');
    bot.user.setPresence({
        game: {
            name: 'my code',
            type: 'WATCHING'
        },
        status: 'online'
    });
});

bot.on('message', async message => {
    const {cmd, args} = handleCommand(message) || {};
    switch (cmd) {
        case 'ping':
            message.channel.send('Pong!');
            break;
        case 'weather':
            handleWeather(message, args);
            break;
        case 'play':
            handlePlayYouTube(message, args);
            break;
        case 'kick':
            handleKick(message);
    }
});
