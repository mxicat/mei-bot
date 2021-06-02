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
const duelcount = require("./duelcount.json");
const stars = require("./stars.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("需要**GM**權限");
    if((!message.channel.name.includes("女武神系統測試")) && (!message.channel.name.includes("新指令"))) return message.reply("請至新指令頻道使用。");
    var man = message.guild.members.get(id);
    var opponent = 0;
    if(args[1] == "reset") 
    {
      duellist[id].now = 0;
      fs.writeFileSync("./duellist.json",JSON.stringify(duellist));
      return message.reply("戰鬥已重置");
    }
    else if(args[1] == "pve")
    {
      if(duelcount[id].pve < 1) return message.reply("本日已達次數限制。")
      var opid = "tower"
      opponent = message.guild.members.get("433287968292339722")
    }
    else if(args[1] == "info")
    {
      let em = new Discord.RichEmbed()
      let str = ""
      if(!duelcount[id].match.history) duelcount[id].match.history = []
      for(i = 0 ; i < duelcount[id].match.history.length ; i++)
      {
        str += duelcount[id].match.history[i]
        str += "\n"
      }
      em.setTitle(man.displayName + "：PVP紀錄")
      em.setDescription(str)
      em.addField("勝場/敗場", duellist[id].win + "/" + duellist[id].lose)
      return message.channel.send(em)
    }
    else if(args[1] == "pvp")
    {
      if(!duelcount[id].match) duelcount[id].match = {now:0, list:[], history:[]}
      function show_pvp(array)
      {
        let str = ""
        let em = new Discord.RichEmbed()
        em.setTitle(man.displayName + "的PVP選項")
        for(i = 0 ; i < array.length ; i++)
        {
          let p = message.guild.members.get(array[i])
          let p_name = ""
          if(p) p_name = p.displayName
          else p_name = "查無此人"
          str += show_rank(i+1) + "　" + p_name + "　等級：" + vlkys[array[i]].status.lv + "　積分：" + duellist[array[i]].elo + "\n" 
        }
        em.setDescription(str);
        return em;
      }
      if(!args[2] || !duelcount[id].match.now)
      {
        //if(duelcount[id].match.now) return message.channel.send(show_pvp(duelcount[id].match.list));
        if(!(vlkys[id].set1[0] && vlkys[id].set1[1])) return message.reply("未設置出戰女武神。")
        if(duelcount[id].pvp < 1) return message.reply("本日已達次數限制。")
        duelcount[id].match.list = new Array();
        duelcount[id].match.list = [];
        let person = 0;
        let list = new Array();
        list = [];
        for(person of Object.keys(duellist))
        {
          if((vlkys[person].set1[0] && vlkys[person].set1[1])) list.push(person)
        }
        list.sort(function(a,b){ return duellist[b].elo -  duellist[a].elo})
        let index = list.findIndex(x => x == id)
        if(index-3 >= 0) duelcount[id].match.list.push(list[index-3])
        if(index-2 >= 0) duelcount[id].match.list.push(list[index-2])
        if(index-1 >= 0) duelcount[id].match.list.push(list[index-1])
        if(list[index+1]) duelcount[id].match.list.push(list[index+1])
        if(list[index+2]) duelcount[id].match.list.push(list[index+2])
        
        duelcount[id].match.now = 1
        fs.writeFileSync("./duellist.json",JSON.stringify(duellist));
        fs.writeFileSync("./duelcount.json",JSON.stringify(duelcount));
        return message.channel.send(show_pvp(duelcount[id].match.list));
      }
      else
      {
        if(!duelcount[id].match.now) return message.reply("請先輸入 duel pvp 進行配對")
        let num = Math.floor(parseInt(args[2]));
        if(!Number.isInteger(num)) return message.reply("請輸入正確編號。");
        if(num <= 0) return message.reply("請輸入正確編號。");
        
        opid = duelcount[id].match.list[num-1]
        opponent = message.guild.members.get(opid);
        if(!opponent) return message.channel.send("錯誤的對象。")
        if(opid == id) return message.channel.send("錯誤的對象。");
      }      
    }
    else 
    {
      return message.reply("請輸入 duel pvp/pve，若欲進行單挑請使用duelt。")
      if(!(vlkys[id].set1[0] && vlkys[id].set1[1])) return message.reply("未設置出戰女武神。")
      if(duelcount[id].pvp < 1) return message.reply("本日已達次數限制。")
      if(args[1]) 
      {
        var opid = args[1].slice(2,-1);
        if(opid.startsWith("!")) opid = opid.slice(1);
      }    //id of first mentioned person
      else return message.channel.send("請指定對象。");
      opponent = message.guild.members.get(opid);
      if(!opponent) return message.channel.send("錯誤的對象。")
      if(opid == id) return message.channel.send("錯誤的對象。");
      
      if(!(vlkys[opid].set1[0] && vlkys[opid].set1[1])) return message.reply("對方未設置出戰女武神。")
    }
    
    if(!duellist[id]) duellist[id] = {now:0, win:0, lose:0, elo:1000, tower:1}
    if(duellist[id].now) return message.reply("尚有未結束之戰鬥。")
  
  //  變數表
    var mp = 0;
    var embed = new Discord.RichEmbed()
    var rand = 0;
    var tp = 0;    //this player
    var array = []
    var i = 0
    var seq = []
    var record = ""
    var state = "fighting"
    var turn = 0
    var time_wait = 1350
  
    function explist(lv)  // required exp for lv up
    {
      //if(lv >= 100) return "∞"
      return lv*lv*lv + 100*lv - 50
    }
   
    function tower_exp(lv)
    {
      return 2*(4*lv*lv + 80*lv - 40)
    }
    
    function lvup(id,exp)
    {
      //if(vlkys[id].status.lv >= 100) return;
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
  
    var player = function(uid,type,position) 
    {
      var player = {};
      player.id = uid;
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
        case "S0": emo = "西琳"
        break;
        case "S1": emo = "布洛尼亞"
        break;
        case "S2": emo = "蘿莎莉婭"
        break;
        case "bella": emo = "貝納勒斯"
        break;
      }
      player.name = emo;
      player.position = position;
      if(position == "p1") player.aibo = "p2";
      else if(position == "p2") player.aibo = "p1";
      else if(position == "op1") player.aibo = "op2";
      else if(position == "op2") player.aibo = "op1";
      player.aibo_obj = 0;
      
      player.lv = vlkys[uid].status.lv;
      player.type = type;
      if(vlkys[uid].rank[type] == "B") mp = 0.65
      else if(vlkys[uid].rank[type] == "A") mp = 0.8
      else if(vlkys[uid].rank[type] == "S") mp = 0.95
      else if(vlkys[uid].rank[type] == "SS") mp = 1.1
      else if(vlkys[uid].rank[type] == "SSS") mp = 1.25
      else if(vlkys[uid].rank[type] == "EX") mp = 1.4
      else mp = 1.1;
      
      let ml = 1
      if(vlkys[uid].favor[type]) ml += (vlkys[uid].favor[type]/10000)/10  // 好感度補償
      if(ml > 1.1) ml = 1.1
      //if(vlkys[id].marry[type] == 1) ml += 0.05;
      mp *= ml
      
      player.sp = 0;
      player.sp_up = 1;
      player.sp_gaining_up = 0;
      player.atk_up = 1;
      player.def_up = 1;
      player.cridmg_up = 0; //爆傷增幅 (+)
      player.maxhp_up = 1;
      player.cri_up = 0;   // 爆率增幅 (%數)
      player.burst = 0;
      player.heal_up = 1;
      player.defense = 0;
      
      player.count = 0; //自身buff
      
      player.status = { "faint":{last:0}, "ignite":{last:0, dot:0, source:0}, 
                       "impair":{last:0, percent:0}, "weaken":{last:0, percent:0}, 
                       "conductive":{last:0, percent:0}, "sakura":{count:0},
                       "increase_cri":{last:0, percent:0}, "increase_cridmg":{last:0, percent:0},
                       "increase_atk":{last:0, percent:0}, "increase_def":{last:0, percent:0},
                       "decrease_dmg":{last:0, percent:0}, "increase_sp_gaining":{last:0, percent:0}
                      }
        
      player.base_maxhp = vlkylist[type].hp * player.lv * mp            //基礎值
      player.base_hp = vlkylist[type].hp * player.lv * mp
      player.base_atk = vlkylist[type].atk  * player.lv * mp
      player.base_cri =  (vlkylist[type].cri * player.lv / 5 * mp)
      player.base_def = vlkylist[type].def * player.lv * mp
      player.base_agi = vlkylist[type].agi * player.lv * mp
      player.base_maxsp = 1000;
      player.base_cridmg = 2;
      player.base_sp_gaining = 1;
      
      player.maxhp = vlkylist[type].hp * player.lv * mp               //浮動值-初始值
      player.hp = vlkylist[type].hp * player.lv * mp
      player.atk = vlkylist[type].atk  * player.lv * mp
      player.cri =  (vlkylist[type].cri * player.lv / 5 * mp)
      player.def = vlkylist[type].def * player.lv * mp
      player.agi = vlkylist[type].agi * player.lv * mp
      player.cridmg = 2;
      player.maxsp = 1000;
      player.sp_gaining = 1;
      
      player.hp_up = function(value)
      {
        player.hp += value * player.heal_up;
        if(player.hp > player.maxhp) player.hp = player.maxhp
        return;
      }
      
      player.initialize = function(aibo,obj1,obj2)        // 初始化能力值 best_match、角色被動
      {
        if(player.type == "A0" && aibo.type == "A1")   //摯愛一生
        {
          player.maxhp_up += 0.08;
          player.maxhp = player.base_maxhp * player.maxhp_up;
          player.hp_up(player.hp * 0.08);
          player.def_up += 0.08;
        }
        if(player.type == "A1" && aibo.type == "A0")  //摯愛一生
        {
          player.atk_up += 0.08;
        }
        if(player.type == "A5" && aibo.type == "A4")  //櫻的飯糰
        {
          player.maxhp_up += 0.1;
          player.maxhp = player.base_maxhp * player.maxhp_up;
          player.hp_up(player.hp * 0.1);
          player.heal_up += 0.2;
        }
        if(player.type == "A7") player.sp_gaining_up += 0.5;  //雷影被動 
        if(player.type == "bella") player.sp_gaining_up += 0.3; //龍之血脈
        return;
      }
      
      player.renew = function(aibo)    //每局開始重新計算數值
      {
        let passive_atk_up = 0;
        switch(player.type)  //角色特殊加成被動
        {
          case "A0":
            passive_atk_up += 0.02 * player.count   //時縫疾行
          break;
            
          case "A2":   // 守護之決意
            if(aibo.type == "A6" && aibo.hp < aibo.maxhp/3) passive_atk_up += 0.2;
          break;
            
          case "A3":   // 誓約守護
            if(aibo.type == "A7" && aibo.hp < aibo.maxhp*0.4 && (!player.status["increase_def"].last)) 
            {
              player.increase_def(5,50);
              aibo.increase_def(5,50);
              record += dis_player(player) + "【誓約守護】發動🛡" + "\n";
            }
          break;
        }
        let n1 = 0;
        let n2 = 0;
        player.maxhp = player.base_maxhp * player.maxhp_up;
        if(player.status["increase_atk"].last) n1 = player.status["increase_atk"].percent/100
        else n1 = 0
        if(player.status["weaken"].last) n2 = player.status["weaken"].percent/100
        else n2 = 0
        player.atk = player.base_atk * (player.atk_up + passive_atk_up + n1 - n2)
        
        if(player.status["increase_def"].last) n1 = player.status["increase_def"].percent/100
        else n1 = 0
        player.def = player.base_def * (player.def_up + n1)
        
        if(player.status["increase_cri"].last) n1 = player.status["increase_cri"].percent
        else n1 = 0
        player.cri = player.base_cri + player.cri_up + n1
        
        if(player.status["increase_cridmg"].last) n1 = player.status["increase_cridmg"].percent/100
        else n1 = 0
        player.cridmg = player.base_cridmg + player.cridmg_up + n1
        
        if(player.status["increase_sp_gaining"].last) n1 = player.status["increase_sp_gaining"].percent/100
        else n1 = 0
        player.sp_gaining = player.base_sp_gaining + player.sp_gaining_up + n1

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
          rand = Math.floor(Math.random()*51 + 100);
          player.sp += rand * player.sp_gaining * ratio;
          if(player.sp > player.maxsp) player.sp = player.maxsp;
          return rand * player.sp_gaining * ratio;
      }
      
      player.hit = function(target,aibo,t2) //玩家行動
      {
        function normal()    // 普攻
        {
          switch(player.type)
          {
            case "A0":
              player.attack(target, 1, "普攻", "normal");            
              if(player.count > 5) player.count = 5;  //時縫疾行
              else player.count += 1;
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
                  record += dis_player(player) + " 的爆發狀態解除" + "\n";
                }
                else player.sp -= 350;
              }
              player.attack(target, 1, "普攻", "normal");            
              aibo.sp += player.sp_gain(1.3)           //武道分流
              return;
            break;
            
            case "A2":
              player.attack(target, 1, "普攻", "normal");
              player.sp_gain(1);
              if(player.hp > player.maxhp*0.05)
              {
                player.hp -= player.maxhp*0.05
                player.attack(target, 0.3, "黃昏焰刃", "fire");
              }
              return;
            break;
              
            case "A3":
              player.attack(target, 1, "普攻", "normal");
              player.sp_gain(1);
              rand = Math.floor(Math.random()*3);
              if(rand == 1)
              {
                player.attack(target, 1.2, "雷之矛", "thunder");
              }
              return;
            break;
              
             case "A4":  // 櫻之雪
              player.attack(target, 1, "普攻", "normal");
              if(aibo.type == "A5")
              {
                rand = Math.floor(Math.random()*2)
                if(rand) aibo.attack(target, 0.2, "猶大附加", "thunder");  // 猶大的祝福
              }  
              player.sp_gain(1);
              if(target.status.sakura.count >= 3)
              {
                player.attack(target, 2.5, "刃返", "normal");
                target.status.sakura.count = 0;
              }
              else
              {
                target.status.sakura.count ++
              }
              return;
            break; 
              
            case "A6":  // 玄武歸心
              player.attack(target, 1, "普攻", "normal");
              player.sp_gain(1);
              player.hp_up(player.maxhp * 0.03)
              if(aibo.type == "A2" && aibo.hp < aibo.maxhp * 0.3)
              {
                player.hp_up(player.maxhp * 0.03)
              }
              if(player.hp > player.maxhp) player.hp = player.maxhp;
              return;
            break;
              
            case "A7":  // 雷影
              player.attack(target,0.9, "普攻", "thunder");
              player.sp_gain(1);
              return;
            break;
            
            case "A8":
              if(!player.defense)  
              {
                player.attack(target, 1, "普攻", "normal");
                player.sp_gain(1);
              }
              else 
              {
                record += dis_player(player) + " 防禦姿態解除" + "\n"
                player.defense = 0;
                player.attack(target, 1, "普攻", "normal");
                player.sp_gain(1);
              }  
            break;
            
            case "A9":         // 暗影洪流  
              if(player.burst)
              {
                if(player.sp < 350) 
                {
                  player.burst = 0;
                  player.atk_up -= 0.3;
                  player.cri_up -= 20;
                  record += dis_player(player) + " 的暗影型態解除" + "\n";
                }
                else player.sp -= 350;
              }
              player.attack(target, 1, "普攻", "normal");            
              player.sp_gain(1);
              return;
            break;
            
            case "S0":
              if(aibo.hp <= 0 && !player.count)  
              {
                record += dis_player(player) + " 召喚了貝納勒斯🍭" + "\n"
                player.count ++
              }
              else 
              {
                player.attack(target, 1, "普攻", "normal"); //亞空之矛
                player.sp_gain(1);
                let n = target.sp*0.15
                target.sp -= n
                player.hp_up(n*player.atk/500);
              }
            break;
              
            case "S1":
              if(!player.burst)
              {
                player.attack(target, 0.5, "普攻", "normal");  
                player.attack(target, 0.5, "零式驅動", "ice");
                rand = Math.floor(Math.random()*4)
                if(rand == 1) target.weaken(3,20)
              }
              else
              {
                rand = Math.floor(Math.random()*4)
                if(rand == 1) target.weaken(3,20)
                player.attack(target, 0.9, "數據疾馳", "ice");
                rand = Math.floor(Math.random()*4)
                if(rand == 1) t2.weaken(3,20)
                player.attack(t2, 0.9, "數據疾馳", "ice");
              }           
              player.sp_gain(1);
              return;
            break;
              
            case "S2":
              player.attack(target, 0.5 + 0.1*(player.count), "普攻", "normal");
              player.attack(t2, 0.5 + 0.1*(player.count), "普攻", "normal");     //呼啦啦旋風
              player.sp_gain(1);
              if(player.count > 5) player.count = 5;  //被動疊物傷
              else player.count += 1;
              if(aibo.type == "A8")  //連攜攻擊
              {
                rand = Math.floor(Math.random()*2)
                if(rand)
                {
                  var r_string = aibo.attack(target, 0.5, "連攜攻擊", "normal")
                  if(r_string == "not alive") aibo.attack(t2, 0.5, "連攜攻擊", "normal")
                }
                else
                {
                  var r_string = aibo.attack(t2, 0.5, "連攜攻擊", "normal")
                  if(r_string == "not alive") aibo.attack(target, 0.5, "連攜攻擊", "normal")
                }
                aibo.sp += 60;
                player.sp += 60;   //默契強化
              }
            break;
          
            default:
              player.attack(target, 1, "普攻", "normal");
              player.sp_gain(1);
              return;
            break;
          }
          return;
        }
        
        function ult()       // 大招
        {
          if(player.type != "A1" && player.type != "A9") player.sp -= 1000; //爆發狀態
          
          switch(player.type)
          {
            case "A0":  //kiana
              player.attack(target, 2, "虛界衝擊", "normal");
              player.attack(t2, 2, "虛界衝擊", "normal");
              if(player.count > 5) player.count = 5;  //Kiana-被動疊物傷
              else player.count += 1;
              aibo.sp += 200;
            break;
            
            case "A1":  //Mei  建御雷
              if(player.burst == 0) 
              {  
                player.burst = 1
                player.atk_up += 0.5;
                player.cri_up += 50;
                record += dis_player(player) + " 開啟了爆發狀態🌟" + "\n";
              }
              else normal();
            break;
            
            case "A2":  //Himeko
              let p = target;
              if(player.attack(p, 2.3, "天燼劫炎", "fire") != "dead")
              {
                rand = Math.floor(Math.random()*2);
                if(rand == 1) 
                {
                  p.ignite(3,player.atk * 0.2,player)
                  record += dis_player(p) + " 受到點燃，持續3回合\n"
                }
              }
              
              p = t2;
              if(player.attack(p, 2.3, "天燼劫炎", "fire") != "dead")
              {
                rand = Math.floor(Math.random()*2);
                if(rand == 1) 
                {
                  p.ignite(3,player.atk * 0.2,player)
                  record += dis_player(p) + " 受到點燃，持續3回合\n"
                }
              }
            break;
            
            case "A3":  //kiana
              player.attack(target, 1.8, "聖槍投雷", "thunder");
              player.attack(t2, 1.8, "聖槍投雷", "thunder");
              target.impair(3,50);
              t2.impair(3,50);
            break;
            
            case "A4":  
              player.attack(target, 1.5, "櫻花散", "normal");
              player.attack(t2, 1.5, "櫻花散", "normal");
              player.increase_cri(3,20)
              //player.increase_cridmg(3,50)
            break;
            
            case "A5":  
              player.attack(target, 2.8, "星雲激流", "normal");
            break;
             
            case "A6":
              if( player.attack(target, 3, "寸勁．開天", "normal") == "dead") return;
              rand = Math.floor(Math.random()*5);
              if(rand == 1)
              {
                target.faint(1);
                record += dis_player(target) + " 受到暈眩，暫停一回合\n"
              }
            break;
              
            case "A7":
              if(target.status.conductive.last && t2.status.conductive.last)
              {
                player.attack(target, 1, "超限釋放", "thunder")
                player.attack(t2, 1, "超限釋放", "thunder")
              }
              else
              {
                target.conductive(3,60);
                t2.conductive(3,60);
                record += dis_player(player) + "【超導效應】敵方全體感電 60%，持續 3 回合" + "\n"
              }
              if(aibo.type == "A3" && aibo.hp > 0) aibo.hp_up(aibo.maxhp/10) //女僕的職責
            break;
            
            case "A8":
              player.defense = 1;
              record += dis_player(player) + " 進入防禦姿態🛡" + "\n"
            break;
            
            case "A9":  // 暗影洪流
              if(player.burst == 0) 
              {  
                player.burst = 1
                player.atk_up += 0.3;
                player.cri_up += 20;
                record += dis_player(player) + " 進入暗影型態👻" + "\n";
                if(aibo.type == "S1") aibo.decrease_dmg(3,10); //幻海夢蝶
              }
              else normal();
            break;
            
            case "S0":  
              if(aibo.hp <= 0 && !player.count)  
              {
                player.sp += 1000
                record += dis_player(player) + " 召喚了貝納勒斯🍭" + "\n"
                player.count ++
              }
              else
              {
                player.attack(target, 2.5, "虛界降臨", "normal");
                player.attack(t2, 2.5, "虛界降臨", "normal");
                player.attack(aibo, 2.5, "虛界降臨", "normal");
                player.increase_atk(3,15)
              }
            break;
              
            case "S1":  // 暗影洪流
              if(player.burst == 0) 
              {  
                player.burst = 1
                player.attack(target, 2, "天使重構", "ice")
                player.attack(t2, 2, "天使重構", "ice")
                record += dis_player(player) + " 進入騎乘模式🏍" + "\n";
                if(aibo.type == "A9") aibo.increase_sp_gaining(3,60);
              }
              else normal();
            break;
              
            case "S2":
              player.attack(target, 1.6, "閃亮亮必殺", "normal");
              player.attack(t2, 1.6, "閃亮亮必殺", "normal");
              player.decrease_dmg(3, 20)
              aibo.decrease_dmg(3, 20)
            break; 
            
            case "bella":
              rand = Math.floor(Math.random()*3)
              var element = 0; 
              if(rand == 0) element = "fire"
              else if(rand == 1) element = "thunder"
              else if(rand == 2) element = "ice"
              player.attack(target, 3, "龍之吐息", element);
              player.attack(t2, 3, "龍之吐息", element);
              target.impair(3, 50)
              t2.impair(3, 50)
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
      
      player.attack = function(man, atk_rate, atk_name, atk_type)  //deal damage
      {
        if(man.hp <= 0) return "not alive";
        let dmg = 0;
        rand = Math.floor(Math.random()*10000 + 1); // 爆擊判定用
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
      
      player.on_hit = function(dmg, atk_type, atk_name, source) //玩家被打
      {
        if(player.hp <= 0) return "not hit";
        let damage = function()
        {
          if(atk_type == "normal") dmg -= player.def;
          if(atk_type == "thunder" && player.status["conductive"].last) dmg *= (1 + player.status["conductive"].percent/100)
          if(dmg < 1) dmg = 1;
          player.hp -= dmg;
          let sp_gain = dmg/player.maxhp * 1500 * player.sp_gaining
          switch(player.type)
          {
            case "A3":
              if(player.aibo_obj.type == "A7") player.aibo_obj.sp += sp_gain/3;
            break;
          }
          player.sp += sp_gain     //受傷回能
          if(atk_name.includes("星雲激流")) source.hp_up(dmg*0.2)
          return;
        }
        
        switch(player.type)
        {
          case "bella":  // 龍之血脈
            if(atk_type == "normal") dmg *= 0.5   
          break;
            
          case "A5":  // 星光賜福
            if(atk_type != "normal") dmg *= 0.5   
          break;
          
          case "A8":  // 防禦反擊
            if(atk_name.includes("點燃")) break;
            if(player.defense)
            {
              player.attack(source, 2.7, "防禦反擊", "normal")
              player.increase_cri(3,25)
              player.aibo_obj.increase_cri(3,25)
              player.defense = 0;
              return "hit";
              break;
            }
          break;
            
          case "A9":  // 量子身軀
            rand = Math.floor(Math.random()*100 + 1)
            let num = 15;
            if(player.burst) num = 30
            if(rand <= num)
            {
              record += dis_player(source) + "【"+ atk_name + "】受到閃避" + "\n";
              return;
            } 
          break       
        }
        if(player.status["decrease_dmg"].last) dmg *= 1 - player.status["decrease_dmg"].percent/100;
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
      
      ///////////////人物狀態更改//////////////
      player.impair = function(last,percent) // 降防
      {
        player.status["impair"].last = last;
        player.status["impair"].percent = percent;
        return;
      }
      
      player.ignite = function(last,dot,source)    //點燃
      {
        player.status["ignite"].last = last;
        player.status["ignite"].dot = dot;
        player.status["ignite"].source = source;
        return;
      }
      
      player.faint = function(last)    //暈眩
      {
        player.status["faint"].last = last;
        return;
      }
      
      player.conductive = function(last,percent)    //感電
      {
        player.status["conductive"].last = last;
        player.status["conductive"].percent = percent;
        return;
      }
      
      player.weaken = function(last,percent)    //虛弱
      {
        player.status["weaken"].last = last;
        player.status["weaken"].percent = percent;
        return;
      }
      
      player.increase_atk = function(last,percent)    //ATK up
      {
        player.status["increase_atk"].last = last;
        player.status["increase_atk"].percent = percent;
        return;
      }
      
      player.increase_def = function(last,percent)    //DEF up
      {
        player.status["increase_def"].last = last;
        player.status["increase_def"].percent = percent;
        return;
      }
      
      player.increase_cri = function(last,percent)    //CRI up
      {
        player.status["increase_cri"].last = last;
        player.status["increase_cri"].percent = percent;
        return;
      }
      
      player.increase_cridmg = function(last,percent)    //cridmg up
      {
        player.status["increase_cridmg"].last = last;
        player.status["increase_cridmg"].percent = percent;
        return;
      }
      
      player.decrease_dmg = function(last,percent)
      {
        player.status["decrease_dmg"].last = last;
        player.status["decrease_dmg"].percent = percent;
        return;
      }
      
      player.increase_sp_gaining = function(last,percent)
      {
        player.status["increase_sp_gaining"].last = last;
        player.status["increase_sp_gaining"].percent = percent;
        return;
      }
      
      ///////////////////////////////////////
      return player;
    }
  
    var p1 = player(id,vlkys[id].set1[0],"p1");
    var p2 = player(id,vlkys[id].set1[1],"p2");
    var op1 = 0
    var op2 = 0
    vlkys["tower"] = {vlkys : {"B0":1, "A0":1, "A1":1, "A2":1, "A3":1, "A4":1, "A5":1, "A6":1, "A7":1, "A8":1, "A9":1, "S0":1, "S1":1, "S2":1},
                        rank:{"B0":"SS", "A0":"SS", "A1":"SS", "A2":"SS", "A3":"SS", "A4":"SS", "A5":"SS", "A6":"SS", "A7":"SS", "A8":"SS", "A9":"SS", "S0":"SS", "S1":"SS", "S2":"SS"},
                        status: {"lv":duellist[id].tower, "exp":0}, set1:[0,0], set2:[0,0], set3:[0,0], favor:{"B0":0}, marry:{"B0":0}};
    if(args[1] == "pve")
    {
      if(args[2] && args[3] && vlkylist[args[2]] && vlkylist[args[3]])
      {
        op1 = player("tower", args[2], "op1");
        op2 = player("tower", args[3], "op2");
      }
      else
      {
        const vlkyset1 = [ ["A0","A1"], ["A2","A6"], ["A3","A7"], ["A4","A5"], ["A8","S2"], ["A9","S1"], "S0"]
        const vlkyset2 = ["A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "S1", "S2"]
        rand = Math.floor(Math.random()*7);
        let tower_op = vlkyset1[rand];
        if(tower_op == "S0")
        {
          rand = Math.floor(Math.random()*12);
          tower_op = ["S0",vlkyset2[rand]]
        }
        if(rand % 2) tower_op = tower_op.reverse()
        op1 = player("tower", tower_op[0], "op1");
        op2 = player("tower", tower_op[1], "op2");
      }
    }
    else
    {
      if(!vlkys[opid].set2[0] || !vlkys[opid].set3[0])
      {
        op1 = player(opid,vlkys[opid].set1[0],"op1");
        op2 = player(opid,vlkys[opid].set1[1],"op2");
      }
      else
      {
        rand = Math.floor(Math.random()*3)
        switch(rand)
        {
          case 0:
            op1 = player(opid,vlkys[opid].set1[0],"op1");
            op2 = player(opid,vlkys[opid].set1[1],"op2");
          break;
          
          case 1:
            op1 = player(opid,vlkys[opid].set2[0],"op1");
            op2 = player(opid,vlkys[opid].set2[1],"op2");
          break;
            
          case 2:
            op1 = player(opid,vlkys[opid].set3[0],"op1");
            op2 = player(opid,vlkys[opid].set3[1],"op2");
          break;
        }
      }
    }
    
    p1.initialize(p2,op1,op2);
    p2.initialize(p1,op1,op2);
    op1.initialize(op2,p1,p2);
    op2.initialize(op1,p1,p2);
    p1.aibo_obj = p2;
    p2.aibo_obj = p1;
    op1.aibo_obj = op2;
    op2.aibo_obj = op1;
  
    function embed_renew (next_one)
    {
      embed = new Discord.RichEmbed();
      function show_rank(player)
      {
        let rank = "🐣"
        if(vlkys[player.id].rank[player.type] == "A") rank = "🍐"
        if(vlkys[player.id].rank[player.type] == "S") rank = "🐬"
        if(vlkys[player.id].rank[player.type] == "SS") rank = "🍆"
        if(vlkys[player.id].rank[player.type] == "SSS") rank = "⭐"
        if(vlkys[player.id].rank[player.type] == "EX") rank = "💎"
        return rank;
      }
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
        return str.slice(0,5);
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
        let emoji = "";
        if(player == next_one) emoji += "⬅";
        if(player.status["sakura"].count >= 3) emoji += "🌸"
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
              case "increase_atk": emoji += "⚔"; break;
              case "increase_def": emoji += "🛡"; break;
              case "increase_cri": emoji += "🥊"; break;
              case "increase_cridmg": emoji += "💥"; break;
              case "decrease_dmg": emoji += "✝"; break;
              case "increase_sp_gaining": emoji += "🍺"; break;
            }
          }
        }
        return emoji;
      }
      embed.setTitle("Lv."+p1.lv+" "+man.displayName+" V.S. "+"Lv."+op1.lv+" "+ opponent.displayName).setColor("#00c5a3");
      embed.addField(dis_player(p1)+show_rank(p1)+show_status(p1), Math.ceil(show_hp(p1))+"/"+Math.ceil(p1.maxhp)+" "+ show_heart(p1) + "\n"+Math.floor(show_sp(p1))+"/"+Math.floor(op2.maxsp) +" "+ show_star(p1),true)
           .addField(dis_player(p2)+show_rank(p2)+show_status(p2), Math.ceil(show_hp(p2))+"/"+Math.ceil(p2.maxhp)+" "+ show_heart(p2) +"\n"+Math.floor(show_sp(p2))+"/"+Math.floor(op2.maxsp)+" "+ show_star(p2),true)
           .addField(dis_player(op1)+show_rank(op1)+show_status(op1), Math.ceil(show_hp(op1))+"/"+Math.ceil(op1.maxhp)+" "+ show_heart(op1) +"\n"+Math.floor(show_sp(op1))+"/"+Math.floor(op2.maxsp)+" "+ show_star(op1))
           .addField(dis_player(op2)+show_rank(op2)+show_status(op2), Math.ceil(show_hp(op2))+"/"+Math.ceil(op2.maxhp)+" "+ show_heart(op2) +"\n"+Math.floor(show_sp(op2))+"/"+Math.floor(op2.maxsp)+" "+ show_star(op2))
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

    function dis_player(obj)
    {
      if(obj.position == "p1") return "🔹" + obj.name;
      if(obj.position == "p2") return "🔹" + obj.name;
      if(obj.position == "op1") return "🔸" + obj.name;
      if(obj.position == "op2") return "🔸" + obj.name;
    }

    function sleep(time) 
    {
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
    
    seq.push(p1)  // 初始化對戰序列
    seq.push(p2)
    seq.push(op1)
    seq.push(op2)
    seq.sort(function(a, b){return b.agi - a.agi});
    renew_all();
    var msg = await message.channel.send(embed_renew(seq[0])); //丟初始訊息
  
    while(state == "fighting")   //正式開打
    {
       duellist[id].now = 1;
       fs.writeFileSync("./duellist.json",JSON.stringify(duellist));
       tp = seq[turn]
       if(tp.hp <= 0) 
       {
         turn ++;
         if(turn >= seq.length) turn = 0;
         continue;
       }
       renew_all();   // 回合開始更新
      
       if(tp.status.faint.last > 0)
       {
         tp.status.faint.last --
         record += dis_player(tp) + " 遭到暈眩，回合暫停\n"
         turn ++;
         if(turn >= seq.length) turn = 0;
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
       if(tp.type == "S0" && tp.count == 1 && tp.aibo_obj.hp <= 0)  // 崩壞使者
       {
         if(tp.aibo_obj.position == "p1") 
         {
           p1 = player(tp.id,"bella","p1")
           seq.push(p1)
           p1.aibo = tp.position
           p1.aibo_obj = tp
           p1.initialize()
         }
         else if(tp.aibo_obj.position == "p2") 
         {
           p2 = player(tp.id,"bella","p2")
           seq.push(p2)
           p2.aibo = tp.position
           p2.aibo_obj = tp
           p2.initialize()
         }
         else if(tp.aibo_obj.position == "op1") 
         {
           op1 = player(tp.id,"bella","op1")
           seq.push(op1)
           op1.aibo = tp.position
           op1.aibo_obj = tp
           op1.initialize()
         }
         else if(tp.aibo_obj.position == "op2") 
         {
           op2 = player(tp.id,"bella","op2")
           seq.push(op2)
           op2.aibo = tp.position
           op2.aibo_obj = tp
           op2.initialize()
         }
         tp.count = 2;
         turn --
       }
      
       if(seq.length == 0) state = "even";
       else if(!seq.find(x => x == op1) && !seq.find(x => x == op2)) state = "win";
       else if(!seq.find(x => x == p1) && !seq.find(x => x == p2)) state = "lose";
       else turn += 1;
       
       if(tp.status.ignite.last && state == "fighting")  tp.on_hit(tp.status.ignite.dot, "fire", "點燃", tp.status.ignite.source)
       if(turn >= seq.length) turn = 0;
       await sleep(time_wait);
       msg.edit(embed_renew(seq[turn]));
    }
  
    
    function count_elo(p_elo, op_elo,state)
    {
      let num = 0;
      if(state == "win")
      {
        num = Math.floor(14*Math.exp(-0.004*(p_elo-op_elo)))
        if(num < 1) num = 1;
        if(num > 50) num = 50;
      }
      else if(state == "lose")
      {
        num = Math.floor(14*Math.exp(-0.004*(op_elo-p_elo)))
        if(num < 4) num = 4;
        if(num > 29) num = 29;
      }
      else return 0;
      return num;
    }
    
    function show_exp()
    {
      let num = Math.ceil( 5 - 5*(vlkys[id].status.exp/explist(vlkys[id].status.lv)) );
      let str = "🏁";
      if(num > 5) num = 5
      for(var j = 0 ; j < num ; j++) str += "🥕";
      return str.concat("🏇");
    }
    
    function find_rank(id)
    {
      let rank_array = (Object.keys(duellist)).sort(function(a, b){return duellist[b].elo - duellist[a].elo})
      var re_num = 0;
      for(i = 0 ; i < rank_array.findIndex(x => x == id) ; i++)
      {
        if(duellist[rank_array[i]].win + duellist[rank_array[i]].lose == 0) continue;
        else re_num ++;
      }
      return "#" + (re_num + 1) + " ";
    }
    
    function array_ten(array)
    {
      while(array.length > 10) array.shift();
      return array;
    }
    //////////
  
    
    let embed1 = 0;
    let num = 0;
    if(state == "win")
    {
      record += "🏆 " + man.displayName + " 獲勝\n";
      
      if(args[1] != "pve")
      {
        num = count_elo(duellist[id].elo, duellist[opid].elo, state)
        embed1 = embed_renew();
        duellist[id].elo += num;
        duellist[opid].elo -= num + 1;
        duellist[id].win ++
        if(!duelcount[id].match) duelcount[id].match = {now:0, list:[], history:[]}
        if(!duelcount[opid].match) duelcount[opid].match = {now:0, list:[], history:[]}
        if(!duelcount[id].match.history) duelcount[id].match.history = []
        if(!duelcount[opid].match.history) duelcount[opid].match.history = []
        duelcount[id].match.history.push("🗡 " + opponent.displayName + " 🏆" + duellist[id].elo +` (🔺${num})`)
        duelcount[opid].match.history.push("🛡 " + man.displayName + " 🌶🐔" + duellist[opid].elo +` (🔻${num+1})`)
        array_ten(duelcount[id].match.history)
        array_ten(duelcount[opid].match.history)
        embed1.addField(find_rank(id) + man.displayName,duellist[id].elo + ` (🔺${num})`)
        embed1.addField(find_rank(opid) + opponent.displayName,duellist[opid].elo + ` (🔻${num + 1})`,true)
      }
      else
      {
        let exp = tower_exp(duellist[id].tower)
        record += "🏹 " + man.displayName + " 獲得了" + `**${exp}**` + " 點經驗及 " + `**${duellist[id].tower*8}**` +" 點星石\n"
        embed1 = embed_renew();
        lvup(id,exp)
        stars[id].stars += duellist[id].tower*8
        duellist[id].tower++
        embed1.addField(man.displayName + " - 女武神等級",`LV.${vlkys[id].status.lv} (${vlkys[id].status.exp}/${explist(vlkys[id].status.lv)})` + show_exp())
      }
      msg.edit(embed1);
    }
    else if(state == "lose")
    {
       record += "🌶🐔 " + man.displayName + " 被屌虐\n"
       if(args[1] != "pve")
       {
         num = count_elo(duellist[id].elo, duellist[opid].elo, state)
         duellist[id].elo -= num + 1;
         duellist[opid].elo += num;
         duellist[id].lose ++
         if(!duelcount[id].match.history) duelcount[id].match.history = []
         if(!duelcount[opid].match.history) duelcount[id].match.history = []
         duelcount[id].match.history.push("🗡 " + opponent.displayName + " 🌶🐔" + duellist[id].elo +` (🔻${num+1})`)
         duelcount[opid].match.history.push("🛡 " + man.displayName + " 🏆" + duellist[opid].elo +` (🔺${num})`)
         array_ten(duelcount[id].match.history)
         array_ten(duelcount[opid].match.history)
         embed1 = embed_renew();
         embed1.addField(find_rank(id) + man.displayName,duellist[id].elo + ` (🔻${num + 1})`)
         embed1.addField(find_rank(opid) + opponent.displayName,duellist[opid].elo + ` (🔺${num})`,true)
       }
       else
       {
          let exp = Math.floor(tower_exp(duellist[id].tower)/2)
          record += "🏹 " + man.displayName + " 獲得了" + `**${exp}**` + " 點經驗\n"
          embed1 = embed_renew();
          lvup(id,exp)
          embed1.addField(man.displayName + " - 女武神等級",`LV.${vlkys[id].status.lv} (${vlkys[id].status.exp}/${explist(vlkys[id].status.lv)})` + show_exp())
       }
       msg.edit(embed1);
    }
    else if(state == "even")
    {
       record += "🍎 雙方平手"
       embed1 = embed_renew();
       if(args[1] != "pve")
       {
         embed1 = embed_renew();
         embed1.addField(man.displayName,duellist[id].elo)
         embed1.addField(opponent.displayName,duellist[opid].elo,true)
         
       }
       msg.edit(embed1);
    }
    duellist[id].now = 0;
    if(args[1] == "pve") duelcount[id].pve --
    else duelcount[id].pvp --
    duelcount[id].match.list = []
    duelcount[id].match.now = 0
    fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
    fs.writeFileSync("./duellist.json",JSON.stringify(duellist));
    fs.writeFileSync("./duelcount.json",JSON.stringify(duelcount));
    fs.writeFileSync("./stars.json",JSON.stringify(stars));
  
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
  
    function rank_renew()
    {
      embed = new Discord.RichEmbed();
      let str_rank = ""
      let rank_array = (Object.keys(duellist)).sort(function(a, b){return duellist[b].elo - duellist[a].elo})
      let num_rank = 1;
      for(i = 0 ; i < rank_array.length && num_rank <= 10 ; i++)
      {
        let person = message.guild.members.get(rank_array[i])
        if(duellist[rank_array[i]].win + duellist[rank_array[i]].lose <= 0) continue;
        else
        {
          let name = `**${person.displayName}**`
          str_rank += show_rank(num_rank) + "　" + name + "　積分：" + duellist[rank_array[i]].elo + "\n"
          num_rank ++
        }
      }
      embed.setTitle("競技場排名").setColor("#7ff396").setDescription(str_rank);
      return embed
    }
    function tower_renew()
    {
      embed = new Discord.RichEmbed();
      let str_rank = ""
      let rank_array = (Object.keys(duellist)).sort(function(a, b){return duellist[b].tower - duellist[a].tower})
      for(i = 0 ; i < 10 ; i++)
      {
        let person = message.guild.members.get(rank_array[i])
        let d_name = "";
        if(person) d_name = person.displayName
        else d_name = "查無此人"
        let name = duellist[rank_array[i]].tower > 1 ? `**${d_name}**` : "-" 
        str_rank += show_rank(i+1) + "　" + `**${d_name}**` + "　層數：" + duellist[rank_array[i]].tower + "\n"
      }
      embed.setTitle("PVE排名").setColor("#da507e").setDescription(str_rank);
      return embed
    }
    
    var ch = message.guild.channels.get("629230265260048414");
    ch.fetchMessage("629230370512044037").then( msg => msg.edit(rank_renew()) ) 
    ch.fetchMessage("629230359153868800").then( msg => msg.edit(tower_renew()) )
    return;
}

module.exports.help = {
    name: "duel"
}