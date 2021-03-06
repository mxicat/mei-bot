
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const stars = require("./stars.json");

module.exports.run = async(bot, message, args) =>{
    return; //已關閉
    var id = message.author.id;
    if(args[1]) {
      var opid = args[1].slice(2,-1);
      if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
    else return message.channel.send("請指定對象。");
    let man = message.guild.members.get(id);
    //if(!message.channel.name.includes("指令")) return message.reply("使用指令請至<#336341341053255684>。");
    if(man.roles.find(role => role.name == "bot") != null) return message.reply("機器人別鬧。");

    let ranking = message.guild.roles.find(role => role.name === "LV.20 女武神．強襲").position;
    if(man.hoistRole.position < ranking) return message.reply("限制功能：水文等級20以上開放");
   
    if(opid == id) return message.channel.send("艦長是想<:nuwa1:592343029369798660>嗎");
    
    if(message.guild.members.get(opid)!= null){
    
      if(!args[2]) return message.channel.send("請輸入給予的星石數量。");
      let num = Math.floor(parseInt(args[2]));
      if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
      if(num <= 0) return message.channel.send("請輸入正整數。");
      if(stars[id].stars < num) return message.channel.send("艦長的星石似乎不夠呢。");
      let profit = Math.floor(num*0.001);
      if(profit < 1) profit = 1;
      stars[id].stars = stars[id].stars - num ;
      stars[opid].stars = stars[opid].stars + num - profit;
      fs.writeFileSync("./stars.json",JSON.stringify(stars));
      return message.channel.send(`星石已轉移。`);
    }else{
      return message.channel.send("對象不存在。");
    }
    return;
    //return message.channel.send(""+args[1]+"  "+args[2]);
}

module.exports.help = {
    name: "gives"
}