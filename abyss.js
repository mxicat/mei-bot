
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const points = require("./points.json");
const boss = require("./boss.json");
const abysslog = require("./abysslog.json");


module.exports.run = async(bot, message, args) =>{
   var id = message.author.id;
  
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null) return message.channel.send("需要**GM**權限");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
  
  let guild = message.guild;
  
  let embed = new Discord.RichEmbed();
  
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
  
  let player = function(id) {
    var player = {};
    player.id = id;
    
    let lv = weapons[id].status.lv;
    
    player.lv = lv;
    
    let re = 0;
    if(weapons[id].status.re) re = weapons[id].status.re;
    let nw = weaponlist[weapons[id].status.now];
    if(nw.name.startsWith("B") && lv > 25) lv = 25;
    if(nw.name.startsWith("A") && lv > 35) lv = 35;
          
    let atk = Math.ceil((nw.atk*(lv/nw.maxlv) + 5 * re )*(1 + 0.01*re));
    let cri = Math.ceil(nw.cri*(lv/nw.maxlv));
    
    player.hp = 100 + points[id].vit*10;
    player.atk = Math.floor((atk + points[id].str*5));
    player.cri =  Math.floor(cri/2 + points[id].luk*2)
    player.def = points[id].vit*2;
    player.flee = points[id].agi*3
    if(player.flee > 30) player.flee = 30;
    
    player.hit = function (op){
      var miss = Math.floor(Math.random()*99 +1);
      
      if(miss <= op.flee) return "miss";
      let dmg = 0;
      var rand = Math.floor(Math.random()*99 +1);
      var chit = 1;
      if(rand <= player.cri) 
      {
        rand = Math.random()*0.4 + 0.6;
        chit = 1.5;
        dmg = Math.floor(((player.atk)*(chit + 0.01 * points[id].luk)- op.def/2)*rand );
      }
      else
      {
        rand = Math.random()*0.4 + 0.6;
        dmg = Math.floor(((player.atk)*(chit + 0.01 * points[id].luk) - op.def)*rand);
      }
      
      
      
      if(dmg < 10) dmg = 10;
      op.hp -= dmg;
      if(chit > 1) return "crihit";
      else return "hit";
    };

    return player;
}
  
  
  let cboss = function(lv) {
    
    let nn = 0;
    if(lv > 11) nn = lv - 11*Math.floor(lv/11); else nn = lv;
    if (!nn) nn = 11;
    let mag = Math.floor(lv/11) + 1;
    
    let num =''+ nn;
    var cboss = {};
    cboss.name = boss[num].name;
    
    let re = 0;
          
    let atk = 0;
    let cri = 0;
    
    cboss.hp = 100 + boss[num].vit*10*mag;
    cboss.atk = boss[num].str*5*mag;
    cboss.cri =  boss[num].luk*2*mag;
    cboss.def = boss[num].vit*2*mag;
    cboss.flee = boss[num].agi*3*mag;
    if(cboss.flee > 30) cboss.flee = 30;
    
    cboss.hit = function (op){
      var miss = Math.floor(Math.random()*99 +1);
      
      if(miss <= op.flee) return "miss";
      let dmg = 0;
      var rand = Math.floor(Math.random()*99 +1);
      var chit = 1;
      if(rand <= cboss.cri) 
      {
        rand = Math.random()*0.4 + 0.6;
        chit = 1.5;
        dmg = Math.floor(((cboss.atk)*(chit + 0.01 * boss[num].luk*mag)- op.def/2)*rand );
      }
      else
      {
        rand = Math.random()*0.4 + 0.6;
        dmg = Math.floor(((cboss.atk)*(chit + 0.01 * boss[num].luk*mag) - op.def)*rand);
      }
      
      if(dmg < 10) dmg = 10;
      op.hp -= dmg;
      if(chit > 1) return "crihit";
      else return "hit";
    };

    return cboss;
}
  
  function balance(p1,p2)
  {
    var b1,b2;
    b1 = p1.hp/(((p2.atk*(p2.cri/100)*(1.5 + 0.05 * points[p2.id].luk) + p2.atk*(1 - p2.cri/100))- p1.def)*(1-p1.flee/100));
    b2 = p2.hp/(((p1.atk*(p1.cri/100)*(1.5 + 0.05 * points[p1.id].luk) + p1.atk*(1 - p1.cri/100))- p2.def)*(1-p2.flee/100));
    if(p1.flee >= p2.flee) b1 += 1;
    else b2 += 1;
    
    message.channel.send("P1的平衡值是" + b1);
    message.channel.send("P2的平衡值是" + b2);
    return;
  }
  
  
   function sumpp(id) {return points[id].str + points[id].agi + points[id].vit + points[id].luk;}
  
      function renew(array,des)
  {
    if(!array[0]) return array[0] = des;
    else if(!array[1]) return array[1] = des;
    else if(!array[2]) return array[2] = des;
    else
    {
      array[0] = array[1];
      array[1] = array[2];
      array[2] = des;
      return;
    }
  }
  
  function display(array)
  {
    var des = "";
    for(var c of array)
      des = des + c + "\n";
    return des;
  }
  
    function createmb (embed)
  {
    let eb = new Discord.RichEmbed();
    eb.setTitle(embed.title);
    eb.setDescription(embed.description);
    eb.setColor(embed.color);
    return eb;
  }
  
  function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
  

    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#C99833")
      .setTitle("無限深淵")
      .addField("目前層數","輸入 **abyss info**")
      .addField("挑戰深淵","輸入 **abyss in**")
      .addField("重置戰鬥","輸入 **abyss reset**")
      .addField("查看排名","輸入 **abyss rank**")
      .setThumbnail("https://i.imgur.com/OchJmVq.png");
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
      {
        case "info":
          
          let lv = abysslog[id].level + 1;
           let nn = 0;
          if(lv > 11) nn = lv - 11*Math.floor(lv/11); else nn = lv;
            if (!nn) nn = 11;
          
          embed = new Discord.RichEmbed()
          .setColor("#C99833")
          .addField("目前層數",`${abysslog[id].level}`)
          .addField("下層BOSS",boss[''+nn].name)
          .setThumbnail("https://i.imgur.com/OchJmVq.png");
          return message.channel.send(embed);
          break;
       
          
        case "rank":
          
          var rich = Object.keys(abysslog).sort(
            function(a, b){
               return abysslog[b].level - abysslog[a].level;
            });
            
           let em = new Discord.RichEmbed()
          .setColor("#DC9FB4")
          .setTitle("深淵排行榜")
          .addField("#1",message.guild.members.get(rich[0]).displayName + "   最高層數： "+ abysslog[rich[0]].level)
           .addField("#2",message.guild.members.get(rich[1]).displayName + "   最高層數： "+ abysslog[rich[1]].level)
           .addField("#3",message.guild.members.get(rich[2]).displayName + "   最高層數： "+ abysslog[rich[2]].level)
           .addField("#4",message.guild.members.get(rich[3]).displayName + "   最高層數： "+ abysslog[rich[3]].level)
           .addField("#5",message.guild.members.get(rich[4]).displayName + "   最高層數： "+ abysslog[rich[4]].level)
          
          return message.channel.send(em);
          break;
          
        case "reset":
          abysslog[id].now = 0;
          fs.writeFileSync("./abysslog.json",JSON.stringify(abysslog));
          message.reply("重置完成。")
        break;
          
        case "in":
          
          if(energy[id].energy < 10) return message.reply("體力不足，需求：10");
          if(abysslog[id].now) return message.reply("請等待當前戰鬥結束");
            
           let nextlv = abysslog[id].level + 1;
           abysslog[id].now = 1; 
           await fs.writeFileSync("./abysslog.json",JSON.stringify(abysslog));
          
           let me = player(id);
           let bb = cboss(nextlv);
           let me_hp = me.hp;
           let bb_hp = bb.hp;
           var win = 0;
           var lose = 0;
           var hs = 0;
           var array = [];
           let man = message.guild.members.get(id);

           if(!weapons[id].status.re)  weapons[id].status.re = 0;
           let p1lv = sumpp(id) + me.lv + weapons[id].status.re;

           embed.setTitle("Lv."+p1lv+" "+man.displayName+" V.S. "+"第 "+ nextlv +" 層 "+ bb.name).setColor("#BEC23F");


           var new_embed = embed;
           var msg = await message.channel.send(new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(bb.name,bb.hp+"/"+bb_hp,true));

           var turn = 0;
           let ohp = 0;


           while( me.hp > 0 && bb.hp > 0)
           {
             if((turn == 0 && bb.flee > me.flee) || turn > 0){
               ohp = me.hp;
               hs = bb.hit(me);

               if(hs == "miss")
               {
                 await sleep(1000);
                 renew(array,"🔸" + bb.name +" 的攻擊被迴避。");
                 new_embed = createmb(embed);
                 new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(bb.name,bb.hp+"/"+bb_hp,true)
                 msg.edit(new_embed.setDescription(display(array)));       
               }
               else if(hs == "crihit")
               {
                 await sleep(1000);
                 renew(array,"🔸" + bb.name +" 的爆擊，造成 "+ (ohp - me.hp) +" 點傷害");
                 new_embed = createmb(embed);
                 new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(bb.name,bb.hp+"/"+bb_hp,true)
                 msg.edit(new_embed.setDescription(display(array)));   
               }
               else if(hs == "hit")
               {
                 await sleep(1000);
                 renew(array,"🔸" + bb.name +" 的攻擊，造成 "+ (ohp - me.hp) +" 點傷害");
                 new_embed = createmb(embed);
                 new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(bb.name,bb.hp+"/"+bb_hp,true)
                 msg.edit(new_embed.setDescription(display(array)));   
               }
              else return console.log("BUG");

             }
               if(me.hp > 0){

               ohp = bb.hp;
               hs = me.hit(bb);

               if(hs == "miss")
               {
                 await sleep(1000);
                 renew(array,"🔹" + man.displayName +" 的攻擊被迴避。");
                 new_embed = createmb(embed);
                 new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(bb.name,bb.hp+"/"+bb_hp,true)
                 msg.edit(new_embed.setDescription(display(array)));   
               }
               else if(hs == "crihit")
               {
                 await sleep(1000);
                 renew(array,"🔹" + man.displayName +" 的爆擊，造成 "+ (ohp - bb.hp) +" 點傷害");
                 new_embed = createmb(embed);
                 new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(bb.name,bb.hp+"/"+bb_hp,true)
                 msg.edit(new_embed.setDescription(display(array)));   
               }
               else if(hs == "hit")
               {
                 await sleep(1000);
                 renew(array,"🔹" + man.displayName +" 的攻擊，造成 "+ (ohp - bb.hp) +" 點傷害");
                 new_embed = createmb(embed);
                 new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(bb.name,bb.hp+"/"+bb_hp,true)
                 msg.edit(new_embed.setDescription(display(array)));   
               }
              else return console.log("BUG");

              }
             turn += 1;
             if(turn > 20) return message.reply("決鬥中止。")
           }

          if(me.hp <= 0) lose = 1;
          else win = 1;
          
          let rw = Math.floor(0.1*nextlv * nextlv + 5*nextlv + 10);

          if(win)
          {
            await sleep(1000);
            renew(array,"🏆 " + man.displayName +" 獲勝");
            msg.edit(new_embed.setDescription(display(array)));
            
            lvup(id, rw);
            energy[id].energy -= 10;
            abysslog[id].now = 0;
            abysslog[id].level += 1;
            
            fs.writeFileSync("./energy.json",JSON.stringify(energy));
            fs.writeFileSync("./abysslog.json",JSON.stringify(abysslog));
            
            message.reply("戰鬥勝利，獲得 "+ rw +" 武器經驗。")
            return;
          }
          else if (lose)
          {
            await sleep(1000);
             renew(array,"🌶🐔 " + man.displayName +" 被屌虐");
            msg.edit(new_embed.setDescription(display(array)));
            
    
            lvup(id, rw);
            energy[id].energy -= 10;
            abysslog[id].now = 0;
            
           
            fs.writeFileSync("./energy.json",JSON.stringify(energy));
            fs.writeFileSync("./abysslog.json",JSON.stringify(abysslog));
            
            message.reply("戰鬥失敗，獲得 "+ rw +" 武器經驗。")
            return
          }  
  
          
          break;
      }
    }
  
  
  return;
    
}

module.exports.help = {
    name: "abyss"
}