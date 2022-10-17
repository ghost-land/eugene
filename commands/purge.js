const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDMPermission(false)
    .setDescription("Purges a number of messages from a channel.")
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("Number of messages to purge")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    if (amount < 1 || amount > 99) {
      return interaction.editReply({
        content: "You need to input a number between 1 and 99.",
        ephemeral: true,
      });
    }
    await interaction.channel.bulkDelete(amount, true).catch((error) => {
      console.error(error);
      return interaction.editReply({
        content: "There was an error trying to prune messages in this channel!",
        ephemeral: true,
      });
    });

    return interaction.editReply({
      content: `Successfully purge \`${amount}\` messages.`,
      ephemeral: true,
    });
  },
};
