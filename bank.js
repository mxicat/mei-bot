
const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const energy = require("./energy.json");
const baillist = require("./baillist.json");

module.exports.run = async(bot, message, args) =>{
    
  var id = message.author.id;
  //if(message.guild.members.get(id).roles.find(`name`,"GM") == null)  return message.channel.send("系統維修中");
    //if((!message.channel.name.includes("指令")) && (!message.channel.name.includes("賭場"))) return message.reply("使用指令請至<#336341341053255684>。");
    let man = message.guild.members.get(id);
    let embed = new Discord.RichEmbed()
    
    let crim = message.guild.roles.find(role => role.id == "438267716915298304");
    
      if(!crystals[id]){
        crystals[id] = { 
            Time: 0,
            crystals: 0
        }
      };
      if(!bankfile[id]){
        bankfile[id] = { 
            savings: 0,
            loanings: 0
        }
      };
     
    if(!args[1]) 
    {
       
       embed = new Discord.RichEmbed()
      .setColor("#C99833")
      .setTitle("芽衣銀行 帳戶資訊:bank info")
      .addField("存款服務","輸入 **bank save 水晶數量**",true)
      .addField("提款服務","輸入 **bank withdraw 水晶數量**",true)
      .addField("貸款服務","輸入 **bank loan 水晶數量**"+" (貸款金額上限為身分組等級*2500)")
      .addField("還款服務","輸入 **bank repay 水晶數量**")
      .setThumbnail("https://i.imgur.com/wMfI5Fw.jpg");
      return message.channel.send(embed);
    }
    else
    {
      
      switch(args[1])
      {
        case "info":
          embed = new Discord.RichEmbed()
          .setColor("#C99833")
          .setTitle("芽衣銀行 帳戶資訊:bank info")
          .addField("存款金額",`${bankfile[id].savings} 水晶`)
          .addField("貸款金額",`${bankfile[id].loanings} 水晶`)
          .setThumbnail("https://i.imgur.com/wMfI5Fw.jpg");
          return message.channel.send(embed);
          break;
        
      }
      
      if(!args[2]) return message.reply("請輸入操作的數量。");
      let num = Math.floor(parseInt(args[2]));
      if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
      if(num <= 0) return message.reply("請輸入正整數。");
      
       switch(args[1])
      {
        case "save":
          if(crystals[id].crystals < num) return message.reply("艦長的水晶似乎不夠呢。");
          else
          {
            bankfile[id].savings =  bankfile[id].savings + num;
            crystals[id].crystals = crystals[id].crystals - num;
            fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
            fs.writeFileSync("./bankfile.json",JSON.stringify(bankfile));
            return message.reply("<:crystal:431483260468592641>存款成功。");
          }
          break;
           
        case "withdraw":
          if(bankfile[id].savings < num) return message.reply("艦長的存款似乎不夠呢。");
          else
          {
            bankfile[id].savings =  bankfile[id].savings - num;
            crystals[id].crystals = crystals[id].crystals + num;
            fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
            fs.writeFileSync("./bankfile.json",JSON.stringify(bankfile));
            return message.reply("<:crystal:431483260468592641>提領成功。");
          }
           break;
           
        case "loan":
            if(man.roles.find(role => role.id == "438267716915298304")) return message.reply("囚犯禁止貸款。");
           
            var m = 0;
            if (man.roles.find(x => x.name === "LV.80 血色玫瑰") != null) m = 80;
            if (man.roles.find(x => x.name === "LV.76 次元邊界突破") != null) m = 76;
            if (man.roles.find(x => x.name === "LV.72 血騎士．月煌") != null) m = 72;
            if (man.roles.find(x => x.name === "LV.68 雷電女王的鬼鎧") != null) m = 68;
            if (man.roles.find(x => x.name === "LV.64 白騎士．月光") != null) m = 64;
            if (man.roles.find(x => x.name === "LV.60 異度黑核侵蝕") != null) m = 60;
            if (man.roles.find(x => x.name === "LV.56 銀狼的黎明") != null) m = 56;
            if (man.roles.find(x => x.name === "LV.52 女武神．凱旋") != null) m = 52;
            if (man.roles.find(x => x.name === "LV.48 雪地狙擊") != null) m = 48;
            if (man.roles.find(x => x.name === "LV.44 影舞衝擊") != null) m = 44;
            if (man.roles.find(x => x.name === "LV.40 聖女祈禱") != null) m = 40;
            if (man.roles.find(x => x.name === "LV.35 融核裝．深紅") != null) m = 35;
            if (man.roles.find(x => x.name === "LV.30 驅動裝．山吹") != null) m = 30;
            if (man.roles.find(x => x.name === "LV.25 女武神．遊俠") != null) m = 25;
            if (man.roles.find(x => x.name === "LV.20 女武神．強襲") != null) m = 20;
            if (man.roles.find(x => x.name === "LV.15 戰場疾風") != null) m = 15;
            if (man.roles.find(x => x.name === "LV.10 女武神．戰車") != null) m = 10;
            if (man.roles.find(x => x.name === "LV.5 脈衝裝．緋紅") != null) m = 5;
            if (man.roles.find(x => x.name === "LV.1 領域裝．白練") != null) m = 1;
            if((bankfile[id].loanings + num) > m*2500) return message.reply("艦長的貸款額度似乎不夠呢。");
            else
            {
              bankfile[id].loanings =  bankfile[id].loanings + num;
              crystals[id].crystals = crystals[id].crystals + num;
              crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals - num;
              fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
              fs.writeFileSync("./bankfile.json",JSON.stringify(bankfile));
              return message.reply("<:crystal:431483260468592641>貸款成功。");
            }
          break;
           
        case "repay":
          if(!bankfile[id].loanings) return message.reply("艦長沒有欠芽衣錢呢。");
          if(crystals[id].crystals < num) return message.reply("艦長的水晶似乎不夠呢。");
          else
          {
            if(bankfile[id].loanings <= num) 
            {
              crystals[id].crystals = crystals[id].crystals - bankfile[id].loanings;
              bankfile[id].loanings =  0;   
            }
            else
            {
              bankfile[id].loanings =  bankfile[id].loanings - num;
              crystals[id].crystals = crystals[id].crystals - num;
            }
            
            crystals["433287968292339722"].crystals = crystals["433287968292339722"].crystals + num;
            fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
            fs.writeFileSync("./bankfile.json",JSON.stringify(bankfile));
            return message.reply("<:crystal:431483260468592641>還款成功。");
          }
          break;
           
           
         case "rob":
           let ranking = message.guild.roles.find(role => role.name === "LV.20 女武神．強襲").position;
           if(man.hoistRole.position < ranking) return message.reply("需求水文等級20");
           if(man.roles.find(role => role.id == "438267716915298304")) return message.channel.send("死囚犯給老娘乖乖回去牢裡。");
           if(energy[id].energy < num) return message.reply("艦長的體力似乎不夠呢。");
           if(num > 1000) return message.reply("搶劫上限1000體力。");
           if(!baillist[id].enable) baillist[id] = {time:baillist[id].time , enable:"yes"};
           //if(baillist[id].enable == "no") return message.reply("請等待當前搶劫結束。");
           baillist[id].enable = "no";
           await fs.writeFileSync("./baillist.json",JSON.stringify(baillist));
           let lv = weapons[id].status.lv;
           var rand = Math.floor(Math.random()*100 + 1);
           if(lv > 200) lv = 200;
           let rr = Math.ceil(lv/10);
           
           if(rand <= 10 + rr)
           {
             if(rand < 10) rand = 10;
             let cc = rand * rand * num;
             crystals[id].crystals += cc;
             fs.writeFileSync("./crystals.json",JSON.stringify(crystals));
             baillist[id].time += rand;
             fs.writeFileSync("./baillist.json",JSON.stringify(baillist));
             message.reply("搶劫成功，獲得 " + cc +" <:crystal:431483260468592641>" );
           }
           else
           {
             man.addRole("438267716915298304");
             await message.reply("做壞事的艦長，請進監獄反省反省吧。" );
             if(!baillist[id]) { baillist[id] = {time:0}};
             baillist[id].time += 1;
             fs.writeFileSync("./baillist.json",JSON.stringify(baillist));
           }
           baillist[id].enable = "yes";
           fs.writeFileSync("./baillist.json",JSON.stringify(baillist));
           energy[id].energy -= num;
           fs.writeFileSync("./energy.json",JSON.stringify(energy));
           return;
           break;
       
         
         default :
          return message.reply("芽衣不清楚艦長想要什麼服務呢。");
          break;  
      }
      
      
    }
    
}

module.exports.help = {
    name: "bank"
}