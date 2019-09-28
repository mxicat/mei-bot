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
const coplayer = require("./coplayer.json");
const vlkylist = require("./vlkylist.json");

module.exports.run = async(bot, message, args) =>{
  
    var id = message.author.id;
    //if(message.channel.id != "436575279402450967" && message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("維護中，需要**GM**權限");
    let man = message.guild.members.get(id);
    let ranking = message.guild.roles.find(role => role.name === "LV.20 女武神．強襲").position;
    if(man.hoistRole.position < ranking) return message.reply("限制功能：水文等級20以上開放");
    
  
    let now = new Date();
    let month = now.getMonth();
    let today = now.getDay();
    let time = now.getTime() + 8*60*60*1000;
    if(!(id in coplayer)) coplayer[id] = {own:0, shares:{}, history:[]};
  
    if(!args[1])
    {
      var embed = new Discord.RichEmbed().setColor("#DC9FB4").setTitle("個人持股資訊")

      for(var type of Object.keys(coplayer[id].shares))
      {
        if(coplayer[id].shares[type]) embed.addField(vlkylist[type].name,`股數：**${coplayer[id].shares[type]}**`,true);
      }
      message.author.send(embed);
      message.channel.send("資訊已傳至個人私訊。")
      return;
    }
    
    switch(args[1])
      {
        case "history":
          embed = new Discord.RichEmbed();
          var string = "";
          while(coplayer[id].history.length > 10) 
          {
            string += coplayer[id].history.shift();
            string += "\n";
          }
          for(var i = 0 ; i < coplayer[id].history.length ; i++)
          {
            string += coplayer[id].history[i];
            string += "\n";
          }
          if(string == "") string += "無股票交易紀錄。";
          embed.setColor("#53e119").setTitle(man.displayName)
          embed.addField("交易紀錄",string)
          message.author.send(embed);
          fs.writeFileSync("./coplayer.json",JSON.stringify(coplayer));
          return;
          break;
          
        default:
          return message.channel.send("未知的指令。")
          break;
      }
    return;
  
}

module.exports.help = {
    name: "stock"
}