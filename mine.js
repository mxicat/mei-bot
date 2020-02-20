
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const items = require("./items.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const baillist = require("./baillist.json");
const coinlist = require("./coinlist.json");

module.exports.run = async(bot, message, args) =>{
    
  var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed();
    
    if(!coinlist[id]) { coinlist[id] = { now : 1 , ltd: 0}}
    
    function explist(lv)  // required exp for lv up
    {
      if(lv == 1) return 11;
      else if (lv < 15) return lv*lv*4 + 40*lv - 50;
      else if (lv < 30) return lv*lv*6 + 50*lv - 50;
      else if (lv < 50) return lv*lv*8 + 60*lv - 50;
      return lv*lv*20 + 100*lv - 50;
    }
  
    function lvup(id,exp)
    {
      weapons[id].status.exp += exp;
      while( weapons[id].status.exp >= explist(weapons[id].status.lv))
      {
        weapons[id].status.exp -= explist(weapons[id].status.lv);
        weapons[id].status.lv += 1;
      }
       weapons[id].status.exp = Math.ceil(weapons[id].status.exp);
      fs.writeFileSync("./weapons.json",JSON.stringify(weapons));
      return;
    }
  
    let crim = message.guild.roles.find(x => x.id == "438267716915298304");
     
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#08192D")
      .setTitle("水晶礦場")
      .addField("支付體力獲取<:crystal:431483260468592641>","輸入 **mine 欲消耗之體力**")
      .setThumbnail("https://i.imgur.com/q4nuVmm.png");
      return message.channel.send(embed);
    }
    else
    {
      let num = Math.floor(parseInt(args[1]));
      if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
      if(num <= 0) return message.reply("請輸入正整數。");
      
      if(energy[id].energy < num) return message.reply("艦長的體力似乎不夠呢。");
           
      energy[id].energy -= num;
      fs.writeFileSync("./energy.json",JSON.stringify(energy));
           
      let lv = weapons[id].status.lv;
      var rand = Math.floor(Math.random()*1000 + 1);
           
      let rr = lv/25;    
      
       embed = new Discord.RichEmbed()
      .setColor("#08192D")
      .setTitle("挖礦結果")
      .setThumbnail("https://i.imgur.com/JExq5Bg.png")
      
      if(rand < Math.floor(num + rr)) 
      {
        items[id].items["001"] += 1;
        embed.addField("發掘崩壞能","你獲得了崩壞碎片")
        fs.writeFileSync("./items.json",JSON.stringify(items));
      }
      
      let cc = (rand/50) + rr;
      if( cc > 20) cc = 20;
      crystals[id].crystals += Math.floor(num*cc);
      embed.addField("水晶礦產","你獲得了 " + Math.floor(num*cc) + "<:crystal:431483260468592641>");
      
      lvup(id,Math.floor(num/5 * (cc)));
      embed.addField("武器提升","你獲得了 " + Math.floor(num/5 * (cc)) + " 武器經驗");
      
      let crime_rand = Math.floor(Math.random()*10000 + 1);
      let crime_num = num;
      if (crime_num > 5000 ) crime_num = 5000; 
      
      if(crime_rand < crime_num) 
      {
        var val = Math.ceil((baillist[id].time)/10);
        if(items[id].items["005"] >= 1) 
          {
            items[id].items["005"] -= 1;
            val = Math.ceil(val*1.5);
          }
        embed.addField("誠心悔過","犯罪值降低了 " + val);
        if(baillist[id].time > 0) baillist[id].time -= val;
      }
      fs.writeFileSync("./items.json",JSON.stringify(items));
      fs.writeFileSync("./baillist.json",JSON.stringify(baillist));
      fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
      
      let ranking = message.guild.roles.find(role => role.name === "LV.20 女武神．強襲").position;
      if(!man.hoistRole) return message.channel.send(embed);
      if(man.hoistRole.position < ranking) return message.channel.send(embed);
      if(coinlist[id].ltd >= 2500) return message.channel.send(embed);
      if(coinlist[id].now > 99) return message.channel.send(embed);
      let mulp = coinlist[id].now*coinlist[id].now;
      if (mulp > 5000) mulp = 5000;
      let coin_rand = Math.floor(Math.random()*100*mulp + 1)
      if((coinlist[id].ltd + num) > 2500) num = 2500 - coinlist[id].ltd;
      if( num > mulp) num = mulp;
      let coin_num = num*100;
      coinlist[id].ltd += num;
      if( coin_rand <= coin_num)
        {
          items[id].items["006"] += 1;
          embed.addField("代幣挖掘","你獲得了 1 枚特特幣");
          coinlist[id].now += 1;
          fs.writeFileSync("./coinlist.json",JSON.stringify(coinlist));
        }
      
      return message.channel.send(embed);
    }
    
}

module.exports.help = {
    name: "mine"
}