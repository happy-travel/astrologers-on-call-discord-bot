const Config = require('../config.json');


async function getOnlineMembers(client, guildId) {
	let members = await (await client.guilds.fetch(guildId)).members.fetch();
			
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


async function getEnlistee(client, guildId, args) {
	let onlineMembers = await getOnlineMembers(client, guildId);

	let message = null;
	if (args !== null && args !== undefined)
		message = args.message;

	if (message === undefined || message === null) 
		return onlineMembers.map(member => member.user.id);

	let enlistee = [];
	if (0 < message.mentions.users.size) {
		for (let [key, user] of message.mentions.users) {
			if (user.bot === true) {
				continue;
			}

			enlistee.push(key);
		}
	}

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

	return onlineMembers;
};


function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
};


module.exports = {
	name: 'scripter',
	description: 'Заклать сакральную жертву!',
	async execute(client, channelId, args) {
		let channel = await client.channels.fetch(channelId);
        
		let enlistee = await getEnlistee(client, Config.guildId, args);
        if (enlistee.length === 0) {
            channel.send('🔮 Астрологи объявили, что выбирать не из кого 🔮');
            return;
        }

        let position = getRandomInt(enlistee.length);

		let message;
		if (args !== null) {
			message = `📜 Астрологи выбрали <@${enlistee[position]}>`;
		} else {
			message = `📜 Астрологи выбрали ${enlistee[position]}`;
		}

		channel.send(message);
	},
};