const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: { name: 'buscar-equipo' },
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: '🎧 ¡Debes estar en un canal de voz!', ephemeral: true });
    }

    const modal = new ModalBuilder()
      .setCustomId('buscarEquipoModal')
      .setTitle('Buscar Equipo');

    const plataformaInput = new TextInputBuilder()
      .setCustomId('plataforma')
      .setLabel('🖥️ Plataforma (PC/PS5/Xbox)')
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(plataformaInput));
    await interaction.showModal(modal);
  }
};