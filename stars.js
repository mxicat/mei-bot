
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const stars = require("./stars.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const raidlist = require("./raidlist.json");
const farmlist = require("./farmlist.json");
const energy = require("./energy.json");
const counting = require("./counting.json");
const abysslog = require("./abysslog.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    let man = message.guild.members.get(id);
    
    let ranking = message.guild.roles.find(role => role.name === "LV.20 女武神．強襲").position;
    if(man.hoistRole.position < ranking) return message.reply("限制功能：水文等級20以上開放");
    
    let now = new Date();
    let month = now.getMonth();
    let today = now.getDay();
    let time = now.getTime();
  
    var embed = new Discord.RichEmbed().setColor("#DC9FB4").setThumbnail("https://i.imgur.com/cw5fo40.png")

    embed.addField(man.displayName,`星石數量：**${stars[id].stars}**`);
    embed.setURL("https://mei-1.gitbook.io/workspace/stock#xing-shi");
    return message.channel.send(embed);
  
    return;
}

module.exports.help = {
    name: "stars"
}