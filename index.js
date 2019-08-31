const Discord = require('discord.js');
const config = require('./config.json');

const { handleWeather } = require('./helpers/weather-helpers');
const { handleCommand } = require('./helpers/bot-helpers');

const ytdl = require('ytdl-core');

const bot = new Discord.Client();

const YouTube = require('youtube-node');
const youTube = new YouTube();
youTube.setKey(config.youtubekey);

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
                youTube.search(args[0] + args[1] + args[2], 1, (error, res) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(res);
                        const id = res.items[0].id.videoId;
                        const dispatcher = connection.playStream(
                            ytdl(`https://www.youtube.com/watch?v=${id}`, {
                                filter: 'audioonly',
                                volume: 0.1,
                            }),
                        );
                        dispatcher.on('end', () => {
                            message.channel.send('Finished playing!');
                            message.member.voiceChannel.leave();
                        });
                    }
                });
            } else {
                message.reply('You need to join a voice channel first!');
            }
            break;
        case 'kick':
            console.log('KICKING');
            message.member.voiceChannel.leave();
    }
});

bot.login(config.discordkey);
