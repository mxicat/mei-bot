
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    let man = message.guild.members.get(id);
    let idlist = new Set();
  if(man.roles.find(x => x.name == "bot") != null) return message.reply("機器人別鬧。");
    var i = 1;
    while(args[i]  && (!Number.isInteger(Math.floor(parseInt(args[i])))))
    {
      var opid = args[i].slice(2,-1);
      if(opid.startsWith("!")) opid = opid.slice(1);
                    //id of first mentioned person
      if(message.guild.members.get(opid) == null) return message.channel.send("對象不存在。");
      if(opid == id) return message.channel.send("艦長是想<:nuwa:401024381004021760>嗎");
      idlist.add(opid);
      i++;
    }
    
    var count = 0;
    idlist.forEach(function (it) {
      count ++;
    });
  
    if(!args[i]) return message.channel.send("請輸入給予的水晶數量。");
    let num = Math.floor(parseInt(args[i]));
    if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
    if(num <= 0) return message.channel.send("請輸入正整數。");
    if(crystals[id].crystals < num*count) return message.channel.send("艦長的水晶似乎不夠呢。");

 
   idlist.forEach(function (userid) {
      
     if(!crystals[userid])  crystals[userid] = { Time: 0, crystals: 10};
     let profit = Math.floor(num*0.01);
     if(!profit) profit = 1;
      crystals[id].crystals = crystals[id].crystals - num ;
      crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals + profit;
      crystals[userid].crystals = crystals[userid].crystals + num - profit;
     
   });
      
      fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
      return message.channel.send(`<:crystal:431483260468592641>已轉移。`);
   
}

module.exports.help = {
    name: "givelist"
}