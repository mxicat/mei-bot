
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const bjlist = require("./bjlist.json");
const energy = require("./energy.json");

module.exports.run = async(bot, message, args) =>{
    
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("賭場"))) return message.reply("揪團賭博請至<#441480274505629706>。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()

    let crim = message.guild.roles.find('id',"438267716915298304");
    var card = 0;
  
    function rcount(reactions, name)
    {
      if(!reactions) return 0;
      let target = reactions.find(reaction => reaction.emoji.name == name);
      if(target) return target.count;
      else return 0;
    }
  
    function points(card)
    {
      var ac = 0; 
      var sum = 0;
      for(var c of card)
      {
        if (c == 1) 
        {
          ac += 1;
          sum += 11;
        }
        else if (c > 10) sum += 10;
        else sum += c;
        
        if(sum > 21 && ac != 0) 
        {
          sum -= 10;
          ac -= 1;
        }
      }
      return sum;
    }
  
    function noc(card)
    {
      if(card == 1) return "A";
      if(card == 11) return "J";
      if(card == 12) return "Q";
      if(card == 13) return "K";
      return ""+card;
    }
     
  
    function list(cards)
    {
      let s = new Array();
      let l = cards.length;
      for(var i = 1 ; i < l ; i ++)
      {
        s[i-1] = noc(cards[i]);
      }
      return s;
    }
  
    function draw() {return Math.floor(Math.random()*12 + 1);}

  
    function reset(id)
  {
    bjlist[id].op = 0;
    bjlist[id].now = 0;
    bjlist[id].cards = new Array();
    bjlist[id].bet = 0;
    bjlist[id].re = 0;
    fs.writeFileSync("./bjlist.json",JSON.stringify(bjlist)); 
    return;
  }
  
    if(!args[1]) 
    {      
       embed = new Discord.RichEmbed()
      .setColor("#9B90C2")
      .setTitle("Black Jack 21點")
      .addField("開啟新遊戲","輸入 **bj start @對手**")
      .setThumbnail("https://i.imgur.com/Tl2jDug.png");
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
      {
        case "start":
           if(args[2]) {var opid = args[2].slice(2,-1);  
                 if(opid.startsWith("!")) opid = opid.slice(1);}
          if(!message.guild.members.get(opid)) return message.channel.send("請TAG正確的對象。");
          if(opid == id) return message.channel.send("請TAG正確的對象。"); 
          if(crystals[id].crystals < 100) return message.reply("莊家需要100<:crystal:431483260468592641>")
          //if(bjlist[id].now || bjlist[opid].now) return message.channel.send("已在遊戲中。");
          man = message.guild.members.get(id);
          if(crystals[opid].crystals <1) return message.channel.send("對手<:crystal:431483260468592641>不足。")
          embed = new Discord.RichEmbed().addField(man.displayName+"的遊戲邀請","請點擊✅加入遊戲，❎拒絕邀請").setThumbnail("https://i.imgur.com/EvxT0mA.png")
          //await message.channel.send("<@"+opid+">\n");  
          let msg = await message.channel.send(embed);
          await msg.react("✅");
          await msg.react("❎");
          
          let filter = (reaction,user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❎") && user.id == opid;
          const reactions = await msg.awaitReactions(filter,{time:7000});
          if(!reactions) return message.channel.send("無人回應QQ");
          let yes = rcount(reactions,"✅");
          let no = rcount(reactions,"❎");
          //return message.channel.send("Y: " + yes + " N: " + no);
          
          if(no) return message.reply("遊戲邀請已被拒絕");
                
          if(yes)
          {
            let op = message.guild.members.get(opid);
            man = message.guild.members.get(id);
            
            bjlist[id].op = opid;
            bjlist[opid].op = id;
            bjlist[id].now = 1;
            bjlist[opid].now = 2;
                        
            embed = new Discord.RichEmbed()
            .setTitle(op.displayName + "請下注 bj bet 水晶(上限100)")
          
            fs.writeFileSync("./bjlist.json",JSON.stringify(bjlist)); 
            return message.channel.send(embed);
          }
          
          return message.channel.send("無人回應");
          
          break;
          
          
        case "bet":
          if(!bjlist[id].now) return message.reply("不在遊戲中");
          if(bjlist[id].now != 2) return message.reply("閒家才能下注");
          if(bjlist[id].bet) return message.reply("下注僅限一次");
          
          if( bjlist[id].cards.length > 2) return message.reply("要牌後不能加注");
          
          if(!args[2]) return message.reply("請輸入操作的數量。");
          let num = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
          if(num <= 0) return message.reply("請輸入正整數。");
          if(num > 100) return message.reply("超過賭金上限(100<:crystal:431483260468592641>)。")
          
          if(num > crystals[id].crystals) return message.reply("現金不足。");
        
          bjlist[id].bet = num;
          fs.writeFileSync("./bjlist.json",JSON.stringify(bjlist)); 
          
           message.reply("下注成功，本次賭注為" +num +"<:crystal:431483260468592641>");
          
            let opp = message.guild.members.get(bjlist[id].op);
            man = message.guild.members.get(id);
            
            card = draw();
            bjlist[bjlist[id].op].cards = new Array();
            bjlist[bjlist[id].op].cards.push(card);
            
            
            card = draw();
            bjlist[id].cards = new Array();
            bjlist[id].cards.push(card);
            
            
            bjlist[id].cards.push(draw());
            bjlist[bjlist[id].op].cards.push(draw());
                     
            embed = new Discord.RichEmbed()
            .addField(opp.displayName + "的牌面", noc(bjlist[bjlist[id].op].cards[1]),true)
            .addField(man.displayName + "的牌面",noc(bjlist[id].cards[1]) + "  暗牌 :" +noc(bjlist[id].cards[0]),true)
          
          
          return message.channel.send(embed);
          break;
        
        case "hit":
          if(!bjlist[id].now) return message.reply("不在遊戲中");
          if(bjlist[id].now != 2) return message.reply("閒家才能要牌");
          if(bjlist[id].bet < 1) return message.reply("請先下注");
          
          card = draw();
          bjlist[id].cards.push(card);
          
          let oid = bjlist[id].op;
          let op = message.guild.members.get(bjlist[id].op);
          man = message.guild.members.get(id);         
          fs.writeFileSync("./bjlist.json",JSON.stringify(bjlist)); 
          
           embed = new Discord.RichEmbed()
            .addField(op.displayName + "的牌面", ' '+list(bjlist[bjlist[id].op].cards),true)
            .addField(man.displayName + "的牌面",' '+list(bjlist[id].cards)+ "  暗牌 :" +noc(bjlist[id].cards[0]),true)
            
          
          message.channel.send(embed);
          
          if(points(bjlist[id].cards) == 21)
          {
           
            message.channel.send("閒家已達21點");
            
            while(points(bjlist[oid].cards) < points(bjlist[id].cards))
            {
              card = draw();
              bjlist[oid].cards.push(card);
              fs.writeFileSync("./bjlist.json",JSON.stringify(bjlist)); 
          
               embed = new Discord.RichEmbed()
              .addField(op.displayName + "的牌面", ' '+list(bjlist[oid].cards)+"  暗牌 :" +noc(bjlist[oid].cards[0]),true)
              .addField(man.displayName + "的牌面",list(bjlist[id].cards) +"  暗牌 :" +noc(bjlist[id].cards[0]),true)
          
              message.channel.send(embed);
            }
            
            if (points(bjlist[oid].cards) == 21 )
            {
              message.channel.send(op.displayName + "獲得21點，莊家獲勝。");
              crystals[id].crystals -= bjlist[id].bet;
              crystals[oid].crystals += bjlist[id].bet;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals)); 
              message.channel.send("獲得賭金" + bjlist[id].bet + "<:crystal:431483260468592641>");
              reset(oid);
              reset(id);
              return;
            }
            else if(points(bjlist[oid].cards) > 21)
            {
              crystals[oid].crystals -= bjlist[id].bet;
              crystals[id].crystals += bjlist[id].bet;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals)); 
              message.channel.send("莊家爆牌," +man.displayName + "獲得賭金" + bjlist[id].bet + "<:crystal:431483260468592641>");
              reset(oid);
              reset(id);
              return;
            }
            
            
          }
          else if(points(bjlist[id].cards) > 21)
          {
            crystals[id].crystals -= bjlist[id].bet;
            crystals[oid].crystals += bjlist[id].bet;
            fs.writeFileSync("./crystals.json",JSON.stringify(crystals)); 
            message.channel.send("閒家爆牌," +op.displayName + "獲得賭金" + bjlist[id].bet + "<:crystal:431483260468592641>");
            reset(oid);
            reset(id);
            return;
          }
          
          return;
          break;
          
        case "stand":
            if(!bjlist[id].now) return message.reply("不在遊戲中");
            if(bjlist[id].now != 2) return message.reply("閒家才能叫停");
            if(bjlist[id].bet < 1) return message.reply("請先下注");
          
            message.channel.send("閒家已叫停，莊家要牌");
            var oids = bjlist[id].op;
            var ops = message.guild.members.get(bjlist[id].op);
            man = message.guild.members.get(id);         
            fs.writeFileSync("./bjlist.json",JSON.stringify(bjlist)); 
            
          while(points(bjlist[oids].cards) < points(bjlist[id].cards) || points(bjlist[oids].cards) < 17)
            {
              card = draw();
              bjlist[oids].cards.push(card);
              fs.writeFileSync("./bjlist.json",JSON.stringify(bjlist)); 
          
               embed = new Discord.RichEmbed()
              .addField(ops.displayName + "的牌面", list(bjlist[oids].cards)+"  暗牌 :" +noc(bjlist[oids].cards[0]),true)
              .addField(man.displayName + "的牌面",list(bjlist[id].cards)+"  暗牌 :" +noc(bjlist[id].cards[0]),true)
          
              message.channel.send(embed);
            }
            if(points(bjlist[oids].cards) > 21)
            {
              crystals[oids].crystals -= bjlist[id].bet;
              crystals[id].crystals += bjlist[id].bet;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals)); 
              message.channel.send("莊家爆牌  " +man.displayName + "獲得賭金" + bjlist[id].bet + "<:crystal:431483260468592641>");
              reset(oids);
              reset(id);
              return;
            }
             else
            {
              message.channel.send("莊家獲勝 最終點數: " +points(bjlist[oids].cards));
              crystals[id].crystals -= bjlist[id].bet;
              crystals[oids].crystals += bjlist[id].bet;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals)); 
              message.channel.send("獲得賭金" + bjlist[id].bet + "<:crystal:431483260468592641>");
              reset(oids);
              reset(id);
              return;
            }
            
          break;
        
        case "restart":
          if(message.guild.members.get(id).roles.find("id","433683517235265537") == null) return message.channel.send("需要**GM**權限");
          bjlist[id] = {op:0 , now:0, cards: new Array() , bet: 0 , re:0,win:0,lose:0};
          fs.writeFileSync("./bjlist.json",JSON.stringify(bjlist)); 
          return message.reply("重置進度完成");
          break;
      }      
    }
    
}

module.exports.help = {
    name: "bj"
}