const fs = require('fs');
const path = require('path');

const handleCommand = message => {
    const { content } = message;
    if (content.startsWith('!')) {
        let args = content.substring(1).split(' ');
        const cmd = args[0];
        args = args.splice(1);
        return { cmd, args };
    } else {
        return;
    }
};

const handleKick = message => {
    message.member.voiceChannel.leave();
};

const sendHelp = message => {
    const readStream = fs.createReadStream(
        path.join(__dirname, '../helpers') + '/commands.txt',
        'utf8'
    );
    let data = '';
    readStream
        .on('data', function(chunk) {
            data += chunk;
        })
        .on('end', function() {
            message.channel.send({
                embed: {
                    color: 3447003,
                    fields: [
                        {
                            name: `LegendBot Commands`,
                            value: data,
                        },
                    ],
                },
            });
        });
};

module.exports = {
    handleCommand,
    handleKick,
    sendHelp,
};
