
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    if(message.guild.members.get(id).roles.find(role => role.id == "433683517235265537") == null && message.guild.members.get(id).roles.find("id","439412731632680960") == null) return message.channel.send("需要**GM**權限");
    if(args[1]) {
      var opid = args[1].slice(2,-1);
      if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
    else return message.channel.send("請指定對象。");
    
    //if(opid == id) return message.channel.send("請指定其他對象");
  
    if(args[1] == "all")
    {
       if(!args[2]) return message.channel.send("請輸入給予的水晶數量。");
        let num = Math.floor(parseInt(args[2]));
        if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
        if(num <= 0) return message.channel.send("請輸入正整數。");
      
       for(var person of Object.keys(crystals)) 
      {
        let ranking = message.guild.roles.find(x => x.name == "LV.10 女武神．戰車").position;
        var man = message.guild.members.get(person);
        if(man){ let role = man.hoistRole;
        if(role) 
        {
          if(role.position >= ranking) crystals[person].crystals = crystals[person].crystals + num;                
        }}
      }
      
      fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
      
      return message.channel.send(`<:crystal:431483260468592641>已轉移。`);
    }
    if(message.guild.members.get(opid)!= null){
      if(!crystals[opid]){
        crystals[opid] = { 
            Time: 0,
            crystals: 0
    }
      };
      if(!args[2]) return message.channel.send("請輸入給予的水晶數量。");
      let num = Math.floor(parseInt(args[2]));
      if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
      if(num <= 0) return message.channel.send("請輸入正整數。");
      
      crystals[opid].crystals = crystals[opid].crystals + num;
      fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
      
      if(message.guild.members.get(id).roles.find(x => x.id == "439412731632680960") != null)
      {
        let ch = message.guild.channels.find(x => x.id == "439409788850405376") ;
         let op = message.guild.members.get(opid);
         let embed = new Discord.RichEmbed()
         .setTitle(op.displayName + "獲得了 " + num + " <:crystal:431483260468592641>");
        ch.send(embed);
        crystals[id].crystals += 20;
        fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
      }
      
      return message.channel.send(`<:crystal:431483260468592641>已轉移。`);
    }else{
      return message.channel.send("對象不存在。");
    }
    return;
    //return message.channel.send(""+args[1]+"  "+args[2]);
}

module.exports.help = {
    name: "reward"
}