const {
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  description: `Ver menu`,
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
    const emoji = {
      Information: "🔰",
      Music: "🎵",
      Settings: "⚙️",
    };

    let allcommands = client.commands.size;
    let allguilds = client.guilds.cache.size;
    let botuptime = `<t:${Math.floor(
      Date.now() / 1000 - client.uptime / 1000
    )}:R>`;

    let raw = new ActionRowBuilder().addComponents([
      new SelectMenuBuilder()
        .setCustomId("help-menu")
        .setPlaceholder(`Escolhe a categoria`)
        .addOptions(
          [
            {
              label: `Home`,
              value: "home",
              emoji: `🏘️`,
              description: `Click to Go On HomePage`,
            },
            client.scategories.map((cat) => {
              return {
                label: `${cat.toLocaleUpperCase()}`,
                value: cat,
                emoji: emoji[cat],
                description: `Click to See Commands of ${cat}`,
              };
            }),
          ].flat(Infinity)
        ),
    ]);

    let help_embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setDescription(
        `** Um sistema de música avançado com filtragem de áudio Um sistema exclusivo de solicitação de música e muito mais! **`
      )
      .addFields([
        {
          name : `Status`,
          value : `>>> ** :gear: \`${allcommands}\` Comandos \n :file_folder: \`${allguilds}\` Servers \n ⌚️ ${botuptime} Uptime \n 🏓 \`${client.ws.ping}\` Ping \n  Feito por [\` LucasDev \`](https://wristdev.netlify.app) **`
        }
      ])
      .setFooter(client.getFooter(interaction.user));

    let main_msg = await interaction.followUp({
      embeds: [help_embed],
      components: [raw],
    });

    let filter = (i) => i.user.id === interaction.user.id;
    let colector = await main_msg.createMessageComponentCollector({
      filter: filter,
      time: 20000,
    });
    colector.on("collect", async (i) => {
      if (i.isSelectMenu()) {
        await i.deferUpdate().catch((e) => {});
        if (i.customId === "help-menu") {
          let [directory] = i.values;
          if (directory == "home") {
            main_msg.edit({ embeds: [help_embed] }).catch((e) => {});
          } else {
            main_msg
              .edit({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.embed.color)
                    .setTitle(
                      `${emoji[directory]} ${directory} Comandos ${emoji[directory]}`
                    )
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setDescription(
                      `>>> ${client.commands
                        .filter((cmd) => cmd.category === directory)
                        .map((cmd) => {
                          return `\`${cmd.name}\``;
                        })
                        .join(" ' ")}`
                    )
                    .setFooter(client.getFooter(interaction.user)),
                ],
              })
              .catch((e) => null);
          }
        }
      }
    });

    colector.on("end", async (c, i) => {
      raw.components.forEach((c) => c.setDisabled(true));
      main_msg.edit({ components: [raw] }).catch((e) => {});
    });
  },
};
