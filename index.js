const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();


function isMatch(command, content) {
	config.prefixes.forEach(prefix => {
		if (content === `${prefix}${command}`) {
			return true;
		}
	})

	return false;
};


client.on('message', message => {
	if (isMatch('proclaim', message.content)) {
		let engineers = config.engineers;
	  
		let today = new Date();
		let utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
		
		let elapsedWeeks = Math.floor((utcToday / (1000 * 60 * 60 * 24)) / 7);
		
		let position = elapsedWeeks % engineers.length;
		let engineer = engineers[position];

		let proclamation = `🔮 Астрологи объявили эту неделю неделей ${engineer.gen}. ${engineer.nom} удваивает количество закрытых багов 🔮`;

		message.channel.send(proclamation);
	}
});

client.login(process.env.HTDC_ON_CALL_DISCORD_TOKEN);