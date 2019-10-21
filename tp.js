
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const tplist = require("./tplist.json");

module.exports.run = async(bot, message, args) =>{
    
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
  if(!message.channel.name.includes("獎勵")) return message.reply("使用指令請至相關頻道。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    if(man.roles.find(x => x.name == "bot") != null) return message.reply("機器人別鬧。");
  
    if(tplist["status"].now >= 24 && message.guild.members.get(id).roles.find(x => x.id == "439412731632680960") == null) return message.reply("獎勵列表已滿，請通知書記官核准獎勵。");
     
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#939650")
      .setTitle("茶會水晶獎勵自助登錄系統")
      .addField("查看獎勵","輸入 **tp info**",true)
      .addField("戰場獎勵","輸入 **tp bf 總分**",true)
      .addField("矩陣獎勵","輸入 **tp mt 探索值**",true)
      .addField("入侵獎勵","輸入 **tp iv 個人名次**",true)
      .addField("獎勵列表","輸入 **tp list**",true)
      .addField("取消登錄","輸入 **tp delete 編號**",true)
      .setThumbnail("https://i.imgur.com/2WJ3NYQ.png");
      return message.channel.send(embed);
    }
    else
    {
      switch(args[1])
      {
        case "info":
          embed = new Discord.RichEmbed()
          .setColor("#939650")
          .setTitle("艦團水晶獎勵")
          .addField("戰場獎勵","戰場總分/100 (最低70000)")
          .addField("矩陣獎勵","探索值/10 (最低500)")
          .addField("入侵獎勵","入侵傷害前五名者每人 200 水晶")
          return message.channel.send(embed);
          break;
        
        case "list":
          if(!tplist["status"].now) return message.reply("獎勵列表為空。")
           
            let aa = tplist["status"].now;
          
          embed =  new Discord.RichEmbed()
            .setColor("#939650")
          .setTitle("艦團獎勵列表")
          
          for (var i = 1; i <= aa ; i++)
           {
             let namelist = new Set();
             if(tplist[i].enable)
             {
               for( var person of tplist[i].member)
                 namelist.add(person);
               var string = "";
               namelist.forEach( (idv) => string = string  +  message.guild.members.get(idv).displayName + " ");
               embed.addField("#" + i +" 獎勵: "+ tplist[i].reward, "對象: " + string ,true);
             }
           }
          return message.channel.send(embed);
          break;
          
        case "check":
           if(message.guild.members.get(id).roles.find(x => x.id == "439412731632680960") == null) return message.reply("書記官專用指令。")
           if(!tplist["status"].now) return message.reply("獎勵列表為空。")
           
            let all = tplist["status"].now;
            let ch = message.guild.channels.find(x => x.id == "439409788850405376");
          
           for (var i = 1; i <= all ; i++)
           {
             if(tplist[i].enable)
             {
               for( var person of tplist[i].member)
               {
                 crystals[person].crystals += tplist[i].reward;
                 let ppm = message.guild.members.get(person);
                 embed = new Discord.RichEmbed()
                 .setTitle(ppm.displayName + "獲得了 " + tplist[i].reward + " <:crystal:431483260468592641>");
                  ch.send(embed);
               }
                 tplist[i].enable = 0;
             }
             crystals[id].crystals += 10;
           }
           
           tplist["status"].now = 0;
           
           fs.writeFileSync("./tplist.json",JSON.stringify(tplist));
           fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
           return message.reply("獎勵已全數發放。")
           break;
          
          
         case "delete":
            if(!args[2]) return message.reply("請輸入操作的數量。");
            let num1 = Math.floor(parseInt(args[2]));
            if(!Number.isInteger(num1)) return message.reply("請輸入正確整數。");
            if(num1 <= 0) return message.reply("請輸入正整數。");
           
          if(!tplist[num1].enable) return message.reply("編號任務不存在。")
          if(id != tplist[num1].member[0]) return message.reply("只有登錄者有權限刪除。")
           
           tplist[num1].enable = 0;
           fs.writeFileSync("./tplist.json",JSON.stringify(tplist));
           return message.reply("任務已刪除。");
           
           break;     
      }
      
      if(!args[2]) return message.reply("請輸入操作的數量。");
      let num = Math.floor(parseInt(args[2]));
      if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
      if(num <= 0) return message.reply("請輸入正整數。");
      
       let now = tplist["status"].now + 1;
             
       switch(args[1])
      {     
        case "bf":
           if(num < 70000) return message.reply("分數未達獎勵門檻，請再加油。");
           if(num > 102400) return message.reply("這是什麼神仙分數？");
           let bfre = Math.floor(num/100);
           tplist[now] = { enable: 1, reward: bfre , member:[] };
           tplist[now].member[0] = id;
           tplist["status"].now += 1;
           fs.writeFileSync("./tplist.json",JSON.stringify(tplist));
           return message.reply("登錄完畢。")
          break;
           
         case "mt":
           if(num < 500) return message.reply("探索值未達獎勵門檻，請再加油。");
           let mtre = Math.floor(num/10);    
           tplist[now] = { enable: 1, reward: mtre , member:[] };
           tplist[now].member[0] = id;
           tplist["status"].now += 1;
           fs.writeFileSync("./tplist.json",JSON.stringify(tplist));
           return message.reply("登錄完畢。")
          break;
        
         case "iv":
           if(num > 5) return message.reply("名次未達獎勵門檻，請再加油。");
           let ivre = 200;    
           tplist[now] = { enable: 1, reward: ivre , member:[] };
           tplist[now].member[0] = id;
           tplist["status"].now += 1;
           fs.writeFileSync("./tplist.json",JSON.stringify(tplist));
           return message.reply("登錄完畢。")
          break;
           
         default :
          return message.reply("芽衣不清楚艦長想要什麼服務呢。");
          break;  
      }
      
      
    }
    
}

module.exports.help = {
    name: "tp"
}