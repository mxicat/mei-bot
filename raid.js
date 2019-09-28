
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const raidlist = require("./raidlist.json");

module.exports.run = async(bot, message, args) =>{
  return; //已關閉。
    
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
  if((!message.channel.name.includes("約戰閒聊"))) return message.reply("使用指令請至相關頻道。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    if(man.roles.find(x => x.name == "bot") != null) return message.reply("機器人別鬧。");
     
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#C99833")
      .setTitle("聯機獎勵自助登錄系統")
      .addField("查看獎勵","輸入 **raid info**")
      .addField("普通難度","輸入 **raid normal 場數(一輪請輸入10) @隊員1 @隊員2**")
      .addField("困難難度","輸入 **raid hard 場數(一輪請輸入10) @隊員1 @隊員2**")
      .addField("噩夢難度","輸入 **raid insane 場數(一輪請輸入10) @隊員1 @隊員2**")
      .addField("獎勵列表","輸入 **raid list**")
      .addField("取消登錄","輸入 **raid delete 編號**");
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
      {
        case "info":
          embed = new Discord.RichEmbed()
          .setColor("#C99833")
          .setTitle("約戰獎勵")
          .addField("普通/困難/噩夢","一場 10/15/20 水晶")
          .addField("重置一輪場數請設定為10","輸入錯誤請根據編號自行刪除")
          return message.channel.send(embed);
          break;
        
        case "list":
          if(!raidlist["status"].now) return message.reply("獎勵列表為空。")
           
            let aa = raidlist["status"].now;
          
          embed =  new Discord.RichEmbed()
            .setColor("#DC9FB4")
          .setTitle("約戰獎勵列表")
          
          for (var i = 1; i <= aa ; i++)
           {
             let namelist = new Set();
             if(raidlist[i].enable)
             {
               for( var person of raidlist[i].member)
                 namelist.add(person);
               var string = "";
               namelist.forEach( (idv) => string = string  +  message.guild.members.get(idv).displayName + " ");
               embed.addField("#" + i +" 獎勵: "+ raidlist[i].reward, "成員: " + string);
             }
           }
          return message.channel.send(embed);
          break;
          
        case "check":
           if(message.guild.members.get(id).roles.find(x => x.id == "439412731632680960") == null) return message.reply("書記官專用指令。")
           if(!raidlist["status"].now) return message.reply("獎勵列表為空。")
           
            let all = raidlist["status"].now;
            let ch = message.guild.channels.find(x => x.id == "439409788850405376");
          
           for (var i = 1; i <= all ; i++)
           {
             if(raidlist[i].enable)
             {
               for( var person of raidlist[i].member)
               {
                 crystals[person].crystals += raidlist[i].reward;
                 let ppm = message.guild.members.get(person);
                 embed = new Discord.RichEmbed()
                 .setTitle(ppm.displayName + "獲得了 " + raidlist[i].reward + " <:crystal:431483260468592641>");
                  ch.send(embed);
               }
                 raidlist[i].enable = 0;
             }
             crystals[id].crystals += 10;
           }
           
           raidlist["status"].now = 0;
           
           fs.writeFileSync("./raidlist.json",JSON.stringify(raidlist));
           fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
           return message.reply("獎勵已全數發放。")
           break;
          
          
         case "delete":
            if(!args[2]) return message.reply("請輸入操作的數量。");
            let num1 = Math.floor(parseInt(args[2]));
            if(!Number.isInteger(num1)) return message.reply("請輸入正確整數。");
            if(num1 <= 0) return message.reply("請輸入正整數。");
           
          if(!raidlist[num1].enable) return message.reply("編號任務不存在。")
          if(id != raidlist[num1].member[0] && message.guild.members.get(id).roles.find(x => x.name == "GM") != null) return message.reply("只有登錄者有權限刪除。")
           
           raidlist[num1].enable = 0;
           fs.writeFileSync("./raidlist.json",JSON.stringify(raidlist));
           return message.reply("任務已刪除。");
           
           break;     
      }
      
      if(!args[2]) return message.reply("請輸入操作的數量。");
      let num = Math.floor(parseInt(args[2]));
      if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
      if(num <= 0) return message.reply("請輸入正整數。");
      
       let now = raidlist["status"].now + 1;
          
           if(args[3]) {
            var opid1 = args[3].slice(2,-1);
            if(opid1.startsWith("!")) opid1 = opid1.slice(1);
            if(message.guild.members.get(opid1) == null) return message.channel.send("對象1不存在。");
                }    //id of first mentioned person
            else return message.channel.send("請輸入至少一個對象。");
           
           
           if(args[4]) {
            var opid2 = args[4].slice(2,-1);
            if(opid2.startsWith("!")) opid2 = opid2.slice(1);
             if(message.guild.members.get(opid2)== null) return message.channel.send("對象2不存在。");
             }    //id of first mentioned person
      
            if(opid1 == id || opid2 == id || opid1 == opid2) return message.reply("請勿重複登錄。");
      
      
       switch(args[1])
      {
                        
           
        case "normal":
           
           raidlist[now] = { enable: 1, reward: 10*num , member:[] };
           raidlist[now].member[0] = id;
           if(args[3]) raidlist[now].member[1] = opid1;
           if(args[4]) raidlist[now].member[2] = opid2;
           raidlist["status"].now += 1;
           fs.writeFileSync("./raidlist.json",JSON.stringify(raidlist));
           return message.reply("登錄完畢。")
          break;
           
         case "hard":
           
           raidlist[now] = { enable: 1, reward: 15*num , member:[] };
           raidlist[now].member[0] = id;
           if(args[3]) raidlist[now].member[1] = opid1;
           if(args[4]) raidlist[now].member[2] = opid2;
           raidlist["status"].now += 1;
           fs.writeFileSync("./raidlist.json",JSON.stringify(raidlist));
           return message.reply("登錄完畢。")
          break;
        
         case "insane":
           
           raidlist[now] = { enable: 1, reward: 20*num , member:[] };
           raidlist[now].member[0] = id;
           if(args[3]) raidlist[now].member[1] = opid1;
           if(args[4]) raidlist[now].member[2] = opid2;
           raidlist["status"].now += 1;
           fs.writeFileSync("./raidlist.json",JSON.stringify(raidlist));
           return message.reply("登錄完畢。")
          break;
           
         default :
          return message.reply("芽衣不清楚艦長想要什麼服務呢。");
          break;  
      }
      
      
    }
    
}

module.exports.help = {
    name: "raid"
}