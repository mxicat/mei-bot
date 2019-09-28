
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const stars = require("./stars.json");
const vlkys = require("./vlkys.json");
const vlkylist = require("./vlkylist.json");

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
    
    if(!args[2]) return message.reply("請輸入欲給予的女武神編號。")
    var type = args[2];
    if(!(vlkylist[type])) return message.reply("無效的女武神編號。")
    
     function ranklist(rank,srank)  // required num of chips for rank up
    {
      if(rank == "None" && srank == "A") return 30;
      if(rank == "None" && srank == "S") return 80;
      if(rank == "B") return 30;
      else if (rank == "A") return 50;
      else if (rank == "S") return 100;
      else if (rank == "SS") return 200;
      else if (rank == "SSS") return 999;
      else if (rank == "EX") return "∞";
      else return console.log("rank error");
      return;
    }  
  
    function rank_up(id, type, num) //vlky rank up
    {
      if(!vlkylist[type]) return console.log("type error");
      if(!(type in vlkys[id].vlkys))
      {
        vlkys[id].rank[type] = "None";
        vlkys[id].vlkys[type] = 0;
      }
      vlkys[id].vlkys[type] += num;  
      let base = ranklist(vlkys[id].rank[type],vlkylist[type].srank);
      while(vlkys[id].vlkys[type] >= base)
        {
          vlkys[id].vlkys[type] -= base;
          if(vlkys[id].rank[type] == "None" && vlkylist[type].srank == "A") vlkys[id].rank[type] = "A";
          else if(vlkys[id].rank[type] == "None" && vlkylist[type].srank == "S") vlkys[id].rank[type] = "S";
          else if(vlkys[id].rank[type] == "A") vlkys[id].rank[type] = "S";
          else if(vlkys[id].rank[type] == "S") vlkys[id].rank[type] = "SS";
          else if(vlkys[id].rank[type] == "SS") vlkys[id].rank[type] = "SSS";
          else if(vlkys[id].rank[type] == "SSS") vlkys[id].rank[type] = "EX";
          base = ranklist(vlkys[id].rank[type],vlkylist[type].srank);
        }
      fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
      return;
    }
  
    if(message.guild.members.get(opid)!= null){
    
      if(!args[3]) return message.channel.send("請輸入給予的碎片數量。");
      let num = Math.floor(parseInt(args[3]));
      if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
      if(num <= 0) return message.channel.send("請輸入正整數。");
      
      if(vlkys[id].vlkys[type] < num || !(type in vlkys[id].vlkys)) return message.channel.send("擁有的女武神碎片不足。");
      vlkys[id].vlkys[type] -= num;
      rank_up(opid,type,num);
      fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
      return message.channel.send(`角色碎片已轉移。`);
    }
    else
    {
      return message.channel.send("對象不存在。");
    }
    return;
}

module.exports.help = {
    name: "givef"
}