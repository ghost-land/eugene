// Discord client
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Libs and utils
const config = require("./config.json");
require("dotenv").config();
client.path = require("node:path");
client.fs = require("fs");
client.os = require("os");
client.cpuStat = require("cpu-stat");
client.axios = require("axios");

// Commands loader
client.commands = new Collection();
const commandsPath = client.path.join(__dirname, "commands");
const commandFiles = client.fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = client.path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Ready message
client.once("ready", () => {
  console.log("Eugene can do it !");
});

// Interaction handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await interaction.deferReply({ content: "loading...", ephemeral: true });
    let t = true;
    config.disabledCommands.forEach((commandName) => {
      if (interaction.commandName == commandName) {
        t = false;
      }
    });
    if (t === true) {
      await command.execute(interaction, client);
    } else {
      return interaction.editReply({
        content: "This command has been disabled !",
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: `**ERROR IN THE MATRIX :**\n${error}`,
      ephemeral: false,
    });
  }
});

// Login
client.login(process.env.TOKEN);
