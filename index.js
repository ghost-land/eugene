const { Client, Collection, GatewayIntentBits } = require("discord.js");

// Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Libs and utils
require('dotenv').config();
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

  require('./config.json').disabledCommands.forEach(function(commandName) {
    if (interaction.commandName == commandName){
      console.log(interaction.commandName+commandName)
      return interaction.reply({content: 'This command has been disabled !', ephemeral: true})
    }
  })

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: `**ERROR IN THE MATRIX :**\n${error}`,
      ephemeral: false,
    });
  }
});

// Login
client.login(process.env.TOKEN);