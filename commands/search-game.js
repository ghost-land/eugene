const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search-game")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("platform")
        .setDescription("Platform to search")
        .setRequired(true)
        .addChoices(
          { name: "Nintendo 3DS", value: "3ds" },
          { name: "Nintendo DS", value: "nds" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("The game you want to search")
        .setRequired(true)
    )
    .setDescription("Search 3DS game in the database of Ghost eShop"),
  async execute(interaction, client) {
    await interaction.deferReply({ content: "loading...", ephemeral: true });
    let finded = false;
    let url;
    const game = interaction.options.getString("game");
    const platform = interaction.options.getString("platform");

    if (platform === "3ds") {
      url =
        "https://raw.githubusercontent.com/ghost-land/ghost-land.github.io/main/ghosteshop.json";
    } else if (platform === "nds") {
      url =
        "https://raw.githubusercontent.com/ghost-land/ghost-land.github.io/main/ghosteshop-ds.json";
    }

    client.axios
      .get(url)
      .then((response) => {
        const data = response.data.storeContent;
        for (let i = 0; i < data.length; i++) {
          if (data[i].info.title.toLowerCase().includes(game.toLowerCase())) {
            finded = true;
            console.log('[search-game] ' + data[i].info.title);
            const embed = new EmbedBuilder()
              .setTitle(data[i].info.title ? data[i].info.title : "")
              .setThumbnail(data[i].info.icon_url ? data[i].info.icon_url : "")
              .setDescription(
                data[i].info.description
                  ? data[i].info.description
                  : "No description"
              )
              .addFields(
                {
                  name: "Author",
                  value: data[i].info.author ? data[i].info.author : "",
                },
                {
                  name: "Console",
                  value: data[i].info.console
                    ? data[i].info.console
                    : "Unknown",
                },
                {
                  name: "Category",
                  value: data[i].info.category
                    ? data[i].info.category
                    : "Unknown",
                }
              )
              .setFooter({ text: "Availbale on ghosteshop.com" });
            interaction.editReply({ embeds: [embed], ephemeral: true });
            break;
          }
        }
        if (!finded) {
          interaction.editReply({ content: "No game found", ephemeral: true });
        }
      })
      .catch((err) => {
        console.log(err);
        return interaction.editReply({
          content: "Problem with the API !",
          ephemeral: true,
        });
      });
  },
};
