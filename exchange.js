
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const stars = require("./stars.json");
const crystals = require("./crystals.json");
const exchangelist = require("./exchangelist.json");

module.exports.run = async(bot, message, args) =>{
    var id = message.author.id;
    //if(message.guild.members.get(id).roles.find(x => x.id == "433683517235265537") == null && message.guild.members.get(id).roles.find("id","439412731632680960") == null) return message.channel.send("需要**GM**權限");
    
    if(!args[1]) return message.channel.send("請輸入欲轉換的星石數量。");
    let num = Math.floor(parseInt(args[1]));
    if(!Number.isInteger(num)) return message.channel.send("請輸入正確整數。");
    if(num <= 0) return message.channel.send("請輸入正整數。");
    
    if(!exchangelist[id]) exchangelist[id] = {stars:0}
    if(exchangelist[id].stars + num > 5000) return message.reply("轉換數量超過上限 (已兌換：" + exchangelist[id].stars +"/5000)")
    if(crystals[id].crystals < num*100) return message.reply("水晶不足 (兌換比例:1:100)。")
    crystals[id].crystals -= num*100
    exchangelist[id].stars += num
    stars[id].stars += num
    fs.writeFileSync("./stars.json",JSON.stringify(stars));
    fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
    fs.writeFileSync("./exchangelist.json",JSON.stringify(exchangelist));
    return message.channel.send(`星石已轉換。`);
    
    //return message.channel.send(""+args[1]+"  "+args[2]);
}

module.exports.help = {
    name: "exchange"
}