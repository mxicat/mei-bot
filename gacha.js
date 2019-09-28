
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const vlkylist = require("./vlkylist.json");
const vlkys = require("./vlkys.json");
const gachalist = require("./gachalist.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    let man = message.guild.members.get(id);
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    
    let now = new Date();
    let month = now.getMonth();
    var embed = new Discord.RichEmbed();
    var i = 0 
    var ary = ["","",""];
  
    function show_options(array)
    {
       embed.setColor("#d355ae")
      .setTitle(man.displayName + " 的選項列")
      
      for(i = 0 ; i < 3 ; i++)
        {
          embed.addField(vlkylist[array[i]].name,'\u200B',true);
        }
      return  message.channel.send(embed);
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
      
    if(!vlkys[id])  vlkys[id] = {vlkys : {"B0":1}, status: {"now":"B0" ,"lv":1, "exp":0}, rank:{ "B0":"B" }};  // initialize user vlky
    if(!gachalist[id]) gachalist[id] = { free : true, list: ary };
      
    if(!crystals[id]){
        crystals[id] = { 
            Time: now.getDay(),
            crystals:  10
        };}
  
    if(!args[1]) 
    {
       embed
      .setColor("#91cd85")
      .setTitle("女武神轉蛋機")
      .addField("消耗 3 枚特特幣進行轉蛋","指令 gacha go")
      .addField("機率詳情","S級女武神 ： 7%\n"+"A級女武神 ： 93%")
      .addField("選取女武神","指令 gacha pick 女武神編號", true)
      .addField("查看當前選項","指令 gacha options", true)
      .setURL("https://mei-1.gitbook.io/workspace/stock/vlky#nv-wu-shen-zhuan-dan")
      .setThumbnail("https://i.imgur.com/IRaffT5.jpg");
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
        {
          case "go":
            if(gachalist[id].free == false) return message.reply("尚有待選女武神，請輸入 gacha options 確認。")
            if(items[id].items["006"] < 3) return message.reply("特特幣不足。");
            var rank_rand = Math.floor(Math.random()*100 + 1);
            var vlky_rand = 0;
            var srank = "";
            var type = "";
            if(rank_rand <= 7) srank = "S";
            else srank = "A";
            
            if(srank == "S")
            {
              for(i = 0 ; i < 3 ; i++)
              {
                vlky_rand = Math.floor(Math.random()*3);
                type = "S" + vlky_rand;
                gachalist[id].list[i] = type;
              }
            }
            else if(srank == "A")
            {
              for(i = 0 ; i < 3 ; i++)
              {
                vlky_rand = Math.floor(Math.random()*10);
                type = "A" + vlky_rand;
                gachalist[id].list[i] = type;
              }
            }
            else return console.log("rank error")
            
            show_options(gachalist[id].list);              
            gachalist[id].free = false;
            items[id].items["006"] -= 3;
            fs.writeFileSync("./items.json",JSON.stringify(items));
            fs.writeFileSync("./gachalist.json",JSON.stringify(gachalist));
            return;
            break;
            
          
          case "pick":
            if(gachalist[id].free == true) return message.reply("尚未抽取女武神，請輸入 gacha go 抽取。")
            if(!args[2]) return message.reply("請輸入欲選取之女武神編號。")
            if(!gachalist[id].list.find(member => member == args[2])) return message.reply("無效的女武神編號。")
            
            var vnum = 0
            if(args[2].startsWith("S"))  vnum = 80;    
            else if(args[2].startsWith("A"))  vnum = 30;    
            else return console.log("args2 error");
            
            rank_up(id, args[2], vnum);
            
            gachalist[id].free = true;
            fs.writeFileSync("./gachalist.json",JSON.stringify(gachalist));
            return message.channel.send("已選擇 " + vlkylist[args[2]].name);
            break;
            
          case "options":
            if(gachalist[id].free == true) return message.reply("尚未抽取女武神，請輸入 gacha go 抽取。")
            show_options(gachalist[id].list);
            return;
            break;   
            
          default:
            return;
        }       
    }
}


module.exports.help = {
    name: "gacha"
}