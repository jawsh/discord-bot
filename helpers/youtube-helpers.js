const ytdl = require('ytdl-core');
const YouTube = require('youtube-node');
const config = require('../config.json');
const _ = require('lodash');

const youTube = new YouTube();

youTube.setKey(config.youtubekey);

const handlePlayYouTube = async (message, args) => {
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
};

const handleYouTubeUrl = (args, connection, message) => {
    const query = args[0].substring(32);
    youTube.getById(query, (error, res) => {
        if (error) {
            console.error(error);
        } else {
            const id = res.items[0].id;
            connection.playStream(
                ytdl(`https://www.youtube.com/watch?v=${id}`, {
                    filter: 'audioonly',
                    volume: 0.1
                })
            );
            message.channel.send(`Now playing ${res.items[0].id}`);
        }
    });
};

const handleYouTubeSearch = (args, connection, message) => {
    youTube.search(args.join(''), 1, (error, res) => {
        if (error) {
            console.error(error);
        } else {
            if (!_.isEmpty(res.items)) {
                const id = res.items[0].id.videoId;
                connection.playStream(
                    ytdl(`https://www.youtube.com/watch?v=${id}`, {
                        filter: 'audioonly',
                        volume: 0.1
                    })
                );
            } else {
                message.reply('Wtf song is that?');
            }
        }
    });
};

module.exports = {
    handlePlayYouTube
};
