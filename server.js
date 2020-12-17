
/*//keep it alive
const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 200000);
//keep it alive*/
const token = ENV['SECRET']
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const bot = new commando.Client({
    commandPrefix: 'Mei:',
  owner: '221465966385561600',
    disableEveryone: true,
    unknownCommandResponse: false
    });
const user = new Discord.User();
const fs = require("fs");
bot.commands = new Discord.Collection();

fs.readdir("./",(err,files)=>{
    if(err) console.log(err);

    let jsfile = files.filter(f=> f.split(".").pop() == "js" && f != "server.js");
    if(jsfile.length <= 0){
        console.log('Unknown Command.');
    }

    jsfile.forEach((f,i)=>{
       let props = require(`./${f}`);
       console.log(`${f} loaded`) 
       bot.commands.set(props.help.name, props);
    });
})

const prefix = '.';
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const itemlist = require("./itemlist.json");
const weaponlist = require("./weaponlist.json");
const weapons = require("./weapons.json");
const items = require("./items.json");
const energy = require("./energy.json");
const killed = require("./killed.json");

var enable = 0;
var rage = 0;

let votelist = new Set();
let cooldownlist = new Set();

function explist(lv)  // required exp for lv up
    {
      if(lv == 1) return 11;
      else if (lv < 15) return lv*lv*4 + 40*lv - 50;
      else if (lv < 30) return lv*lv*6 + 50*lv - 50;
      else if (lv < 50) return lv*lv*8 + 60*lv - 50;
      return lv*lv*20 + 100*lv - 50;
    }

function lvup(id,exp)
{
  weapons[id].status.exp += exp;
  while( weapons[id].status.exp >= explist(weapons[id].status.lv))
  {
    weapons[id].status.exp -= explist(weapons[id].status.lv);
    weapons[id].status.lv += 1;
  }
   weapons[id].status.exp = Math.ceil(weapons[id].status.exp);
  fs.writeFileSync("./weapons.json",JSON.stringify(weapons));
}
 
bot.on("ready",function() {
    
    console.log("Ready!");
});

/*bot.on("messageDelete", (message,user) => {
  
  if(message.author.id == "221465966385561600"){
    let emb = new Discord.RichEmbed()
    .setAuthor(message.author.username , message.author.avatarURL)
    .setDescription(message.content)
    .addField("Channel",message.channel.name)
    .setTimestamp()
    message.channel.send(emb);
    message.reply("還想自刪阿底迪")
  }
})*/

bot.on('message', (message) => {
    //return;  //sleep
    if(message.author.id == '433287968292339722') return;
    

    //var messageArray = message.content.slice(prefix.length).trim().split(" ");
    var messageArray = message.content.split(" ");
    var cmd = messageArray[0];
    var args = messageArray;
    if(args[1]) {var opid = args[1].slice(2,-1);  
                 if(opid.startsWith("!")) opid = opid.slice(1);}   //id of first mentioned person
    if(message.channel.type == "dm" && cmd == "EE")
    {
       let commandfile = bot.commands.get(cmd);
       commandfile.run(bot,message,args);
       return;
    }
    if(message.channel.type == "dm" ) return message.author.send("芽衣才沒空和你聊天呢");
  
    var id = message.author.id;
    let now = new Date();
    let today = now.getDay();
    let time = now.getTime();
    let man = message.guild.members.get(id);
    var gu = bot.guilds.get("586891417440485383")
    var ch2 = gu.channels.get("586891418493124619")
    if((message.attachments.array())[0] && message.channel.id != "538904002885320705")
    {
      let ch = message.guild.channels.find(c => c.id == "538904002885320705");
      if(ch) ch.send((message.attachments.array())[0].url);
    }
    
    let tempmute = function(id,ptime){
        let tomute = message.guild.members.get(id);
        let muterole = message.guild.roles.find(role => role.name === "泡水海豹");
        tomute.addRole(muterole.id).catch( err => console.log(err));
        killed[id].seal = 1;
        killed[id].time = time;
        killed[id].ptime = ptime;
        fs.writeFileSync("./killed.json",JSON.stringify(killed));
    }
     
     function sleep () {
        message.guild.channels.find(channel => channel.id === "336341341053255684").overwritePermissions(message.guild.roles.find(role => role.name === "@everyone"),{ 'SEND_MESSAGES': false});
  setTimeout(function(){ message.guild.channels.find(channel => channel.id === "336341341053255684").overwritePermissions(message.guild.roles.find(role => role.name === "@everyone"),{ 'SEND_MESSAGES': true});
     }, 5000);
}
    
    let inf = bot.commands.get("initialize");
    inf.run(bot,message,args);
  
    let co_renew = bot.commands.get("co_renew");
    co_renew.run(bot,message,args);
  
    if(message.channel == message.guild.channels.find(channel => channel.id === "446226468117413903"))
    {
      if(cooldownlist.has(id)) {message.reply("CD時間3秒。");  return message.delete();}
      let cg = bot.commands.get("countinggame");
      cg.run(bot,message,args);
      cooldownlist.add(id);
      setTimeout(function(){ cooldownlist.delete(id) },3000);
      return;
    }
    
    let commandfile = bot.commands.get(cmd);
    if(commandfile) 
    {
      if(cooldownlist.has(id)) {message.reply("指令CD時間1秒。");  return message.delete();}
      else
      {
        cooldownlist.add(id);
        setTimeout(function(){ cooldownlist.delete(id) },1000);
        commandfile.run(bot,message,args);
      }
    }
    
    
    switch(cmd){
    case "DeepDarkFantasy":
      if(message.channel.id != "450362248427208714") return;
      if(gu.members.get(id)) return gu.members.get(id).send("艦長已經是個成熟的大人了，該學會自己開車了。");
      man.send("想不到你是這樣的" + man.displayName)
      var invite = ch2.createInvite( {maxUses:1} ) 
      .then(invite => man.send(invite.url))
      .catch(console.error);
      return;
      break;
      
    case"DDF":
      var role = message.guild.roles.find(role => role.id == "626732755371163659");
      if(!role) return;
      man.addRole("626732755371163659");
      message.reply("Deep♂Dark♂Fantasy")
      return;
      break;
    
    case"我要入學":
      var role = message.guild.roles.find(role => role.id == "622484410825965598");
      if(!role) return;
      man.addRole("622484410825965598");
      message.reply("歡迎入學")
      return;
      break;
    case "ttoday":
      let now1 = new Date();
      message.channel.send(`今天是星期${now1.getDay()}`);
      message.channel.send(`今天是${now1.getMonth()}月${now1.getDate()}日`);
      message.channel.send(`現在是${now1.getHours()}點`);
      break
    case"saym":
      if(man.roles.find(x => x.name == "bot") != null) return message.reply("機器人別鬧。");
      message.channel.send(message.content.slice(5));
      message.delete();
      break;
    case"mei<:crystal:431483260468592641>":
        let embed = new Discord.RichEmbed()
      .setColor("#DC9FB4")
      .addField("Mei",`水晶數量： **${crystals["433287968292339722"].crystals}**`)
      .setThumbnail("https://i.imgur.com/tvAkopu.png");
       return message.channel.send(embed);
        break;
        
      case"kreset":
        enable = 0;
      break;   
        
    case "kill":
      return;
      if(man.roles.find(role => role.name === "bot") != null) return message.channel.send("請不要用機器人幹壞事。");
      if(!message.channel.name.includes("指令")) return message.reply("使用指令請至<#336341341053255684>。");
      if(man.roles.find(role => role.id === "438267716915298304")) return message.channel.send("請不要做壞事。");
      if(!message.guild.members.get(opid)) return message.channel.send("請TAG正確的對象。");
      if(enable || (message.guild.members.get(opid).roles.find(role => role.name == "泡水海豹") != null)) return message.channel.send("請等待現階段的審判結束。");
      if(message.guild.members.get(opid).user.bot) return message.reply("請不要殺機器人。");
      if(id == opid) return message.reply("請不要殺自己。");
      /////////////////////////////initialize//////////////////////////////////////////
      if(!weapons[id])  weapons[id] = {weapons : {"B0":1}, status: {"now":"B0","lv":1, "exp":0}}; 
      if(!energy[id])  energy[id] = {energy : 10};
      if(!items[id]) {items[id] = {items : {"000":0}};}
      votelist.clear();
      rage = 0;
      ///////////////////////////////////////////////////////////////////////
        
      if(!items[id].items["000"]) return message.channel.send("需要獵人執照");
      if(energy[id].energy < 10) return message.channel.send("體力不足(需求:10)");
        
        message.channel.send("海豹終結者程序啟動。");
        message.channel.send(`<@&434214765070516235>，大家都進來吧。認為${args[1]}欠制裁的人打+1，我統計一下人數。`);
        
        enable = 1;
        items[id].items["000"] --;
        energy[id].energy -= 10;
        fs.writeFileSync("./items.json",JSON.stringify(items));
        fs.writeFileSync("./energy.json",JSON.stringify(energy));
        
        setTimeout(function(){
          var count = 0;
          votelist.forEach((value)=> count += 1);
          
          let tem = 10 * count + 50;
          let crihit = 0;
          
          let lv = weapons[id].status.lv;
          tem += 10*lv;
          let re = 0;
          if(weapons[id].status.re) re = weapons[id].status.re;
          let nw = weaponlist[weapons[id].status.now];
          if(nw.name.startsWith("B") && lv > 25) lv = 25;
          if(nw.name.startsWith("A") && lv > 35) lv = 35;
          
          let atk = Math.ceil((nw.atk*(lv/nw.maxlv) + 5 * re )*(1 + 0.01*re));
          let cri = Math.ceil(nw.cri*(lv/nw.maxlv));
          
          tem = Math.ceil(tem*atk/300);
          if(Math.floor(Math.random()*100 + 1) <= Math.ceil(cri/2)) crihit = 1;
          
          if(crihit)
          {
            tem = Math.ceil(tem * 1.5);
            message.channel.send("你對海豹造成了爆擊。");
          }
          let exp = Math.ceil(tem/500);
          lvup(id,exp);
          
          let pTime = count * tem * 600;
          if(pTime > 600000) pTime = 600000;
          if(pTime) message.channel.send(`${args[1]}將被浸入 **${tem}** 度的水桶 **${pTime/1000}** 秒，請深刻反省自己的曬卡行為。`);
          if(pTime) message.channel.send("https://i.imgur.com/iRsIZcC.jpg");
          else 
          {
            enable = 0;
            return message.channel.send("海豹逃過了一劫。");
          }
          if(!crystals[id]){ crystals[id] = { Time: today,crystals: 10 };}
          if(!crystals[opid]){crystals[opid] = { Time: today,crystals: 10};}
          
          crystals[id].crystals = crystals[id].crystals + Math.ceil(pTime/5000);
          crystals[opid].crystals = crystals[opid].crystals + Math.ceil(pTime/10000);
          votelist.forEach((listid)=> {
            if(crystals[listid]) crystals[listid].crystals = crystals[listid].crystals + Math.ceil(pTime/30000);
            else crystals[listid] = { Time: today, crystals: 10 + Math.ceil(pTime/30000)};
            if(weapons[listid]) lvup(listid,Math.ceil(pTime/40000));
            else 
            {
              weapons[listid] = {weapons : {"B0":1}, status: {"now":"B0","lv":1, "exp":0}}; 
              lvup(listid,Math.ceil(pTime/40000));
            }
          });
          
          let ee = new Discord.RichEmbed()
          .setColor("#DC9FB4")
          .addField(message.guild.members.get(id).displayName,"獵殺海豹獲得 "+  Math.ceil(pTime/5000) + " 獎勵水晶以及 " + exp + " 武器經驗")
          .addField(message.guild.members.get(opid).displayName,"泡水海豹獲得 "+  Math.ceil(pTime/10000) + " 撫卹水晶")
          .addField("Others","參與者各獲得 "+  Math.ceil(pTime/30000) + " 分贓水晶以及 "+  Math.ceil(pTime/40000) + " 武器經驗")
          .setThumbnail("https://i.imgur.com/O9WA8tx.png");
          if(pTime)message.channel.send(ee);
          fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
          if(pTime)tempmute(opid,pTime);
          enable = 0;
        }, 20 * 1000);
        break;
      
     case"+1":
       rage = rage + 1;
       if((!votelist.has(id)) && enable) votelist.add(id);
       else if(enable) return message.delete();
       else return;
      break;
   }
    return;
});

bot.login(token).catch(console.error);

