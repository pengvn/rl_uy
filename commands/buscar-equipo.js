const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'buscar-equipo',
    description: 'Busca compañeros para jugar Rocket League'
  },
  async execute(interaction) {
    // 1. Verificar canal de voz con manejo de error mejorado
    try {
      if (!interaction.member.voice.channel) {
        return await interaction.reply({
          content: '🎧 ¡Debes estar en un canal de voz para usar este comando!',
          ephemeral: true
        });
      }

      // 2. Crear modal con validación
      const modal = new ModalBuilder()
        .setCustomId(`buscarEquipoModal_${interaction.user.id}`) // ID único por usuario
        .setTitle('Configura tu búsqueda');

      // 3. Componentes del modal con validación
      const components = [
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('plataforma')
            .setLabel('🖥️ Plataforma (PC/PS5/Xbox)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(20)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('rango')
            .setLabel('🏆 Rango (Ej: Gran Campeón III)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(30)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('jugadores')
            .setLabel('#️⃣ Jugadores necesarios (1-3)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(1)
            .setValue('1') // Valor por defecto
        )
      ];

      modal.addComponents(...components);

      // 4. Mostrar modal con protección contra timeouts
      await interaction.showModal(modal);
      
    } catch (error) {
      console.error('💥 Error en buscar-equipo:', error);
      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Error al procesar tu solicitud. Por favor intenta nuevamente.',
          ephemeral: true
        });
      }
    }
  }
};