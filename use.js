
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const itemlist = require("./itemlist.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    let now = new Date();
    let month = now.getMonth();
  let today = now.getDay();
  
  let mei = message.guild.members.get("433287968292339722");
  let guild = message.guild;


 
    if(!args[1]) 
    {
       let embed = new Discord.RichEmbed()
      .setColor("#A28C37")
      .setTitle("使用道具指南")
      .addField("use energy","使用體力藥水",true)
      .addField("use license","使用獵人執照換取體力藥水 ( 10 : 1 )",true)
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
      {
        case "energy":
         
          if(!items[id].items["003"]) return message.reply("沒有體力藥水。")
          else
          {
            energy[id].energy += 30*items[id].items["003"];
            items[id].items["003"] = 0;
            
            fs.writeFileSync("./items.json",JSON.stringify(items));
            fs.writeFileSync("./energy.json",JSON.stringify(energy));
            return message.reply("使用道具成功，道具剩餘數量:" +  items[id].items["003"]);
          }
          
          break;
          
        case "license":
         
           if(!args[2]) {
           
             if(!items[id].items["000"] || items[id].items["000"]< 10) return message.reply("可供兌換的執照不足。")
             else
            {
              items[id].items["000"] -= 10;
              items[id].items["003"] += 1;
              fs.writeFileSync("./items.json",JSON.stringify(items));
            
              return message.reply("兌換成功，執照剩餘數量:" +  items[id].items["000"]);
            }
           }
          
          let num = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
          if(num <= 10) return message.channel.send("請輸入正確整數。");
          if(!items[id].items["000"] || items[id].items["000"]< num) return message.reply("可供兌換的執照不足。")
          
          else
          {
            items[id].items["000"] -= Math.floor(num/10)*10;
            items[id].items["003"] += Math.floor(num/10);
            fs.writeFileSync("./items.json",JSON.stringify(items));
            
            return message.reply("兌換成功，執照剩餘數量:" +  items[id].items["000"]);
          }
          
          break;
      }
  
    }
  
  return;
  
}

module.exports.help = {
    name: "use"
}