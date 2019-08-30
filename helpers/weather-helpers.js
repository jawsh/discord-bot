const formatWeather = week => {
    return week.map(d => {
        const date = new Date(d.day);
        const day = date.toString().substring(0, 4);
        const temp = d.temp;
        const desc = d.desc;
        return `${day} - ${desc} - ${temp}°`;
    });
};

module.exports = {
    formatWeather,
};
