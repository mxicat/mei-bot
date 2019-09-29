
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const crystals = require("./crystals.json");
const items = require("./items.json");
const itemlist = require("./itemlist.json");
const vlkylist = require("./vlkylist.json");
const vlkys = require("./vlkys.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("測試中，需要**GM**權限");
    let man = message.guild.members.get(id);
    let ranking = message.guild.roles.find(role => role.name === "LV.20 女武神．強襲").position;
    if(man.hoistRole.position < ranking) return message.reply("限制功能：水文等級20以上開放");
    //if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");

    let now = new Date() ;
    now = new Date(now + 8*60*60*1000);
    let month = now.getMonth();
    var type = 0;
    if(!vlkys[id])  vlkys[id] = {vlkys : {"B0":1}, status: {"lv":1, "exp":0}, rank:{ "B0":"B" }, set1:[0,0], set2:[0,0], set3:[0,0], favor:{"B0":0}};  // invitailize user vlky
  
    function explist(lv)  // required exp for lv up
    {
      return lv*lv*lv + 100*lv - 50;
    }
    
    function lvup(id,exp)
    {
      vlkys[id].status.exp += exp;
      while( vlkys[id].status.exp >= explist(vlkys[id].status.lv))
      {
        vlkys[id].status.exp -= explist(vlkys[id].status.lv);
        vlkys[id].status.lv += 1;
      }
      vlkys[id].status.exp = Math.ceil(vlkys[id].status.exp);
      fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
      return;
    }
    
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
  
    function rcount(reactions, name)
    {
      if(!reactions) return 0;
      let target = reactions.find(reaction => reaction.emoji.name == name);
      if(target) return target.count;
      else return 0;
    }
    
    var lv = 0;
    var i = 0;
    var num = 0;
    var type = 0;
    var vk = 0;
    var embed = new Discord.RichEmbed();
    
    if(!args[1]) 
    {

       embed = new Discord.RichEmbed()
      .setColor("#98beff")
      .setTitle(man.displayName+" 的女武神")
      .setURL("https://mei-1.gitbook.io/workspace/stock/vlky")
    // console.log(typeof(weapons[id].weapons))
      for(var w of Object.keys(vlkys[id].vlkys)) 
      {
        if(vlkys[id].vlkys[w] >= 0) embed.addField(vlkylist[w].name,"階級: "+ vlkys[id].rank[w] + " (" + vlkys[id].vlkys[w] + "/" + ranklist(vlkys[id].rank[w], vlkylist[w].srank) + ")",true);
      }
        return message.channel.send(embed);
    }
    else
    {
       switch(args[1])
       {
         case "now":
            //if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("測試中，需要**GM**權限");
            lv = vlkys[id].status.lv;
            vk = vlkylist[vlkys[id].set1[0]];
            if(!vk) return message.reply("未設定出戰女武神。")
            embed = new Discord.RichEmbed()
            .setColor("#ea8181")
            .setTitle("女武神等級: " + vlkys[id].status.lv+ "   ("+ vlkys[id].status.exp+ "/" + explist(vlkys[id].status.lv)+")")
            embed.addField("No.1",vk.name)
            vk = vlkylist[vlkys[id].set1[1]];
            if(!vk) return message.reply("未設定出戰女武神。")
            embed.addField("No.2",vk.name)
            return message.channel.send(embed);
            break;
          
         case "set":
             //if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("測試中，需要**GM**權限");
             
             if(!(args[2] && args[3])) return message.reply("請輸入欲設置的女武神編號組。");
             if(args[2] == args[3]) return message.reply("不可設置重複的女武神。")
             if(vlkylist[args[2]] && vlkylist[args[3]])
             {
               if((!Object.keys(vlkys[id].vlkys).includes(args[2])) || vlkys[id].rank[args[2]] == "None") return message.reply("含有未解鎖之女武神。");
               if((!Object.keys(vlkys[id].vlkys).includes(args[3])) || vlkys[id].rank[args[3]] == "None") return message.reply("含有未解鎖之女武神。");
               vlkys[id].set1[0] = args[2];
               vlkys[id].set1[1] = args[3];
               fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
               return message.channel.send("女武神已配置。")
             }
             else return message.channel.send("含有未知的女武神編號。")
             break; 
           
         case "reset100":
           //if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("測試中，需要**GM**權限");
           vlkys[id] = {vlkys : {"B0":1, "A0":1, "A1":1, "A2":1, "A3":1, "A4":1, "A5":1, "A6":1, "A7":1, "A8":1, "A9":1, "S0":1, "S1":1, "S2":1},
                        rank:{"B0":"SS", "A0":"SS", "A1":"SS", "A2":"SS", "A3":"SS", "A4":"SS", "A5":"SS", "A6":"SS", "A7":"SS", "A8":"SS", "A9":"SS", "S0":"SS", "S1":"SS", "S2":"SS"},
                        status: {"lv":100, "exp":0}, set1:[0,0], set2:[0,0], set3:[0,0], favor:{"B0":0}};
           fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
           return message.reply("OK");
           break;
           
     default:
         if(vlkylist[args[1]])
         {
           let nw = vlkylist[args[1]];
           type = args[1];
           embed = new Discord.RichEmbed()
            .setColor("#86C166")
            .setTitle(nw.name)
            /*.addField("Max ATK：",nw.atk,true)
            .addField("Max CRI：",nw.cri,true)*/
           .setThumbnail(nw.img);
          if( !(type in vlkys[id].vlkys) || (!vlkys[id].vlkys[type] && vlkys[id].rank[type] == "None")) embed.addField("個人擁有","醒醒吧，你沒有老婆。")
          else embed.addField("個人擁有","階級: "+ vlkys[id].rank[type] + " (" + vlkys[id].vlkys[type] + "/" + ranklist(vlkys[id].rank[type], vlkylist[type].srank) + ")")
          return message.channel.send(embed);
         }
         else return message.channel.send("未知的女武神編號。")
         break;
       }
    }
}

module.exports.help = {
    name: "vlky"
}
