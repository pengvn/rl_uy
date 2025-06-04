const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  async execute(interaction) {
    if (interaction.customId !== 'buscarEquipoModal') return;

    const plataforma = interaction.fields.getTextInputValue('plataforma');
    const embed = new EmbedBuilder()
      .setTitle(`🎮 ${interaction.user.username} busca equipo!`)
      .addFields(
        { name: '🖥️ Plataforma', value: plataforma, inline: true },
        { name: '🎤 Micrófono', value: 'Sí', inline: true }
      )
      .setColor('#FFD700');

    const joinButton = new ButtonBuilder()
      .setLabel('🎧 Unirse al Canal')
      .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.member.voice.channelId}`)
      .setStyle(ButtonStyle.Link);

    const acceptButton = new ButtonBuilder()
      .setCustomId('aceptar_busqueda')
      .setLabel('🟢 Aceptar Búsqueda')
      .setStyle(ButtonStyle.Success);

    await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(joinButton, acceptButton)]
    });
  }
};