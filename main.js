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

const nerds = ['brooks', 'cody', 'mason', 'john', 'jack', 'jake', 'bubba']
client.on('message', message => {
	// Avoid querying database if wrong channel or bad format
	if (message.channel.name != 'diablo2' || !message.content.startsWith("!")) {
		return
	}

	let index = nerds.indexOf(message.content.slice(1));
	if (index >= 0) {
		// Uppercase first letter of name
		let nerdName = nerds[index][0].toUpperCase() + nerds[index].substring(1)
		let docRef = db.collection('deathcount').doc(process.env.DEATH_COLLECTION)
		docRef.get().then(docSnap => {
			let data = docSnap.data()
			let numDeaths = data[nerds[index]]
			numDeaths = numDeaths === undefined ? 0 : numDeaths + 1

			message.channel.send(`${nerdName} died! They have been sheeton by Diablo ${numDeaths} times. Better luck next time!`);

			data[nerds[index]] = data[nerds[index]] === undefined ? 0 : data[nerds[index]]+1
			docRef.set(data).then(res => console.log(`Updated deaths for ${nerdName} to ${numDeaths}`))
		})
	} else {
		message.channel.send(`${message.content.slice(1)} is not being tracked for deaths, you nerd!`);
	}
});

// Discord login
client.login(process.env.DISCORD_TOKEN);
