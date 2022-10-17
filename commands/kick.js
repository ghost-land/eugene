const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescription("Kick bad boys from server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Member to kick")
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("target");
    member
      .kick()
      .then(() => {
        return interaction.editReply({
          content: `<@${member.user.id}> has been kicked !`,
          ephemeral: false,
        });
      })
      .catch((err) => {
        return interaction.editReply({
          content: `**ERROR IN THE MATRIX :**\n\n${err}`,
          ephemeral: false,
        });
      });
  },
};
