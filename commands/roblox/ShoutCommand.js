const { MessageEmbed } = require('discord.js');
const roblox = require('noblox.js');
const Discord = require('discord.js');
const path = require('path');
require('dotenv').config();
module.exports = {
	name: 'shout',
	category: 'roblox',
  rolesRequired: [],
  usage: '<shout>',
	description: 'shout something ig',
	timeout: 1000,
	run: async (client, message, args) => {
    const allowedRanks = process.env.AllowedRanks.split(",");

    let isAllowed = false;
    for(let i = 0; i < allowedRanks.length; i++) {
        if(message.member.roles.cache.some(role => [allowedRanks[i]].includes(role.name))) {
            isAllowed = true;
        }
    }

    if(isAllowed == false) {
        return message.channel.send(client.embed("No Permission", "You don't have permission to run this command"));
    }
    let embed = new Discord.MessageEmbed();

        let msg = args.join(' ');
        if(!msg) {
            embed.setDescription(`Missing arguments.\n\nUsage: !shout <message>`);
            embed.setColor("RED");
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.channel.send(embed);
        }

        let shoutInfo;
        try {
            shoutInfo = await roblox.shout(process.env.groupId, msg);
        } catch (err) {
            console.log(`Error: ${err}`);
            embed.setDescription('Oops! An unexpected error has occured. The bot owner can check the bot logs for more information.');
            embed.setColor("RED");
            embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            return message.channel.send(embed);
        }

        embed.setDescription(`**Success!** Posted a group shout with the following message:\n\`\`\`${msg}\`\`\``);
        embed.setColor("GREEN");
        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
        message.channel.send(embed);

        if(process.env.logChannelId !== 'false') {
            let logEmbed = new Discord.MessageEmbed();
            let logChannel = await client.channels.fetch(process.env.logChannelId);
            logEmbed.setDescription(`**Moderator:** <@${message.author.id}> (\`${message.author.id}\`)\n**Action:** Shout\n**Message:**\n\`\`\`${msg}\`\`\``);
            logEmbed.setColor("ORANGE");
            logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
            logEmbed.setTimestamp();
            return logChannel.send(logEmbed);
        } else {
            return;
        }
	},
};
