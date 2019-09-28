
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const farmlist = require("./farmlist.json");
const energy = require("./energy.json");

module.exports.run = async(bot, message, args) =>{
    
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
  
    let now = new Date();
    let today = now.getDay();
    let time = now.getTime();
  
    if(!farmlist[id]) { farmlist[id] = {farm: 1,time : 0, crops:"00", num: 0 ,steal:{ now:0, status:0}}};
  
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    
    const cd = 43200000;
    
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#90B44B")
      .setTitle("愛醬的開心農場")
      .addField("農場狀態","輸入 **farm status**",true)
      .addField("種高麗菜 (消耗 100 水晶)","輸入 **farm cabbage**",true)
      .addField("收成販售 (收穫量x50 水晶)","輸入 **farm harvest**",true)
      .addField("偷別人菜","輸入 **farm steal 對象**",true)
      .setThumbnail("https://i.imgur.com/2iC1JcA.jpg");
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
      {
        case "status":
          embed = new Discord.RichEmbed()
          .setColor("#C99833")
          .setTitle(man.displayName + "的農場")
          .setThumbnail("https://i.imgur.com/4sCpqf9.jpg");
          
          if(!farmlist[id].time) embed.addField("收成時間：","農地閒置中")
          else{ embed.addField("收成時間：", Math.ceil((cd - (time - farmlist[id].time))/60000) + " 分鐘",true); embed.addField("收成數量：", farmlist[id].num,true);}
          
          if(time - farmlist[id].steal.now > 86400000) embed.addField("偷菜CD：","可進行偷菜")
          else embed.addField("偷菜CD：",Math.ceil((86400000 - (time - farmlist[id].steal.now))/60000) + " 分鐘")
          
          return message.channel.send(embed);
          break;
          
      case "cabbage":
          if(farmlist[id].time) return message.reply("農地尚未收成，收成時間："+  Math.ceil((cd - (time - farmlist[id].time))/60000) + " 分鐘");
          if(crystals[id].crystals < 100)  return message.reply("艦長的水晶似乎不夠呢。");
          
          crystals[id].crystals -= 100;
          
          var rand = Math.floor(Math.random()*5 + 5);
          
          farmlist[id].time = time;
          farmlist[id].num = rand;
          
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          fs.writeFileSync("./farmlist.json",JSON.stringify(farmlist));
          
          return message.reply("高麗菜種植成功，數量："+ rand);
          break;
          
          
        case "steal":
          if(time - farmlist[id].steal.now <= 86400000) return message.reply("偷菜CD："+ Math.ceil((86400000 - (time - farmlist[id].steal.now))/60000) + " 分鐘")
          
            if(args[2]) 
            {
              var opid = args[2].slice(2,-1);
              if(opid.startsWith("!")) opid = opid.slice(1);
            }    //id of first mentioned person
            else return message.channel.send("請指定對象。");
          
          if(!farmlist[opid] || !farmlist[opid].time) return message.reply("對方的菜園沒有菜。");
          if(time - farmlist[opid].time < cd) return message.reply("對方作物尚未成熟，收成時間："+ Math.ceil((cd - (time - farmlist[opid].time))/60000) + " 分鐘");
          if(farmlist[opid].num < 6) return message.reply("行行好，對方的菜已所剩無幾了。")
          
          
          farmlist[opid].num -= 1;
          crystals[id].crystals += 50;
          farmlist[id].steal.now = time;
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          fs.writeFileSync("./farmlist.json",JSON.stringify(farmlist));
          
          return message.reply("偷菜成功，獲得 "+ 50+" <:crystal:431483260468592641>");
          break;
          
        case "harvest":
           if(!farmlist[id].time) return message.reply("農地閒置中");
           if( time - farmlist[id].time < cd)  return message.reply("作物尚未成熟，收成時間："+ Math.ceil((cd - (time - farmlist[id].time))/60000) + " 分鐘");
           
           var cc = 50*farmlist[id].num; 
          
           crystals[id].crystals += cc;
           farmlist[id].num = 0;
           farmlist[id].time = 0;
           fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
           fs.writeFileSync("./farmlist.json",JSON.stringify(farmlist));
          
          return message.reply("收成結束，獲得 "+ cc+" <:crystal:431483260468592641>");
          break;
          
          
      default :
          return message.reply("芽衣不清楚艦長想要什麼服務呢。");
          break;  
        
      }
      
      if(!args[2]) return message.reply("請輸入操作的數量。");
      let num = Math.floor(parseInt(args[2]));
      if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
      if(num <= 0) return message.reply("請輸入正整數。");
    
       
         
       
      }
      
      
    
    
}

module.exports.help = {
    name: "farm"
}