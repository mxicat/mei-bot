
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const gd = require("./gamble_data.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
   if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    
    if(!gd[id]){
        gd[id] = { 
            win: 0,
            lose: 0
        }
      };

      let embed = new Discord.RichEmbed()
      .setColor("#A5DEE4")
      .setTitle(man.displayName+" 與芽衣的輸贏紀錄")
      .addField("勝場",gd[id].win,true)
      .addField("敗場",gd[id].lose,true)
      .addField("勝率",gd[id].win/(gd[id].lose+gd[id].win) *100+"%")
      
     
      return message.channel.send(embed);
    
}

module.exports.help = {
    name: "g.status"
}