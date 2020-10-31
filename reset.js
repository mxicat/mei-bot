
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const weapons = require("./weapons.json");
const points = require("./points.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    let man = message.guild.members.get(id);
    let now = new Date();
    let month = now.getMonth();
  
  
   function pp(id){
      var num = 0;
      man = message.guild.members.get(id);
      if (man.roles.find(x => x.name === "LV.150 女武神．愛醬") != null) num = 150;
      if (man.roles.find(x => x.name == "LV.80 血色玫瑰") != null) num = 80;
      if (man.roles.find(x => x.name == "LV.76 次元邊界突破") != null) num = 76;
      if (man.roles.find(x => x.name == "LV.72 血騎士．月煌") != null) num = 72;
      if (man.roles.find(x => x.name == "LV.68 雷電女王的鬼鎧") != null) num = 68;
      if (man.roles.find(x => x.name == "LV.64  白騎士．月光") != null) num = 64;
      if (man.roles.find(x => x.name =="LV.60 異度黑核侵蝕") != null) num = 60;
      if (man.roles.find(x => x.name == "LV.56 銀狼的黎明") != null) num = 56;
      if (man.roles.find(x => x.name == "LV.52 女武神．凱旋") != null) num = 52;
      if (man.roles.find(x => x.name == "LV.48 雪地狙擊") != null) num = 48;
      if (man.roles.find(x => x.name == "LV.44 影舞衝擊") != null) num = 44;
      if (man.roles.find(x => x.name == "LV.40 聖女祈禱") != null) num = 40;
      if (man.roles.find(x => x.name == "LV.35 融核裝．深紅") != null) num = 35;
      if (man.roles.find(x => x.name == "LV.30 驅動裝．山吹") != null) num = 30;
      if (man.roles.find(x => x.name == "LV.25 女武神．遊俠") != null) num = 25;
      if (man.roles.find(x => x.name == "LV.20 女武神．強襲") != null) num = 20;
      if (man.roles.find(x => x.name == "LV.15 戰場疾風") != null) num = 15;
      if (man.roles.find(x => x.name == "LV.10 女武神．戰車") != null) num = 10;
      if (man.roles.find(x => x.name == "LV.5 脈衝裝．緋紅") != null) num = 5;
      if (man.roles.find(x => x.name == "LV.1 領域裝．白練") != null) num = 1;
      return num;
    }
  
points[id] = { str: 0, agi: 0, vit: 0, luk: 0, points: pp(id,man)};
  fs.writeFileSync("./points.json",JSON.stringify(points)); 
  
  return message.reply("重置完成。");
}  


module.exports.help = {
    name: "reset"
}