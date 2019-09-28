
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const luckylist = require("./luckylist.json");
const energy = require("./energy.json");
const items = require("./items.json");

module.exports.run = async(bot, message, args) =>{
    
    var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return ;
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()

   
    if(!luckylist[id]) {luckylist[id] = { num: 0, reward: 0 , up: 0 , down: 0}};
  
  
    function roll() {return Math.floor(Math.random()*999 + 1);}

  
    function reset(id)
  {
    luckylist[id] = { num: 0, reward: 0 , up: 1000 , down: 0};
    fs.writeFileSync("./luckylist.json",JSON.stringify(luckylist)); 
    return;
  }
  
    function ball()
  {
    var rand = Math.floor(Math.random()*99 + 1);
    if(rand <= 9) 
    {
      luckylist[id].reward = 0;
      message.reply("獎金歸零，目前獎金為： " + luckylist[id].reward + "<:crystal:431483260468592641>");
    }
    else if(rand <= 15)
    {
      luckylist[id].reward = luckylist[id].reward * 2;
      message.reply("獎金加倍，目前獎金為： " + luckylist[id].reward + "<:crystal:431483260468592641>");
    } 
    else if(rand <= 25)
    {
      luckylist[id].reward = Math.ceil(luckylist[id].reward / 2);
      message.reply("獎金減半，目前獎金為： " + luckylist[id].reward + "<:crystal:431483260468592641>");
    }   
    else if(rand <= 27)
    {
      luckylist[id].reward += 1000;
      message.reply("1000<:crystal:431483260468592641>，目前獎金為： " + luckylist[id].reward + "<:crystal:431483260468592641>");
    }   
    else if(rand <= 32)
    {
      luckylist[id].reward += 500;
      message.reply("500<:crystal:431483260468592641>，目前獎金為： " + luckylist[id].reward + "<:crystal:431483260468592641>");
    }   
    else if(rand <= 50)
    {
      luckylist[id].reward += 200;
      message.reply("200<:crystal:431483260468592641>，目前獎金為： " + luckylist[id].reward + "<:crystal:431483260468592641>");
    }   
    else if(rand <= 70)
    {
      luckylist[id].reward += 100;
      message.reply("100<:crystal:431483260468592641>，目前獎金為： " + luckylist[id].reward + "<:crystal:431483260468592641>");
    }   
    else if(rand <= 100)
    {
      luckylist[id].reward += 30;
      message.reply("30<:crystal:431483260468592641>，目前獎金為： " + luckylist[id].reward + "<:crystal:431483260468592641>");
    }  
    return fs.writeFileSync("./luckylist.json",JSON.stringify(luckylist)); 
  }
  
    if(!args[1]) 
    {      
       embed = new Discord.RichEmbed()
      .setColor("#EB7A77")
      .setTitle("終極密碼")
      .addField("開啟新遊戲","輸入 luckyball go 數字")
      .setThumbnail("https://i.imgur.com/KNl61E0.jpg");
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
      {
        case "go":
          
          if(!args[2]) return message.reply(luckylist[id].down+"~"+luckylist[id].up);
          let num = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
          if(num < 0) return message.reply("請輸入正整數。");
          if(items[id].items["004"] < 1) return message.reply("需要遊樂園券");
          man = message.guild.members.get(id);
        
          if(!luckylist[id].num) {luckylist[id].num  = roll();  message.reply("已開啟新遊戲")}
          if (!luckylist[id].up) luckylist[id].up = 1000;
          
          if(num >= luckylist[id].up) return message.reply("數字過大，目前上限為： " + luckylist[id].up);
          else if(num <= luckylist[id].down) return message.reply("數字過小，目前下限為： " + luckylist[id].down);;
          
          items[id].items["004"] -= 1;
          fs.writeFileSync("./items.json",JSON.stringify(items));
          
          if( num == luckylist[id].num)
          {
            crystals[id].crystals += luckylist[id].reward;
            fs.writeFileSync("./crystals.json",JSON.stringify(crystals)); 
            message.reply("恭喜中獎，獲得獎金： "+ luckylist[id].reward + "<:crystal:431483260468592641>")
            if(luckylist[id].up == 1000 && luckylist[id].down == 0) 
            {
              items[id].items["001"] += 1; 
              fs.writeFileSync("./items.json",JSON.stringify(items)); 
              message.reply("一發入魂，獲得獎品：崩壞碎片*1");
            }
            reset(id); 
            return ;
          }
          else if ( num > luckylist[id].num)
          {
            luckylist[id].up  = num; 
            ball();
            message.reply(luckylist[id].down+"~"+luckylist[id].up);
            return;
          }
          else if ( num < luckylist[id].num)
          {
            luckylist[id].down  = num; 
            ball();
            message.reply(luckylist[id].down+"~"+luckylist[id].up);
            return;
          }
          return;
          
          break;
      }      
    }
    return;
}

module.exports.help = {
    name: "luckyball"
}