
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
const coinlist = require("./coinlist.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    if(message.guild.members.get(id).roles.find(`name`,"GM") == null) return message.channel.send("需要**GM**權限");
    let man = message.guild.members.get(id);
    let now = new Date();
    let month = now.getMonth();
  let today = now.getDay();
  let time = now.getTime();
  
  let mei = message.guild.members.get("433287968292339722");
  let guild = message.guild;

  let role = message.guild.roles.find(x => x.name == "GM");
 
  id = "286520983563796480";
  vlkys[id] =  {vlkys : {"B0":1}, status: {"now":"B0" ,"lv":1, "exp":0}, rank:{ "B0":"B" }}; 
  items[id].items["006"] = coinlist[id].now - 1;
  fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
  fs.writeFileSync("./coinlist.json",JSON.stringify(coinlist));
    /*fs.writeFileSync("./raidlist.json",JSON.stringify({}));*/
  
  return;
}

module.exports.help = {
    name: "test"
}