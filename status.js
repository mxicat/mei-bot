
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const points = require("./points.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
   if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    
    function pp(id){
      var num = 0;
      man = message.guild.members.get(id);
      if (man.roles.find(x => x.name === "LV.80 血色玫瑰") != null) num = 80;
      if (man.roles.find(x => x.name === "LV.76 次元邊界突破") != null) num = 76;
      if (man.roles.find(x => x.name === "LV.72 血騎士．月煌") != null) num = 72;
      if (man.roles.find(x => x.name === "LV.68 雷電女王的鬼鎧") != null) num = 68;
      if (man.roles.find(x => x.name === "LV.64 白騎士．月光") != null) num = 64;
      if (man.roles.find(x => x.name === "LV.60 異度黑核侵蝕") != null) num = 60;
      if (man.roles.find(x => x.name === "LV.56 銀狼的黎明") != null) num = 56;
      if (man.roles.find(x => x.name === "LV.52 女武神．凱旋") != null) num = 52;
      if (man.roles.find(x => x.name === "LV.48 雪地狙擊") != null) num = 48;
      if (man.roles.find(x => x.name === "LV.44 影舞衝擊") != null) num = 44;
      if (man.roles.find(x => x.name === "LV.40 聖女祈禱") != null) num = 40;
      if (man.roles.find(x => x.name === "LV.35 融核裝．深紅") != null) num = 35;
      if (man.roles.find(x => x.name === "LV.30 驅動裝．山吹") != null) num = 30;
      if (man.roles.find(x => x.name === "LV.25 女武神．遊俠") != null) num = 25;
      if (man.roles.find(x => x.name === "LV.20 女武神．強襲") != null) num = 20;
      if (man.roles.find(x => x.name === "LV.15 戰場疾風") != null) num = 15;
      if (man.roles.find(x => x.name === "LV.10 女武神．戰車") != null) num = 10;
      if (man.roles.find(x => x.name === "LV.5 脈衝裝．緋紅") != null) num = 5;
      if (man.roles.find(x => x.name === "LV.1 領域裝．白練") != null) num = 1;
      return num + 20;
    }
  
     if(!points[id]) 
        {
           points[id] = {
            str: 0,
            agi: 0,
            vit: 0,
            luk: 0,
            points: pp(id)
          };
        }

    function sumpp(id) {return points[id].str + points[id].agi + points[id].vit + points[id].luk + points[id].points;}
    if(sumpp(id) < pp(id)) points[id].points += pp(id) - sumpp(id);
  
      let embed = new Discord.RichEmbed()
      .setColor("#F17C67")
      .setTitle(man.displayName + " 的素質欄")
      .addField("str",''+points[id].str,true)
      .addField("agi",''+points[id].agi,true)
      .addField("vit",''+points[id].vit,true)
      .addField("luk",''+points[id].luk,true)
      .addField("points",''+points[id].points)
     
      return message.channel.send(embed);
}

module.exports.help = {
    name: "status"
}