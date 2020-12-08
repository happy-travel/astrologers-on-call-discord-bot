const Config = require('./config.json');
const { Discord, Client, Intents } = require('discord.js');

const intents = new Intents([
    Intents.NON_PRIVILEGED, 
	"GUILD_MEMBERS", 
	"GUILD_PRESENCES"
]);

const client = new Client({ ws: { intents } });


function isMatch(command, content) {
	return Config.prefixes.some(prefix => content === `${prefix}${command}`);
};


function isStart(command, content) {
	return Config.prefixes.some(prefix => content.startsWith(`${prefix}${command}`));
};


function getElapsedWeekCount() {
	let today = new Date();
	let utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	
	return Math.floor((utcToday / (1000 * 60 * 60 * 24)) / 7);
};


function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}


client.on('message', async (message) => {
	try {
		if (isMatch('proclaim', message.content)) {
			let engineers = Config.engineers;
			let elapsedWeeks = getElapsedWeekCount();
			
			let position = elapsedWeeks % engineers.length;
			let engineer = engineers[position];
	
			let proclamation = `🔮 Астрологи объявили эту неделю неделей ${engineer.gen}. ${engineer.nom} удваивает количество закрытых багов 🔮`;
	
			message.channel.send(proclamation);
		}
	
		if (isStart('scripter', message.content) || isStart('enlist', message.content)) {
			let participants = [];
		
			if (0 < message.mentions.users.size) {
				for (let [key, user] of message.mentions.users) {
					if (user.bot === true) {
						continue;
					}
	
					participants.push(key);
				}
			}

			let members = ( await (await client.guilds.fetch(Config.guildId)).members.fetch());
		
			let onlineMembers = [];
			for(let [key, member] of members) {
				if (member.deleted === true) {
					continue;
				}

				if (member.user.bot == undefined || member.user.bot === true) {
					continue;
				}

				if (member.presence.status !== 'online') {
					continue;
				}

				onlineMembers.push(member);
			};

			if (0 < message.mentions.roles.size) {
				for (let [key, role] of message.mentions.roles) {
					if (role.deleted === true) {
						continue;
					}
	
					let roleMembers = onlineMembers.filter(member => member._roles.includes(key));
					participants.push(roleMembers.map(member => member.user.id));
				}
			}

			if (participants.length === 0 ) {
				participants = onlineMembers.map(member => member.user.id);;
			}

			if (participants.length !== 0) {
				let position = getRandomInt(participants.length);
				message.channel.send(`📜 Астрологи выбрали <@${participants[position]}>`);

				return;
			}

			message.channel.send('🔮 Астрологи объявили, что выбирать не из кого 🔮');
		}
	} catch (e) {
		message.channel.send(`🔮 Астрологи многозначительно объявили следующее: «${e.message}» 🔮`);
	}
});

client.login(process.env.HTDC_ON_CALL_DISCORD_TOKEN);