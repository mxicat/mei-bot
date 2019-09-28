
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");


module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
     if(message.guild.members.get(id).roles.find("id","433683517235265537") == null) return message.channel.send("需要**GM**權限");
    let man = message.guild.members.get(id);
   
    //console.log(""+message.guild.channels.find(`name`,"簽到及指令區").name);
    
   if(args[1] == "on")
    {  
      message.guild.channels.find(`name`,"簽到及指令區").overwritePermissions(message.guild.roles.find(`name`,"@everyone"),{ 'SEND_MESSAGES': false});
      return message.channel.send("系統維護中。")
    }
    else if (args[1] == "off")
    {
       message.guild.channels.find(`name`,"簽到及指令區").overwritePermissions(message.guild.roles.find(`name`,"@everyone"),{ 'SEND_MESSAGES': true});
      return message.channel.send("系統維護結束。")
    }
    else return;
  
  return;
    
}

module.exports.help = {
    name: "修time"
}