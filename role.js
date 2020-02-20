
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const rolelist = require("./rolelist.json");

module.exports.run = async(bot, message, args) =>{
    
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    let ranking = message.guild.roles.find(role => role.name === "LV.20 女武神．強襲").position;
    if(man.hoistRole.position < ranking) return message.reply("限制功能：水文等級20以上開放");    
  
    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
   
    if(!args[1]) 
    {
       embed = new Discord.RichEmbed()
      .setColor("#2B5F75")
      .setTitle("專屬身分組系統")
      .addField("role info","查看當前身分組資訊")
      .addField("role buy","購買專屬身分組 (售價: 3000 水晶)")
      .addField("role name (名稱)","設定身分組名稱 (售價: 500 水晶)")
      .addField("role color (16進位色碼)","自訂身分組顏色 (售價: 500 水晶)")
      .addField("role random","隨機身分組顏色 (售價: 500 水晶)")
      .setThumbnail("https://i.imgur.com/guTJB7T.png")
      .setURL("https://mei-1.gitbook.io/workspace/si-fu-qi-gong-neng/role")
      return message.channel.send(embed);
    }
    else
    {
      switch(args[1])
      {
        case "info":
          if(!rolelist[id].role) return message.reply("尚未購買專屬身分組。");
           let rr = message.guild.roles.find(role => role.id === rolelist[id].role);
          embed = new Discord.RichEmbed()
          .setColor(rr.hexColor)
          .setTitle(rr.name)
          return message.channel.send(embed);
          break;
        
        case "delete":
          if(!rolelist[id].role) return message.reply("尚未購買專屬身分組。");
           let rr1 = message.guild.roles.find(role => role.name == args[2]);
           if(!rr1) return message.reply("名稱有誤。")
          let d_id = Object.keys(rolelist).find(id => rolelist[id].role === rr1.id);
          rolelist[d_id].role = 0
          rr1.delete()
          return message.channel.send("身分組已刪除。");
          break;
    
        case "buy":
          if(crystals[id].crystals < 3000) return message.reply("<:crystal:431483260468592641>不足。");
          if(rolelist[id].role) 
          {
            man.addRole(rolelist[id].role);
            return message.reply("已擁有專屬身分組。");
          }
          else
          {
            let guild = message.guild;
            let po = message.guild.roles.find(x => x.id == "433865897690660875").position + 1;
              let newrole = await guild.createRole({
              name: "乂煞氣a"+man.displayName+"乂",
              color:  'DEFAULT',
              mentionable: true,
              position: po
            });
            
            rolelist[id].role = newrole.id;           
            crystals[id].crystals -= 3000;
            man.addRole(newrole.id);
            fs.writeFileSync("./rolelist.json",JSON.stringify(rolelist));
            fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
            return message.reply("專屬身分組購買成功。");
          }
          break;
          
        case "color":
            if(!rolelist[id].role) return message.reply("尚未購買專屬身分組。");
            
            if(!args[2]) return message.reply("請輸入欲更改之顏色(16進位色碼)。");
          
            let role = message.guild.roles.find(role => role.id === rolelist[id].role);
            if(!role.color){
              if(crystals[id].crystals < 500) return message.reply("<:crystal:431483260468592641>不足。");
              crystals[id].crystals -= 500;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
             }
          
            role.setColor(args[2]);
            if(!role.color)  role.setColor("#00896C");
          
            return message.reply("身分組顏色設置成功。"); 
          break;
           
        case "random":
            if(!rolelist[id].role) return message.reply("尚未購買專屬身分組。");
            
            let role1 = message.guild.roles.find(role => role.id === rolelist[id].role);
          
            if(!role1.color){
              if(crystals[id].crystals < 500) return message.reply("<:crystal:431483260468592641>不足。");
              crystals[id].crystals -= 500;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
             }
                 
            role1.setColor(getRandomColor());
                      
            return message.reply("身分組顏色設置成功。"); 
            break;
           
        case "name":
            if(!rolelist[id].role) return message.reply("尚未購買專屬身分組。");
            if(!args[2]) return message.reply("請輸入欲更改之名稱。");
            
            let name = message.content.slice(10);
            let role2 = message.guild.roles.get(rolelist[id].role);
            if (name.length > 100) return message.reply("太長了。");
            if(role2.name.includes("乂煞氣a")){
              if(crystals[id].crystals < 500) return message.reply("<:crystal:431483260468592641>不足。");
              crystals[id].crystals -= 500;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
             }
          
            role2.setName(name);
            return message.reply("身分組名稱設置成功。"); 
            break;
        
        case "reset":
          if(message.guild.members.get(id).roles.find(x => x.id == "433683517235265537") == null) return message.channel.send("需要**GM**權限");
          rolelist[id] = {role:0 };
          fs.writeFileSync("./rolelist.json",JSON.stringify(rolelist)); 
          return message.reply("重置完成");
          break;
         default :
          return message.reply("芽衣不清楚艦長想要什麼服務呢。");
          break;  
          
          
        case "check":
          if(message.guild.members.get(id).roles.find(x => x.id == "433683517235265537") == null) return message.channel.send("需要**GM**權限");
          for(var person of Object.keys(rolelist)) 
          {   
           if(!message.guild.members.get(person))
           {
             let prole = rolelist[person].role
             if(prole) 
             {
               let name = message.guild.roles.find(x => x.id == prole).name;
               message.channel.send(name);
               //prole.delete;
               //rolelist[person].role = 0;
             }
           }
          }
          return;
          break;
      }
    }
    
}

module.exports.help = {
    name: "role"
}