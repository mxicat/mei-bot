
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const gd = require("./gamble_data.json");

module.exports.run = async(bot, message, args) =>{
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
  if(!message.channel.name.includes("芽衣線上賭場")) return message.reply("請勿公然聚賭，賭博請至<#434546312101363734>。");
    let man = message.guild.members.get(id);
  if(man.roles.find(role => role.name == "bot") != null) return message.reply("機器人別鬧。");
  
    if(!gd[id]){
        gd[id] = { 
            win: 0,
            lose: 0
        }
      };
      
      if(!crystals[id]){
        crystals[id] = { 
            Time: 0,
            crystals: 0
        }
      };
      if(!crystals["433287968292339722"]){
        crystals["433287968292339722"] = { 
            Time: 0,
            crystals: 0
        }
      };
  
      if(!args[1]) return message.reply("請輸入當作籌碼的水晶數量。");
      let num = Math.floor(parseInt(args[1]));
      let num2 = 0;
      if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
      if(num <= 0) return message.reply("請輸入正整數。");
      if(crystals[id].crystals < num) return message.reply("艦長的水晶似乎不夠呢。");
      
      
       let roll3 = function()
      {
        var series = [];
        for(var j = 0 ;j <= 2; j++)
        {
          var rand = Math.floor(Math.random() * 6 + 1);
          series[j] = rand;
        }
        return series.sort();
      };
  
      let points = function(series){
           var obj = {}; 
           let count = 0;
           let rnum = 0;
        
          for(var i in series) { 
            if(obj[series[i]])  {
              count = count + 1;
              if(count == 2) return series[i]*10;
            }
            obj[series[i]] = true; 
          } 
        
          if(count == 0)
          {
            if(series[0] == 1 && series[1] == 2 && series[2] == 3) return 0;
            else if(series[0] == 4 && series[1] == 5 && series[2] == 6) return 7;
            else return -1;
          }
        
          if(count == 1) 
          {
             if(series[0] == series[1]) return series[2];
             else if(series[1] == series[2]) return series[0];
             else return series[1];
          }
      }
      
      let Mpoint = roll3();
      let Upoint = roll3();
        
      let embed = new Discord.RichEmbed()
      .setColor("#A5DEE4")
      .addField("芽衣的點數",`**${Mpoint[0]}**       **${Mpoint[1]}**       **${Mpoint[2]}**`,true)
      .addField(man.displayName+"的點數",`**${Upoint[0]}**       **${Upoint[1]}**       **${Upoint[2]}**`,true)
      //.setThumbnail("https://i.imgur.com/tvAkopu.png");
      message.channel.send(embed);
      
      function add(a, b) {
        return a + b;
      }
      
  
      if(points(Upoint) == points(Mpoint))
      {
        if(Upoint.reduce(add, 0) == Mpoint.reduce(add, 0))
        {
          embed = new Discord.RichEmbed()
          .setColor("#FFBA84")
          .setTitle(`艦長跟芽衣達成平手了呢`);
          return message.channel.send(embed);
        }
        else if(Upoint.reduce(add, 0) > Mpoint.reduce(add, 0)) 
        {
           embed = new Discord.RichEmbed()
          .setColor("#FFBA84")
          .setTitle("恭喜艦長贏了水晶ｘ"+num*2);
          if(num*2 >= 10000){ num2 = num - Math.floor(num*2*0.01); embed.addField("賭博稅","已額外收取 "+Math.floor(num*2*0.01) +" 水晶");}
          else num2 = num;
          crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals - num2;
          crystals[id].crystals = crystals[id].crystals + num2;
          gd[id].win ++;
          fs.writeFileSync("./gamble_data.json",JSON.stringify(gd));
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          return message.channel.send(embed);
        }
        else
        {
          embed = new Discord.RichEmbed()
          .setColor("#FFBA84")
          .setTitle("芽衣贏了！謝謝艦長的水晶！");
          crystals[id].crystals = crystals[id].crystals - num;
          crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals + num;
          gd[id].lose ++;
          fs.writeFileSync("./gamble_data.json",JSON.stringify(gd));
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          return message.channel.send(embed);
        }
      }
      else
      {
      
        if(points(Upoint) > points(Mpoint))
        {
          embed = new Discord.RichEmbed()
          .setColor("#FFBA84")
          .setTitle("恭喜艦長贏了水晶ｘ"+num*2);
          if(num*2 >= 10000){ num2 = num - Math.floor(num*2*0.01); embed.addField("賭博稅","已額外收取 "+Math.floor(num*2*0.01) +" 水晶");}
          else num2 = num;
          crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals - num2;
          gd[id].win ++;
          fs.writeFileSync("./gamble_data.json",JSON.stringify(gd));
          crystals[id].crystals = crystals[id].crystals + num2;
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          return message.channel.send(embed);
        }
        else 
        {
          embed = new Discord.RichEmbed()
          .setColor("#FFBA84")
          .setTitle("芽衣贏了！謝謝艦長的水晶！");
          crystals[id].crystals = crystals[id].crystals - num;
          crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals + num;
          gd[id].lose ++;
          fs.writeFileSync("./gamble_data.json",JSON.stringify(gd));
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          return message.channel.send(embed);
        }
      }
     
      return;
    
}

module.exports.help = {
    name: "gamble"
}