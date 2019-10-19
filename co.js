const Discord = require('discord.js');
const commando = require('discord.js-commando');
const fs = require("fs");
const items = require("./items.json");
const crystals = require("./crystals.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const vlkylist = require("./vlkylist.json");
const colist = require("./colist.json");
const coplayer = require("./coplayer.json");
const vlkys = require("./vlkys.json");
const stars = require("./stars.json");
const gachalist = require("./gachalist.json");
const co_timer = require("./co_timer.json");
const coinlist = require("./coinlist.json");
const duellist = require("./duellist.json");
const duelcount = require("./duelcount.json");
const exchangelist = require("./exchangelist.json");

String.prototype.len = function()
{ return this.replace(/[^\x00-\xff]/g,"rr").length; }


module.exports.run = async(bot, message, args) => {
  
    var id = message.author.id;
    let man = message.guild.members.get(id);
    //if(message.channel.id != "436575279402450967" && message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("維護中，需要**GM**權限");
    if((!message.channel.name.includes("新指令")) && message.channel.id != "453960579065970709" && message.channel.id != "436575279402450967") return message.reply("請至股票分類頻道使用。");
  
    let ranking = message.guild.roles.find(role => role.name == "LV.20 女武神．強襲").position;
    if(man.hoistRole.position < ranking) return message.reply("限制功能：水文等級20以上開放");
    if(man.roles.find(role => role.name == "bot") != null) return message.reply("機器人別鬧。");

    let now = new Date();
    let today = now.getDate();
    now = new Date(now.getTime() + 8*60*60*1000);
    var embed = new Discord.RichEmbed();
    var i = 0 
    var index = 0;
    var type = "";
    const space = " ";
    var num = 0;
    var name = "";
    var total = 0;
    var price = 0;
    var corp = 0;
    var list = [];
    var len = 0;
    var channel = 0;
    var person = 0;
    var string = "";
    var msg = "";
    const banner = { "A0": "624190304764821524" , "A1":"624190414353727499" , "A2":"624190434662416385", "A3":"624190451888422932", "A4":"624190469324144651", "A5":"624190598198329356", "A6":"624190607656484864", 
                   "A7":"624190628670078977", "A8":"624190634768597005", "A9":"624190640116465665", "S0":"624190677063827467", "S1":"624190685406298152", "S2":"624190692515774465"}
    const orderlist = { "A0":"624213873259446283", "A1":"624213880985485323", "A2":"624213886467440640", "A3":"624213891790143500", "A4":"624213899046158342", "A5":"624213904402415617", "A6":"624213910656122891", 
                       "A7":"624213916775350272", "A8":"624213922731524096", "A9":"624213928771059744", "S0":"624213941018558464", "S1":"624213947612135454", "S2":"624213955308552192"}
    var bo = 0;
    var so = 0;
    const length_day = 86400000;
    if(!(id in coplayer)) coplayer[id] = {own:[], shares:{}, history:[]};
    if(!vlkys[id])  vlkys[id] = {vlkys : {"B0":1}, status: {"now":"B0" ,"lv":1, "exp":0}, rank:{ "B0":"B" }};
    
     function order_renew(type)
    {
      if(!orderlist[type]) return;
      if(type == "B0") return;
      corp = colist[type];
      channel = message.guild.channels.get("624201672012595210");
      embed = new Discord.RichEmbed();
      if(colist[type].enable == 0) return channel.fetchMessage(orderlist[type]).then(msg => msg.edit(embed.setTitle(type + " 公司未啟用。")));   
      if(colist[type].now == 1) return channel.fetchMessage(orderlist[type]).then(msg => msg.edit(embed.setTitle(type + " 新創計劃開放中。"))); 
      var so_s = "";
      var bo_s = "";

      for(i = 0 ; i < corp.buy.length ; i++)
      {
        name = message.guild.members.get(corp.buy[i].owner).displayName.slice(0,6);
        bo_s += `${name} 欲以單價 ${corp.buy[i].price} 買入 ${corp.buy[i].num} 股。`
        bo_s += "\n"
      }
      for(i = 0 ; i < corp.sell.length ; i++)
      {
        name = message.guild.members.get(corp.sell[i].owner).displayName.slice(0,6);
        so_s += `${name} 欲以單價 ${corp.sell[i].price} 賣出 ${corp.sell[i].num} 股。`
        so_s += "\n"
      }
      if(bo_s == "") bo_s = "現無買單"
      if(so_s == "") so_s = "現無賣單"

      embed.setColor("#11adb1").setTitle("公司："+ vlkylist[type].name)
      embed.addField("買單",bo_s,true)
      embed.addField("賣單",so_s,true)
      return channel.fetchMessage(orderlist[type]).then(msg => msg.edit(embed));
    }
    
    function banner_renew(type)
    {
      if(!banner[type]) return;
      if(type == "B0") return;
      corp = colist[type];
      channel = message.guild.channels.get("622000118668984320");
      if(colist[type].enable == 0) return channel.fetchMessage(banner[type]).then(msg => msg.edit(embed.setTitle(type + " 公司未啟用。")));   
      if(colist[type].now == 1) 
      {
        embed.setColor("#86e999").setTitle("公司："+ vlkylist[type].name + " (新創計劃)")
        for(person of Object.keys(corp.newlist)) 
        {
          if(message.guild.members.get(person)) 
          {
            string += (message.guild.members.get(person).displayName.slice(0,5).toLowerCase());
            for(i = 0; i < (9 - message.guild.members.get(person).displayName.slice(0,5).len())/2 ; i++) string += "　" ;
            string +=  "　　" + corp.newlist[person];
          }
          string += "\n";
        }
       embed.addField("對象                  投資額",string)
       return channel.fetchMessage(banner[type]).then(msg => msg.edit(embed));
      }
      else
      {
        total = 0
        for(i of Object.keys(corp.sharelist)) total += corp.sharelist[i]
        embed = new Discord.RichEmbed();
        string = "";
        embed.setColor("#53e119").setTitle("公司："+ vlkylist[type].name)
        embed.addField("經理人",message.guild.members.get(corp.owner).displayName,true)
        embed.addField("參考市價",corp.price,true)
        embed.addField("總釋股數",total,true)
        embed.addField("日成交量",corp.volume,true)
        embed.addField("資本額",corp.funds,true)
        embed.addField("剩餘分紅",corp.bonus,true)
        embed.addField("季度營利",corp.revenue,true)
        embed.addField("碎片售價",corp.pricef,true)
        embed.addField("生產額度",corp.level.limit,true)
        embed.addField("碎片存量",corp.fragments + "/" + corp.level.capacity,true)
        embed.setThumbnail(vlkylist[type].img);
        return channel.fetchMessage(banner[type]).then(msg => msg.edit(embed));
      }
      return;
    }
  
    function ranklist(rank,srank)  // required num of chips for rank up
    {
      if(rank == "None" && srank == "A") return 30;
      if(rank == "None" && srank == "S") return 80;
      if(rank == "B") return 30;
      else if (rank == "A") return 50;
      else if (rank == "S") return 100;
      else if (rank == "SS") return 200;
      else if (rank == "SSS") return 999;
      else if (rank == "EX") return "∞";
      else return console.log("rank error");
      return;
    }  
  
    function rank_up(id, type, num) //vlky rank up
    {
      if(!vlkylist[type]) return console.log("type error");
      if(!(type in vlkys[id].vlkys))
      {
        vlkys[id].rank[type] = "None";
        vlkys[id].vlkys[type] = 0;
      }
      vlkys[id].vlkys[type] += num;  
      let base = ranklist(vlkys[id].rank[type],vlkylist[type].srank);
      while(vlkys[id].vlkys[type] >= base)
        {
          vlkys[id].vlkys[type] -= base;
          if(vlkys[id].rank[type] == "None" && vlkylist[type].srank == "A") vlkys[id].rank[type] = "A";
          else if(vlkys[id].rank[type] == "None" && vlkylist[type].srank == "S") vlkys[id].rank[type] = "S";
          else if(vlkys[id].rank[type] == "A") vlkys[id].rank[type] = "S";
          else if(vlkys[id].rank[type] == "S") vlkys[id].rank[type] = "SS";
          else if(vlkys[id].rank[type] == "SS") vlkys[id].rank[type] = "SSS";
          else if(vlkys[id].rank[type] == "SSS") vlkys[id].rank[type] = "EX";
          base = ranklist(vlkys[id].rank[type],vlkylist[type].srank);
        }
      fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
      return;
    }
    
    function time(value) //回傳對應毫秒代表的時間
    {
      let n = new Date(value);
      return `${n.getMonth()+1}/${n.getDate()} ${n.getHours()}:${n.getMinutes()}`;
    }
  
    function count(list)  //回傳 object內有幾個 key 含>0的值
    {
      i = 0;
      for(person of Object.keys(list))
        {
          if(list[person] > 0 && Number.isInteger(list[person])) i++;
        }
      return i;
    }
    
    function build(corp)  //新建公司流程
    {
      if(corp.now == 0) return console.log("build function error - corp.now == 0");
      total = 0;
      for(person of Object.keys(corp.newlist))
        {
          if(corp.newlist[person] > 0 && Number.isInteger(corp.newlist[person])) 
            {
              total += corp.newlist[person];
            }
        }
      num = 1;
      
      while(total/num > 100) num *= 2;
      while(total/num < 100 && num != 1) num /= 2;
      
      corp.price = num;
      corp.open = num;
      total = 0;
      i = 0;
      for(person of Object.keys(corp.newlist))
        {
          if(corp.newlist[person] > 0 && Number.isInteger(corp.newlist[person])) 
            {
              stars[person].stars += corp.newlist[person] % num;
              corp.newlist[person] -= corp.newlist[person] % num;
              corp.sharelist[person] = Math.floor(corp.newlist[person]/num);
              i += corp.sharelist[person];
              total += corp.newlist[person];
              coplayer[person].shares[corp.type] = corp.sharelist[person];
            }
        }
      corp.funds = total;
      corp.now = 0;
      corp.time = now.getTime();
      
      fs.writeFileSync("./colist.json",JSON.stringify(colist));
      fs.writeFileSync("./stars.json",JSON.stringify(stars));
      fs.writeFileSync("./coplayer.json",JSON.stringify(coplayer));
      channel = message.guild.channels.get("621999946429628416");
      channel.send(vlkylist[corp.type].name + " 公司新創成功。");
      banner_renew(type);
      return;
    }
  
  /*function line*/
  
    if(!args[1]) 
    {
       embed
      .setColor("#91cd85")
      .setTitle("Corporation")
      .addField("發起新創計畫","co new 女武神編號 投資額", true)
      .addField("投資新創計畫","co invest 公司編號 投資額", true)
      .addField("查看公司資訊","co info 公司編號", true)
      .addField("查看公司持股資訊", "co shares 公司編號",true)
      .addField("下碎片買單","co buyf 女武神編號 價格 數量", true)
      .addField("查看碎片買單","co orderf 公司編號", true)
      .addField("下股票買單","co buy 公司編號 價格 股數", true)
      .addField("下股票賣單","co sell 公司編號 價格 股數", true)
      .addField("查看股票買/賣單","co order 公司編號", true)
      .addField("查看當日股價紀錄","co price 公司編號", true)
      .setThumbnail("https://i.imgur.com/KYgwgla.png")
      .setURL("https://mei-1.gitbook.io/workspace/stock/corp")
      if(coplayer[id].own.length)
      {
        embed.addField("公司技術升級","co upgrade 公司編號 技術項目(limit/capacity)", true)
        embed.addField("設定碎片售價","co setf 公司編號 單價", true)
        embed.addField("公司經理人轉讓","co transfer 公司編號 @轉讓對象", true)
      }
      return message.channel.send(embed);
    }
    else
    {
      switch(args[1])
        {
          case "reset":
            if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("需要**GM**權限");
            for(var v_type of Object.keys(vlkylist)) 
              {
                colist[v_type] = 
                {
                  enable: 0, time:0, now:0, newlist:{}, type:v_type, owner:0, level:{limit:1, capacity:1},
                  volume:0, buy:[], sell:[], sharelist:{}, price_history:[], fragments:0, price:0, funds:0, bonus:0,
                  buyf:[], pricef:999, revenue:0
                };
              }
            for( i of Object.keys(banner))
            {
              banner_renew(i);
              order_renew(i);
            }
            for(i of Object.keys(coplayer))
            {
              coplayer[i] = {own:[], shares:{}, history:[]};
            }
            for(i of Object.keys(stars))
            {
              stars[i].stars = 100;
            }
            for(i of Object.keys(coinlist))
            {
              items[i].items["006"] = coinlist[i].now - 1;
            }
            for(i of Object.keys(vlkys))
            {
              vlkys[i] = {vlkys : {"B0":1}, status: {"lv":1, "exp":0}, rank:{ "B0":"B" }, set1:[0,0], set2:[0,0], set3:[0,0], favor:{"B0":0}, marry:{"B0":0}}
            }
            for(i of Object.keys(duellist))
            {
              duellist[i] = {now:0, win:0, lose:0, elo:1000, tower:1}            
            }
            for(i of Object.keys(duelcount))
            {
              duelcount[i] = {pve:3, pvp:3}  
              if(crystals[i].Time != today) duelcount[i].pvp = 0;  // 未簽到者
            }
            for(i of Object.keys(exchangelist))
            {
              exchangelist[i] = {stars:0} 
            }
          
            fs.writeFileSync("./duellist.json",JSON.stringify(duellist));
            fs.writeFileSync("./exchangelist.json",JSON.stringify(exchangelist));
            fs.writeFileSync("./duelcount.json",JSON.stringify(duelcount));
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            fs.writeFileSync("./coplayer.json",JSON.stringify(coplayer));
            fs.writeFileSync("./stars.json",JSON.stringify(stars));
            fs.writeFileSync("./items.json",JSON.stringify(items));
            fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
            return message.reply("reset");
            break;
         
          case "renew":
            if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("需要**GM**權限");
            switch(args[2])
            {
              case "date":
                co_timer.date = 0;
                break;
                
              case "hour":
                co_timer.past = 0;
                break;
                
              case "week":
                co_timer.weekday = 0;
                break;
            }
            fs.writeFileSync("./co_timer.json",JSON.stringify(co_timer));
            return;
            break;
            
          case "setf":
            if(!args[2]) return message.reply("請輸入公司編號。")
            type = args[2];
            if(!(vlkylist[type])) return message.reply("無效的公司編號。")
            if(!colist[type].enable) return message.reply("未啟用的公司編號。");
            if(colist[type].now == 1) return message.reply("為新創公司。");
            corp = colist[type];
            if(corp.owner != id) return message.reply("須為公司經理人。");
            
            if(!args[3]) return message.reply("請輸入欲設置的單價。")
            price = Math.floor(parseInt(args[3]));
            if(!Number.isInteger(price)) return message.reply("請輸入正確整數。");
            if(price < 10) return message.reply("碎片最低售價為10。");
            if(price <= 0) return message.reply("請輸入正整數。");
            
            corp.pricef = price;
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            banner_renew(type)
            return message.reply("碎片價格已設置為：" + price);
            break;
            
          case "transfer":
            if(!args[2]) return message.reply("請輸入公司編號。")
            type = args[2];
            if(!(vlkylist[type])) return message.reply("無效的公司編號。")
            if(!colist[type].enable) return message.reply("未啟用的公司編號。");
            if(colist[type].now == 1) return message.reply("為新創公司。");
            corp = colist[type];
            if(corp.owner != id) return message.reply("須為公司經理人。");
            
            if(!args[3]) return message.reply("請輸入欲轉移的對象。")
            
            var opid = args[3].slice(2,-1);
            if(opid.startsWith("!")) opid = opid.slice(1); //id of first mentioned person
            if(!corp.sharelist[opid]) return message.reply("轉讓對象須為股東。");
            
            if(!coplayer[opid]) coplayer[opid] = {own:[], shares:{}, history:[]};
            coplayer[opid].own.push(type);
            coplayer[id].own.splice(coplayer[id].own.findIndex(x => x == type),1);
            corp.owner = opid;
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            banner_renew(type)
            return message.reply("轉移成功。")
            break;
            
          case "upgrade":
            if(!args[2]) return message.reply("請輸入公司編號。")
            type = args[2];
            if(!(vlkylist[type])) return message.reply("無效的公司編號。")
            if(!colist[type].enable) return message.reply("未啟用的公司編號。");
            if(colist[type].now == 1) return message.reply("為新創公司。");
            corp = colist[type];
            if(corp.owner != id) return message.reply("須為公司經理人。");
            
            function limit(x){ return 4*x*x + 20*x};
            function capacity(x){ return x*x + 10*x};
            if(!args[3]) 
            {
              embed = new Discord.RichEmbed();
              embed.setColor("#e472d2").setTitle("公司：" + vlkylist[corp.type].name)
              embed.addField("生產等級：" + corp.level.limit , "升級所需資金：" + limit(corp.level.limit));
              embed.addField("倉庫等級：" + corp.level.capacity, "升級所需資金：" + capacity(corp.level.capacity));
              return message.channel.send(embed)
            }
            else
            {
              switch(args[3])
              {
                case "limit":
                  if(corp.level.limit == 50) return message.reply("已達技術等級上限。")
                  if(corp.funds < limit(corp.level.limit)) return message.reply("資金不足，當前資金/所需資金：" + corp.funds + "/" +limit(corp.level.limit) +"。")
                  corp.funds -= limit(corp.level.limit);
                  corp.level.limit += 1;
                  fs.writeFileSync("./colist.json",JSON.stringify(colist));
                  return message.reply("升級成功，當前生產等級：" + corp.level.limit + "。剩餘資金/下級所需資金：" + corp.funds + "/" + limit(corp.level.limit) +"。")
                  banner_renew(type)
                  break;
                
                case "capacity":
                  if(corp.level.limit == 100) return message.reply("已達技術等級上限。")
                  if(corp.funds < capacity(corp.level.capacity)) return message.reply("資金不足，當前資金/所需資金：" + corp.funds + "/" +capacity(corp.level.capacity) +"。")
                  corp.funds -= capacity(corp.level.capacity);
                  corp.level.capacity += 1;
                  fs.writeFileSync("./colist.json",JSON.stringify(colist));
                  return message.reply("升級成功，當前倉庫等級：" + corp.level.capacity + "。剩餘資金/下級所需資金：" + corp.funds + "/" + capacity(corp.level.capacity) +"。")
                  banner_renew(type)
                  break;
                  
                default:
                  return message.reply("錯誤的升級項目。")
                  break;
              }
            }
            return;
            break;
            
          case "buyf":
            if(!args[2]) return message.reply("請輸入欲下買單的公司編號。")
            type = args[2];
            if(!(vlkylist[type])) return message.reply("無效的公司編號。")
            if(!colist[type].enable) return message.reply("未啟用的公司編號。");
            if(colist[type].now == 1) return message.reply("新創公司不可下單。");
            corp = colist[type];
            
            if(!args[3]) return message.reply("請輸入欲下單的價格。")
            price = Math.floor(parseInt(args[3]));
            if(!Number.isInteger(price)) return message.reply("請輸入正確整數。");
            if(price <= 0) return message.reply("請輸入正整數。");
            
            if(!args[4]) return message.reply("請輸入欲下單的碎片數量。")
            num = Math.floor(parseInt(args[4]));
            if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
            if(num < 0) return message.reply("請輸入正整數。");
            if(stars[id].stars < num*price) return message.reply("星石數量不足。")
            
            bo = 0;
            if(!(type in vlkys[id].vlkys))
            {
              vlkys[id].rank[type] = "None";
              vlkys[id].vlkys[type] = 0;
            }
              
            if(corp.buyf.find(bo => bo.owner == id))
            {
              bo = corp.buyf.find(bo => bo.owner == id);
              stars[id].stars += bo.num*bo.price;
              stars[id].stars += Math.floor(bo.num*bo.price/1000) > 0 ? Math.floor(bo.num*bo.price/1000) : 1
              index = (corp.buyf.findIndex(bo => bo.owner == id));
              (corp.buyf).splice(index, 1);
            }
            if(num != 0)
            {
              stars[id].stars -= num*price;
              stars[id].stars -= Math.floor(num*price/1000) > 0 ? Math.floor(num*price/1000) : 1
              bo = 
              {
                owner:id,
                price:price,
                num:num,
                time:now.getTime() 
              }
              corp.buyf.push(bo);
              corp.buyf.sort(function(a, b){return b.price - a.price;});
            }
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            fs.writeFileSync("./stars.json",JSON.stringify(stars));
            fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
            message.channel.send("下單完畢。")
            banner_renew(type)
            return;  
            
          case "buy":
            if(!args[2]) return message.reply("請輸入欲下買單的公司編號。")
            type = args[2];
            if(!(vlkylist[type])) return message.reply("無效的公司編號。")
            if(!colist[type].enable) return message.reply("未啟用的公司編號。");
            if(colist[type].now == 1) return message.reply("新創公司不可下單。");
            corp = colist[type];
            
            if(!args[3]) return message.reply("請輸入欲下單的價格。")
            price = Math.floor(parseInt(args[3]));
            if(!Number.isInteger(price)) return message.reply("請輸入正確整數。");
            if(price > Math.ceil(corp.price*1.3)) return message.reply("當前價格上限為 " + Math.ceil(corp.price*1.3));
            if(price < Math.floor(corp.price*0.7)) return message.reply("當前價格下限為 " + Math.floor(corp.price*0.7));
            
            if(!args[4]) return message.reply("請輸入欲下單的股數。")
            num = Math.floor(parseInt(args[4]));
            if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
            if(num < 0) return message.reply("請輸入正整數。");
            if(stars[id].stars < num*price) return message.reply("星石數量不足。")
            /*total = 0;
            for(i of Object.keys(corp.sharelist))
            {
              total += corp.sharelist[i]
            }
            if(num > total) return message.reply("委託數量上限為公司總釋股數 (" + total + ")。")*/
            
            bo = 0;
            if(!(id in corp.sharelist)) corp.sharelist[id] = 0;
            if(!(type in coplayer[id].shares)) coplayer[id].shares[type] = 0;
              
            if(corp.buy.find(bo => bo.owner == id))
            {
              bo = corp.buy.find(bo => bo.owner == id);
              stars[id].stars += bo.num*bo.price;
              stars[id].stars += Math.floor(bo.num*bo.price/1000) > 0 ? Math.floor(bo.num*bo.price/1000) : 1
              index = (corp.buy.findIndex(bo => bo.owner == id));
              (corp.buy).splice(index, 1);
            }
            if(num != 0)
            {
              stars[id].stars -= num*price;
              stars[id].stars -= Math.floor(num*price/1000) > 0 ? Math.floor(num*price/1000) : 1
              bo = 
              {
                owner:id,
                price:price,
                num:num,
                time:now.getTime() 
              }
              len = corp.sell.length;
              for(i = 0 ; i < len ; i++)
              {
                if(corp.sell[i].num == 0) 
                  {
                    (corp.sell).splice(corp.sell.findIndex(so => so.owner == corp.sell[i].owner),1);
                    i--;
                    len = corp.sell.length;
                    continue
                  }
                if(corp.sell[i].price <= bo.price && corp.sell[i].owner != bo.owner )
                {
                  num = corp.sell[i].num < bo.num ? corp.sell[i].num : bo.num;
                  
                  corp.sharelist[corp.sell[i].owner] -= num;
                  corp.sharelist[bo.owner] += num;
                  corp.sell[i].num -= num;
                  bo.num -= num;
                  stars[corp.sell[i].owner].stars += num*corp.sell[i].price;
                  stars[corp.sell[i].owner].stars -= Math.floor(num*corp.sell[i].price/1000) > 0 ? Math.floor(num*corp.sell[i].price/1000) : 1
                  stars[bo.owner].stars += num*(bo.price - corp.sell[i].price);
                  corp.price = corp.sell[i].price;
                  corp.price_history.push("$" + corp.price + "　　"  + time(bo.time));
                  corp.volume += num;
                  coplayer[bo.owner].history.push("以單價 " + corp.sell[i].price + " 星石買入 " + type + " 公司 " + num + " 股   " + time(bo.time));
                  if(corp.sell[i].owner != "433287968292339722")
                  {
                    coplayer[corp.sell[i].owner].history.push("以單價 " + corp.sell[i].price + " 星石賣出 " + type + " 公司 " + num + " 股   " + time(bo.time));
                    coplayer[corp.sell[i].owner].shares[type] = corp.sharelist[corp.sell[i].owner];
                  }
                  if(corp.sell[i].num == 0) 
                  {
                    (corp.sell).splice(corp.sell.findIndex(so => so.owner == corp.sell[i].owner),1);
                    i--;
                    len = corp.sell.length;
                  }
                  if(bo.num == 0) i = corp.sell.length + 1;
                }
              }
              coplayer[bo.owner].shares[type] = corp.sharelist[bo.owner];
              if(bo.num != 0)
                {
                  corp.buy.push(bo);
                  corp.buy.sort(function(a, b){return b.price - a.price;});
                }
            }
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            fs.writeFileSync("./stars.json",JSON.stringify(stars));
            fs.writeFileSync("./coplayer.json",JSON.stringify(coplayer));
            message.channel.send("下單完畢。")
            order_renew(type);
            return;
            
          case "sell":
            if(!args[2]) return message.reply("請輸入欲下賣單的公司編號。")
            type = args[2];
            if(!(vlkylist[type])) return message.reply("無效的公司編號。")
            if(!colist[type].enable) return message.reply("未啟用的公司編號。");
            if(colist[type].now == 1) return message.reply("新創公司不可下單。");
            corp = colist[type];
            
            if(!args[3]) return message.reply("請輸入欲下單的價格。")
            price = Math.floor(parseInt(args[3]));
            if(!Number.isInteger(price)) return message.reply("請輸入正確整數。");
            if(price <= 0) return message.reply("請輸入正整數。");
            if(price > Math.ceil(corp.price*1.3)) return message.reply("當前價格上限為 " + Math.ceil(corp.price*1.3));
            if(price < Math.floor(corp.price*0.7)) return message.reply("當前價格下限為 " + Math.floor(corp.price*0.7));
            
            if(!args[4]) return message.reply("請輸入欲下單的股數。")
            num = Math.floor(parseInt(args[4]));
            if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
            if(num < 0) return message.reply("請輸入正整數。");
            so = 0;
            if(!(id in corp.sharelist)) corp.sharelist[id] = 0;
            if(corp.sharelist[id] < num) return message.reply("持有股數不足。")
            if(!(type in coplayer[id].shares)) coplayer[id].shares[type] = 0;
              
            if(corp.sell.find(so => so.owner == id))
            {
              so = corp.sell.find(so => so.owner == id);
              index = (corp.sell.findIndex(so => so.owner == id));
              (corp.sell).splice(index, 1);
            }
            if(num != 0)
            {
              so = 
              {
                owner:id,
                price:price,
                num:num,
                time:now.getTime() 
              }
              len = corp.buy.length;
              for(i = 0 ; i < len ; i++)
              {
                if(corp.buy[i].price >= so.price && corp.buy[i].owner != so.owner)
                {
                  num = so.num < corp.buy[i].num ? so.num : corp.buy[i].num;
                  
                  corp.sharelist[so.owner] -= num;
                  corp.sharelist[corp.buy[i].owner] += num;
                  so.num -= num;
                  corp.buy[i].num -= num;
                  stars[so.owner].stars += num*so.price;
                  stars[so.owner].stars -= Math.floor(num*so.price/1000) > 0 ? Math.floor(num*so.price/1000) : 1
                  stars[corp.buy[i].owner].stars += num*(corp.buy[i].price - so.price);
                  corp.price = so.price;
                  corp.price_history.push("$" + corp.price + "　　" + time(so.time));
                  corp.volume += num;
                  coplayer[corp.buy[i].owner].history.push("以單價 " + so.price + " 星石買入 " + type + " 公司 " + num + " 股   " + time(so.time));
                  coplayer[so.owner].history.push("以單價 " + so.price + " 星石賣出 " + type + " 公司 " + num + " 股   " + time(so.time));
                  coplayer[corp.buy[i].owner].shares[type] = corp.sharelist[corp.buy[i].owner];
                  if(corp.buy[i].num == 0)
                  {
                    (corp.buy).splice(corp.buy.findIndex(bo => bo.owner == corp.buy[i].owner),1);
                    i--;
                    len = corp.buy.length;
                  } 
                  if(so.num == 0) i = corp.buy.length + 1;
                }
              }
              coplayer[so.owner].shares[type] = corp.sharelist[so.owner];
              if(so.num != 0)
                {
                  corp.sell.push(so);
                  corp.sell.sort(function(a, b){return a.price - b.price;});
                }
            }
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            fs.writeFileSync("./stars.json",JSON.stringify(stars));
            fs.writeFileSync("./coplayer.json",JSON.stringify(coplayer));
            message.channel.send("下單完畢。")
            order_renew(type)
            return;  
          
          case "new":
            if(!args[2]) return message.reply("請輸入欲開立的女武神編號。")
            type = args[2];
            if(!(type in vlkys[id].vlkys) ||  !(vlkylist[type])  ) return message.reply("無效的女武神編號。")
            if(vlkys[id].rank[type] == "A" || vlkys[id].rank[type] == "B" || vlkys[id].rank[type] == "None") return message.reply("需為S階級以上之女武神。")
            if(colist[type].enable) return message.reply("已存在的公司編號。");
            if(coplayer[id].own.length) return message.reply("已擁有新創計畫/公司者不可進行新創。");
            corp = colist[type];
            
            if(!args[3]) return message.reply("請輸入欲投資的星石數量。")
            num = Math.floor(parseInt(args[3]));
            if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
            if(num < 500) return message.reply("請輸入不小於500之整數。");
            if(num > 1000) return message.reply("新創投資額不可高於1000。")
            if(stars[id].stars < num) return message.reply("星石數量不足。")
            
            stars[id].stars -= num;
            corp.newlist[id] = num;
            corp.now = 1;
            corp.owner = id;
            corp.time = now.getTime() 
            corp.enable = 1;
            coplayer[id].own.push(type);
            
            message.reply("新創成功，公司編號 " + type);
            banner_renew(type)
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            fs.writeFileSync("./stars.json",JSON.stringify(stars));
            fs.writeFileSync("./coplayer.json",JSON.stringify(coplayer));
            return;
            break;
            
          case "invest":
            if(!args[2]) return message.reply("請輸入欲投資的公司代號。")
            type = args[2];
            if(!(type in vlkylist)) return message.reply("無效的女武神編號。");
            if(colist[type].now == 0) return message.reply("非新創公司。");
            corp = colist[type];
            
            if(!args[3]) return message.reply("請輸入欲投資的星石數量。")
            num = Math.floor(parseInt(args[3]));
            if(!Number.isInteger(num)) return message.reply("請輸入正確整數。");
            if(num <= 0) return message.reply("請輸入大於0之整數。");
            if(num > 500 && id != corp.owner) return message.reply("個人投資額不可高於500。")
            else if(num > 1000 && id == corp.owner) return message.reply("創立者投資額不可高於1000。")
            else if(num < 500 && id == corp.owner) return message.reply("創立者投資額不可低於500。")
            if(!(id in corp.newlist)) corp.newlist[id] = 0;
            
            if((num - corp.newlist[id]) > stars[id].stars) return message.reply("星石數量不足。")
            if(num >= corp.newlist[id]) stars[id].stars -= (num - corp.newlist[id]);
            else if(num < corp.newlist[id]) stars[id].stars += (corp.newlist[id] - num);
            
            corp.newlist[id] = num;
            
            message.reply("投資成功。");
            
            colist[type] = corp;
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            fs.writeFileSync("./stars.json",JSON.stringify(stars));
            
            if((now.getTime() - corp.time >= 3 * length_day  && count(corp.newlist) >= 5) || count(corp.newlist) >= 20)
              {
                build(corp);
              }
            banner_renew(type)
            return;
            break;
                       
          case "info":
            if(!args[2]) return message.reply("請輸入欲查看的公司代號。")
            type = args[2];
            if(!(type in vlkylist)) return message.reply("無效的女武神編號。")            
            corp = colist[type];
            
            if(colist[type].enable == 0) return message.reply("公司未啟用。")   
            
            if(colist[type].now == 1) 
            {
              embed.setColor("#86e999").setTitle("公司："+ vlkylist[type].name + " (新創計劃)")
              for(person of Object.keys(corp.newlist)) 
                {
                  if(person != "time" && person != "now")
                  {
                    if(message.guild.members.get(person)) 
                    {
                      string += (message.guild.members.get(person).displayName.slice(0,5).toLowerCase());
                      for(i = 0; i < (9 - message.guild.members.get(person).displayName.slice(0,5).len())/2 ; i++) string += "　" ;
                      string +=  "　　" + corp.newlist[person];
                    }
                    string += "\n";
                  }
                }
              embed.addField("對象                  投資額",string)
              message.channel.send(embed);
              return;
            }
            else
            {
              total = 0
              for(i of Object.keys(corp.sharelist)) total += corp.sharelist[i]
                
              embed = new Discord.RichEmbed();
              string = "";
              embed.setColor("#53e119").setTitle("公司："+ vlkylist[type].name)
              embed.addField("經理人",message.guild.members.get(corp.owner).displayName,true)
              embed.addField("參考市價",corp.price,true)
              embed.addField("總釋股數",total,true)
              embed.addField("日成交量",corp.volume,true)
              embed.addField("資本額",corp.funds,true)
              embed.addField("剩餘分紅",corp.bonus,true)
              embed.addField("季度營利",corp.revenue,true)
              embed.addField("碎片售價",corp.pricef,true)
              embed.addField("生產額度",corp.level.limit,true)
              embed.addField("碎片存量",corp.fragments + "/" + corp.level.capacity,true)
              embed.setThumbnail(vlkylist[type].img);
              message.channel.send(embed);
            }
            return;
            break;
            
           case "order":
            if(!args[2]) return message.reply("請輸入欲查看的公司代號。")
            type = args[2];
            if(!(type in vlkylist)) return message.reply("無效的女武神編號。")            
            corp = colist[type];
            
            if(colist[type].enable == 0) return message.reply("公司未啟用。")   
            
            if(colist[type].now == 1) 
            {
              message.channel.send("此為新創公司。");
              return;
            }
            else
            {
              embed = new Discord.RichEmbed();
              var so_string = "";
              var bo_string = "";
              
              for(i = 0 ; i < corp.buy.length ; i++)
              {
                name = message.guild.members.get(corp.buy[i].owner).displayName.slice(0,6);
                bo_string += `${name} 欲以單價 ${corp.buy[i].price} 買入 ${corp.buy[i].num} 股。`
                bo_string += "\n"
              }
              for(i = 0 ; i < corp.sell.length ; i++)
              {
                name = message.guild.members.get(corp.sell[i].owner).displayName.slice(0,6);
                so_string += `${name} 欲以單價 ${corp.sell[i].price} 賣出 ${corp.sell[i].num} 股。`
                so_string += "\n"
              }
              if(bo_string == "") bo_string = "現無買單"
              if(so_string == "") so_string = "現無賣單"
              
              embed.setColor("#11adb1").setTitle("公司："+ vlkylist[type].name)
              embed.addField("買單",bo_string,true)
              embed.addField("賣單",so_string,true)
              message.channel.send(embed);
            }
            return;
            break;  
          
          case "orderf":
            if(!args[2]) return message.reply("請輸入欲查看的公司代號。")
            type = args[2];
            if(!(type in vlkylist)) return message.reply("無效的女武神編號。")            
            corp = colist[type];
            if(colist[type].enable == 0) return message.reply("公司未啟用。")   
            if(colist[type].now == 1) 
            {
              message.channel.send("此為新創公司。");
              return;
            }
            else
            {
              embed = new Discord.RichEmbed();
              var bo_string1 = "";
              
              for(i = 0 ; i < corp.buyf.length ; i++)
              {
                name = message.guild.members.get(corp.buyf[i].owner).displayName.slice(0,6);
                bo_string1 += `${name} 欲以單價 ${corp.buyf[i].price} 買入 ${corp.buyf[i].num} 片。`
                bo_string1 += "\n"
              }
              if(bo_string1 == "") bo_string1 = "現無買單"
              embed.setColor("#f55050").setTitle("公司："+ vlkylist[type].name)
              embed.addField("碎片買單",bo_string1,true)
              message.channel.send(embed);
            }
            return;
            break;
            
          case "price":
            if(!args[2]) return message.reply("請輸入欲查看的公司代號。")
            type = args[2];
            if(!(type in vlkylist)) return message.reply("無效的女武神編號。")            
            corp = colist[type];
            
            if(colist[type].enable == 0) return message.reply("公司未啟用。")   
            
            if(colist[type].now == 1) return message.reply("此為新創公司。")  
           
            embed = new Discord.RichEmbed();
            string = "";
            while(corp.price_history.length > 10) corp.price_history.shift();
            for(i = 0 ; i < corp.price_history.length ; i++)
            {
              string += corp.price_history[i];
              string += "\n";
            }
            if(string == "") string += "無股價變更紀錄。";
            embed.setColor("#53e119").setTitle("公司："+ vlkylist[type].name)
            embed.addField("股價紀錄",string)
            embed.setThumbnail(vlkylist[type].img);
            message.channel.send(embed);
            fs.writeFileSync("./colist.json",JSON.stringify(colist));
            return;
            break;
          
          case "shares":
            if(!args[2]) return message.reply("請輸入欲查看的公司代號。")
            type = args[2];
            if(!(type in vlkylist)) return message.reply("無效的女武神編號。")            
            corp = colist[type];
            
            if(colist[type].enable == 0) return message.reply("公司未啟用。")   
            if(colist[type].now == 1) return message.reply("此為新創公司。")  
           
            embed = new Discord.RichEmbed();
            string = "";
            list = Object.keys(corp.sharelist).sort(function(a, b){return corp.sharelist[b] - corp.sharelist[a]});
            if(list.length > 5) len = 5;
            else len = list.length;
            for(i = 0 ; i < len ; i++)
            {
              person = message.guild.members.get(list[i]).displayName;
              string += person + "　持股數：" + corp.sharelist[list[i]];
              string += "\n";
            }
            if(string == "") string += "無人持股。";
            embed.setColor("#53e119").setTitle("公司："+ vlkylist[type].name)
            embed.addField("持股排名",string)
            embed.setThumbnail(vlkylist[type].img);
            message.channel.send(embed);
            return;
            break;
          
          case "build":
            if(message.guild.members.get(id).roles.find(x => x.name == "GM") == null) return message.channel.send("需要**GM**權限");
            if(!args[2]) return message.reply("請輸入欲查看的公司代號。")
            type = args[2];
            if(!(type in vlkylist)) return message.reply("無效的女武神編號。")
            if(colist[type].now == 0) return message.reply("非新創公司。");
            corp = colist[type];
            build(corp);
            return message.reply("新建成功。");
            break;
      
          default:
            return message.reply("指令不存在。");
        }       
    }
}

module.exports.help = {
    name: "co"
}