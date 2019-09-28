
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    if(args[1]) {
      var opid = args[1].slice(2,-1);
      if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
    else return message.channel.send("請指定對象。");
  let man = message.guild.members.get(id);
  //if(!message.channel.name.includes("指令")) return message.reply("使用指令請至<#336341341053255684>。");
  if(man.roles.find(role => role.name == "bot") != null) return message.reply("機器人別鬧。");
   
    if(opid == id) return message.channel.send("艦長是想<:nuwa1:592343029369798660>嗎");
    if(message.guild.members.get(opid)!= null){
      if(!crystals[opid]){
        crystals[opid] = { 
            Time: 0,
            crystals: 10
    }
      };
      if(!args[2]) return message.channel.send("請輸入給予的水晶數量。");
      let num = Math.floor(parseInt(args[2]));
      if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
      if(num <= 0) return message.channel.send("請輸入正整數。");
      if(crystals[id].crystals < num) return message.channel.send("艦長的水晶似乎不夠呢。");
      let profit = Math.floor(num*0.01);
      if(!profit) profit = 1;
      crystals[id].crystals = crystals[id].crystals - num ;
      crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals + profit;
      crystals[opid].crystals = crystals[opid].crystals + num - profit;
      fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
      return message.channel.send(`<:crystal:431483260468592641>已轉移。`);
    }else{
      return message.channel.send("對象不存在。");
    }
    return;
    //return message.channel.send(""+args[1]+"  "+args[2]);
}

module.exports.help = {
    name: "give"
}