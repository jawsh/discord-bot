const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

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

bot.login(config.discordkey);
