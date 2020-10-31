
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null) return message.channel.send("維護中，需要**GM**權限");
    let man = message.guild.members.get(id);
 if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    
    let now = new Date();
    let month = now.getMonth();
    var embed = new Discord.RichEmbed();
    
    if(!items[id])  items[id] = {items : {"000":0}};
    if(!weapons[id])  weapons[id] = {weapons : {"B0":1}, status: {"now":"B0","lv":1, "exp":0}}; 
    if(!crystals[id]){
        crystals[id] = { 
            Time: now.getDay(),
            crystals:  10
        };}
    if(!args[1]) 
    {
       embed
      .setColor("#6C6024")
      .addField("消耗60水晶進行精準補給","指令:draw 數量")
      .addField("機率詳情","四星武器: 1%\n"+"三星武器: 13%\n"+"二星武器: 25%\n"+ "贖罪券: 1%\n"+"獵人執照: 5%\n"  + "體力藥水: 5%\n" + "遊樂園券: 50%\n")
      .setThumbnail("https://i.imgur.com/cVHkT7g.png");
      return message.channel.send(embed);
    }
    else
    {
      let num = Math.floor(parseInt(args[1]));
      if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
      if(num <= 0) return message.reply("請輸入正整數。");
      if(num > 10000) return message.reply("最大值10000。");
      if(crystals[id].crystals < num*60) return message.reply("艦長的水晶似乎不夠呢。");
      
      crystals[id].crystals = crystals[id].crystals - num*60;
      var count = 0;
      var ticket = 0;
      var tt = 0;
      var ep = 0;
      let nw = 0;
      if(num >= 10) num += Math.floor(num / 10);
       var em = new Discord.RichEmbed().setColor("#6C6024");
       em.setTitle("你進行了 " + num +" 次精準補給  ");
      
      for(var i = 0 ; i < num ; i++)
      {
        var rand = Math.floor(Math.random() * 100) + 1;
        if(rand <= 5){ count = count + 1;}
        else if(rand == 6)
        {
          var wnum = Math.floor(Math.random() * 5);
          let type = 'S' + wnum;
          if(!Object.keys(weapons[id].weapons).includes(type)) weapons[id].weapons[type] = 1;
          else weapons[id].weapons[type] += 1;
          nw = weaponlist['S' + wnum];
           if(num < 25) em.addField("四星武器" , nw.name,true);
        }
        else if(rand == 7)
        {
          tt += 1;
        }
        else if(rand <= 20)
        {
          var wnum = Math.floor(Math.random() * 5);
          let type = 'A' + wnum;
          if(!Object.keys(weapons[id].weapons).includes(type)) weapons[id].weapons[type] = 1;
          else weapons[id].weapons[type] += 1;
          nw = weaponlist['A' + wnum];
          if(num < 25) em.addField("三星武器" , nw.name,true);
        }
        else if(rand <= 45)
        {
          var wnum = Math.floor(Math.random() * 3);
           let type = 'B' + wnum;
          if(!Object.keys(weapons[id].weapons).includes(type)) weapons[id].weapons[type] = 1;
          else weapons[id].weapons[type] += 1;
          nw = weaponlist['B'+wnum];
          if(num < 25) em.addField("二星武器" , nw.name,true);
        }
         else if(rand <= 50)
        {
          ep += 1;
        }
        else ticket += 1;
      }
      
      if(count) {items[id].items["000"] += count;   em.addField( "獵人執照","共抽中 " + count + " 張"); }
      if(ticket) {items[id].items["004"] += ticket;   em.addField( "遊樂園券","共抽中 " + ticket + " 張"); }
      if(tt) {items[id].items["005"] += tt;   em.addField( "贖罪券","共抽中 " + tt + " 張"); }
      if(ep) {items[id].items["003"] += ep;   em.addField( "體力藥水","共抽中 " + ep + " 罐"); }
     
      fs.writeFileSync("./items.json",JSON.stringify(items));
      fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
      fs.writeFileSync("./weapons.json",JSON.stringify(weapons));
      em.setThumbnail("https://i.imgur.com/cVHkT7g.png");
      
      return message.channel.send(em); 
    }
   
}


module.exports.help = {
    name: "draw"
}