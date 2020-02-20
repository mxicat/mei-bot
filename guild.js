
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const guildlist = require("./guildlist.json");

module.exports.run = async(bot, message, args) =>{
    
    var id = message.author.id;
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    //let ranking = message.guild.roles.find(role => role.name === "LV.20 女武神．強襲").position;
    //if(man.hoistRole.position < ranking) return message.reply("限制功能：水文等級20以上開放");    
  
    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
   
    var gu_name = "";
    var gu = "";
    var role = "";
    var role_id = 0;
    var opid = 0;
    var op = 0;
  
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#2B5F75")
      .setTitle("艦團系統")
      .addField("guild info","查看當前艦團資訊")
      .addField("guild add @指定對象","招收艦團成員")
      .addField("guild remove @指定對象","移除艦團成員")
      .addField("guild name (名稱)","設定艦團身分組名稱")
      .addField("guild color (16進位色碼)","自訂艦團身分組顏色")
      .addField("guild random","隨機艦團身分組顏色")
      .addField("guild icon (圖片連結)","設定艦團圖示")
      .setThumbnail("https://i.imgur.com/YRZhV90.png")
      .setURL("https://mei-1.gitbook.io/workspace/server/guild")
      return message.channel.send(embed);
    }
    else
    {
      switch(args[1])
      {
        case "info":
          for(var g of Object.keys(guildlist))
          {
            if(message.guild.members.get(id).roles.find(x => x.id == guildlist[g].role)) 
            {
              gu = guildlist[g];
              role_id = guildlist[g].role;
              break;
            }
            else gu = 0
          }
          if(!gu) return message.reply("未加入艦團。")
          role = message.guild.roles.find(x => x.id === role_id);
          embed = new Discord.RichEmbed()
          .setColor(role.hexColor)
          .addField("艦團長",message.guild.members.get(gu.owner).displayName,true)
          .addField("艦團人數",(role.members.array()).length,true)
          .setTitle(role.name)
          if(gu.icon) embed.setThumbnail(gu.icon)
          
          return message.channel.send(embed);
          break;
          
        case "build":
          if(message.guild.members.get(id).roles.find( x => x.name == "GM") == null)  return 
          gu_name = args[2]
          role = args[3]
          guildlist[guildlist.no] = 
          {  
            "owner": id,
            "name": gu_name,
            "role": role,
            "icon": 0
          }
          guildlist.no += 1;
          fs.writeFileSync("./guildlist.json",JSON.stringify(guildlist));
          return message.reply("艦團建立成功。");
          break;
        
        case "transfer":
          for(var g of Object.keys(guildlist))
          {
            if(guildlist[g].owner == id)
            {
              gu = guildlist[g]
              break;
            }
            else gu = 0
          }
          if(!gu) return message.reply("艦團長專用。")
          if(args[2]) {
            opid = args[2].slice(2,-1);
            if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
          else return message.channel.send("請指定對象。");
          gu.owner = opid;
          fs.writeFileSync("./guildlist.json",JSON.stringify(guildlist))
          return message.reply("艦團長轉任成功。")
          break;
          
        case "add":
          for(var g of Object.keys(guildlist))
          {
            if(guildlist[g].owner == id)
            {
              gu = guildlist[g]
              break;
            }
            else gu = 0
          }
          if(!gu) return message.reply("艦團長專用。")
          if(args[2]) {
            opid = args[2].slice(2,-1);
            if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
          else return message.channel.send("請指定對象。");
          op = message.guild.members.get(opid);
          op.addRole(gu.role);
          return message.reply("成員新增成功。");
          break;
          
        case "remove":
          for(var g of Object.keys(guildlist))
          {
            if(guildlist[g].owner == id)
            {
              gu = guildlist[g]
              break;
            }
            else gu = 0
          }
          if(!gu) return message.reply("艦團長專用。")
          if(args[2]) {
            opid = args[2].slice(2,-1);
            if(opid.startsWith("!")) opid = opid.slice(1);
                }    //id of first mentioned person
          else return message.channel.send("請指定對象。");
          op = message.guild.members.get(opid);
          op.removeRole(gu.role);
          return message.reply("成員移除成功。");
          break;
          
        case "color":
          for(var g of Object.keys(guildlist))
          {
            if(guildlist[g].owner == id)
            {
              gu = guildlist[g]
              break;
            }
            else gu = 0
          }
          if(!gu) return message.reply("艦團長專用。")
          if(!gu.role) return message.reply("尚未擁有艦團身分組。");
            
          if(!args[2]) return message.reply("請輸入欲更改之顏色(16進位色碼)。");
          
          role = message.guild.roles.find(role => role.id === gu.role);
          
          role.setColor(args[2]);
          if(!role.color)  role.setColor("#00896C");
          return message.reply("身分組顏色設置成功。"); 
          break;
        
        case "icon":
          for(var g of Object.keys(guildlist))
          {
            if(guildlist[g].owner == id)
            {
              gu = guildlist[g]
              break;
            }
            else gu = 0
          }
          if(!gu) return message.reply("艦團長專用。")
          if(!gu.role) return message.reply("尚未擁有艦團身分組。");
            
          if(!args[2]) return message.reply("請輸入欲設定之圖片連結。");
          
          gu.icon = args[2]
          fs.writeFileSync("./guildlist.json",JSON.stringify(guildlist))
          return message.reply("艦團圖示設置成功。"); 
          break;
           
        case "random":
          for(var g of Object.keys(guildlist))
          {
            if(guildlist[g].owner == id)
            {
              gu = guildlist[g]
              break;
            }
            else gu = 0
          }
          if(!gu) return message.reply("艦團長專用。")
          if(!gu.role) return message.reply("尚未擁有艦團身分組。");
            
          role = message.guild.roles.find(role => role.id === gu.role);       
          role.setColor(getRandomColor());          
          return message.reply("身分組顏色設置成功。"); 
          break;
           
        case "name":
          for(var g of Object.keys(guildlist))
          {
            if(guildlist[g].owner == id)
            {
              gu = guildlist[g]
              break;
            }
            else gu = 0
          }
          if(!gu) return message.reply("艦團長專用。")
          if(!gu.role) return message.reply("尚未擁有艦團身分組。"); 
          role = message.guild.roles.find(role => role.id === gu.role);
          
          if(!args[2]) return message.reply("請輸入欲更改之名稱。");
          let name = message.content.slice(10);
          if (name.length > 100) return message.reply("太長了。");
          role.setName(name);
          return message.reply("身分組名稱設置成功。"); 
          break;
        
        default:
          message.reply("請輸入正確指令。")
          break;
      }
    }
    
}

module.exports.help = {
    name: "guild"
}