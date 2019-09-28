
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const baillist = require("./baillist.json");

module.exports.run = async(bot, message, args) =>{
        
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
 
    let crim = message.guild.roles.find(x => x.id == "438267716915298304");
    
     
     
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#C99833")
      .setTitle("監獄保釋方法  bail info 查看犯罪值")
      .addField("機會","輸入 bail crystal 支付 犯罪值 x **300** <:crystal:431483260468592641> 即刻保釋出獄",true)
      .addField("命運","輸入 bail roll 消耗 犯罪值 x **50** <:crystal:431483260468592641>進行擲骰，若點數為 **6** 即可出獄。",true)
      return message.channel.send(embed);
    }
    else
    {
      
      if(!baillist[id]) { baillist[id] = {time:0}};
      let mul = baillist[id].time + 1;
      
      switch(args[1])
      {
        case "info":
          return message.channel.send("艦長的犯罪值是" + mul);
          break;
          
        case "crystal":
           if(!man.roles.find(x => x.id == "438267716915298304")) return message.channel.send("sayb 艦長就這麼想當囚犯嗎?");
          if(crystals[id].crystals < mul*300) return message.channel.send("sayb 布洛尼亞不做吃虧的交易，請好好工作賺錢。");
          else
          {
              crystals[id].crystals -= mul*300;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
              man.removeRole("438267716915298304");
              return message.channel.send("sayb 保釋成功。");
          }
          break;
          
         case "roll":
          if(!man.roles.find(x => x.id == "438267716915298304")) return message.channel.send("sayb 艦長就這麼想當囚犯嗎?");
          if(crystals[id].crystals < mul*50) return message.channel.send("sayb 布洛尼亞不做吃虧的交易，請好好工作賺錢。");
          else
          { 
            crystals[id].crystals -= mul*50;
            fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
           
           var rand = Math.floor(Math.random()*6 + 1);
            
           message.reply("你擲出了 "+ rand+ " 點。");
            if(rand == 6)
            {
                man.removeRole("438267716915298304");
                return message.reply("已成功逃獄。");
            }
            else
            {
              return message.channel.send("sayb 逃獄失敗，請艦長繼續陪伴布洛尼亞吧。");
            }   
          }
          break;
          
        default:
          return message.reply("芽衣不清楚艦長想要什麼服務呢。");
          break;  
      }     
    }  
}

module.exports.help = {
    name: "bail"
}