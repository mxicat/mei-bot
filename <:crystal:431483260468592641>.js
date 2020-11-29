const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const items = require("./items.json");
const energy = require("./energy.json");
const rolelist = require("./rolelist.json");
const coinlist = require("./coinlist.json");
const vlkys = require("./vlkys.json");
const stars = require("./stars.json");
const duelcount = require("./duelcount.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    let man = message.guild.members.get(id);
    let now = new Date();
    let today = now.getDate();
    
    //if(man.roles.find(`name`,"bot") != null) return message.reply("機器人別鬧。");
    
   
    if(!energy[id])  energy[id] = {energy : 10};
    if(!items[id])  items[id] = {items : {"000":0}};
    if(!coinlist[id]) { coinlist[id] = { now : 1 , ltd: 0}}
  
    if(!bankfile[id]){
        bankfile[id] = { 
            savings: 0,
            loanings: 0
        }
       await fs.writeFileSync("./bankfile.json",JSON.stringify(bankfile));
      };
  
    function show_member_name(id)
    {
      if(message.channel.guild.members.get(id)) return message.channel.guild.members.get(id).displayName
      else return "查無此人"
    }
    
  
    if(args[1])
    {
      switch(args[1])
      {
        case "rank":
          var wealth = function(id) {
            if(id == "mei") return -100;
            if(bankfile[id]) return bankfile[id].savings - bankfile[id].loanings + crystals[id].crystals;
            else return crystals[id].crystals;
          }
          
          var rich = Object.keys(crystals).sort(
            function(a, b){
               return wealth(b) - wealth(a);
            });
        
           let em = new Discord.RichEmbed()
          .setColor("#DC9FB4")
          .setTitle("水晶排行榜")
          .addField("#1",show_member_name(rich[0]) + "   水晶資產： "+ wealth(rich[0]))
           .addField("#2",show_member_name(rich[1]) + "   水晶資產： "+ wealth(rich[1]))
           .addField("#3",show_member_name(rich[2]) + "   水晶資產： "+ wealth(rich[2]))
           .addField("#4",show_member_name(rich[3]) + "   水晶資產： "+ wealth(rich[3]))
           .addField("#5",show_member_name(rich[4]) + "   水晶資產： "+ wealth(rich[4]))
          .setThumbnail("https://i.imgur.com/tvAkopu.png");
          
          return message.channel.send(em);
          break;
      }  
    }
      
   
    let num = 1;
    if (man.roles.find(x => x.name === "LV.150 女武神．愛醬") != null) num = 150;
    if (man.roles.find(x => x.name === "LV.80 血色玫瑰") != null) num = 80;
    if (man.roles.find(x => x.name === "LV.76 次元邊界突破") != null) num = 76;
    if (man.roles.find(x => x.name === "LV.72 血騎士．月煌") != null) num = 72;
    if (man.roles.find(x => x.name === "LV.68 雷電女王的鬼鎧") != null) num = 68;
    if (man.roles.find(x => x.name === "LV.64 白騎士．月光") != null) num = 64;
    if (man.roles.find(x => x.name === "LV.60 異度黑核侵蝕") != null) num = 60;
    if (man.roles.find(x => x.name === "LV.56 銀狼的黎明") != null) num = 56;
    if (man.roles.find(x => x.name === "LV.52 女武神．凱旋") != null) num = 52;
    if (man.roles.find(x => x.name === "LV.48 雪地狙擊") != null) num = 48;
    if (man.roles.find(x => x.name === "LV.44 影舞衝擊") != null) num = 44;
    if (man.roles.find(x => x.name === "LV.40 聖女祈禱") != null) num = 40;
    if (man.roles.find(x => x.name === "LV.35 融核裝．深紅") != null) num = 35;
    if (man.roles.find(x => x.name === "LV.30 驅動裝．山吹") != null) num = 30;
    if (man.roles.find(x => x.name === "LV.25 女武神．遊俠") != null) num = 25;
    if (man.roles.find(x => x.name === "LV.20 女武神．強襲") != null) num = 20;
    if (man.roles.find(x => x.name === "LV.15 戰場疾風") != null) num = 15;
    if (man.roles.find(x => x.name === "LV.10 女武神．戰車") != null) num = 10;
    if (man.roles.find(x => x.name === "LV.5 脈衝裝．緋紅") != null) num = 5;
    if (man.roles.find(x => x.name === "LV.1 領域裝．白練") != null) num = 1;
    
    var rand = Math.floor(Math.random() * num *2.5 + Math.ceil(num/1.5));
    if(rolelist[id].role) rand = Math.ceil(rand*1.2);
    if(man.roles.find(x => x.id === "586253482227400912")!= null) rand = rand *2;
   
    
    if(!crystals[id]){
        crystals[id] = { 
            Time: today,
            crystals: rand + 10
        };
        fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
        fs.writeFileSync("./energy.json",JSON.stringify(energy));
      
        let embed = new Discord.RichEmbed()
        .setColor("#DC9FB4")
        .addField("當前體力","當前體力: " + 10)
        .addField("每日水晶",`你獲得了 **${rand}** 顆水晶`)
        .addField(man.displayName,`水晶數量： **${crystals[id].crystals}**`)
        .setThumbnail("https://i.imgur.com/tvAkopu.png");
        return message.channel.send(embed);
    } 
      
    let embed = new Discord.RichEmbed()
    .setColor("#DC9FB4")
    .addField("當前體力",   energy[id].energy)
    .addField(man.displayName,`水晶數量： **${crystals[id].crystals}**`)
    .setThumbnail("https://i.imgur.com/tvAkopu.png");
  
    if(crystals[id].Time == today) return message.channel.send(embed);
  
   if(!Math.floor(Math.random()*25)) 
    {
      items[id].items["000"] ++ ;
      fs.writeFileSync("./items.json",JSON.stringify(items));
      message.channel.send("你幸運地獲得了一次殺海豹的機會。")
    }

  
    crystals[id] = { 
        Time: today,
        crystals: crystals[id].crystals + rand
    };

     embed = new Discord.RichEmbed()
      .setColor("#DC9FB4")
  
      let ee = Math.ceil(num*1.5);
      if(man.roles.find(x => x.id === "586253482227400912")!= null) ee = ee*2;
      if(rolelist[id].role) energy[id].energy += Math.ceil(ee*1.1);
      else energy[id].energy += ee;
      energy[id].energy = Math.ceil(energy[id].energy);
    
      embed.addField("當前體力",   energy[id].energy)
      .addField("每日水晶",`你獲得了 **${rand}** 顆水晶`)
      .setThumbnail("https://i.imgur.com/tvAkopu.png");
  
  
    if(bankfile[id].savings > 99) 
    {
      let profit = Math.floor(bankfile[id].savings*0.01);
      embed.addField("存款利息",`你獲得了 **${profit}** 顆水晶`);
      crystals[id].crystals = crystals[id].crystals + profit;
    }
    if(bankfile[id].loanings > 49) 
    {
      let profit = Math.floor(bankfile[id].loanings*0.02);
      embed.addField("貸款利息",`你支付了 **${profit}** 顆水晶`);
      crystals[id].crystals = crystals[id].crystals - profit;
      crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals + profit;
    }
    
    var ranking = 1;
    var mp = 0;
    for(var type of Object.keys(vlkys[id].rank))
    {
      if(type.startsWith("S")) mp = 3;
      else mp = 1;
      if(vlkys[id].rank[type] == "A") ranking += 1*mp;
      else if(vlkys[id].rank[type] == "S") ranking += 3*mp;
      else if(vlkys[id].rank[type] == "SS") ranking += 6*mp;
      else if(vlkys[id].rank[type] == "SSS") ranking += 10*mp;
      else if(vlkys[id].rank[type] == "EX") ranking += 16*mp;
    }
    rand = Math.floor(Math.random()*ranking + ranking);
    rand += Math.floor(Math.random()*11 + 10);
    if(man.roles.find(x => x.id === "586253482227400912")!= null) rand = Math.floor(rand*1.3);
    stars[id].stars += rand;
    embed.addField("每日星石",`你獲得了 **${rand}** 顆星石`)
    
    embed.addField(man.displayName,`水晶數量：**${crystals[id].crystals}** `);
  
    coinlist[id].ltd = 0; //reset ttc
    
    duelcount[id].pvp = 3;
  
    fs.writeFileSync("./duelcount.json",JSON.stringify(duelcount));
    fs.writeFileSync("./coinlist.json",JSON.stringify(coinlist));
    fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
    fs.writeFileSync("./energy.json",JSON.stringify(energy));
  
    return message.channel.send(embed);
}


module.exports.help = {
    name: "<:crystal:431483260468592641>"
}