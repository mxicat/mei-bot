
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const itemlist = require("./itemlist.json");
const itembu = require("./itembu.json");
const crystals = require("./crystals.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null) return message.channel.send("需要**GM**權限");
  if(!message.channel.name.includes("指令")) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    let now = new Date();
    let month = now.getMonth();

   var embed = new Discord.RichEmbed()
      .setColor("#89916B")
      .setTitle(man.displayName+" 的道具欄")
     
    // console.log(typeof(weapons[id].weapons))
      for(var i of Object.keys(items[id].items)) 
      {
        if(items[id].items[i]) embed.addField(itemlist[i].name,"件數 : "+items[id].items[i],true);
      }
        return message.channel.send(embed);
    
    
}

module.exports.help = {
    name: "item"
}