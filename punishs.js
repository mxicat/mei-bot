
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const stars = require("./stars.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    if(message.guild.members.get(id).roles.find(x => x.id == "433683517235265537") == null && message.guild.members.get(id).roles.find("id","439412731632680960") == null) return message.channel.send("需要**GM**權限");
    if(args[1]) {
      var opid = args[1].slice(2,-1);
      if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
    else return message.channel.send("請指定對象。");
    
    //if(opid == id) return message.channel.send("請指定其他對象");
  
    if(args[1] == "all")
    {
       if(!args[2]) return message.channel.send("請輸入給予的星石數量。");
        let num = Math.floor(parseInt(args[2]));
        if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
        if(num <= 0) return message.channel.send("請輸入正整數。");
      
       for(var person of Object.keys(stars)) 
      {
        let ranking = message.guild.roles.find(x => x.name == "LV.20 女武神．強襲").position;
        var man = message.guild.members.get(person);
        if(man){ let role = man.hoistRole;
        if(role) 
        {
          if(role.position >= ranking) stars[person].stars = stars[person].stars - num;                
        }}
      }
      
      fs.writeFileSync("./stars.json",JSON.stringify(stars));
      
      return message.channel.send(`<:crystal:431483260468592641>已轉移。`);
    }
      
      if(!args[2]) return message.channel.send("請輸入給予的星石數量。");
      let num = Math.floor(parseInt(args[2]));
      if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
      if(num <= 0) return message.channel.send("請輸入正整數。");
      
      stars[opid].stars = stars[opid].stars - num;
      fs.writeFileSync("./stars.json",JSON.stringify(stars));
      
      return message.channel.send(`星石已轉移。`);
    return;
    //return message.channel.send(""+args[1]+"  "+args[2]);
}

module.exports.help = {
    name: "punishs"
}