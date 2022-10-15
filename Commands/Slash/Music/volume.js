const { CommandInteraction } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "volume",
  description: `change volume of current queue`,
  userPermissions: ["CONNECT"],
  botPermissions: ["CONNECT"],
  category: "Music",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,
  options: [
    {
      name: "valor",
      description: `Escolhe o volume da musica`,
      type: "NUMBER",
      required: true,
    },
  ],
  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    let volume = interaction.options.getNumber("amount");
    if (volume > 2500) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} Fornecer quantidade de volume entre 1 e 2500  !!`
      );
    } else {
      await queue.setVolume(volume);
      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} Volume alterado para: ${queue.volume}% !!`
      );
    }
  },
};
