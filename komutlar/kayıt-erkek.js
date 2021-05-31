const Discord = require("discord.js"),
  client = new Discord.Client();
require('discord-reply');
const id = require('../Settings/idler.json');
const ayar = require('../Settings/ayarlar.json');
const db = require('quick.db');

module.exports.run = async (client, message, args) => {

  if (!message.member.hasPermission('MANAGE_ROLES') && !message.member.roles.cache.get(id.yetkilirol) && message.author.id !== ayar.sahip) return message.lineReply('`Bu komudu kullanmak için gerekli izinlere sahip değilsin!`').then(x => x.delete({ timeout: 3000 }), message.react(id.başarısızemojiid));

  let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!üye) return message.lineReply('`Kayıt edebilmem için bir üye belirtmelisin!`').then(x => x.delete({ timeout: 3000 }));

  let isim = args[1];
  if (!isim) return message.lineReply('`Üyeyi kaydedebilmem için geçerli bir isim belirtmelisin!`').then(x => x.delete({ timeout: 3000 }));

  let yaş = args[2];
  if (!yaş) return message.lineReply('`Üyeyi kaydedebilmem için geçerli bir yaş belirtmelisin!`').then(x => x.delete({ timeout: 3000 }));

  if (üye.roles.cache.get(id.erkekrol)) return message.lineReply('`Bu üye zaten sunucuya kayıtlı!`').then(x => x.delete({ timeout: 3000 }));
  if (üye.roles.cache.get(id.kızrol)) return message.lineReply('`Bu üye zaten sunucuya kayıtlı!`').then(x => x.delete({ timeout: 3000 }));
  if (!üye.user.username.includes(id.tag) && !üye.user.discriminator.includes(id.etikettag)) return message.lineReply('`Bu üyede tagımız bulunmuyor!`').then(x => x.delete({ timeout: 3000 }));

  await üye.setNickname(`${id.tag} ${isim} - ${yaş}`), üye.roles.add(id.erkekrol), üye.roles.add(id.tagrol), üye.roles.remove(id.kayıtsızrol);

  let logs = db.get(`kullanici.${üye.id}.isimler`) || [];
  logs = logs.reverse();
  let ismleri = logs.length > 0 ? logs.map((value, index) => `\`${index + 1}.\` ${value.İsim} - ${value.Yaş} (<@&${value.Rol}>)`).join("\n") : "Kaydı Bulunamadı!";

  message.lineReply(new Discord.MessageEmbed().setColor('GREEN').setDescription(`${üye} üyesine başarılı bir şekilde <@&${id.erkekrol}> rolünü verip sunucuya kaydettim. \n **Kullanıcının önceki kayıtları**;\n ${ismleri}`)).then(x => x.delete({ timeout: 10000 }), message.react(id.başarılıemojiid));

  client.channels.cache.get(id.genelsohbet).send(`${üye} \`adlı üye sunucumuza katıldı. Sunucumuza hoş geldin...\``).then(x => x.delete({ timeout: 7000 }))

  db.push(`kullanici.${üye.id}.isimler`, {
    İsim: isim,
    Yaş: yaş,
    Rol: id.erkekrol
  });

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["e"],
  permLevel: 0
};
exports.help = {
  name: "erkek"
};
