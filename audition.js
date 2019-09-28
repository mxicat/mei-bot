
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const aulist = require("./aulist.json");
const energy = require("./energy.json");

module.exports.run = async(bot, message, args) =>{
    
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if(message.channel.id != "454693087575408650") return message.reply("尬舞請至<#454693087575408650>。");

  
    if(!aulist[id]) { aulist[id] = {bpm:0, length:0}};
  let ch = message.channel;
  
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    
    function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
  
   function getStep(num) {
    var letters = '8546'.split('');
    let step = "";
    for (var i = 0; i < num; i++ ) {
        step += letters[Math.floor(Math.random() * 4)];
    }
    return step;
}
  
  function toArrow(ss)
  {
    let l = ss.length;
    let arrow = "";
    for (var i = 0; i < l; i++)
    {
      if(ss[i] == "4") arrow += "⬅";
      else if(ss[i] == "5") arrow += "⬇";
      else if(ss[i] == "8") arrow += "⬆";
      else if(ss[i] == "6") arrow += "➡";
    }
    return arrow;
  }
  
    let length = aulist[id].length*1000;
    let bpm = aulist[id].bpm;
  
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#90B44B")
      .setTitle("輸入 audition info 查看當前歌曲資訊")
      .addField("開始遊戲","輸入 **audition start**")
      .addField("設定歌曲bpm","輸入 **audition bpm 數值**")
      .addField("設定歌曲長度","輸入 **audition length 秒數**")
      .setThumbnail("https://landing.mangot5.com/template/au/images/img_logo.png")
      return message.channel.send(embed);
    }
   else
    {
      
      switch(args[1])
      {
        case "start":
          if(!aulist[id].bpm) return message.reply("請設定歌曲bpm及長度");
          if(!aulist[id].length) return message.reply("請設定歌曲bpm及長度");
          
          let level = 6;
          let count = 0;
          let nn = (new Date()).getTime();
          let combo = 0;
          let score = 0;
          let miss = 0;
          let time = 0;
          let last = 0;
          let max = 0;
          
          while( (new Date()).getTime() - nn < length)
          {
            if(count >= level) {level +=1; count = 0;}
            if(level > 6 && count == 6) { level += 1; count = 0;}
            if(level == 10 && count == 1) {level += 1}
            if(level > 10) {level = 6; count = 0;}
            
            let step = getStep(level);
            
            let ss = await ch.send(toArrow(step));
            
            last =  (new Date()).getTime();
            
            if (level >=6 ) time = (60/bpm*11)*1000;
            else time = (60/bpm*7)*1000;
            
            const filter = m => m.author.id == id;
            let msg = await ch.awaitMessages(filter, { max: 1, time: time , errors: ['time'] })
            .catch(collected => console.log("miss"));
            last =  (new Date()).getTime() - last;
      
            if(msg) 
            {
              let tt = msg.find(m => m.author == message.author);
              
              if(tt)
              {
                if(tt.content == step) {combo += 1; score += Math.ceil((1 + combo/10)*50*level);   }
                else {miss += 1; combo = 0;}
                await tt.delete();
              }               
            }
            else  {miss += 1; combo = 0;}
            
            await ss.delete();
            if(level >5 )await sleep((60/bpm*1)*1000 + (time - last)); 
            count += 1;
            if(max < combo) max = combo;
          }
          
          ch.send("遊戲結束，總分："+ score);
          return ch.send("Max Combo： "+max+ "      Miss： "+miss);
          
          break;
  
      case "bpm":
          
          if(!args[2]) return message.channel.send("請輸入bpm數值。");
          let num = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(num)) return message.channel.send("請輸入正確數值。");
          if(num < 70 || num > 240) return message.channel.send("請輸入70~240之間的數值。");
                    
          aulist[id].bpm = num;
          fs.writeFileSync("./aulist.json",JSON.stringify(aulist)); 
          return ch.send("設置完成");
          
          break;
           
      case "length":
          
          if(!args[2]) return message.channel.send("請輸入數值。");
          let ll = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(ll)) return message.channel.send("請輸入正確數值。");
          if(ll < 10 || ll > 300) return message.channel.send("請輸入10~300之間的數值。");
                    
          aulist[id].length = ll;
          fs.writeFileSync("./aulist.json",JSON.stringify(aulist)); 
          return ch.send("設置完成");
          break;
          
      case "info":
          
          embed = new Discord.RichEmbed()
          .setColor("#90B44B")
          .setTitle("歌曲資訊")
          .addField("bpm",aulist[id].bpm)
          .addField("長度",aulist[id].length)
          return message.channel.send(embed);
          
          break;
          
      }
    }
      
      return;
}

module.exports.help = {
    name: "audition"
}