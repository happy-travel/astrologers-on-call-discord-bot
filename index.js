const Config = require('./config.json');
const fs = require('fs');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');

const intents = new Intents([
    Intents.NON_PRIVILEGED, 
	"GUILD_MEMBERS", 
	"GUILD_PRESENCES"
]);


const client = new Client({ ws: { intents } });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.on('message', async (message) => {
	try {
		if (!Config.prefixes.some(prefix => message.content.startsWith(prefix)) || message.author.bot) 
			return;

		// Slice 1 to skip a prefix
		const args = message.content.slice(1).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		args.message = message;

		await client.commands.get(command).execute(client, message.channel.id, args);
	} catch (e) {
		message.channel.send(`🔮 Астрологи открыли свою мудрость: «${e.message}» 🔮`);
	}
});


client.ws.on('INTERACTION_CREATE', async (interaction) => {
	let command = interaction.data.name;
	
	await client.commands.get(command).execute(client, interaction.channel_id, null);
});


client.login(process.env.HTDC_ON_CALL_DISCORD_TOKEN);  