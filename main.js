require('dotenv').config()
var admin = require('firebase-admin');
const Discord = require('discord.js');
const client = new Discord.Client();

// Firebase setup
var serviceAccount = require(process.env.FIREBASE_ADMIN);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Discord ready
client.once('ready', () => {
	console.log('Deckard is ready to count deaths');
});

let getDeaths = () => {
	db.collection('deathcount').get().then(snapshot => {
		snapshot.forEach((doc) => {
			console.log(doc.id)
			console.log(process.env.DEATH_COLLECTION)
			if (doc.id == process.env.DEATH_COLLECTION) {
				return doc.data();
			}
		});
	});
}

console.log(getDeaths());

// Death counter
client.on('message', message => {
	if (!message.startsWith("!")) {
		return
	}

	switch(message.content) {
		case "!brooks":
			message.channel.send(`Brooks has died! Total death count: ${count}`);
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


// Discord login
client.login(process.env.DISCORD_TOKEN);
