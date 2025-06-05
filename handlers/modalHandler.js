const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId.startsWith('buscarEquipoModal_')) return;

    try {
      // Extraer datos del modal
      const plataforma = interaction.fields.getTextInputValue('plataforma');
      const rango = interaction.fields.getTextInputValue('rango');
      const jugadores = interaction.fields.getTextInputValue('jugadores');

      // Crear embed con información de voz
      const embed = new EmbedBuilder()
        .setTitle(`🎮 ${interaction.user.username} busca equipo!`)
        .addFields(
          { name: '🖥️ Plataforma', value: plataforma, inline: true },
          { name: '🏆 Rango', value: rango, inline: true },
          { name: '#️⃣ Jugadores', value: jugadores, inline: true }
        )
        .setFooter({ 
          text: `ID: ${interaction.user.id} | ${interaction.member.voice.channelId}` 
        })
        .setColor('#FFD700');

      // Crear botones con protección contra duplicados
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('🎧 Unirse al Canal')
          .setURL(`https://discord.com/channels/${interaction.guildId}/${interaction.member.voice.channelId}`)
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setCustomId(`aceptar_busqueda_${interaction.user.id}`) // ID único
          .setLabel('🟢 Aceptar Búsqueda')
          .setStyle(ButtonStyle.Success)
      );

      await interaction.reply({ 
        embeds: [embed], 
        components: [buttons] 
      });
      
    } catch (error) {
      console.error('💥 Error en modalHandler:', error);
      await interaction.reply({
        content: '❌ Error al procesar tu formulario.',
        ephemeral: true
      });
    }
  }
};