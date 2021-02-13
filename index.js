/**
 * @variables
 **/
const express = require('express'),
	app = express(),
	Canvas = require('canvas'),
	{ registerFont } = require('canvas'),
	moment = require('moment'),
	Discord = require('discord.js'),
	client = new Discord.Client(),
	prefix = process.env.PREFIX,
	welcomeImage = process.env.DEFAULT_WELCOME_IMAGE,
	db = require('quick.db'),
	getWelcomeChannel = (guildId, channel) => db.get(`welcome_${guildId}`),
	setWelcomeChannel = (guildId, channel) =>
		db.set(`welcome_${guildId}`, channel);

require('dotenv').config();
registerFont('./Impact.ttf', { family: 'cairo' });
/**
 * @web server by express
 **/
app.get('/', (req, res) => {
	res.send('Server - discord-bot-welcome' + process.env.PORT);
});
app.listen(process.env.PORT, () => {
	console.log('Server - discord-bot-welcome');
});
/**
 * @ready event
 **/
client.on('ready', () => {
	client.user.setPresence({
		activity: { name: process.env.statues, type: process.env.type }
	});
	console.log('am ready at ' + client.user.tag);
});
/**
 * @login into bot client
 **/
client.login(process.env.TOKEN);

client.on('guildMemberAdd', async member => {
	//do not toutch if you can't understand please👇


		canvas = Canvas.createCanvas(700, 350),
		ctx = canvas.getContext('2d'),
		applyText = (canvas, text) => {
			let fontSize = 50;
			do {
				ctx.font = `${(fontSize -= 10)}px cairo`;
			} while (ctx.measureText(text).width > canvas.width - 300);
			return ctx.font;
		},
		applyText2 = (canvas, text) => {
			let fontSize = 70;
			do {
				ctx.font = `${(fontSize -= 10)}px cairo`;
			} while (ctx.measureText(text).width > canvas.width - 300);
			return ctx.font;
		},

		background = await Canvas.loadImage(process.env.DEFAULT_WELCOME_IMAGE),
		avatar = await Canvas.loadImage(
			member.user.displayAvatarURL({ format: 'jpg' })
		),
		msg = `Welcome, ${member} \nTo :(${member.guild.name}) \nWe Have Now :(${
			member.guild.memberCount
		}) Members`;
	//do not toutch if you can't understand please👆
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	// juat msg
	ctx.font = '28px cairo';
	ctx.fillStyle = 'AQUA';
	ctx.fillText(
		`Welcome: (${member.displayName})`,
		canvas.width / 4.5,
		canvas.height / 5.5
	);
	// member name
	ctx.font = applyText2(canvas, `To :(${member.guild.name})!`);
	ctx.fillStyle = 'red';
	ctx.fillText(
		`To :(${member.guild.name})!`,
		canvas.width / 2.5,
		canvas.height / 2.0
	);
	// guild name
	ctx.font = applyText2(canvas, `We Have Now :(.   ) Members!`);
	ctx.fillStyle = 'red';
	ctx.fillText(
		`We Have Now :(!      !) Members!`,
		canvas.width / 2.5,
		canvas.height / 1.4
	);
	ctx.font = applyText2(
		canvas,
		`We Have Now :(${member.guild.memberCount}) Members!`
	);
	ctx.fillStyle = 'aqua';
	ctx.fillText(
		`${member.guild.memberCount}`,
		canvas.width / 1.5,
		canvas.height / 1.4
	);
	ctx.beginPath();
	ctx.arc(125, 180, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	ctx.drawImage(avatar, 25, 80, 200, 200);
	const attachment = new Discord.MessageAttachment(
		canvas.toBuffer(),
		'welcome-image.png'
	);
try {
const chId = await getWelcomeChannel(member.guild.id),	
channel = client.channels.cache.get(chId) || client.channels.fetch(chId.id)

		
	channel.send(msg, attachment);
} catch (e) {
  console.error(e.message)
}

});
client.on('message', async msg => {
	if (msg.content.startsWith(prefix + 'set-channel')) {
		const args = msg.content.split(' ').slice(1),
			channel = client.channels.cache.get(args.join('')) || msg.mentions.channels.first()
		if (!msg.member.hasPermission('ADMINISTRATOR'))
			return msg.reply("sory mate you can't do that");

		try {
			if (channel) {
				setWelcomeChannel(msg.guild.id, channel.id);

				msg.channel.send('succesfuly seted welcome channel to : <#' + channel + '>');
			} else {
				return msg.reply("sorry mate that's invalid channel");
			}
		} catch (e) {
			if (e) throw e.message;
			msg.reply('i have ann err : `' + e.message + '`');
		}
	}
});
