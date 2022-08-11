const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription("Timeout bad boys from server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Member to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason of the timeout")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("Minutes to timeout")
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("target");
    const time = interaction.options.getInteger("time");
    const reason = interaction.options.getString("reason");
    member
      .timeout(time * 60000, reason)
      .then(() => {
        return interaction.reply({
          content: `<@${member.user.id}> has been timeout ! :wave:`,
          ephemeral: false,
        });
      })
      .catch((err) => {
        return interaction.reply({
          content: `**ERROR IN THE MATRIX :**\n\n${err}`,
          ephemeral: false,
        });
      });
  },
};
