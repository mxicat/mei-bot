
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const viplist = require("./viplist.json");

module.exports.run = async(bot, message, args) =>{
    
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    let vipchannel = 0
    let ranking = message.guild.roles.find(x => x.name == "LV.20 女武神．強襲").position;
    if(!(man.hoistRole) || man.hoistRole.position < ranking) return message.reply("需求水文等級20");
    if(!(man.premiumSince)) return message.reply("Nitro Booster限定功能");
    if(!viplist[id])
      {
        viplist[id] = 
          {
            "channel":0
          }
      }
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#2B5F45")
      .setTitle("vip功能")
      .addField("vip info","查看vip資訊")
      .addField("vip checkin","申請vip包廂")
      .setThumbnail("https://i.imgur.com/040cgnq.png");
      //.setURL("https://mei-1.gitbook.io/workspace/si-fu-qi-gong-neng/sysrole")
      return message.channel.send(embed);
    }
    else
    {
      switch(args[1])
      {
        case "info":
         embed = new Discord.RichEmbed()
        .setColor("#2B5F75")
        .setTitle("vip資訊")
        .addField("vip時間",man.premiumSince)
        .addField("vip包廂",message.guild.channels.find(ch => ch.id == viplist[id].channel) ? message.guild.channels.find(ch => ch.id == viplist[id].channel).name:"未申請vip包廂")
        .setThumbnail("https://i.imgur.com/dnDWwSt.png");
          
        return message.channel.send(embed);
        break;
          
        case "checkin":
          if(viplist[id].channel) 
          {
            if(!message.guild.channels.find(ch => ch.id == viplist[id].channel))
            {
              viplist[id].channel = 0
              fs.writeFileSync("./viplist.json",JSON.stringify(viplist));
              return message.reply("包廂已遺失，請重新登記。")    
            }
            return message.channel.send("已擁有vip包廂：" + "<#" + viplist[id].channel + ">。");
          }
                    
         await message.guild.createChannel(man.displayName + "的vip包廂", {
            topic:"vip專屬包廂",
            parent:"725655194444234832",
            type: 'text',
            permissionOverwrites: [
             {
               id: "332870931980484609",
               deny: ['VIEW_CHANNEL'],
              },
              {
                id:id,
                allow:['MANAGE_CHANNELS','VIEW_CHANNEL','MANAGE_ROLES']
              }
          ],
        }).then(channel => vipchannel = channel)
          
          viplist[id].channel = vipchannel.id
          fs.writeFileSync("./viplist.json",JSON.stringify(viplist));
          
          return message.reply("vip包廂申請成功：" + "<#" + vipchannel.id + ">。")
          break;    
      }
    }
    
}

module.exports.help = {
    name: "vip"
}