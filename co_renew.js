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

module.exports.run = async(bot, message, args) =>{
  
    let now = new Date();
    now = new Date(now.getTime() + 8*60*60*1000);
    var man = 0;
    var embed = new Discord.RichEmbed();
    var i = 0 
    var type = "";
    var num = 0;
    var total = 0;
    var index = 0;
    var corp = 0;
    var channel = 0;
    var person = 0;
    var list = [];
    var rand = 0;
    var len = 0;
    var bo = 0;
    var so = 0;
    var string = "";
    const length_day = 86400000;
    const countlist = ["A0","A1","A2","A3","A4","A5","A6","A7","A8","A9","S0","S1","S2"];
    const banner = { "A0": "624190304764821524" , "A1":"624190414353727499" , "A2":"624190434662416385", "A3":"624190451888422932", "A4":"624190469324144651", "A5":"624190598198329356", "A6":"624190607656484864", 
                   "A7":"624190628670078977", "A8":"624190634768597005", "A9":"624190640116465665", "S0":"624190677063827467", "S1":"624190685406298152", "S2":"624190692515774465"}
    const orderlist = { "A0":"624213873259446283", "A1":"624213880985485323", "A2":"624213886467440640", "A3":"624213891790143500", "A4":"624213899046158342", "A5":"624213904402415617", "A6":"624213910656122891", 
                       "A7":"624213916775350272", "A8":"624213922731524096", "A9":"624213928771059744", "S0":"624213941018558464", "S1":"624213947612135454", "S2":"624213955308552192"}
     
    function order_renew(type)
    {
      if(!orderlist[type]) return;
      if(type == "B0") return;
      corp = colist[type];
      channel = message.guild.channels.get("624201672012595210");
      if(!channel) return;
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
      if(type == "B0") return;
      corp = colist[type];
      channel = message.guild.channels.get("622000118668984320");
      if(!channel) return;
      embed = new Discord.RichEmbed();
      if(!banner[type]) return;
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
        embed = new Discord.RichEmbed();
        string = "";
        embed.setColor("#53e119").setTitle("公司："+ vlkylist[type].name)
        embed.addField("經理人",message.guild.members.get(corp.owner).displayName,true)
        embed.addField("參考市價",corp.price,true)
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
      return `${n.getMonth()}/${n.getDate()} ${n.getHours()}:${n.getMinutes()}`;
    }
  
    function count(list)  //回傳 object內有幾個 key 含 >0 的值
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
      
      while(total/num > 50) num *= 2;
      while(total/num < 50 && num != 1) num /= 2;
      
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
    
    ////////////////////////////////////////////
    
    if( now.getDay() == 1 && now.getDate() != co_timer.weekday) //周更
    {
      console.log("周更");
      for(type of Object.keys(colist))  
      {
         corp = colist[type];
         if(corp.enable && corp.now != 1)
         {
           if(corp.type.startsWith("S"))  //S級碎片生產
           {
             if(corp.level.capacity - corp.fragments > 0)
             {
               corp.fragments += corp.level.limit;
               if( corp.fragments > corp.level.capacity) corp.fragments = corp.level.capacity;
             }
             
           }
           
           total = 0;                                 // 總股數
           for(person of Object.keys(corp.sharelist)) // 公司分紅
           {
             if(corp.sharelist[person] > 0 && Number.isInteger(corp.sharelist[person])) total += corp.sharelist[person];
           }
           if(corp.funds >= total*10)
           {
             num = Math.floor(corp.funds/total);
             for(person of Object.keys(corp.sharelist))
             {
               if(corp.sharelist[person] > 0 && Number.isInteger(corp.sharelist[person])) 
               {
                 stars[person].stars += corp.sharelist[person]*num;
                 corp.funds -= corp.sharelist[person]*num;
               }
             }
           }
         }
        banner_renew(type);
      }
      co_timer.weekday = now.getDate();
      fs.writeFileSync("./colist.json",JSON.stringify(colist));
      fs.writeFileSync("./stars.json",JSON.stringify(stars));
      fs.writeFileSync("./co_timer.json",JSON.stringify(co_timer));
      return;
    }
    
    if(now.getDate() != co_timer.date)  //日更
    {
      console.log("日更");
      for(type of Object.keys(colist))  
      {
         corp = colist[type];
         if(corp.enable && corp.now != 1)
         {
           if(!corp.type.startsWith("S"))  //A級碎片生產
           {
             if(corp.level.capacity - corp.fragments > 0)
             {
               corp.fragments += corp.level.limit;
               if( corp.fragments > corp.level.capacity) corp.fragments = corp.level.capacity;
               banner_renew(type);
             }
           }   
           corp.volume = 0;
           len = corp.buy.length;      //清空買賣單
           for(i = 0 ; i < len ; i++)
           {
             stars[corp.buy[i].owner].stars += corp.buy[i].num*corp.buy[i].price
             stars[corp.buy[i].owner].stars += Math.floor(corp.buy[i].num*corp.buy[i].price/1000) > 0 ? Math.floor(corp.buy[i].num*corp.buy[i].price/1000) : 1
           }
           while(corp.buy.length) corp.buy.pop();
           while(corp.sell.length) corp.sell.pop();
           if(type != "BO") order_renew(type);
         }
         else if(corp.enable && corp.now == 1)  //新創
         {
           if((now.getTime() - corp.time > 2 * length_day && count(corp.newlist) >= 5) || count(corp.newlist) >= 20)
           {
             build(corp);
             banner_renew(type);
           }
         }
      }
      co_timer.date = now.getDate();
      fs.writeFileSync("./colist.json",JSON.stringify(colist));
      fs.writeFileSync("./co_timer.json",JSON.stringify(co_timer));
      return;
    }
    
    if(now.getTime() - co_timer.past > co_timer.random)  // 時更
    {
      channel = message.guild.channels.get("621999946429628416");
      channel.send("隨機更新。");
      list = Object.keys(colist).sort( function(a,b){ return colist[b].price - colist[a].price;});
      list = list.slice(0,3);
      console.log("時更");
      for(type of Object.keys(colist))
      {
        corp = colist[type];
        len = corp.buyf.length;       //更新碎片買單
        corp.buyf.sort(function(a, b){return b.price - a.price;});
        for(i = 0 ; i < len ; i++)    
        {
          bo = corp.buyf[i];
          if(corp.pricef <= bo.price && corp.fragments > 0)
          {
            num = corp.fragments < bo.num ? corp.fragments : bo.num;
            corp.fragments -= num;
            bo.num -= num;
            rank_up(bo.owner, type, num);
            total = Math.floor(num*bo.price*(999/1000));
            corp.revenue += total;
            corp.funds += Math.floor(total/2);
            corp.bonus += total - Math.floor(total/2);
            if(bo.num == 0) 
            {
              corp.buyf.splice(i, 1);
              i--;
              len = corp.buyf.length;
            }
          }
        }
        
        corp.buy.sort(function(a, b){return b.price - a.price;});        //低成交量釋股
        len = corp.buy.length;
        total = 0;
        for(i = 0 ; i < len ; i++)    // 計算買價高於市價30%以上之總數量
        {
          if(corp.buy[i].price > Math.ceil(corp.price)) total += corp.buy[i].num;
        }
        if((corp.volume*10 < total))
        {
          rand = Math.floor(Math.random()*total/2 + 1);     
          so = 
          {
            owner: "433287968292339722",
            price: corp.buy[0].price,
            num: rand,
            time: now.getTime() 
          }
          len = corp.buy.length;
          for(i = 0 ; i < len ; i++)
          {
            if(corp.buy[i].price >= so.price)
            {
              num = so.num < corp.buy[i].num ? so.num : corp.buy[i].num;
              corp.sharelist[corp.buy[i].owner] += num;
              so.num -= num;
              corp.buy[i].num -= num;
              stars[corp.buy[i].owner].stars += num*(corp.buy[i].price - so.price);
              corp.price = so.price;
              corp.price_history.push("$" + corp.price + "　　" + time(so.time));
              corp.volume += num;
              corp.funds += num*so.price;
              coplayer[corp.buy[i].owner].history.push("以單價 " + so.price + " 星石買入 " + type + " 公司 " + num + " 股   " + time(so.time));
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
          if(so.num != 0)
          {
            corp.sell.push(so);
            corp.sell.sort(function(a, b){return a.price - b.price;});
          }
          channel = message.guild.channels.get("621999946429628416");
          channel.send("低成交量釋股： " + vlkylist[type].name + " 公司釋出股數 " + rand + " 股。" );
          if(type != "B0") banner_renew(type);
        }
      }
      
      for(person of Object.keys(coplayer))  //更新玩家股票買賣紀錄
      {
        embed = new Discord.RichEmbed();
        string = "";
        while(coplayer[person].history.length > 0) 
        {
          string += coplayer[person].history.shift();
          string += "\n";
        }
        if(string != "") 
        {
          man = message.guild.members.get(person);
          embed.setColor("#53e119").setTitle(man.displayName)
          embed.addField("交易紀錄",string)
          man.send(embed);
          fs.writeFileSync("./coplayer.json",JSON.stringify(coplayer));
        }
      }
      
      rand = Math.floor(Math.random()*4*60*60*1000 + 4*60*60*1000);
      co_timer.random = rand;
      co_timer.past = now.getTime();
      
      fs.writeFileSync("./colist.json",JSON.stringify(colist));
      fs.writeFileSync("./co_timer.json",JSON.stringify(co_timer));
      fs.writeFileSync("./coplayer.json",JSON.stringify(coplayer));
      fs.writeFileSync("./vlkys.json",JSON.stringify(vlkys));
      return;
    }

    if( now.getTime() - co_timer.time > 5000)   // 秒更 看板用
    {
      type = countlist[co_timer.count];
      if(!type) return;
      if(now.getTime() % 2) banner_renew(type);
      else order_renew(type);
      co_timer.time = now.getTime();
      if(co_timer.count < 12) co_timer.count ++;
      else co_timer.count = 0;
      fs.writeFileSync("./co_timer.json",JSON.stringify(co_timer));
    }
  
   return;
}

module.exports.help = {
    name: "co_renew"
}