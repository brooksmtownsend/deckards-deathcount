require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Deckard is ready to count deaths');
});

client.on('message', message => {
	switch(message.content) {
		case "!brooks":
			message.channel.send(`Brooks has died! Total death count: ${}`);
			break;
		case "!cody":
			break;
		case "!mason":
			break;
		case "!john":
			break;
		case "!jake":
			break;
		case "!bubba":
			break;
		case "!jack":
			break;
	}
});

client.login(process.env.DISCORD_TOKEN);
