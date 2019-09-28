
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const counting = require("./counting.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    let man = message.guild.members.get(id);
    let now = new Date();
    let month = now.getMonth();
  let today = now.getDay();
  let time = now.getTime();
  
  let mei = message.guild.members.get("433287968292339722");
  let guild = message.guild;

  let ch = message.channel;
  
  function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

  let num = Math.floor(parseInt(args));
  if(!Number.isInteger(num)) {var msg1 = await message.reply("請輸入正確整數。"); await sleep(1500); message.delete(); msg1.delete(); return;}
  if(num != counting["now"]) {var msg0 = await message.channel.send("請輸入" + counting["now"]); await sleep(1500); message.delete(); msg0.delete(); return;}
  
  if(num == counting["reward"])
  {
    var rand = Math.floor(Math.random()*49 + 1);
    crystals[id].crystals += rand;
    message.reply("獲得獎勵 " + rand +"<:crystal:431483260468592641>");
    fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
    
    rand = Math.floor(Math.random()*50 + 50);
    counting["reward"] += rand;
  }
  
  counting["now"] += 1;
  
  fs.writeFileSync("./counting.json",JSON.stringify(counting));

  return;
    
}

module.exports.help = {
    name: "countinggame"
}