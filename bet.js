
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const betlist = require("./betlist.json");

module.exports.run = async(bot, message, args) =>{
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
  let man = message.guild.members.get(id);
  if(man.roles.find(x => x.name == "bot") != null) return message.reply("機器人別鬧。");
  let embed = new Discord.RichEmbed()
  
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
  
   if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#C99833")
      .setTitle("D群線上賭盤")
      .addField("查看當前賭盤","輸入 **bet info**",true)
      .addField("賭盤下注","輸入 **bet 下注編號 下注張數**",true)
      .addField("重置下注","輸入 **bet reset**",true)
      .addField("查看個人下注","輸入 **bet me**",true)
      return message.channel.send(embed);
    }
    else
    {
      switch(args[1])
      {
        case "info":
          if(!betlist["info"].active) return message.reply("賭盤未開啟");
          let one = 0;
          let two = 0;
          for(var person of Object.keys(betlist)) 
          {
            if (person!="info" && betlist[person].now){
              if(betlist[person].now == 1) one += betlist[person].num;
              else two += betlist[person].num;
            }
          }
           embed = new Discord.RichEmbed()
            .setColor("#C99833")
            .setTitle(betlist["info"].content)
            .addField("No.1",betlist["info"].bet1,true)
            .addField("No.2",betlist["info"].bet2,true)
            .addField("賠率",two/one + " v.s. " + one/two,true)
            .addField("售價","一張 "+betlist["info"].price + " 水晶",true)
            .setThumbnail("https://i.imgur.com/GbFnV98.jpg");
            return message.channel.send(embed);
          break;
          
        case "stop":
          if(message.guild.members.get(id).roles.find(x => x.name == "書記官") == null) return message.channel.send("需要**GM**權限");
          if(!betlist["info"].active) return message.reply("賭盤未開啟");
          betlist["info"].stop = 1;
          return message.reply("本期已截止下注。");
          break;
          
         case "me":
          if(!betlist["info"].active) return message.reply("賭盤未開啟");
           embed = new Discord.RichEmbed()
            .setColor("#C99833")
            .setTitle("個人下注資訊")
            .addField("下注編號",betlist[id].now,true)
            .addField("下注數量",betlist[id].num,true)
            .setThumbnail("https://i.imgur.com/0vcwhgs.jpg");
             return message.channel.send(embed);
          break;
          
        case "set":
           if(message.guild.members.get(id).roles.find(x => x.name == "書記官") == null) return message.channel.send("需要**GM**權限");
           if(!args[2] || !args[3] || !args[4] || !args[5]) { return message.reply("資訊不足");}
           if(!betlist["info"])
           {
              betlist["info"] = { 
                active : 1,
                content: args[2],
                bet1: args[3],
                bet2: args[4],
                price : args[5],
                stop : 0
              }
           }
          else
          {
            if(betlist["info"].active) return message.reply("當前賭盤尚未結算");
            betlist["info"] = { 
                active : 1,
                content: args[2],
                bet1: args[3],
                bet2: args[4],
                price :  Math.floor(parseInt(args[5])),
                stop : 0
              }
          }
          fs.writeFileSync("./betlist.json",JSON.stringify(betlist));
          return message.channel.send("賭盤設定完畢");
          break;
             
        case "reset":
          if(!betlist["info"].active) return message.reply("賭盤未開啟");
          if(betlist["info"].stop) return message.reply("已截止下注");
          crystals[id].crystals += Math.floor(betlist[id].num*betlist["info"].price);
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          betlist[id].now = 0;
          betlist[id].num = 0;
          fs.writeFileSync("./betlist.json",JSON.stringify(betlist));
          return message.reply("已重置賭注");
          break;
      }
      
      
          if(!args[2])  return message.reply("請輸入正確參數。");
          let num = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
          if(num <= 0) return message.reply("請輸入正整數。");
          
      
      
      switch(args[1]) {
        case "finish":
          if(message.guild.members.get(id).roles.find(x => x.name == "書記官") == null) return message.channel.send("需要**GM**權限");
          if(!betlist["info"].active) return message.reply("賭盤未開啟");
          let total = 0;
          let win = 0;
          let lose = 0;
          let rate = 0;
          for(var person of Object.keys(betlist)) 
          {
            if (person!="info"){
            if(Math.floor(parseInt(betlist[person].now)) == num) win += Math.floor(parseInt(betlist[person].num));
            else lose += Math.floor(parseInt(betlist[person].num));
            }
          }
          total = win + lose;
          if(win) rate = total/win;
          else rate = 0;
          for(var person of Object.keys(betlist)) 
          {   
            if(Math.floor(parseInt(betlist[person].now))  == num)
            {
              let add = Math.floor(betlist[person].num*betlist["info"].price + lose*betlist["info"].price*betlist[person].num/win);
              crystals[person].crystals += add;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
            }
            betlist[person].now = 0;
            betlist[person].num = 0;
          }
          betlist["info"] = {active : 0};
          fs.writeFileSync("./betlist.json",JSON.stringify(betlist));
          return message.reply("賭盤結束");
                 
          break;
          
        case "push":
          if(message.guild.members.get(id).roles.find(x => x.name == "書記官") == null) return message.channel.send("需要**GM**權限");
          if(!betlist["info"].active) return message.reply("賭盤未開啟");
          for(var person of Object.keys(betlist)) 
           {  
              if (person!="info")
             {
               let amount = Math.floor(betlist[person].num*betlist["info"].price) + num;
               crystals[person].crystals += amount;
               fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
               betlist[person].now = 0;
               betlist[person].num = 0;
             }
          }
          betlist["info"] = {active : 0};
          fs.writeFileSync("./betlist.json",JSON.stringify(betlist));
          return message.reply("賭盤結束")
          break;
          
        case "1":
          if(!betlist["info"].active) return message.reply("賭盤未開啟");
          if(num > 100) return message.reply("下注上限為100張。")
          if(betlist["info"].stop) return message.reply("已截止下注");
          if(betlist[id].now) return message.reply("不可重複下注");
          if(!args[2])  return message.reply("請輸入下注數量");
          if(crystals[id].crystals < betlist["info"].price*num) return message.reply("水晶不足");
          crystals[id].crystals -= Math.floor(parseInt(betlist["info"].price*num));
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          betlist[id].now = 1;
          betlist[id].num = num;
          fs.writeFileSync("./betlist.json",JSON.stringify(betlist));
          return message.reply("下注成功");
          break;
          
        case "2":
          if(!betlist["info"].active) return message.reply("賭盤未開啟");
          if(num > 100) return message.reply("下注上限為100張。")
          if(betlist["info"].stop) return message.reply("已截止下注");
          if(betlist[id].now) return message.reply("不可重複下注");
          if(!args[2])  return message.reply("請輸入下注數量");
          if(crystals[id].crystals < betlist["info"].price*num) return message.reply("水晶不足");
          crystals[id].crystals -= Math.floor(parseInt(betlist["info"].price*num));
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          betlist[id].now = 2;
          betlist[id].num = num;
          fs.writeFileSync("./betlist.json",JSON.stringify(betlist));
          return message.reply("下注成功");
          break;
          
        default:
          return message.reply("請輸入正確指令");
          break;
      }
      
    }
      return;
    
}

module.exports.help = {
    name: "bet"
}