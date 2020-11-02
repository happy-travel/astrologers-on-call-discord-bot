const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();


function isMatch(command, content) {
	return config.prefixes.some(prefix => content === `${prefix}${command}`)
};


function getElapsedWeekCount() {
	let today = new Date();
	let utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	
	return Math.floor((utcToday / (1000 * 60 * 60 * 24)) / 7);
};


client.on('message', message => {
	if (isMatch('proclaim', message.content)) {
		let engineers = config.engineers;
		let elapsedWeeks = getElapsedWeekCount();
		
		let position = elapsedWeeks % engineers.length;
		let engineer = engineers[position];

		let proclamation = `🔮 Астрологи объявили эту неделю неделей ${engineer.gen}. ${engineer.nom} удваивает количество закрытых багов 🔮`;

		message.channel.send(proclamation);
	}

	if (isMatch('scripter', message.content)) {
		let scripters = config.scripters;
		let elapsedWeeks = getElapsedWeekCount();

		let position = elapsedWeeks % scripters.length;
		let scripter = scripters[position];

		let msg = `📜 ${scripter}`;

		message.channel.send(msg);
	}
});

client.login(process.env.HTDC_ON_CALL_DISCORD_TOKEN);