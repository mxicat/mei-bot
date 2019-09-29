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
const vlkys = require("./vlkys.json");
const vlkylist = require("./vlkylist.json");
const duellist = require("./duellist.json");
const stars = require("./stars.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("需要**GM**權限");
    if((!message.channel.name.includes("女武神系統測試")) && (!message.channel.name.includes("賭場"))) return message.reply("需要**GM**權限。");
    if(args[1]) 
    {
      var opid = args[1].slice(2,-1);
      if(opid.startsWith("!")) opid = opid.slice(1);
    }    //id of first mentioned person
    else return message.channel.send("請指定對象。");
    let man = message.guild.members.get(id);
    let opponent = message.guild.members.get(opid);
    if(opid == id) return message.channel.send("錯誤的對象。");
    if(!(vlkys[id].set1[0] && vlkys[id].set1[1])) return message.reply("己方未設置出戰女武神。")
    if(!(vlkys[opid].set1[0] && vlkys[opid].set1[1])) return message.reply("對方未設置出戰女武神。")
    if(!duellist[id]) duellist[id] = { now:0, win:0, lose:0, elo:1000}
    if(duellist[id].now) return message.reply("尚有未結束之戰鬥。")
    var mp = 0;
    var embed = new Discord.RichEmbed();
  
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
  
    var player = function(id,type,position) 
    {
      var player = {};
      player.id = id;
      //player.name = vlkylist[type].name.slice(3)
      let emo = "";
      switch(type)
      {
        case"A0": emo = "琪亞娜"
        break;
        case "A1": emo = "芽衣"
        break;
        case "A2": emo = "姬子"
        break;
        case "A3": emo = "德麗莎"
        break;
        case "A4": emo = "八重櫻"
        break;
        case "A5": emo = "卡蓮"
        break;
        case "A6": emo = "符華"
        break;
        case "A7": emo = "麗塔"
        break;
        case "A8": emo = "莉莉婭"
        break;
        case "A9": emo = "希兒"
        break;
        case "S0": emo = "空律"
        break;
        case "S1": emo = "布洛尼亞"
        break;
        case "S2": emo = "蘿莎莉婭"
        break;
      }
      player.name = emo;
      player.position = position;
      if(position == "p1") player.aibo = "p2";
      else if(position == "p2") player.aibo = "p1";
      else if(position == "op1") player.aibo = "op2";
      else if(position == "op2") player.aibo = "op1";
      
      player.lv = vlkys[id].status.lv;
      player.type = type;
      if(vlkys[id].rank[type] == "A") mp = 0.9;
      if(vlkys[id].rank[type] == "S") mp = 1;
      if(vlkys[id].rank[type] == "SS") mp = 1.1;
      if(vlkys[id].rank[type] == "SSS") mp = 1.2;
      if(vlkys[id].rank[type] == "EX") mp = 1.3
      
      player.sp = 0;
      player.sp_up = 1;
      player.sp_gaining = 1;
      player.atk_up = 1;
      player.def_up = 1;
      player.cridmg_up = 0; //爆傷增幅 (+)
      player.maxhp_up = 1;
      player.cri_up = 0;   // 爆率增幅 (%數)
      player.burst = 0;
      
      player.count = 0; //自身buff
      
      player.status = { "faint":{last:0}, "ignite":{last:0, dot:0, source:0}, 
                       "impair":{last:0, percent:0}, "weaken":{last:0, percent:0}, 
                       "conductive":{last:0, percent:0}, "sakura":{time:0},
                       "judah":{last:0, dot:0}, "increase_atk":{last:0, num:0}, "increase_def":{last:0, num:0}
                      }
        
      player.base_maxhp = vlkylist[type].hp * player.lv * mp            //基礎值
      player.base_hp = vlkylist[type].hp * player.lv * mp
      player.base_atk = vlkylist[type].atk  * player.lv * mp
      player.base_cri =  (vlkylist[type].cri * player.lv / 5 * mp)
      player.base_def = vlkylist[type].def * player.lv * mp
      player.base_agi = vlkylist[type].agi * player.lv * mp
      player.base_maxsp = 1000;
      player.base_cridmg = 2;
      
      player.maxhp = vlkylist[type].hp * player.lv * mp               //浮動值-初始值
      player.hp = vlkylist[type].hp * player.lv * mp
      player.atk = vlkylist[type].atk  * player.lv * mp
      player.cri =  (vlkylist[type].cri * player.lv / 5 * mp)
      player.def = vlkylist[type].def * player.lv * mp
      player.agi = vlkylist[type].agi * player.lv * mp
      player.cridmg = 2;
      player.maxsp = 1000;
      
      player.hp_up = function(value)
      {
        player.hp *= 1 + value;
        return;
      }
      player.initialize = function(aibo,obj1,obj2)        // 初始化能力值 best_match、角色被動
      {
        if(player.type == "A0" && aibo.type == "A1")
        {
          player.hp_up(0.08);
          player.maxhp_up += 0.08;
          player.def_up += 0.08;
        }
        if(player.type == "A1" && aibo.type == "A0")
        {
          player.atk_up += 0.08;
        }
        
        return;
      }
      
      player.renew = function(aibo)    //每局開始重新計算數值
      {
        let passive_atk_up = 0;
        switch(player.type)  //角色特殊加成被動
        {
          case "A2":
            if(aibo.type == "A6" && aibo.hp < aibo.maxhp/3) passive_atk_up += 0.2;
          break;
        }
        player.maxhp = player.base_maxhp * player.maxhp_up;
        player.atk = player.base_atk * (player.atk_up + passive_atk_up)
        player.def = player.base_def * player.def_up
        player.cri = player.base_cri + player.cri_up
        player.cridmg = player.base_cridmg + player.cridmg_up;
        player.maxsp = player.base_maxsp * player.sp_up 
        player.sp_up = 1;
        if(player.sp > player.maxsp) player.sp = player.maxsp;
        if(player.hp > player.maxhp) player.hp = player.maxhp;
        return;
      }
      
      player.turn_end = function()   //回合結束
      {
        for(var status of Object.keys(player.status))
        {
          if(!player.status[status].last) continue;
          if(player.status[status].last > 0) player.status[status].last -= 1
        }
        return;
      }
      
      player.sp_gain = function(ratio)        //玩家gain sp
      {
          let rand = Math.floor(Math.random()*51 + 100);
          player.sp += rand * player.sp_gaining * ratio;
          if(player.sp > player.maxsp) player.sp = player.maxsp;
          return rand * player.sp_gaining * ratio;
      }
      
      player.hit = function(target,aibo,t2) //玩家行動
      {
        
        function attack(man, atk_rate, atk_name, atk_type)  //deal damage
        {
          if(man.hp <= 0) return "dead";
          let dmg = 0;
          let rand = Math.floor(Math.random()*10000 + 1); // 爆擊判定用
          if(atk_type == "normal") // 普通傷害
          {    
            dmg = player.atk * atk_rate;
            if(rand <= player.cri*100) 
            {
              dmg *= player.cridmg; // 有爆
              atk_name += "爆擊"
            }
            rand = Math.random()*0.2 + 0.8;
            dmg *= rand;
          }
          else  // 元素傷害
          {
            rand = Math.random()*0.2 + 0.8;
            dmg = player.atk * atk_rate * rand;
          }
          return man.on_hit(dmg, atk_type, atk_name, player);
        }
        
        function normal()
        {
          switch(player.type)
          {
            case "A0":
              attack(target, 1, "普攻", "normal");            
              if(player.count > 5) player.count = 0;  //Kiana-被動疊物傷
              else player.count += 1;
              player.atk_up += player.count *0.02;
              player.sp_gain(1);
              return;
            break;
              
            case "A1":         
              if(player.burst)
              {
                if(player.sp < 350) 
                {
                  player.burst = 0;
                  player.atk_up -= 0.5;
                  player.cri_up -= 50;
                  record += dis_player(player) + " 的爆發狀態解除。" + "\n";
                }
                else player.sp -= 350;
              }
              attack(target, 1, "普攻", "normal");            
              aibo.sp += player.sp_gain(1.3)           //武道分流
              return;
            break;
            
            case "A2":
              attack(target, 1, "普攻", "normal");
              player.sp_gain(1);
              if(player.hp > player.maxhp*0.05)
              {
                player.hp -= player.maxhp*0.05
                attack(target, 0.3, "黃昏焰刃", "fire");
              }
              return;
            break;
              
            case "A6":
              attack(target, 1, "普攻", "normal");
              player.sp_gain(1);
              player.hp += player.maxhp * 0.03;
              if(aibo.type == "A2" && aibo.hp < aibo.maxhp * 0.3)
              {
                player.hp += player.maxhp * 0.03;
              }
              if(player.hp > player.maxhp) player.hp = player.maxhp;
              return;
            break;
              
            default:
              attack(target, 1, "普攻", "normal");
              player.sp_gain(1);
              return;
            break;
          }
          return;
        }
        
        function ult()
        {
          if(player.type != "A1") player.sp -= 1000; //爆發狀態
          
          switch(player.type)
          {
            case "A0":  //kiana
              attack(target, 2, "虛界衝擊", "normal");
              attack(t2, 2, "虛界衝擊", "normal");
              if(player.count > 5) player.count = 0;  //Kiana-被動疊物傷
              else player.count += 1;
              player.atk_up += player.count *0.02;
              aibo.sp += 200;
            break;
            
            case "A1":  //Mei  建御雷
              if(player.burst == 0) 
              {  
                player.burst = 1
                player.atk_up += 0.5;
                player.cri_up += 50;
                record += dis_player(player) + " 開啟了爆發狀態。" + "\n";
              }
              else normal();
            break;
            
            case "A2":  //Himeko
              let p = target;
              if(attack(p, 2, "天燼劫炎", "fire") != "dead")
              {
                let rand = Math.floor(Math.random()*2);
                if(rand == 1) 
                {
                  p.status.ignite.dot = player.atk * 0.2;
                  p.status.ignite.last = 3;
                  p.status.ignite.source = player;
                  record += dis_player(p) + " 受到點燃，持續3回合。\n"
                }
              }
              
              p = t2;
              if(attack(p, 2, "天燼劫炎", "fire") != "dead")
              {
                let rand = Math.floor(Math.random()*2);
                if(rand == 1) 
                {
                  p.status.ignite.dot = player.atk * 0.2;
                  p.status.ignite.last = 3;
                  p.status.ignite.source = player;
                  record += dis_player(p) + " 受到點燃，持續3回合。\n"
                }
              }
            break;
            
             
            case "A6":
              if( attack(target, 3, "寸勁．開天", "normal") == "dead") return;
              let rand = Math.floor(Math.random()*5);
              if(rand == 1)
              {
                target.status.faint.last = 1;
                record += dis_player(target) + " 受到暈眩，暫停一回合。\n"
              }
            break;
              
            default:
              return;
            break;
          }
          return;
        }
        
        if(player.sp >= 1000) ult();      // 尻大招
        else normal();                      //普攻
      }    
        
      player.on_hit = function(dmg, atk_type, atk_name, source) //玩家被打
      {
        if(player.hp <= 0) return "dead";
        let damage = function()
        {
          if(atk_type == "normal") dmg -= player.def;
          if(dmg < 1) dmg = 1;
          player.hp -= dmg;
          player.sp += dmg/player.maxhp * 1500;      //受傷回能
          return;
        }
        switch(player.type)
        {
          case "A5":
            if(atk_type != "normal") dmg = 0   
          break;
        }
        damage();
        let emoji = "🗡";
        let emoji1 = "🔻";
        if(!atk_name.includes("普攻")) emoji = "💠";
        if(atk_name.includes("爆擊")) 
        {
          emoji = "💥";
          if(atk_name == "普攻爆擊") atk_name = "爆擊";
          else atk_name = atk_name.slice(0,-2);
        }
        if(atk_type == "fire") emoji1 = "🔥";
        if(atk_type == "thunder") emoji1 = "⚡";
        if(atk_type == "ice") emoji1 = "❄";
        record += dis_player(source)  + emoji + "【"+ atk_name + "】" + player.name + emoji1 + Math.floor(dmg) + "\n";
        if(player.hp <= 0) return "dead";
        else return "hit";
      }
      return player;
    }
  
    var p1 = player(id,vlkys[id].set1[0],"p1");
    var p2 = player(id,vlkys[id].set1[1],"p2");
    var op1 = player(opid,vlkys[opid].set1[0],"op1");
    var op2 = player(opid,vlkys[opid].set1[1],"op2");
    p1.initialize(p2,op1,op2);
    p2.initialize(p1,op1,op2);
    op1.initialize(op2,p1,p2);
    op2.initialize(op1,p1,p2);
  
    var tp = 0;    //this player
    var array = []
    var i = 0;
    var seq = [];
    var record = "";
    var state = "fighting";
    var turn = 0;
    var time_wait = 1750;
  
    function embed_renew ()
    {
      embed = new Discord.RichEmbed();
      function show_hp(player)
      {
        if(player.hp < 0) return 0;
        else return player.hp
      }
      function show_sp(player)
      {
        if(player.sp > player.maxsp) return player.maxsp;
        else return player.sp
      }
      function show_heart(player)
      {
        let num = Math.ceil((player.hp / player.maxhp)/0.2);
        let str = "";
        for(var j = 0 ; j < num ; j++) str += "◽";
        for(var j = 0 ; j < 5 - num ; j++) str += "◾";
        return str;
      }
      function show_star(player)
      {
        let num = Math.floor((player.sp / player.maxsp)/0.2);
        let str = "";
        for(var j = 0 ; j < num ; j++) str += "🍵";
        if(str.length > 5) str = "🍵🍵🍵🍵🍵"
        return str;
      }
      function show_status(player)
      {
        let emoji = 0;
        for(var status of Object.keys(player.status))
        {
          if(!player.status[status].last) continue;
          if(player.status[status].last > 0)
          {
            switch(status)
            {
              case "ignite":  emoji += "🔥";  break;
              case "faint":  emoji += "✨";  break;
              case "impair":  emoji += "⏬";  break;
              case "weaken":  emoji += "😰";  break;
              case "conductive":  emoji += "🌩";  break;
              case "sakura":  if(player.status[status].last >= 3) emoji += "🌸";  break;
              case "increase_atk": emoji += "⚔"; break;
              case "increase_def": emoji += "🛡"; break;
            }
          }
        }
        return emoji;
      }
      embed.setTitle("Lv."+p1.lv+" "+man.displayName+" V.S. "+"Lv."+op1.lv+" "+ opponent.displayName).setColor("#00c5a3");
      embed.addField(dis_player(p1)+show_status(p1), Math.ceil(show_hp(p1))+"/"+Math.floor(p1.maxhp)+" "+ show_heart(p1) + "\n"+Math.floor(show_sp(p1))+"/"+Math.floor(op2.maxsp) +" "+ show_star(p1),true)
           .addField(dis_player(p2+show_status(p2)), Math.ceil(show_hp(p2))+"/"+Math.floor(p2.maxhp)+" "+ show_heart(p2) +"\n"+Math.floor(show_sp(p2))+"/"+Math.floor(op2.maxsp)+" "+ show_star(p2),true)
           .addField(dis_player(op1)+show_status(op1), Math.ceil(show_hp(op1))+"/"+Math.floor(op1.maxhp)+" "+ show_heart(op1) +"\n"+Math.floor(show_sp(op1))+"/"+Math.floor(op2.maxsp)+" "+ show_star(op1),true)
           .addField(dis_player(op2)+show_status(op2), Math.ceil(show_hp(op2))+"/"+Math.floor(op2.maxhp)+" "+ show_heart(op2) +"\n"+Math.floor(show_sp(op2))+"/"+Math.floor(op2.maxsp)+" "+ show_star(op2),true)
      embed.setDescription(record)
      return embed;
    }

    function player_obj(string)
    {
      if(string == "p1") return p1;
      if(string == "p2") return p2;
      if(string == "op1") return op1;
      if(string == "op2") return op2;
      else return "string error"
    }

    function op2_obj(string)
    {
      if(string == "p1") return p2;
      if(string == "p2") return p1;
      if(string == "op1") return op2;
      if(string == "op2") return op1;
    }

    function dis_player(obj)
    {
      if(obj.position == "p1") return "🔹" + obj.name;
      if(obj.position == "p2") return "🔹" + obj.name;
      if(obj.position == "op1") return "🔸" + obj.name;
      if(obj.position == "op2") return "🔸" + obj.name;
    }

    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }
    
    function renew_all()
    {
      p1.renew(p2);
      p2.renew(p1);
      op1.renew(op2);
      op2.renew(op1);
      return;
    }
  
    function find_target(player)
    {
      if(player.position == "p1")
      {
        if(op1.hp > 0) return op1;
        else return op2;
      }
      if(player.position == "p2")
      {
        if(op2.hp > 0) return op2;
        else return op1;
      }
      if(player.position == "op1")
      {
        if(p1.hp > 0) return p1;
        else return p2;
      }
      if(player.position == "op2")
      {
        if(p2.hp > 0) return p2;
        else return p1;
      }
      else return "finding error"
    }
    
    var msg = await message.channel.send(embed_renew()); //丟初始訊息
    seq.push(p1)  // 初始化對戰序列
    seq.push(p2)
    seq.push(op1)
    seq.push(op2)
    seq.sort(function(a, b){return b.agi - a.agi});
  
    while(state == "fighting")   //正式開打
    {
       duellist[id].now = 1;
       fs.writeFileSync("./duellist.json",JSON.stringify(duellist));
       if(turn >= seq.length) turn = 0
       tp = seq[turn]
       if(tp.hp <= 0) 
       {
         turn ++;
         continue;
       }
       renew_all();   // 回合開始更新
      
       if(tp.status.faint.last > 0)
       {
         tp.status.faint.last --
         record += dis_player(tp) + " 遭到暈眩，回合暫停。\n"
         turn ++;
         continue;
       }
       let target = find_target(tp);
       tp.hit(target, player_obj(tp.aibo), player_obj(target.aibo));
       tp.turn_end();
       for(i = 0 ; i < seq.length ; i++ )  //死者取消行動
       {
         if(seq[i].hp <= 0)
         {
           seq.splice(i,1);
           i--;
         }
       }
       if(seq.length == 0) state = "even";
       if(!seq.find(x => x == op1) && !seq.find(x => x == op2)) state = "win";
       if(!seq.find(x => x == p1) && !seq.find(x => x == p2)) state = "lose";
      
       if(tp.status.ignite.last && state == "fighting")  tp.on_hit(tp.status.ignite.dot, "fire", "點燃", tp.status.ignite.source)
      
       await sleep(time_wait);
       msg.edit(embed_renew());
       
       turn += 1
    }
  
    duellist[id].now = 0;
    fs.writeFileSync("./duellist.json",JSON.stringify(duellist));

    if(state == "win")
    {
      await sleep(time_wait);
      record += "🏆 " + man.displayName + " 獲勝。";
      msg.edit(embed_renew());
      return;
    }
    else if(state == "lose")
    {
       await sleep(time_wait);
       record += "🌶🐔 " + man.displayName + " 被屌虐。"
       msg.edit(embed_renew());
      return
    }
    else if(state == "even")
    {
       await sleep(time_wait);
       record += "雙方平手。"
       msg.edit(embed_renew());
      return
    }
    return;
    
}

module.exports.help = {
    name: "duel"
}