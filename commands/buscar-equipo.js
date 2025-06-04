const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'buscar-equipo',
    description: 'Busca compañeros para jugar Rocket League'
  },
  async execute(interaction) {
    // 1. Verificar canal de voz
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: '🎧 ¡Debes estar en un canal de voz para usar este comando!',
        ephemeral: true
      });
    }

    // 2. Crear modal
    const modal = new ModalBuilder()
      .setCustomId('buscarEquipoModal')
      .setTitle('Configura tu búsqueda');

    // 3. Componentes del modal
    const plataformaInput = new TextInputBuilder()
      .setCustomId('plataforma')
      .setLabel('🖥️ Plataforma (PC/PS5/Xbox)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const rangoInput = new TextInputBuilder()
      .setCustomId('rango')
      .setLabel('🏆 Rango (Ej: Gran Campeón III)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const jugadoresInput = new TextInputBuilder()
      .setCustomId('jugadores')
      .setLabel('#️⃣ Jugadores necesarios (1-3)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    // 4. Organizar filas
    const firstRow = new ActionRowBuilder().addComponents(plataformaInput);
    const secondRow = new ActionRowBuilder().addComponents(rangoInput);
    const thirdRow = new ActionRowBuilder().addComponents(jugadoresInput);

    // 5. Añadir componentes al modal
    modal.addComponents(firstRow, secondRow, thirdRow);

    // 6. Mostrar modal con manejo de errores
    try {
      await interaction.showModal(modal);
    } catch (error) {
      console.error('💥 Error al mostrar modal:', error);
      await interaction.reply({
        content: '❌ No se pudo abrir el formulario. Por favor intenta nuevamente.',
        ephemeral: true
      });
    }
  }
};

// Al crear el embed en modalHandler.js, añade:
embed.setFooter({
  text: `ID: ${interaction.user.id} | ${interaction.member.voice.channelId}`
});
