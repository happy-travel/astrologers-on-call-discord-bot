const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', message => {
	if (message.content === `${config.prefix}proclaim`) {
		let engineers = config.engineers;
	  
		let today = new Date();
		let utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
		
		let elapsedWeeks = Math.floor((utcToday / (1000 * 60 * 60 * 24)) / 7);
		
		let position = elapsedWeeks % engineers.length;
		let engineer = engineers[position];

		let proclamation = `Астрологи объявили эту неделю неделей ${engineer.gen}. ${engineer.nom} удваивает количество закрытых багов`;

		message.channel.send(proclamation);
	}
});

client.login(process.env.HTDC_ON_CALL_DISCORD_TOKEN);