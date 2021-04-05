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


async function getEnlistee(message) {
	async function getOnlineMembers() {
		let members = await (await client.guilds.fetch(Config.guildId)).members.fetch();
				
		let onlineMembers = [];
		for(let [_, member] of members) {
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

		return onlineMembers;
	};


	let enlistee = [];
	if (0 < message.mentions.users.size) {
		for (let [key, user] of message.mentions.users) {
			if (user.bot === true) {
				continue;
			}

			enlistee.push(key);
		}
	}

	let onlineMembers = await getOnlineMembers();
	if (0 < message.mentions.roles.size) {
		for (let [key, role] of message.mentions.roles) {
			if (role.deleted === true) {
				continue;
			}

			let roleMembers = onlineMembers.filter(member => member._roles.includes(key));
			enlistee = [...enlistee, ...roleMembers.map(member => member.user.id)];
		}
	}

	if (enlistee.length !== 0 ) {
		return enlistee;
	}

	return onlineMembers.map(member => member.user.id);
};


function getProclamation(correctionCoefficient) {
	function getPosition(week, count, correction) {
		let pos = (week % count) + correction;

		if(count <= pos) {
			pos = pos - count;
		}

		return pos;
	}


	if (correctionCoefficient === undefined || correctionCoefficient === 0) {
		correctionCoefficient = 0;
	}

	let engineers = Config.engineers;
	let elapsedWeeks = getElapsedWeekCount();
	
	let position = getPosition(elapsedWeeks, engineers.length, correctionCoefficient);
	let engineer = engineers[position];

	let nextPosition = getPosition((elapsedWeeks + 1), engineers.length, correctionCoefficient);
	let nextEngineer = engineers[nextPosition];

	return `🔮 Астрологи объявили эту неделю неделей ${engineer.gen} <@!${engineer.id}>. ${engineer.nom} удваивает количество закрытых багов 🔮` + 
		`\r\nНа горизонте появляется <@${nextEngineer.id}>.`;
};


function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
};


client.on('message', async (message) => {
	try {
		if (isMatch('proclaim', message.content)) {
			let correctionCoefficient = Number(process.env.HTDC_ON_CALL_CORRECTION_COEFFICIENT);
			let proclamation = getProclamation(correctionCoefficient);
	
			message.channel.send(proclamation);
		}
	
		if (isStart('scripter', message.content) || isStart('enlist', message.content)) {
			let enlistee = await getEnlistee(message);
			if (enlistee.length === 0) {
				message.channel.send('🔮 Астрологи объявили, что выбирать не из кого 🔮');
				return;
			}

			let position = getRandomInt(enlistee.length);
			message.channel.send(`📜 Астрологи выбрали <@${enlistee[position]}>`);
		}
	} catch (e) {
		message.channel.send(`🔮 Астрологи открыли свою мудрость: «${e.message}» 🔮`);
	}
});


client.login(process.env.HTDC_ON_CALL_DISCORD_TOKEN);