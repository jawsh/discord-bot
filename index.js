const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');
const _ = require('lodash');
const { formatWeather } = require('./helpers/weather-helpers');

const bot = new Discord.Client();

const weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';

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
    const { content } = message;
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
                axios
                    .get(
                        `${weatherUrl}?q=${city},${country}&units=metric&APPID=${config.weatherkey}`
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
                        const weather = formatWeather(week);
                        message.channel.send({
                            embed: {
                                color: 3447003,
                                fields: [
                                    {
                                        name: `Weather in ${res.data.city.name}/${res.data.city.country}`,
                                        value: weather
                                            .map(i => {
                                                return `${i}\n`;
                                            })
                                            .join(''),
                                        inline: true,
                                    },
                                ],
                            },
                        });
                        console.log(
                            `Sent weather data for ${res.data.city.name}`
                        );
                    })
                    .catch(error => {
                        console.log(error.response.data.message);
                        message.channel.send(error.response.data.message);
                    });
                break;
        }
    }
});

bot.login(config.discordkey);
