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

const nerds = ['Brooks', 'Cody', 'Mason', 'John', 'Jack', 'Jake', 'Bubba']
const phrases = [
'got sheeton by Diablo',
'ran out of mana',
'couldn\'t teepee in time',
'found out health potions work over time, the hard way',
'had a hard day, okay',
'forgot how to close the inventory screen',
'instantly TP\'ed back to town, in their own style',
]

client.on('message', message => {
	// Avoid querying database if wrong channel or bad format
	if (!message.channel.name.startsWith('diablo2') || !message.content.startsWith("!")) {
		return
	}

	if (message.content == "!diablohelp") {
		let allNerds = nerds.reduce((acc, curr) => acc + ', ' + curr)
		message.channel.send(`I'm here to remember all the shameful times you died! I'll keep track of the following nerds: ${allNerds}.\nI can understand the command !<nerd> to increment deaths, or !set <nerd> <number> to set the deaths.`);
		return
	}

	// Manual override for deaths
	if (message.content.startsWith("!set")) {
		let parts = message.content.split(" ")
		if (parts.length !== 3) {
			return
		}
		let docRef = db.collection('deathcount').doc(process.env.DEATH_COLLECTION)
		docRef.get().then(docSnap => {
			let data = docSnap.data();
			let resetNum = parseInt(parts[2])
			if (data[parts[1]] !== undefined && resetNum != NaN) {
				data[parts[1]] = resetNum
			}

			message.channel.send(`I'm just an old man, I must've miscounted! Looks like ${parts[1][0].toUpperCase() + parts[1].substring(1)} only died ${resetNum} times!`);
			docRef.set(data).then(res => console.log(`Reset deaths for ${parts[1]} to ${resetNum}`))
		})
		return
	}

	let nerdName = message.content.slice(1).toLowerCase()
	let index = nerds.indexOf(nerdName[0].toUpperCase() + nerdName.substring(1));
	if (index >= 0) {
		let docRef = db.collection('deathcount').doc(process.env.DEATH_COLLECTION)
		docRef.get().then(docSnap => {
			let data = docSnap.data()
			let numDeaths = data[nerdName]
			numDeaths = numDeaths === undefined ? 0 : numDeaths + 1

			message.channel.send(`${nerds[index]} ${phrases[Math.floor(Math.random() * phrases.length)]}. Their total death count is: ${numDeaths}.`);

			data[nerdName] = data[nerdName] === undefined ? 0 : data[nerdName]+1
			docRef.set(data).then(res => console.log(`Updated deaths for ${nerdName} to ${numDeaths}`))
		})
	} else {
		message.channel.send(`${message.content.slice(1)} is not being tracked for deaths, you nerd!`);
	}
});

// Discord login
client.login(process.env.DISCORD_TOKEN);
