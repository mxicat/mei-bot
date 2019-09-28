
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const killed = require("./killed.json");
const energy = require("./energy.json");
const items = require("./items.json");
const baillist = require("./baillist.json");

module.exports.run = async(bot, message, args) =>{
    return; // 已禁止使用
    var id = message.author.id;
    if(args[1]) {
      var opid = args[1].slice(2,-1);
      if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
    else return message.channel.send("請指定對象。");
  let man = message.guild.members.get(id);
  //if(!message.channel.name.includes("指令")) return message.reply("使用指令請至<#336341341053255684>。");
  if(man.roles.find(`name`,"bot") != null) return message.reply("機器人別鬧。");
   
  if(!baillist[id]) { baillist[id] = {time:0}};
  
    if(opid == id) return message.channel.send("暫不開放自救服務。");
    if(message.guild.members.get(opid)!= null){
      if(!crystals[opid]){
        crystals[opid] = { 
            Time: 0,
            crystals: 10
    }
      };
      
    let p1 = message.guild.members.get(opid);
    if(!p1.roles.find(`name`,"泡水海豹")) return message.channel.send("對象無泡水。");
      
      if(!items[id].items["005"]) return message.channel.send("需要贖罪券。");
     
       if(killed[opid].seal){
               
          killed[opid].seal = 0;
          killed[opid].time = 0;
          killed[opid].ptime = 0;
          let muterole = message.guild.roles.find(`name`,"泡水海豹");
          let pp = message.guild.members.get(opid);
          if(muterole) pp.removeRole(muterole.id);
      }
    
      items[id].items["005"] -= 1;  
      baillist[id].time -= Math.floor(baillist[id].time/10);
      
      fs.writeFileSync("./killed.json",JSON.stringify(killed));
      fs.writeFileSync("./items.json",JSON.stringify(items));
      fs.writeFileSync("./baillist.json",JSON.stringify(baillist));
      
      return message.channel.send("海豹已被釋放。");
    }else{
      return message.channel.send("對象不存在。");
    }
    return;
    //return message.channel.send(""+args[1]+"  "+args[2]);
}

module.exports.help = {
    name: "save"
}