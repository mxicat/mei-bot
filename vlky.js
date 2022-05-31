
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
    let ranking = message.guild.roles.find(role => role.name === "LV.10 女武神．戰車").position;
    if(man.hoistRole.position < ranking) return message.reply("限制功能：水文等級10以上開放");
    //if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");

    let now = new Date() ;
    now = new Date(now + 8*60*60*1000);
    let month = now.getMonth();
    var type = 0;
    if(!vlkys[id])  vlkys[id] = {vlkys : {"B0":1}, status: {"lv":1, "exp":0}, rank:{ "B0":"B" }, set1:[0,0], set2:[0,0], set3:[0,0], favor:{"B0":0} , marry:{"B0":0} };  // invitailize user vlky
  
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
            lv = vlkys[id].status.lv;
            vk = vlkylist[vlkys[id].set1[0]];
            if(!vk) return message.reply("未設定出戰女武神。")
            embed = new Discord.RichEmbed()
            .setColor("#ea8181")
            .setTitle("女武神等級: " + vlkys[id].status.lv+ "   ("+ vlkys[id].status.exp+ "/" + explist(vlkys[id].status.lv)+")")
            let vk1 = vlkylist[vlkys[id].set1[1]];
            if(!vk1 || !vlkylist[vlkys[id].set2[0]] || !vlkylist[vlkys[id].set3[0]]) return message.reply("未設定出戰女武神。")
            embed.addField("Team.1",vk.name + "⚔" + vk1.name)
            embed.addField("Team.2",vlkylist[vlkys[id].set2[0]].name + "⚔" + vlkylist[vlkys[id].set2[1]].name)
            embed.addField("Team.3",vlkylist[vlkys[id].set3[0]].name + "⚔" + vlkylist[vlkys[id].set3[1]].name)
            return message.channel.send(embed);
            break;
          
         case "set":
             if(args[2] == "1")
             {
               if(!(args[3] && args[4])) return message.reply("請輸入欲設置的女武神編號組。");
               if(args[3] == args[4]) return message.reply("不可設置重複的女武神。")
               if(vlkylist[args[3]] && vlkylist[args[4]])
               {
                 if((!Object.keys(vlkys[id].vlkys).includes(args[3])) || vlkys[id].rank[args[3]] == "None") return message.reply("含有未解鎖之女武神。");
                 if((!Object.keys(vlkys[id].vlkys).includes(args[4])) || vlkys[id].rank[args[4]] == "None") return message.reply("含有未解鎖之女武神。");
                 vlkys[id].set1[0] = args[3];
                 vlkys[id].set1[1] = args[4];
                 fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
                 return message.channel.send("女武神已配置。")
               }
               else return message.channel.send("含有未知的女武神編號。")
             }
             else if(args[2] == "2")
             {
               if(!(args[3] && args[4])) return message.reply("請輸入欲設置的女武神編號組。");
               if(args[3] == args[4]) return message.reply("不可設置重複的女武神。")
               if(vlkylist[args[3]] && vlkylist[args[4]])
               {
                 if((!Object.keys(vlkys[id].vlkys).includes(args[3])) || vlkys[id].rank[args[3]] == "None") return message.reply("含有未解鎖之女武神。");
                 if((!Object.keys(vlkys[id].vlkys).includes(args[4])) || vlkys[id].rank[args[4]] == "None") return message.reply("含有未解鎖之女武神。");
                 vlkys[id].set2[0] = args[3];
                 vlkys[id].set2[1] = args[4];
                 fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
                 return message.channel.send("女武神已配置。")
               }
               else return message.channel.send("含有未知的女武神編號。")
             }
             else if(args[2] == "3")
             {
               if(!(args[3] && args[4])) return message.reply("請輸入欲設置的女武神編號組。");
               if(args[3] == args[4]) return message.reply("不可設置重複的女武神。")
               if(vlkylist[args[3]] && vlkylist[args[4]])
               {
                 if((!Object.keys(vlkys[id].vlkys).includes(args[3])) || vlkys[id].rank[args[3]] == "None") return message.reply("含有未解鎖之女武神。");
                 if((!Object.keys(vlkys[id].vlkys).includes(args[4])) || vlkys[id].rank[args[4]] == "None") return message.reply("含有未解鎖之女武神。");
                 vlkys[id].set3[0] = args[3];
                 vlkys[id].set3[1] = args[4];
                 fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
                 return message.channel.send("女武神已配置。")
               }
               else return message.channel.send("含有未知的女武神編號。")
             }
             else
             {
               if(!(args[2] && args[3])) return message.reply("請輸入欲設置的女武神編號組。");
               if(args[2] == args[3]) return message.reply("不可設置重複的女武神。")
               if(vlkylist[args[2]] && vlkylist[args[3]])
               {
                 if((!Object.keys(vlkys[id].vlkys).includes(args[2])) || vlkys[id].rank[args[2]] == "None") return message.reply("含有未解鎖之女武神。");
                 if((!Object.keys(vlkys[id].vlkys).includes(args[3])) || vlkys[id].rank[args[3]] == "None") return message.reply("含有未解鎖之女武神。");
                 vlkys[id].set1[0] = args[2];
                 vlkys[id].set1[1] = args[3];
                 if(vlkys[id].set2[0] == 0)
                 {
                   vlkys[id].set2[0] = args[2];
                   vlkys[id].set2[1] = args[3];
                 }
                 if(vlkys[id].set3[0] == 0)
                 {
                   vlkys[id].set3[0] = args[2];
                   vlkys[id].set3[1] = args[3];
                 }
                 fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
                 return message.channel.send("女武神已配置。")
               }
               else return message.channel.send("含有未知的女武神編號。")
             }
             break; 
           
         case "gal":
           if(!(args[2])) return message.reply("請輸入欲查看的女武神編號。");
           if(vlkylist[args[2]])
           {
             type = args[2]
             for(var member of Object.keys(vlkys))
             { 
               if(! (type in vlkys[member].favor)) vlkys[member].favor[type] = 0
               if(!vlkys[member].favor[type]) vlkys[member].favor[type] = 0
             }
             var rank_array = Object.keys(vlkys).sort(function(a,b){ return vlkys[b].favor[type] - vlkys[a].favor[type]})
             var str = ""
             function show_rank(num)
             {
               switch(num)
               {
                  case 1 : return ":one:";  break;
                  case 2 : return ":two:";  break;
                  case 3 : return ":three:";  break;
                  case 4 : return ":four:";  break;
                  case 5 : return ":five:";  break;
                  case 6 : return ":six:";  break;
                  case 7 : return ":seven:";  break;
                  case 8 : return ":eight:";  break;
                  case 9 : return ":nine:";  break;
                  case 10 : return "🔟";  break;
               }
             }
             for(var i = 0 ; i < 5 ; i ++)
             {
               let person = message.guild.members.get(rank_array[i])
               let name = "查無此人"
               if(person) name = vlkys[rank_array[i]].favor[type] > 0 ? `**${person.displayName}**` : "-" 
               str += show_rank(i+1) + "　" + name + "　好感度：" + vlkys[rank_array[i]].favor[type] + "\n"
             }
             embed = new Discord.RichEmbed()
             .setColor("#98beff")
             .setTitle(vlkylist[type].name + "　好感度排行榜")
             .setThumbnail(vlkylist[type].img)
             .setDescription(str)
             fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
             return message.channel.send(embed)
           }
           else
           {
             return message.reply("錯誤的女武神編號") 
           }
         break;
           
         case "reset100":
           if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("測試中，需要**GM**權限");
           vlkys[id] = {vlkys : {"B0":1, "A0":1, "A1":1, "A2":1, "A3":1, "A4":1, "A5":1, "A6":1, "A7":1, "A8":1, "A9":1, "S0":1, "S1":1, "S2":1},
                        rank:{"B0":"SS", "A0":"SS", "A1":"SS", "A2":"SS", "A3":"SS", "A4":"SS", "A5":"SS", "A6":"SS", "A7":"SS", "A8":"SS", "A9":"SS", "S0":"SS", "S1":"SS", "S2":"SS"},
                        status: {"lv":100, "exp":0}, set1:[0,0], set2:[0,0], set3:[0,0], favor:{"B0":0}, marry:{"B0":0}};
           fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
           return message.reply("OK");
           break;
           
     default:
         if(vlkylist[args[1]])
         {
           let nw = vlkylist[args[1]];
           type = args[1];
           if(!vlkys[id].favor[type]) vlkys[id].favor[type] = 0
           embed = new Discord.RichEmbed()
            .setColor("#86C166")
            .setTitle(nw.name)
            .setThumbnail(nw.img);
          if( !(type in vlkys[id].vlkys) || (!vlkys[id].vlkys[type] && vlkys[id].rank[type] == "None")) embed.addField("個人擁有","醒醒吧，你沒有老婆。")
          else embed.addField("個人擁有","階級: "+ vlkys[id].rank[type] + " (" + vlkys[id].vlkys[type] + "/" + ranklist(vlkys[id].rank[type], vlkylist[type].srank) + ")")
          
          function show_heart(id,v_type)
          {
            let num = Math.floor((vlkys[id].favor[v_type]/10000)/0.2);
            let str = "";
            for(var j = 0 ; j < num ; j++) str += "♥";
            if(str.length > 5) str = "♥♥♥♥♥"
            if(str == "") str = "💚"
            //if(vlkys[id].marry[v_type] == 1) str = "💍"
            return str;
          }
          embed.addField("好感度：" + vlkys[id].favor[type],show_heart(id,type))
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
