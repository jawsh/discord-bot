const Discord = require('discord.js');
const _ = require('lodash');
const config = require('./config.json');

const {handleWeather} = require('./helpers/weather-helpers');
const {handleCommand} = require('./helpers/bot-helpers');
const {
    handleYouTubeUrl,
    handleYouTubeSearch
} = require('./helpers/youtube-helpers');

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
            if (message.member.voiceChannel) {
                const connection = await message.member.voiceChannel.join();
                if (args[0].startsWith('https://www.youtube.com/watch?v=')) {
                    handleYouTubeUrl(args, connection, message);
                } else {
                    handleYouTubeSearch(args, connection, message);
                }
            } else {
                message.reply('You need to join a voice channel first!');
            }
            break;
        case 'kick':
            message.member.voiceChannel.leave();
    }
});
