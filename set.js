
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

module.exports.run = async(bot, message, args) =>{
  
    if(!vlkys[id])  vlkys[id] = {vlkys : {"B0":1}, status: {"lv":1, "exp":0}, rank:{ "B0":"B" }, set1:[0,0], set2:[0,0], set3:[0,0], favor:{"B0":0}};  // invitailize user vlky

    var id = message.author.id;
    if(!(args[1] && args[2])) return message.reply("請輸入欲設置的女武神編號組。");
             if(args[1] == args[2]) return message.reply("不可設置重複的女武神。")
             if(vlkylist[args[1]] && vlkylist[args[2]])
             {
               if((!Object.keys(vlkys[id].vlkys).includes(args[1])) || vlkys[id].rank[args[1]] == "None") return message.reply("含有未解鎖之女武神。");
               if((!Object.keys(vlkys[id].vlkys).includes(args[2])) || vlkys[id].rank[args[2]] == "None") return message.reply("含有未解鎖之女武神。");
               vlkys[id].set1[0] = args[1];
               vlkys[id].set1[1] = args[2];
               fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
               return message.channel.send("女武神已配置。")
             }
             else return message.channel.send("含有未知的女武神編號。")
  
  return;
}

module.exports.help = {
    name: "set"
}