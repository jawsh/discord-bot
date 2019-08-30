const handleCommand = (message) => {
    const { content } = message;
    if (content.startsWith('!')) {
        let args = content.substring(1).split(' ');
        const cmd = args[0];
        args = args.splice(1);
        return {cmd, args};
    };
};

module.exports = {
    handleCommand
};