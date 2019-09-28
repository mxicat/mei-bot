
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const marilist = require("./marilist.json");
const maridata = require("./maridata.json");
const energy = require("./energy.json");
const items = require("./items.json");

module.exports.run = async(bot, message, args) =>{
    
    var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場")) && (!message.channel.name.includes("小瑪莉"))) return ;
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()

   
    if(!marilist[id]) {marilist[id] = {bet_str:"000000000"}};
    if(!maridata[id]) {maridata[id] = {enable:0, hat:0 } };
    if(!maridata[id].hat) { maridata[id] = {enable: maridata[id].enable, hat : 0} };
  
    var hat = new Set();
  
    const en_str = "abcdefghi";
    const empty_str = "          ";
    var betnum = 0;
    var newstr = "";
    var n = 0;
    var enable = 0;
    var win = 0;
    var lose = 0;
    function sleep (time) { return new Promise((resolve) => setTimeout(resolve, time));}

    
    function getemj(letter)
    {
      switch(letter)
        {
          case "a":
            return "<:nuwa0:586492722668371978>";
            break;
          case "b":
            return "<:duoyu:473112480357416980>";
            break;
          case "c":
            return "<:teriteri:569019032364384256>";
            break;
          case "d":
            return "<:dalao:486505918440275968>";
            break;
          case "e":
            return "<:sealr:473105876916502538>";
            break;
          case "f":
            return "<:C5:588387735711252486>";
            break;
          case "g":
            return "<:twin_cherry1:586482580258553866>";
            break;
          case "h":
            return "<:twin_berry1:586482627389816832>";
            break;
          case "i":
            return "<:ysy_ej:566490896145842186>";
            break;
          case "o":
            return "<:mei2:586486100046905363>";
            break;
          default:
            return message.reply("emoji false");
            break;
        }
    }
    
    function roll() 
    {
      var rand = Math.floor(Math.random()*1000 + 1);
      if(rand <= 47) return 2;
      else if(rand <= 94) return 12;
      else if(rand <= 142) return 16;
      else if(rand <= 190) return 22;
      else if(rand <= 211) return 17;
      else if(rand <= 226) return 6;
      else if(rand <= 241) return 13;
      else if(rand <= 263) return 10;
      else if(rand <= 286) return 18;
      else if(rand <= 295) return 5;
      else if(rand <= 317) return 1;
      else if(rand <= 340) return 7;
      else if(rand <= 370) return 8;
      else if(rand <= 400) return 19;
      else if(rand <= 430) return 3;
      else if(rand <= 460) return 14;
      else if(rand <= 490) return 21;
      else if(rand <= 588) return 4;
      else if(rand <= 686) return 9;
      else if(rand <= 784) return 15;
      else if(rand <= 882) return 20;
      else if(rand <= 980) return 24;
      else if(rand <= 990) return 11;
      else if(rand <= 1000) return 23;
      else return console.log("error");
    }

    function pos_to_emo(pos)
    {
        if(pos == 2 || pos == 12 || pos == 16 || pos ==22) return "a";
        else if (pos == 17) return "b";
        else if (pos == 6 || pos == 13) return "c";
        else if (pos == 10 || pos == 18) return "d";
        else if (pos == 5) return "e";
        else if (pos == 1 || pos == 7) return "f";
        else if (pos == 8 || pos == 19) return "g";
        else if (pos == 3 || pos == 14 || pos == 21) return "h";
        else if (pos == 4  || pos == 9 || pos == 15 || pos == 20 || pos == 24) return "i";
        else if (pos == 11 || pos == 23) return "o";
        else return console.log("error");
    }
    
    function num_to_emo(num)
    {
        if(num == 1) return ":one:";
        else if(num == 2) return ":two:";
        else if(num == 3) return ":three:";
        else if(num == 4) return ":four:";
        else if(num == 5) return ":five:";
        else if(num == 6) return ":six:";
        else if(num == 7) return ":seven:";
        else if(num == 8) return ":eight:";
        else if(num == 9) return ":nine:";
        else if(num == 0) return ":zero:";
        else return  console.log("error");
    }
    
    function rcount(reactions, id)
    {
      if(!reactions) return 0;
      let target = reactions.find(reaction => reaction.emoji.id == id);
      if(target) return target.count;
      else return 0;
    }
  
    function sum(str)
    {
      n = 0;
      for(var i = 0 ; i < 9 ; i++)
         n += Math.floor(parseInt(str[i]));
      return n;
    }
  
    function reset(id)
    {
        marilist[id] = {bet_str:"000000000"};
        fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
        return;
    }
    
    function showbet()
    {
      message.channel.send(getemj("a")+getemj("b")+getemj("c")+getemj("d")+getemj("e")+getemj("f")+getemj("g")+getemj("h")+getemj("i"));
      var numstr = "";
      for(var k = 0 ; k < 9 ; k++)
        numstr += num_to_emo(Math.floor(parseInt((marilist[id].bet_str)[k])));
      message.channel.send(numstr);
    }
  
    if(!args[1]) 
    {      
       embed = new Discord.RichEmbed()
      .setColor("#EB7A77")
      .setTitle("小瑪莉")
      .addField("開始遊戲","輸入 mari go",true)
      .addField("檢視當前下注","輸入 mari now",true)
      .addField("查看倍率表","輸入 mari info",true)
      .addField("整體下注(請輸入9位數字)","輸入 mari bet 9位數字",true)
      .addField("單一下注(請輸入1位數字)","輸入 mari 對應表符 1位數字",true)
      .addField("重置賭注及卡點","輸入 mari reset",true)
      .addField("開啟/關閉猜帽子遊戲","輸入 mari hat",true)
      //.addField("檢視個人紀錄","輸入 mari status")
      .setThumbnail("https://i.imgur.com/86xB2O5.png");
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
      {
          
        case "hat":
          
          if(maridata[id].hat)
            {
               maridata[id].hat = 0;
              message.reply("猜帽子功能已關閉。");
            }
          else 
          { 
            maridata[id].hat = 1;
            message.reply("猜帽子功能已開啟。");
          }
          fs.writeFileSync("./maridata.json",JSON.stringify(maridata)); 
          break;
        
        case "info":
          message.channel.send("https://i.imgur.com/ZxIIFre.png");
          
          return;
          break;
        case "reset":
          reset(id);
          maridata[id].enable = 0;
          fs.writeFileSync("./maridata.json",JSON.stringify(maridata)); 
          return message.reply("賭注已重置。");
        break;
          
        case "go":        
          if(maridata[id].enable) return message.reply("請等待當前遊戲結束。");
          if((!message.channel.name.includes("小瑪莉"))) return message.channel.send("請至<#615129888948748288>遊玩。");
          if(items[id].items["004"] < sum(marilist[id].bet_str)) return message.reply("遊樂園券不足。");
          if(items[id].items["004"] < 0)  return message.reply("遊樂園券不足。");
          
          maridata[id].enable = 1;
          fs.writeFileSync("./maridata.json",JSON.stringify(maridata)); 
          
          function printarrow(pos,now)
          {
              if(now == 1 && (pos == 1)) return "🔹";
              if(now == 1 && (pos == 13)) return "🔸";
              if(now == 2 && (pos == 7)) return "🔹";
              if(now == 2 && (pos == 19)) return "🔸";
              else return empty_str;
          }
          
          let now = 1;
          var msg = await message.channel.send(getemj("a")+getemj("h")+getemj("i")+getemj("e")+getemj("c")+getemj("f")+getemj("g")+"\n"+
                           getemj("f")+printarrow(1,now)+printarrow(4,now)+printarrow(5,now)+printarrow(6,now)+printarrow(7,now)+getemj("i")+"\n"+
                           getemj("i")+printarrow(24,now)+empty_str+empty_str+empty_str+                          printarrow(10,now)+getemj("d")+"\n"+
                           getemj("o")+printarrow(23,now)+empty_str+empty_str+empty_str+                          printarrow(11,now)+getemj("o")+"\n"+
                           getemj("a")+printarrow(22,now)+empty_str+empty_str+empty_str+                          printarrow(12,now)+getemj("a")+"\n"+
                           getemj("h")+printarrow(19,now)+printarrow(18,now)+printarrow(17,now)+printarrow(16,now)+printarrow(13,now)+getemj("c")+"\n"+
                           getemj("i")+getemj("g")+getemj("d")+getemj("b")+getemj("a")+getemj("i")+getemj("h"));
          while ( now < 2)
            {  
               now += 1;
               let board = getemj("a")+getemj("h")+getemj("i")+getemj("e")+getemj("c")+getemj("f")+getemj("g")+"\n"+
                           getemj("f")+printarrow(1,now)+printarrow(4,now)+printarrow(5,now)+printarrow(6,now)+printarrow(7,now)+getemj("i")+"\n"+
                           getemj("i")+printarrow(24,now)+empty_str+empty_str+empty_str+                          printarrow(10,now)+getemj("d")+"\n"+
                           getemj("o")+printarrow(23,now)+empty_str+empty_str+empty_str+                          printarrow(11,now)+getemj("o")+"\n"+
                           getemj("a")+printarrow(22,now)+empty_str+empty_str+empty_str+                          printarrow(12,now)+getemj("a")+"\n"+
                           getemj("h")+printarrow(19,now)+printarrow(18,now)+printarrow(17,now)+printarrow(16,now)+printarrow(13,now)+getemj("c")+"\n"+
                           getemj("i")+getemj("g")+getemj("d")+getemj("b")+getemj("a")+getemj("i")+getemj("h");
               await sleep(333);
               msg.edit(board);
            }
          
          function printfinal(pos,now)
          {
            if(pos == 1 && now == 2) return "↖";
              else if(pos == 1 && now == 3) return "⬆";
              else if(pos == 7 && now == 8) return "↗";
              else if(pos == 7 && now == 9) return "➡";
              else if(pos == 13 && now == 14) return "↘";
              else if(pos == 13 && now == 15) return "⬇";
              else if(pos == 19 && now == 20) return "↙";
              else if(pos == 19 && now == 21) return "⬅";
              else if(pos == now)
              {
                  if(pos == 1) return "⬅";
                  if (pos >= 4 && pos <= 9) return "⬆";
                  if (pos >= 10 && pos <= 15) return "➡";
                  if (pos >= 16 && pos <= 19) return "⬇";
                  if (pos >= 22 && pos <= 24) return "⬅";
              }
            else return empty_str;
          }
          let finalnum = roll();
          let final = getemj("a")+getemj("h")+getemj("i")+getemj("e")+getemj("c")+getemj("f")+getemj("g")+"\n"+
                           getemj("f")+printfinal(1,finalnum)+printfinal(4,finalnum)+printfinal(5,finalnum)+printfinal(6,finalnum)+printfinal(7,finalnum)+getemj("i")+"\n"+
                           getemj("i")+printfinal(24,finalnum)+empty_str+empty_str+empty_str+                          printfinal(10,finalnum)+getemj("d")+"\n"+
                           getemj("o")+printfinal(23,finalnum)+empty_str+empty_str+empty_str+                          printfinal(11,finalnum)+getemj("o")+"\n"+
                           getemj("a")+printfinal(22,finalnum)+empty_str+empty_str+empty_str+                          printfinal(12,finalnum)+getemj("a")+"\n"+
                           getemj("h")+printfinal(19,finalnum)+printfinal(18,finalnum)+printfinal(17,finalnum)+printfinal(16,finalnum)+printfinal(13,finalnum)+getemj("c")+"\n"+
                           getemj("i")+getemj("g")+getemj("d")+getemj("b")+getemj("a")+getemj("i")+getemj("h");
          await sleep(333);
          msg.edit(final);
          
          let finalletter = pos_to_emo(finalnum);
          
          var mp = 0;
          if(finalletter == "a") {betnum = Math.floor(parseInt((marilist[id].bet_str)[0])); mp = 5;}
          else if(finalletter == "b") {betnum = Math.floor(parseInt((marilist[id].bet_str)[1])); mp = 40;}
          else if(finalletter == "c") {betnum = Math.floor(parseInt((marilist[id].bet_str)[2])); mp = 30;}
          else if(finalletter == "d") {betnum = Math.floor(parseInt((marilist[id].bet_str)[3])); mp = 20;}
          else if(finalletter == "e") {betnum = Math.floor(parseInt((marilist[id].bet_str)[4])); mp = 100;}
          else if(finalletter == "f") {betnum = Math.floor(parseInt((marilist[id].bet_str)[5])); mp = 20;}
          else if(finalletter == "g") {betnum = Math.floor(parseInt((marilist[id].bet_str)[6])); mp = 15;}
          else if(finalletter == "h") {betnum = Math.floor(parseInt((marilist[id].bet_str)[7])); mp = 10;}
          else if(finalletter == "i") {betnum = Math.floor(parseInt((marilist[id].bet_str)[8])); mp = 2;}
          else if(finalletter == "o") betnum = -1;
          else console.log("error");
          
          items[id].items["004"] -= sum(marilist[id].bet_str);
          maridata[id].lose += sum(marilist[id].bet_str);
          
          if(betnum < 0)
            {
              items[id].items["004"] += 1;
              items[id].items["004"] += sum(marilist[id].bet_str);
              message.reply("再來一次，獲得額外獎勵遊樂園券*1");
            }
          else if (betnum > 0)
            {
              var ticketnum = mp * betnum;
              maridata[id].win += ticketnum;
              
              if(!maridata[id].hat)
              {
                message.channel.send("恭喜獲得彩金 " + ticketnum * 50 + " <:crystal:431483260468592641>" + "，遊樂園券剩餘張數: " + items[id].items["004"]);
                crystals[id].crystals += ticketnum * 50 ;
                
              }
              else
              {
                   message.channel.send("目前彩金 " + ticketnum * 50 + " <:crystal:431483260468592641>" + "，遊樂園券剩餘張數: " + items[id].items["004"]);
                   message.channel.send("猜猜裡面是誰。");
                   let msg1 = await message.channel.send("🎩");
                   await msg1.react("586482580258553866");
                   await msg1.react("586482627389816832");
                   await msg1.react("473542366188404746");
          
                    let filter = (reaction,user) => (reaction.emoji.id == "586482580258553866" || reaction.emoji.id == "586482627389816832" || reaction.emoji.id == "473542366188404746") && user.id == id;
                    const reactions = await msg1.awaitReactions(filter,{time:5000});         
                    let pink = rcount(reactions,"586482580258553866");
                    let blue = rcount(reactions,"586482627389816832");
                    let no = rcount(reactions,"473542366188404746");
                    if(!reactions) no = 1;
              
              var bonus = ticketnum * 50 
              var rm = 0;
              if(no) message.channel.send("恭喜贏得 " + bonus+ " <:crystal:431483260468592641>");
              else if(pink || blue)
                {
                  rm = Math.floor(Math.random()*2 + 1);
                  if(rm == 1 && pink) 
                  {
                    msg1.edit("<:twin_cherry1:586482580258553866>")
                    bonus *= 2;
                    message.channel.send("恭喜贏得 " + bonus + " <:crystal:431483260468592641>");
                  }
                  else if(rm == 1 && blue)
                  {
                    msg1.edit("<:twin_berry1:586482627389816832>")
                    bonus *= 2;
                    message.channel.send("恭喜贏得 " + bonus + " <:crystal:431483260468592641>");
                  }
                  else if(rm == 2 && blue) 
                  {
                    msg1.edit("<:twin_cherry1:586482580258553866>")
                    bonus = 0;
                    message.channel.send("答錯了，獎金歸零。");
                  }
                  else if(rm == 2 && pink) 
                  {
                    msg1.edit("<:twin_berry1:586482627389816832>")
                    bonus = 0;
                    message.channel.send("答錯了，獎金歸零。");
                  }
                }
              else
                {
                  message.channel.send("恭喜贏得 " + bonus+ " <:crystal:431483260468592641>");
                }
              crystals[id].crystals += bonus;
              }
            }
        else
           {
              message.channel.send("銘謝惠顧，已消耗 " + sum(marilist[id].bet_str) + " 張遊樂園券，剩餘數量: " + items[id].items["004"] );
          }
            
            
          
          maridata[id].enable = 0;
          fs.writeFileSync("./maridata.json",JSON.stringify(maridata)); 
          fs.writeFileSync("./items.json",JSON.stringify(items)); 
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals)); 
          return;
          break;
          
       case "now":
          showbet();
          message.channel.send("總下注數量: "+sum(marilist[id].bet_str));
          return;
          break;
          
          
        case "bet":
          if(!args[2]) return message.reply("請輸入下注數量(9位數字)");
          if(args[2].length > 9 || args[2].length < 9) return message.reply("請輸入9位數字。")
          for(var i = 0 ; i < 9 ; i++)
          {
            betnum = Math.floor(parseInt(args[2][i]));
            if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          }
          marilist[id].bet_str = args[2];
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
          
          
        case getemj("a"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 0) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
          
        case getemj("b"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 1) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
        case getemj("c"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 2) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
        case getemj("d"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 3) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
        case getemj("e"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 4) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
        case getemj("f"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 5) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
        case getemj("g"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 6) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
        case getemj("h"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 7) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
        case getemj("i"):
          if(!args[2]) return message.reply("請輸入下注數量(1位數字)");
          if(args[2].length > 1 || args[2].length < 0) return message.reply("請輸入1位數字。")
          betnum = Math.floor(parseInt(args[2]));
          if(!Number.isInteger(betnum)) return message.reply("請輸入整數。");
          newstr = "";
          for(var i = 0 ; i < 9 ; i++)
          {
            if(i == 8) newstr += args[2];
            else newstr += (marilist[id].bet_str)[i];
          }
          marilist[id].bet_str = newstr;
          fs.writeFileSync("./marilist.json",JSON.stringify(marilist)); 
          return showbet();
          break;
      }      
    }
    return;
}

module.exports.help = {
    name: "mari"
}