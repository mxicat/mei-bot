
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const crystals = require("./crystals.json");
const items = require("./items.json");
const itemlist = require("./itemlist.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(`name`,"GM") == null) return message.channel.send("測試中，需要**GM**權限");
    let man = message.guild.members.get(id);
  if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    
    let now = new Date();
    let month = now.getMonth();
    
    if(!weapons[id])  weapons[id] = {weapons : {"B0":1}, status: {"now":"B0","lv":1, "exp":0,"re":0}}; 
  // invitailize user weapon
  
    function explist(lv)  // required exp for lv up
    {
      if(lv == 1) return 11;
      else if (lv < 15) return lv*lv*4 + 40*lv - 50;
      else if (lv < 30) return lv*lv*6 + 50*lv - 50;
      else if (lv < 50) return lv*lv*8 + 60*lv - 50;
      return lv*lv*20 + 100*lv - 50;
    }
  
    function rcount(reactions, name)
    {
      if(!reactions) return 0;
      let target = reactions.find(reaction => reaction.emoji.name == name);
      if(target) return target.count;
      else return 0;
    }
    
    if(!args[1]) 
    {

     var embed = new Discord.RichEmbed()
      .setColor("#86C166")
      .setTitle(man.displayName+" 的武器欄")
     
    // console.log(typeof(weapons[id].weapons))
      for(var w of Object.keys(weapons[id].weapons)) 
      {
        if(weapons[id].weapons[w]) embed.addField(weaponlist[w].name,"件數 : "+ weapons[id].weapons[w],true);
      }
        return message.channel.send(embed);
    }
    else
    {
       switch(args[1])
       {
         case "now":
            var lv = weapons[id].status.lv;
            var nw = weaponlist[weapons[id].status.now];
            var embed = new Discord.RichEmbed()
            .setColor("#86C166")
            .setTitle("武器等級: "+weapons[id].status.lv+ "   ("+ weapons[id].status.exp+ "/" + explist(weapons[id].status.lv)+")")
            .setThumbnail(nw.img);
           
           let re = 0;
           if(weapons[id].status.re) re = weapons[id].status.re;
           
           if(nw.name.startsWith("B") && lv > 25) embed.addField("+"+ re +"   "+nw.name, "atk："+ Math.ceil(nw.atk) + "\ncri："+ Math.ceil(nw.cri))
          else if(nw.name.startsWith("A") && lv > 35) embed.addField("+"+ re +"   "+nw.name, "atk："+ Math.ceil(nw.atk) + "\ncri："+ Math.ceil(nw.cri))
          //else if(nw.name.startsWith("S") || lv > 50) embed.addField(nw.name, "atk："+ Math.ceil(nw.atk*(lv/nw.maxlv)) + "\ncri："+ Math.ceil(nw.cri*(lv/nw.maxlv)))
           else embed.addField("+"+ re +"   "+nw.name, "atk："+ Math.ceil(nw.atk*(lv/nw.maxlv)) + "\ncri："+ Math.ceil(nw.cri*(lv/nw.maxlv)))
           return message.channel.send(embed);
           break;
        
           case "sell":
           
             if(!args[2]) return message.reply("請輸入欲出售的武器編號");
             if(args[2] == "all")
             {
                 for(var w of Object.keys(weapons[id].weapons)) 
                  {
                      if(weapons[id].weapons[w] > 1) 
                      {  
                         if(w.startsWith("A")) crystals[id].crystals += 50*(weapons[id].weapons[w]-1);
                         else if(w.startsWith("B"))  crystals[id].crystals += 10*(weapons[id].weapons[w]-1);
                        else if(w.startsWith("S"))  items[id].items["001"] += weapons[id].weapons[w]-1;
                        weapons[id].weapons[w] = 1;
                        fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                        fs.writeFileSync("./weapons.json",JSON.stringify(weapons));
                        fs.writeFileSync("./items.json",JSON.stringify(items));
                      }
                  }
               return message.channel.send("武器已出售。");
             }
             if(weaponlist[args[2]])
             {
               if((!Object.keys(weapons[id].weapons).includes(args[2])) || (!weapons[id].weapons[args[2]])) return message.reply("你沒有這項武器。");
               else
               {
                 if(!crystals[id]) { 
                   crystals[id] = { 
                      Time: 0,
                      crystals:  10};
                 }
                 if(args[2].startsWith("S")) items[id].items["001"] += 1;
                 else if(args[2].startsWith("A")) crystals[id].crystals += 50;
                 else if(args[2].startsWith("B"))  crystals[id].crystals += 10;
                 weapons[id].weapons[args[2]] -= 1;
                 fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
                 fs.writeFileSync("./weapons.json",JSON.stringify(weapons));
                 fs.writeFileSync("./items.json",JSON.stringify(items));
                 
                 return message.channel.send("武器已出售。")
               }
             }
             else return message.channel.send("未知的裝備編號。")
             break;
          
         case "equip":
             if(!args[2]) return message.reply("請輸入欲裝備的武器編號");
             if(weaponlist[args[2]])
             {
               if((!Object.keys(weapons[id].weapons).includes(args[2])) || (!weapons[id].weapons[args[2]])) return message.reply("你沒有這項武器。");
               else
               {
                 weapons[id].weapons[weapons[id].status.now] += 1;
                 weapons[id].status.now = args[2];
                 weapons[id].weapons[args[2]] -= 1;
                 fs.writeFileSync("./weapons.json",JSON.stringify(weapons));
                 
                 return message.channel.send("武器已裝備。")
               }
             }
             else return message.channel.send("未知的裝備編號。")
             break; 
          
         case "refine":
          man = message.guild.members.get(id);
          if(!weapons[id].status.re)  weapons[id].status.re = 0;
          var percent = 0;
           
          if(weapons[id].status.re < 4) percent = 100;
          else if(weapons[id].status.re < 5) percent = 60;
          else if(weapons[id].status.re < 7) percent = 40;
          else if(weapons[id].status.re < 9) percent = 20;
          else if(weapons[id].status.re < 10) percent = 10;
          else  percent = 7;
        
           
          embed = new Discord.RichEmbed().addField("武器精煉系統","請點擊✅進行武器精煉，❎返回操作").addField("當前精煉值： +"+ weapons[id].status.re,"成功機率： "+ percent + " %")
    
          let msg = await message.channel.send(embed);
          await msg.react("✅");
          await msg.react("❎");
          
          let filter = (reaction,user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❎") && user.id == id;
          const reactions = await msg.awaitReactions(filter,{time:7000});
          if(!reactions) return message.channel.send("無人回應");
          let yes = rcount(reactions,"✅");
          let no = rcount(reactions,"❎");
          
          if(no) return msg.delete();
                
          if(yes)
          {
            if(!items[id].items["001"]) return message.reply("需要崩壞碎片");
            var rand = Math.floor(Math.random()*99 + 1)
            
            if(rand > percent) 
            {
              items[id].items["001"] -= 1;
              fs.writeFileSync("./items.json",JSON.stringify(items));
              return message.reply("精煉失敗，消耗崩壞碎片*1");
            }
            else
            {
              weapons[id].status.re = weapons[id].status.re + 1;
              items[id].items["001"] -= 1;
              fs.writeFileSync("./items.json",JSON.stringify(items));
              fs.writeFileSync("./weapons.json",JSON.stringify(weapons));
              return message.reply("精煉成功，消耗崩壞碎片*1");
            }
          }
          
           return msg.delete();
           break;
           
           
    case "rall":
          man = message.guild.members.get(id);
          if(!weapons[id].status.re)  weapons[id].status.re = 0;
          var percent = 0;
          if(!items[id].items["001"]) return message.reply("需要崩壞碎片");
          let time1 = items[id].items["001"]; 
           
           for(var i = 1; i <= time1 ; i++)
           {
             var rand = Math.floor(Math.random()*99 + 1)
             
              if(weapons[id].status.re < 4) percent = 100;
              else if(weapons[id].status.re < 5) percent = 60;
              else if(weapons[id].status.re < 7) percent = 40;
              else if(weapons[id].status.re < 9) percent = 20;
              else if(weapons[id].status.re < 10) percent = 10;
              else  percent = 7;
             
              items[id].items["001"] -= 1;  
             
             if(rand <= percent) weapons[id].status.re = weapons[id].status.re + 1;
          }
          fs.writeFileSync("./items.json",JSON.stringify(items));
          fs.writeFileSync("./weapons.json",JSON.stringify(weapons));
          
           return message.reply("精煉完畢，消耗碎片："+time1);
           break;
           
     default:
           
         if(weaponlist[args[1]])
         {
           let nw = weaponlist[args[1]];
           var embed = new Discord.RichEmbed()
            .setColor("#86C166")
            .setTitle(nw.name)
            .addField("Max ATK：",nw.atk,true)
            .addField("Max CRI：",nw.cri,true)
           .setThumbnail(nw.img);
          return message.channel.send(embed);
         }
         else return message.channel.send("未知的裝備編號。")
         break;
       }
    }
}

module.exports.help = {
    name: "weapon"
}