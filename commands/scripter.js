async function getEnlistee(message, guildId) {
	async function getOnlineMembers(guildId) {
		let members = await (await message.client.guilds.fetch(guildId)).members.fetch();
				
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

	let onlineMembers = await getOnlineMembers(guildId);
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


function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
};


module.exports = {
	name: 'scripter',
	description: 'Заклать сакральную жертву!',
	async execute(message, args) {
		let enlistee = await getEnlistee(message, args.guildId);
        if (enlistee.length === 0) {
            message.channel.send('🔮 Астрологи объявили, что выбирать не из кого 🔮');
            return;
        }

        let position = getRandomInt(enlistee.length);
        message.channel.send(`📜 Астрологи выбрали <@${enlistee[position]}>`);
	},
};