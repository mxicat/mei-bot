const Discord = require("discord.js");
const commando = require("discord.js-commando");
const fs = require("fs");
const items = require("./items.json");
const itemlist = require("./itemlist.json");
const itembu = require("./itembu.json");
const crystals = require("./crystals.json");
const bankfile = require("./bankfile.json");
const weapons = require("./weapons.json");
const weaponlist = require("./weaponlist.json");
const bjlist = require("./bjlist.json");
const energy = require("./energy.json");
const rolelist = require("./rolelist.json");
const luckylist = require("./luckylist.json");
const points = require("./points.json");
const killed = require("./killed.json");
const farmlist = require("./farmlist.json");
const abysslog = require("./abysslog.json");
const aulist = require("./aulist.json");
const baillist = require("./baillist.json");
const betlist = require("./betlist.json");
const marilist = require("./marilist.json");
const maridata = require("./maridata.json");
const stars = require("./stars.json");
const vlkys = require("./vlkys.json");
const coplayer = require("./coplayer.json");
const duellist = require("./duellist.json");
const duelcount = require("./duelcount.json");

module.exports.run = async (bot, message, args) => {
  var id = message.author.id;

  let man = message.guild.members.get(id);
  let now = new Date();
  let today = now.getDay();
  let time = now.getTime();

  function pp(id, man) {
    var num = 0;
    if (!man) return 0;
    if (man.roles.find(x => x.name === "LV.150 女武神．愛醬") != null) num = 150;
    if (man.roles.find(x => x.name === "LV.80 血色玫瑰") != null) num = 80;
    if (man.roles.find(x => x.name === "LV.76 次元邊界突破") != null) num = 76;
    if (man.roles.find(x => x.name === "LV.72 血騎士．月煌") != null) num = 72;
    if (man.roles.find(x => x.name === "LV.68 雷電女王的鬼鎧") != null) num = 68;
    if (man.roles.find(x => x.name === "LV.64 白騎士．月光") != null) num = 64;
    if (man.roles.find(x => x.name === "LV.60 異度黑核侵蝕") != null) num = 60;
    if (man.roles.find(x => x.name === "LV.56 銀狼的黎明") != null) num = 56;
    if (man.roles.find(x => x.name === "LV.52 女武神．凱旋") != null) num = 52;
    if (man.roles.find(x => x.name === "LV.48 雪地狙擊") != null) num = 48;
    if (man.roles.find(x => x.name === "LV.44 影舞衝擊") != null) num = 44;
    if (man.roles.find(x => x.name === "LV.40 聖女祈禱") != null) num = 40;
    if (man.roles.find(x => x.name === "LV.35 融核裝．深紅") != null) num = 35;
    if (man.roles.find(x => x.name === "LV.30 驅動裝．山吹") != null) num = 30;
    if (man.roles.find(x => x.name === "LV.25 女武神．遊俠") != null) num = 25;
    if (man.roles.find(x => x.name === "LV.20 女武神．強襲") != null) num = 20;
    if (man.roles.find(x => x.name === "LV.15 戰場疾風") != null) num = 15;
    if (man.roles.find(x => x.name === "LV.10 女武神．戰車") != null) num = 10;
    if (man.roles.find(x => x.name === "LV.5 脈衝裝．緋紅") != null) num = 5;
    if (man.roles.find(x => x.name === "LV.1 領域裝．白練") != null) num = 1;
    return num + 20;
  }

  if (!killed[id]) {
    killed[id] = { seal: 0, time: 0, ptime: 0 };
  }
  let muterole = message.guild.roles.find(x => x.id == 428580407995269140);

  for (var i of Object.keys(killed)) {
    let pp = message.guild.members.get(i);
    if (!pp) continue;
    if (killed[i].seal) {
      if (time - killed[i].time >= killed[i].ptime) {
        await pp
          .removeRole(muterole)
          .then(() => {
            killed[i].seal = 0;
            killed[i].time = 0;
            killed[i].ptime = 0;
          })
          .catch(err => console.log(err));
      }
    }
    if (killed[i].ptime == 0) {
      if (pp) {
        if (pp.roles.find(x => x.name == "泡水海豹"))
          await pp.removeRole(muterole).catch(e => console.log(e));
      }
    }
  }
  fs.writeFileSync("./killed.json", JSON.stringify(killed));

  if (!bankfile[id]) {
    bankfile[id] = {
      savings: 0,
      loanings: 0
    };
    fs.writeFileSync("./bankfile.json", JSON.stringify(bankfile));
  }

  if (!crystals[id]) {
    crystals[id] = {
      Time: today,
      crystals: 10
    };
    fs.writeFileSync("./crystals.json", JSON.stringify(crystals));
  }

  if (!energy[id]) {
    energy[id] = { energy: 10 };
    fs.writeFileSync("./energy.json", JSON.stringify(energy));
  }

  if (!items[id])
    items[id] = {
      items: {
        "000": 0,
        "001": 0,
        "002": 0,
        "003": 0,
        "004": 0,
        "005": 0,
        "006": 0
      }
    };

  for (var i of Object.keys(itemlist))
    if (!items[id].items[i]) items[id].items[i] = 0;

  fs.writeFileSync("./items.json", JSON.stringify(items));

  if (!weapons[id]) {
    weapons[id] = {
      weapons: { B0: 1 },
      status: { now: "B0", lv: 1, exp: 0, re: 0 }
    };
    fs.writeFileSync("./weapons.json", JSON.stringify(weapons));
  }

  if (!bjlist[id]) {
    bjlist[id] = {
      op: 0,
      now: 0,
      cards: new Array(),
      bet: 0,
      re: 0,
      win: 0,
      lose: 0
    };
  }
  fs.writeFileSync("./bjlist.json", JSON.stringify(bjlist));

  if (!betlist[id]) {
    betlist[id] = { now: 0, num: 0 };
  }
  fs.writeFileSync("./betlist.json", JSON.stringify(betlist));

  if (!rolelist[id]) {
    rolelist[id] = { role: 0 };
  }
  fs.writeFileSync("./rolelist.json", JSON.stringify(rolelist));

  if (!luckylist[id]) {
    luckylist[id] = { num: 0, reward: 0, up: 1000, down: 0 };
  }
  fs.writeFileSync("./luckylist.json", JSON.stringify(luckylist));

  if (!points[id]) {
    points[id] = { str: 0, agi: 0, vit: 0, luk: 0, points: pp(id, man) };
  }
  fs.writeFileSync("./points.json", JSON.stringify(points));

  if (!farmlist[id]) {
    farmlist[id] = {
      farm: 1,
      time: 0,
      crops: "00",
      num: 0,
      steal: { now: 0, status: 0 }
    };
  }
  fs.writeFileSync("./farmlist.json", JSON.stringify(farmlist));

  if (!abysslog[id]) {
    abysslog[id] = { now: 0, level: 0 };
  }
  fs.writeFileSync("./abysslog.json", JSON.stringify(abysslog));

  if (!aulist[id]) {
    aulist[id] = { bpm: 0, length: 0 };
  }
  fs.writeFileSync("./aulist.json", JSON.stringify(aulist));

  if (!baillist[id]) {
    baillist[id] = { time: 0 };
  }
  fs.writeFileSync("./baillist.json", JSON.stringify(baillist));

  fs.writeFileSync("./itembu.json", JSON.stringify(items));

  if (!marilist[id]) {
    marilist[id] = { bet_str: "000000000" };
  }
  fs.writeFileSync("./marilist.json", JSON.stringify(marilist));

  if (!maridata[id]) {
    maridata[id] = { enable: 0 };
  }
  fs.writeFileSync("./maridata.json", JSON.stringify(maridata));

  if (!stars[id]) {
    stars[id] = { stars: 0 };
  }
  fs.writeFileSync("./stars.json", JSON.stringify(stars));

  if (!vlkys[id])
    vlkys[id] = {
      vlkys: { B0: 1 },
      status: { lv: 1, exp: 0 },
      rank: { B0: "B" },
      set1: [0, 0],
      set2: [0, 0],
      set3: [0, 0],
      favor: { B0: 0 },
      marry: { B0: 0 }
    };
  fs.writeFileSync("./vlkys.json", JSON.stringify(vlkys));

  if (!(id in coplayer)) coplayer[id] = { own: [], shares: {}, history: [] };
  fs.writeFileSync("./coplayer.json", JSON.stringify(coplayer));

  if (!duellist[id])
    duellist[id] = { now: 0, win: 0, lose: 0, elo: 1000, tower: 1 };
  fs.writeFileSync("./duellist.json", JSON.stringify(duellist));

  if (!duelcount[id]) duelcount[id] = { pve: 3, pvp: 3 };
  fs.writeFileSync("./duelcount.json", JSON.stringify(duelcount));

  return;
};

module.exports.help = {
  name: "initialize"
};
