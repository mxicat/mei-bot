const Discord = require("discord.js");
const commando = require("discord.js-commando");
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
const duellist = require("./duellist.json");
const coinlist = require("./coinlist.json");
const duelcount = require("./duelcount.json");
const exchangelist = require("./exchangelist.json");

module.exports.run = async (bot, message, args) => {
  var id = message.author.id;
  if (!message.guild.members.get(id).roles.find(x => x.name, "GM"))
    return message.channel.send("需要**GM**權限");
  let man = message.guild.members.get(id);
  let now = new Date();
  let month = now.getMonth();
  let today = now.getDate();
  let time = now.getTime();

  let mei = message.guild.members.get("433287968292339722");
  let guild = message.guild;
  var i = 0;
  let role = message.guild.roles.find(x => x.name == "GM");

  
  let price = require('crypto-price')
price.getCryptoPrice('USD', 'DOGE').then(obj => { // Base for ex - USD, Crypto for ex - ETH 
    console.log(obj.price)
}).catch(err => {
    console.log(err)
});
  
  /*for(i of Object.keys(duellist))
  {
    duellist[i].win = 0;
    duellist[i].lose = 0;
    duellist[i].elo = 1000;           
  }*/
  /*for(i of Object.keys(duelcount))
  {
    if(!duelcount[i].match) duelcount[i].match = {now:0, list:[], history:[]}
    duelcount[i].match["history"] = []
  }
  //duelcount["490526196820606998"].pve += 3
  fs.writeFileSync("./duellist.json",JSON.stringify(duellist));
    
  fs.writeFileSync("./duelcount.json",JSON.stringify(duelcount));
*/

  //message.reply(message.guild.roles.find(role => (role.name = "@everyone")).id);
  
  //items["286520983563796480"].items["006"] += 2000;
  //fs.writeFileSync("./items.json", JSON.stringify(items));
  
  
  return;
};

module.exports.help = {
  name: "test"
};
