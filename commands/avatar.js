const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDMPermission(false)
		.setDescription('Get the avatar of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		const embed = new EmbedBuilder()
		if(user){
			embed.setTitle(user.username+'\'s avatar')
			embed.setImage(user.displayAvatarURL({dynamic: true, size: 1024}))
			return interaction.reply({embeds: [embed] , ephemeral: true});
		}
		embed.setTitle('Your avatar')
		embed.setImage(interaction.user.displayAvatarURL({dynamic: true, size: 1024}))
		return interaction.reply({embeds: [embed], ephemeral: true});
	},
};
