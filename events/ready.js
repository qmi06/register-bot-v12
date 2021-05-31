const Discord = require('discord.js');
const prefix = process.env.PREFIX;
const ayarlar = require("../Settings/ayarlar.json");

module.exports = client => {
client.user.setActivity(ayarlar.durum, {type: 'WATCHING'}); 

}