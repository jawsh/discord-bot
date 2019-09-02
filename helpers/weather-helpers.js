const axios = require('axios');
const config = require('../config.json');
const _ = require('lodash');
const weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';

const handleWeather = (message, args) => {
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
                            inline: true
                        }
                    ]
                }
            });
            console.log(`Sent weather data for ${res.data.city.name}`);
        })
        .catch(error => {
            console.log(error.response.data.message);
            message.channel.send(error.response.data.message);
        });
};

const formatWeather = week => {
    return week.map(d => {
        const date = new Date(d.day);
        const day = date.toString().substring(0, 4);
        const temp = d.temp;
        const desc = d.desc;
        return `${day} - ${desc} - ${temp}°C`;
    });
};

module.exports = {
    formatWeather,
    handleWeather
};
