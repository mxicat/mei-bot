
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
  let man = message.guild.members.get(id);
  let embed = new Discord.RichEmbed()
  
  switch(message.channel.id)
  {
        case "652876415485870102":
          if(man.roles.find(role => role.id == "657182668244516865"))
          {
            man.removeRole("657182668244516865");
            return message.reply("身分組已移除。")
          }
          else
          {
            man.addRole("657182668244516865");
            return message.reply("身分組已新增。")
          }
          break;
        
        case "687561312380911617":
          if(man.roles.find(role => role.id == "687564020210729103"))
          {
            man.removeRole("687564020210729103");
            return message.reply("身分組已移除。")
          }
          else
          {
            man.addRole("687564020210729103");
            return message.reply("身分組已新增。")
          }
          break;
      
        case "685459429084102660":
          if(man.roles.find(role => role.id == "686795561126330392"))
          {
            man.removeRole("686795561126330392");
            return message.reply("身分組已移除。")
          }
          else
          {
            man.addRole("686795561126330392");
            return message.reply("身分組已新增。")
          }
          break;
      
         case "628956893972267018":
          if(man.roles.find(role => role.id == "641671087456780338"))
          {
            man.removeRole("641671087456780338");
            return message.reply("身分組已移除。")
          }
          else
          {
            man.addRole("641671087456780338");
            return message.reply("身分組已新增。")
          }
          break;
      
          case "673540878001897502":
          if(man.roles.find(role => role.id == "675592912851173376"))
          {
            man.removeRole("675592912851173376");
            return message.reply("身分組已移除。")
          }
          else
          {
            man.addRole("675592912851173376");
            return message.reply("身分組已新增。")
          }
          break;
      
        
    default:
      return message.reply("非遊戲頻道。")
      break;
  }  
}
    


module.exports.help = {
    name: "gamerole"
}