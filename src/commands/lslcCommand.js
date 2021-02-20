module.exports = {
  name: "lslc",
  aliases: ['lslc'],
  cooldown: 1,
  guildOnly: true,
  ownerOnly: true,
  async execute(client, message, args) {
    const db = require('quick.db')
    const { MessageEmbed } = require('discord.js')
    let user = message.mentions.members.first() || message.author;

    switch (args[0]) {
      case "remove_coins":

        if (isNaN(args[1])) return;
        db.subtract(`coins_${user.id}`, args[1])
        let now = await db.fetch(`coins_${user.id}`)
        message.channel.send(`Removido ${args[1]} FoxCoins de ${user} agora ele(a) possui ${now} FoxCoins`)
        break

      case "add_coins":
        db.add(`coins_${user.id}`, args[1])
        let bal = await db.fetch(`coins_${user.id}`)
        message.channel.send(`Foram adicionados ${args[1]} FoxCoins na conta de ${user} agora ele(a) possui ${bal} FoxCoins`)
        break

      case "reset_all":
        db.set(`background_${user.id}`, 'default_background.png')
        db.delete(`coins_${user.id}`)
        db.delete(`coins_${user.id}`)
        break

      case "reset_background":
        db.set(`background_${user.id}`, 'default_background.png')
        message.channel.send(`O Background de ${user} foi redefinido!`)
        break

      case "set_background":
        db.set(`background_${user.id}`, `${args[1]}`)
        message.channel.send(`O arquivo ${args[1]} foi setado no perfil de ${user}`)
        break

      default:
          const embed = new MessageEmbed()
              .setTitle("Database Settings")
              .setDescription(`Altere o valor do banco de dados`)
              .addFields(
                  { name: "remove_coins", value: "Remove as coins de algum usuário"},
                  { name: "add_coins", value: "Adiciona coins a mais para um usuário"},
                  { name: "reset_all", value: "Reseta todas as configurações do usuário"},
                  { name: "reset_background", value: "Reseta o background de algum usuário para o padrão"},
                  { name: "set_background", value: "Define o background de algum usuário"}
              )
    }
  }
}