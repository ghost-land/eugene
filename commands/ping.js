const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDMPermission(false)
		.setDescription('Gives the WebSocket ping'),
	async execute(interaction, client) {
		return interaction.reply("🏓 " + client.ws.ping + "ms");
	},
};
