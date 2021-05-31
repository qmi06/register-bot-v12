const Discord = require("discord.js"),
    client = new Discord.Client();
require('discord-reply');
const id = require('../Settings/idler.json');
const ayar = require('../Settings/ayarlar.json');
const db = require('quick.db');

module.exports.run = async (client, message, args) => {

    if (!message.member.hasPermission('MANAGE_ROLES') && !message.member.roles.cache.get(id.yetkilirol) && message.author.id !== ayar.sahip) return message.lineReply('`Bu komudu kullanmak için gerekli izinlere sahip değilsin!`').then(x => x.delete({ timeout: 3000 }), message.react(id.başarısızemojiid));

    let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!üye) return message.lineReply('`Bu işlemi gerçekleştirmek için bir üye belirtmelisin!`').then(x => x.delete({ timeout: 2000 }));

    let logs = db.get(`kullanici.${üye.id}.isimler`) || [];
    logs = logs.reverse();
    let ismleri = logs.length > 0 ? logs.map((value, index) => `\`${index + 1}.\` ${value.İsim} - ${value.Yaş} (<@&${value.Rol}>)`).join("\n") : "Kaydı Bulunamadı!";

    message.lineReply(new Discord.MessageEmbed().setColor('BLUE').setDescription(`**Kullanıcının önceki kayıtları**;\n ${ismleri}`)).then(x => x.delete({ timeout: 10000 }), message.react(id.başarılıemojiid)).then(x => x.delete({ timeout: 9000 }), message.react(id.başarılıemojiid));

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
};
exports.help = {
    name: "isimleri"
};
