
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const energy = require("./energy.json");
const coinlist = require("./coinlist.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null) return message.channel.send("需要**GM**權限");
    let man = message.guild.members.get(id);
    let now = new Date();
    let month = now.getMonth();
    let today = now.getDay();
    let time = now.getTime();
  
    let mei = message.guild.members.get("433287968292339722");
    let guild = message.guild;
  
    var embed = new Discord.RichEmbed();
    if(!coinlist[id]) { coinlist[id] = { now : 1 , ltd: 0}}
      fs.writeFileSync("./coinlist.json",JSON.stringify(coinlist));
      let mulp = coinlist[id].now*coinlist[id].now;
      if (mulp > 5000)  mulp = 5000;
       embed
      .setColor("#6C6424")
      .setTitle(man.displayName + "的特特幣資訊")
      .addField("已挖掘特特幣",coinlist[id].now - 1,true)
      .addField("必中體力值", mulp, true)
      .addField("本日體力限制", coinlist[id].ltd + "/2500", true)
      .setURL("https://mei-1.gitbook.io/workspace/stock/vlky#te-te-bi")
      .setThumbnail("https://i.imgur.com/ghGhnhU.png");
      return message.channel.send(embed);

  return;
  
  
    
}

module.exports.help = {
    name: "coin"
}