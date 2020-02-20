
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");

module.exports.run = async(bot, message, args) =>{
    
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    let ranking = message.guild.roles.find(x => x.name == "LV.20 女武神．強襲").position;
    if(man.hoistRole.position < ranking) return message.reply("需求水文等級20");
  
   
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#2B5F75")
      .setTitle("系統身分組商店")
      .addField("sysrole info","查看身分組資訊")
      .addField("sysrole buy 表符","購買系統身分組")
      .addField("sysrole remove 表符","移除系統身分組")
      .setThumbnail("https://i.imgur.com/guTJB7T.png")
      .setURL("https://mei-1.gitbook.io/workspace/si-fu-qi-gong-neng/sysrole")
      return message.channel.send(embed);
    }
    else
    {
      switch(args[1])
      {
        case "info":
         embed = new Discord.RichEmbed()
        .setColor("#2B5F75")
        .setTitle("特殊身分組商店")
        .addField("8088","<:crystal:431483260468592641> (售價:8088)",true)
        .addField("米忽悠洗地工讀生","<:nuwa1:592343029369798660> (售價:3560)",true)
        .addField("芽衣的火山孝子","<:eevee:472077794398961684> (售價:999)",true)
        .addField("月卡黨","<:yuno:588359925084979211> (售價:150)",true)  
        .addField("海豹獵犬","<:ysy7:420984553138814986> (售價:777)",true)
        .addField("老司機","<:bya:378080241576574977> (售價:3333)",true)
        .addField("考古學家","<:aichan:438006259678052373> (售價:66666)",true)
        .addField("煌帝國","<:teriteri:569019032364384256> (售價:9999)",true)
        .addField("天命教國","<:fuka2:589314493226680321>(售價:9999)",true)
        .addField("海盜聯邦","<:hmk2:586486129474273280> (售價:9999)",true)
        .addField("股票玩家","<:bya2:586481143000334336> (售價:555)",true)
        .setThumbnail("https://i.imgur.com/guTJB7T.png");
        return message.channel.send(embed);
          return message.channel.send(embed);
          break;
          
        case "remove":
          if(!args[2]) return message.channel.send("請輸入欲移除的身分組代表之表情符號。");
          switch(args[2])
          {
              case "<:crystal:431483260468592641>":
                man.removeRole("414673014030860288");
              break;        
              
              case "<:nuwa1:592343029369798660>":
                man.removeRole("433267647120146432");
              break;         
              
              case "<:eevee:472077794398961684>":
                man.removeRole("434704579351805952");
              break;         
              
              case "<:yuno:588359925084979211>":
                man.removeRole("432767419782660096");
              break;         
              
              case "<:ysy7:420984553138814986>":
                man.removeRole("434214765070516235");
              break;         
              
              case "<:bya:378080241576574977>":
                man.removeRole("432782514789154817");
              break;         
              
              case "<:aichan:438006259678052373>":
                man.removeRole("432786685609377792");
              break;         
              
              case "<:teriteri:569019032364384256>":
                man.removeRole("589124226498297896");
              break;      
              
              case "<:fuka2:589314493226680321>":
                man.removeRole("589125072686678016");
              break;    
              
              case "<:hmk2:586486129474273280>":
                man.removeRole("589124816951574539");
              break;    
              
              case "<:bya2:586481143000334336>":
                man.removeRole("624566221261504523");
                break;
              default :
                return message.reply("請輸入欲購買的身分組代表之表情符號。");
              break;
          }
          return message.reply("身分組已移除")
          break;
    
        case "buy":
          
          if(!args[2]) return message.channel.send("請輸入欲購買的身分組代表之表情符號。");
          switch(args[2])
          {
              case "<:crystal:431483260468592641>":
                if(crystals[id].crystals < 8088) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("414673014030860288");
                crystals[id].crystals -= 8088;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;        
              
              case "<:nuwa1:592343029369798660>":
                if(crystals[id].crystals < 3560) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("433267647120146432");
                crystals[id].crystals -= 3560;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;         
              
              case "<:eevee:472077794398961684>":
                if(crystals[id].crystals < 999) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("434704579351805952");
                crystals[id].crystals -= 999;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;         
              
              case "<:yuno:588359925084979211>":
                if(crystals[id].crystals < 150) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("432767419782660096");
                crystals[id].crystals -= 150;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;         
              
              case "<:ysy7:420984553138814986>":
                if(crystals[id].crystals < 777) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("434214765070516235");
                crystals[id].crystals -= 777;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;         
              
              case "<:bya:378080241576574977>":
                if(crystals[id].crystals < 3333) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("432782514789154817");
                crystals[id].crystals -= 3333;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;         
              
              case "<:aichan:438006259678052373>":
                if(crystals[id].crystals < 66666) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("432786685609377792");
                crystals[id].crystals -= 66666;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;         
              
              
               case "<:teriteri:569019032364384256>":
                if(crystals[id].crystals < 9999) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("589124226498297896");
                crystals[id].crystals -= 9999;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;      
              
              case "<:fuka2:589314493226680321>":
                if(crystals[id].crystals < 9999) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("589125072686678016");
                crystals[id].crystals -= 9999;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;    
              
              case "<:hmk2:586486129474273280>":
                if(crystals[id].crystals < 9999) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("589124816951574539");
                crystals[id].crystals -= 9999;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
              break;    
              
              case "<:bya2:586481143000334336>":
                if(crystals[id].crystals < 555) return message.reply("<:crystal:431483260468592641>不足。");
                man.addRole("624566221261504523");
                crystals[id].crystals -= 555;
                fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                return message.reply("身分組購買成功。");
                break;
              default :
                return message.reply("請輸入欲購買的身分組代表之表情符號。");
              break;  
          }
          break;
          
          
      }
    }
    
}

module.exports.help = {
    name: "sysrole"
}