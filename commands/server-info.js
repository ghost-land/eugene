const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDMPermission(false)
    .setDefaultMemberPermissions(0)
    .setDescription("Gives the info of the ghost land server"),
  async execute(interaction, client) {
    client.cpuStat.usagePercent(function (err, percent, seconds) {
      const embed = new EmbedBuilder()
        .setTitle("Server state")
        .setColor(0xffffff)
        .addFields(
          {
            name: "CPU global usage",
            value: `${percent.toFixed(2)}%`,
			inline: true
          },
          {
            name: "CPU name",
            value: `${client.os.cpus()[0].model}`,
            inline: true,
          },
          {
            name: "RAM global usage",
            value:
              ((Math.round(
                (client.os.totalmem() - client.os.freemem()) / 1024 / 1024 / 100
              ) /
                10) +
              "GB" + "/"+ (Math.round(
                (client.os.totalmem()) / 1024 / 1024 / 100
              ) /
                10) +  "GB" + " ("
			  + (100 - Math.round(client.os.freemem() / client.os.totalmem() * 100)) + "%)")
			  ,
          },
		  {
			name: "OS version",
			value: `${client.os.platform} ${client.os.release()}`,
		  }
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    });
  },
};
