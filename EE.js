
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const raidlist = require("./raidlist.json");
const farmlist = require("./farmlist.json");
const energy = require("./energy.json");
const counting = require("./counting.json");
const abysslog = require("./abysslog.json");
const stars = require("./stars.json");
const vlkys = require("./vlkys.json");
const vlkylist = require("./vlkylist.json");
const EElist = require("./EElist.json");

module.exports.run = async(bot, message, args) =>{
  
  var id = message.author.id;
  if(EElist[id] == 1) return message.reply("彩蛋獎勵不能領兩次喔。");
  message.reply("恭喜你發現了彩蛋，獲得獎勵 333 星石。")
  stars[id].stars += 333;
  EElist[id] = 1;
  fs.writeFileSync("./stars.json",JSON.stringify(stars))
  fs.writeFileSync("./EElist.json",JSON.stringify(EElist))
  return;
}

module.exports.help = {
    name: "EE"
}