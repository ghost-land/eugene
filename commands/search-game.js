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
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The id fort the game you're looking for")
        .setRequired(false)
    )
    .setDescription("Search 3DS game in the database of Ghost eShop"),
  async execute(interaction, client) {
    let finded = false;
    let url;
    const game = interaction.options.getString("game");
    const platform = interaction.options.getString("platform");

    if (
      !interaction.options.getString("id") &&
      !interaction.options.getString("game")
    ) {
      return interaction.editReply({
        content: "Please, sepcify id or name !",
        ephemeral: true,
      });
    }
    if (platform === "3ds") {
      url =
        "https://raw.githubusercontent.com/ghost-land/ghost-land.github.io/main/ghosteshop.json";
    } else if (platform === "nds") {
      url =
        "https://raw.githubusercontent.com/ghost-land/ghost-land.github.io/main/ghosteshop-ds.json";
    }
    if (interaction.options.getString("id")) {
      client.axios.get(url).then((response) => {
        const data = response.data.storeContent;
        if (data[interaction.options.getString("id")]) {
          const embed = new EmbedBuilder()
            .setTitle(
              data[interaction.options.getString("id")].info.title
                ? data[interaction.options.getString("id")].info.title
                : ""
            )
            .setThumbnail(
              data[interaction.options.getString("id")].info.icon_url
                ? data[interaction.options.getString("id")].info.icon_url
                : ""
            )
            .setDescription(
              data[interaction.options.getString("id")].info.description
                ? data[interaction.options.getString("id")].info.description
                : "No description"
            )
            .addFields(
              {
                name: "Author",
                value: data[interaction.options.getString("id")].info.author
                  ? data[interaction.options.getString("id")].info.author
                  : "",
              },
              {
                name: "Console",
                value: data[interaction.options.getString("id")].info.console
                  ? data[interaction.options.getString("id")].info.console
                  : "Unknown",
              },
              {
                name: "Category",
                value: data[interaction.options.getString("id")].info.category
                  ? data[interaction.options.getString("id")].info.category
                  : "Unknown",
              }
            )
            .setFooter({ text: "Availbale on ghosteshop.com" });
          return interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
          return interaction.editReply({
            content: "Unknown game id !",
            ephemeral: true,
          });
        }
      });
    } else {
      client.axios
        .get(url)
        .then((response) => {
          let gameid = [];
          const data = response.data.storeContent;
          for (let i = 0; i < data.length; i++) {
            if (data[i].info.title.toLowerCase().includes(game.toLowerCase())) {
              gameid.push(i);
              // console.log("[search-game] " + data[i].info.title);
            }
          }
          if (gameid.length == 1) {
            const embed = new EmbedBuilder()
              .setTitle(
                data[gameid[0]].info.title ? data[gameid[0]].info.title : ""
              )
              .setThumbnail(
                data[gameid[0]].info.icon_url
                  ? data[gameid[0]].info.icon_url
                  : ""
              )
              .setDescription(
                data[gameid[0]].info.description
                  ? data[gameid[0]].info.description
                  : "No description"
              )
              .addFields(
                {
                  name: "Author",
                  value: data[gameid[0]].info.author
                    ? data[gameid[0]].info.author
                    : "",
                },
                {
                  name: "Console",
                  value: data[gameid[0]].info.console
                    ? data[gameid[0]].info.console
                    : "Unknown",
                },
                {
                  name: "Category",
                  value: data[gameid[0]].info.category
                    ? data[gameid[0]].info.category
                    : "Unknown",
                }
              )
              .setFooter({ text: "Availbale on ghosteshop.com" });
            return interaction.editReply({ embeds: [embed], ephemeral: true });
          } else if (gameid.length > 1) {
            if (gameid.length > 50) {
              return interaction.editReply({
                content: "Too many games to display !",
                ephemeral: true,
              });
            }
            const embed = new EmbedBuilder().setTitle(
              "Several games have been found!"
            );
            let embedcontent = "";
            for (let gg = 0; gg < gameid.length; gg++) {
              // embed.addFields({
              //   name: gg.toString(),
              //   value: data[gg].info.title,
              // });
              embedcontent =
                embedcontent +
                gameid[gg].toString() +
                ". " +
                data[gameid[gg]].info.title +
                "\n";
            }
            embed.setDescription(embedcontent);
            embed.setFooter({
              text: "Use this command with the id field to display your game",
            });
            return interaction.editReply({ embeds: [embed], ephemeral: true });
          } else {
            return interaction.editReply({
              content: "No game fond !",
              ephemeral: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return interaction.editReply({
            content: "Problem with the API !",
            ephemeral: true,
          });
        });
    }
  },
};
