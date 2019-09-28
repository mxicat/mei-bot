
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

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null) return message.channel.send("需要**GM**權限");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    if(args[1]) {
      var opid = args[1].slice(2,-1);
      if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
    else return message.channel.send("請指定對象。");
    let man = message.guild.members.get(id);
  let opponent = message.guild.members.get(opid);
  if(opid == id) return message.channel.send("艦長是想<:nuwa:401024381004021760>嗎");
  if(!points[opid]) return message.channel.send("對手尚未設定屬性點數。");
  
  //if(energy[id].energy < 5) return message.channel.send("體力不足(需求:5)。");
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
    player.flee = points[id].agi*3;
    player.agi = points[id].agi;
    if(player.flee > 51) player.flee = 51;
    
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
  
   let me = player(id);
   let mumi = player(opid);
   let me_hp = me.hp;
   let mumi_hp = mumi.hp;
   var win = 0;
   var lose = 0;
   var hs = 0;
   var array = [];
  
  if(!weapons[id].status.re)  weapons[id].status.re = 0;
  if(!weapons[opid].status.re)  weapons[opid].status.re = 0;
  
   let p1lv = sumpp(id) + me.lv + weapons[id].status.re;
   let p2lv = sumpp(opid) + mumi.lv + weapons[opid].status.re;
  
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
  
   embed.setTitle("Lv."+p1lv+" "+man.displayName+" V.S. "+"Lv."+p2lv+" "+ opponent.displayName).setColor("#BEC23F");
  
  function createmb (embed)
  {
    let eb = new Discord.RichEmbed();
    eb.setTitle(embed.title);
    eb.setDescription(embed.description);
    eb.setColor(embed.color);
    return eb;
  }
  
  //balance(me,mumi);

  var new_embed = embed;
  var msg = await message.channel.send(new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(opponent.displayName,mumi.hp+"/"+mumi_hp,true));
  
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

  var turn = 0;
  let ohp = 0;
  
  /*energy[id].energy -= 5;
  fs.writeFileSync("./energy.json",JSON.stringify(energy));*/
  
   while( me.hp > 0 && mumi.hp > 0)
   {
     if((turn == 0 && mumi.agi > me.agi) || turn > 0){
       ohp = me.hp;
       hs = mumi.hit(me);
       
       if(hs == "miss")
       {
         await sleep(1000);
         renew(array,"🔸" + opponent.displayName +" 的攻擊被迴避。");
         new_embed = createmb(embed);
         new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(opponent.displayName,mumi.hp+"/"+mumi_hp,true)
         msg.edit(new_embed.setDescription(display(array)));       
       }
       else if(hs == "crihit")
       {
         await sleep(1000);
         renew(array,"🔸" + opponent.displayName +" 的爆擊，造成 "+ (ohp - me.hp) +" 點傷害");
         new_embed = createmb(embed);
         new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(opponent.displayName,mumi.hp+"/"+mumi_hp,true)
         msg.edit(new_embed.setDescription(display(array)));   
       }
       else if(hs == "hit")
       {
         await sleep(1000);
         renew(array,"🔸" + opponent.displayName +" 的攻擊，造成 "+ (ohp - me.hp) +" 點傷害");
         new_embed = createmb(embed);
         new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(opponent.displayName,mumi.hp+"/"+mumi_hp,true)
         msg.edit(new_embed.setDescription(display(array)));   
       }
      else return console.log("BUG");
       
     }
       if(me.hp > 0){
         
       ohp = mumi.hp;
       hs = me.hit(mumi);
       
       if(hs == "miss")
       {
         await sleep(1000);
         renew(array,"🔹" + man.displayName +" 的攻擊被迴避。");
         new_embed = createmb(embed);
         new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(opponent.displayName,mumi.hp+"/"+mumi_hp,true)
         msg.edit(new_embed.setDescription(display(array)));   
       }
       else if(hs == "crihit")
       {
         await sleep(1000);
         renew(array,"🔹" + man.displayName +" 的爆擊，造成 "+ (ohp - mumi.hp) +" 點傷害");
         new_embed = createmb(embed);
         new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(opponent.displayName,mumi.hp+"/"+mumi_hp,true)
         msg.edit(new_embed.setDescription(display(array)));   
       }
       else if(hs == "hit")
       {
         await sleep(1000);
         renew(array,"🔹" + man.displayName +" 的攻擊，造成 "+ (ohp - mumi.hp) +" 點傷害");
         new_embed = createmb(embed);
         new_embed.addField(man.displayName,me.hp+"/"+me_hp,true).addField(opponent.displayName,mumi.hp+"/"+mumi_hp,true)
         msg.edit(new_embed.setDescription(display(array)));   
       }
      else return console.log("BUG");
       
      }
     turn += 1;
     if(turn > 20) return message.reply("決鬥中止。")
   }
    
  if(me.hp <= 0) lose = 1;
  else win = 1;
  
  if(win)
  {
    await sleep(1000);
    renew(array,"🏆" + man.displayName +" 獲勝");
    msg.edit(new_embed.setDescription(display(array)));
    
    /*var rew = p2lv/2;
    var rewrate = p1lv - p2lv;
    
    if(rewrate > 10) rewrate = 0.05;
    else if (rewrate > 0) rewrate = (10-rewrate)/10;
    else{
      rewrate *= -1;
      rewrate = (10 + rewrate)/10;
    } 
    
    let nn = Math.floor(rew*rewrate);
    if(nn < 10) nn = 10;
    if(nn > 50) nn = 50;
       
    crystals[id].crystals += nn;
    lvup(id, Math.floor(nn*1.5));
    
    fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
   message.reply("戰鬥結束，獲得 "+ nn +" <:crystal:431483260468592641>以及 "+ Math.floor(nn*1.5) +" 武器經驗。")*/
    return;
  }
  else if (lose)
  {
    await sleep(1000);
     renew(array,"🌶🐔" + man.displayName +" 被屌虐");
    msg.edit(new_embed.setDescription(display(array)));
   /* crystals[id].crystals += 10;
    lvup(id,15);
    fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
    message.reply("戰鬥結束，獲得 10 <:crystal:431483260468592641>以及 15 武器經驗。")*/
    return
  }
  return;
    
}

module.exports.help = {
    name: "fight"
}