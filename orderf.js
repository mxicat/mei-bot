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
const colist = require("./colist.json");
const vlkys = require("./vlkys.json");

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
      var embed = new Discord.RichEmbed().setColor("#DC9FB4").setTitle("個人碎片買單資訊")

      for(var type of Object.keys(colist))
      {
        var corp = colist[type];
        var length = corp.buyf.length;
        for(var i = 0; i < length; i++)
        {
          if(corp.buyf[i].owner == id) embed.addField(vlkylist[type].name,`欲以單價 ${corp.buyf[i].price} 買入 ${corp.buyf[i].num} 片。`,true);
        }
      }
      message.author.send(embed);
      message.channel.send("資訊已傳至個人私訊。")
      return;
    }
    
    return;
  
}

module.exports.help = {
    name: "orderf"
}