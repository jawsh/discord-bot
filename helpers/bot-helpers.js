const handleCommand = (message) => {
    const { content } = message;
    if (content.substring(0, 1) == '!') {
        let args = content.substring(1).split(' ');
        const cmd = args[0];
        args = args.splice(1);
        return {cmd, args};
    };
};

module.exports = {
    handleCommand
};