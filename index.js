const Discord = require('discord.js');
const _ = require('lodash');
const config = require('./config.json');

const { handleWeather } = require('./helpers/weather-helpers');
const { handleCommand } = require('./helpers/bot-helpers');

const ytdl = require('ytdl-core');

const bot = new Discord.Client();

const YouTube = require('youtube-node');
const youTube = new YouTube();
youTube.setKey(config.youtubekey);

bot.on('ready', () => {
    console.log('LegendBot Ready');
    bot.user.setPresence({
        game: {
            name: 'my code',
            type: 'WATCHING',
        },
        status: 'online',
    });
});

bot.on('message', async message => {
    const { cmd, args } = handleCommand(message) || {};
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
                    const query = args[0].substring(32);
                    youTube.getById(query, (error, res) => {
                        if (error) {
                            console.error(error);
                        } else {
                            const id = res.items[0].id;
                            const dispatcher = connection.playStream(
                                ytdl(`https://www.youtube.com/watch?v=${id}`, {
                                    filter: 'audioonly',
                                    volume: 0.1,
                                }),
                            );
                        }
                    });
                } else {
                    youTube.search(args.join(''), 1, (error, res) => {
                        if (error) {
                            console.error(error);
                        } else {
                            if (!_.isEmpty(res.items)) {
                                const id = res.items[0].id.itemId;
                                const dispatcher = connection.playStream(
                                    ytdl(
                                        `https://www.youtube.com/watch?v=${id}`,
                                        {
                                            filter: 'audioonly',
                                            volume: 0.1,
                                        },
                                    ),
                                );
                            } else {
                                message.reply('Wtf song is that?');
                            }
                        }
                    });
                }
            } else {
                message.reply('You need to join a voice channel first!');
            }
            break;
        case 'kick':
            message.member.voiceChannel.leave();
    }
});

bot.login(config.discordkey);
