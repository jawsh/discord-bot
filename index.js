const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');
const _ = require('lodash');
const {formatChat} = require('./helpers/chat-helpers');

const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('LEGENDBOT ONLINE');
});

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
                const city = args[0];
                const country = args[1];
                try {
                    axios
                        .get(
                            `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&APPID=${config.weatherkey}`
                        )
                        .then(res => {
                            const list = res.data.list;
                            const days = [];
                            list.map(d => {
                                let day = d.dt_txt.substr(0, 10);
                                days.push({
                                    day: day,
                                    temp: d.main.temp,
                                    desc: d.weather[0].main
                                });
                            });
                            const week = _.uniqBy(days, 'day');
                            message.channel.send(formatChat(week));
                        });
                    break;
                } catch (err) {
                    console.error(err);
                }
        }
    }
});

bot.login(config.discordkey);
