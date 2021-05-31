const Discord = require("discord.js");
require('discord-reply');
const client = new Discord.Client();
const ayarlar = require("./Settings/ayarlar.json");
const moment = require('moment');
const id = require("./Settings/idler.json")
const chalk = require("chalk");
const { Client, Util } = require('discord.js');
const fs = require("fs");
const db = require("quick.db");
require("./util/eventLoader.js")(client);
const request = require("request");
var prefix = ayarlar.prefix;
const log = message => { console.log(`${message}`); };

//--------------------------------------| DOKUNMA |--------------------------------------\\

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

//--------------------------------------| DOKUNMA |--------------------------------------\\

client.login(ayarlar.token).then(console.log("Bot başarılı bir şekilde giriş yaptı."));

//--------------------------------------| HOŞGELDİN + OTOROL + OTOİSİM - B |--------------------------------------\\

client.on("guildMemberAdd", member => {
  let yetkili = id.yetkilirol
  let kayıtsohbet2 = id.kayıtsohbet

  member.roles.add(id.kayıtsızrol), member.setNickname(`${id.tag} İSİM - YAŞ`);

  let guild = member.guild;

  const channel = member.guild.channels.cache.find(channel => channel.id === (kayıtsohbet2)); /// Kayıt Kanalı Adı
  let aylartoplam = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs", //acebots 
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",//acebots
    "09": "Eylül", //acebots 
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık"
  }
  let aylar = aylartoplam

  let user = client.users.cache.get(member.id);
  require("moment-duration-format"); //acebots 

  const kurulus = new Date().getTime() - user.createdAt.getTime();
  const gün = moment.duration(kurulus).format("D")
  var kontrol = [];

  if (gün < 7) {
    kontrol = '**Şüphelidir**'
  } if (gün > 7) {//acebots
    kontrol = '**Güvenlidir**'
  }
  let kanal = id.kayıtsohbet //acebots 
  if (!kanal) return;

  client.channels.cache.get(kanal).send(new Discord.MessageEmbed().setThumbnail(user.avatarURL({ dynamic: true, format: "gif", format: "png", format: "jpg", size: 2048 })).setColor('#ff8310').setDescription(`
  <a:csiyahkalp:846293939827769354> ${member.user} Aramıza Hoşgeldin Senin Gelmenle Beraber \`${guild.memberCount}\` kişiye ulaştık.
  
  <a:yildizlar:846293939707183104> Sunucu kurallarımız <#${id.kurallar}> kanalında belirtilmiştir. 
  
  <a:yildizlar:846293939707183104> Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.
  
  <a:yildizlar:846293939707183104> Hesabın \`${moment(user.createdAt).format('DD')} ${aylar[moment(user.createdAt).format('MM')]} ${moment(user.createdAt).format('YYYY HH:mm:ss')}\` zamanında kurulmuş.
  
  <a:gul:846293908367474728> <@&${yetkili}> etiketli yetkililer seninle ilgilenecektir.`)
  .setImage('https://cdn.discordapp.com/attachments/797436340178124840/846298902496149545/steamuserimages-a.akamaihd.gif'))
  client.channels.cache.get(kanal).send(`${member.user}, <@&${yetkili}>`).then(x=> x.delete())
});

//--------------------------------------| HOŞGELDİN + OTOROL + OTOİSİM - S |--------------------------------------\\




