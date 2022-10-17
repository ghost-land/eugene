const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDMPermission(false)
    .setDescription("Gives the WebSocket ping"),
  async execute(interaction, client) {
    return interaction.editReply({
      content: "🏓 " + client.ws.ping + "ms",
      ephemeral: true,
    });
  },
};
