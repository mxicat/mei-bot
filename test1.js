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
const coinlist = require("./coinlist.json");
const colist = require("./coinlist.json");
const gachalist = require("./gachalist.json");
const coplayer = require("./coplayer.json");
const vlkys = require("./vlkys.json");
const vlkylist = require("./vlkylist.json");
var maridata = require("./maridata.json");
const duellist = require("./duellist.json");
const duelcount = require("./duelcount.json");
const exchangelist = require("./exchangelist.json");
const stars = require("./stars.json");

module.exports.run = async (bot, message, args) => {
  var id = message.author.id;
  if (message.guild.members.get(id).roles.find(x => x.name == "GM") == null)
    return message.channel.send("需要**GM**權限");
  let man = message.guild.members.get(id);
  let now = new Date();
  let month = now.getMonth();
  let today = now.getDate();
  let time = now.getTime();

  let mei = message.guild.members.get("433287968292339722");
  let guild = message.guild;


  
  var yahooStockPrices = require('yahoo-stock-prices');

// start month, start day, start year, end month, end day, end year, ticker, frequency

// month [ 0 -> 11 ] = [ January -> December ]

yahooStockPrices.getHistoricalPrices(3, 2, 2016, 3, 9, 2016, 'JNJ', '1d', function(err, prices){

	//rconsole.log(prices);

});

yahooStockPrices.getCurrentPrice('0050:TW', function(err, price){

	console.log(price);

});


  return;
};

module.exports.help = {
  name: "test1"
};
