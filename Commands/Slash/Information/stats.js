const { CommandInteraction, EmbedBuilder, version } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
let os = require("os");
let cpuStat = require("cpu-stat");

module.exports = {
  name: "status",
  description: `Ver status do bot`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["EMBED_LINKS"],
  category: "Info",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    cpuStat.usagePercent(function (err, percent, seconds) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTitle("__**Status:**__")
            .addFields([
              {
                name: `⏳ Uso da memoria`,
                value: `\`${(
                  process.memoryUsage().heapUsed /
                  1024 /
                  1024
                ).toFixed(2)}\` / \`${(os.totalmem() / 1024 / 1024).toFixed(
                  2
                )} MB\``,
              },
              {
                name: `⌚️ Tempo Ligado`,
                value: `<t:${Math.floor(
                  Date.now() / 1000 - client.uptime / 1000
                )}:R>`,
              },
              {
                name: `📁 Usuarios`,
                value: `\`${client.guilds.cache.reduce(
                  (acc, guild) => acc + guild.members.memberCount,
                  0
                )} \``,
                inline: true,
              },
              {
                name: `📁 Canais`,
                value: `\`${client.channels.cache.size}\``,
                inline: true,
              },
              {
                name: `👾 Discord.JS`,
                value: `\`v${version}\``,
                inline: true,
              },
              {
                name: `🤖 Node`,
                value: `\`${process.version}\``,
                inline: true,
              },
              {
                name: `🏓 Ping`,
                value: `\`${client.ws.ping}ms\``,
                inline: true,
              },
              {
                name: `🤖 Processador`,
                value: `\`\`\`md\n${
                  os.cpus().map((i) => `${i.model}`)[0]
                }\`\`\``,
              },
              {
                name: `🤖 Uso do processador`,
                value: `\`${percent.toFixed(2)}%\``,
                inline: true,
              },
              {
                name: `🤖 Bits`,
                value: `\`${os.arch()}\``,
                inline: true,
              },
              {
                name: `💻 Plataforma`,
                value: `\`\`${os.platform()}\`\``,
                inline: true,
              },
            ])
            .setFooter(client.getFooter(interaction.user)),
        ],
      });
    });
  },
};
