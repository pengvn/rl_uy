module.exports = {
  async execute(interaction) {
    if (interaction.customId !== 'aceptar_busqueda') return;

    try {
      // 1. Deshabilitar el botón inmediatamente
      await interaction.update({
        components: []
      });

      // 2. Obtener información del embed original
      const embed = interaction.message.embeds[0];
      const solicitanteTag = embed.title.match(/🎮 (.+?) busca equipo/)[1];

      // 3. Enviar DMs
      await interaction.user.send(
        `✅ Has aceptado la búsqueda de ${solicitanteTag}!\n` +
        `Canal de voz: https://discord.com/channels/${interaction.guildId}/${interaction.message.interaction.member.voice.channelId}`
      );

      const solicitanteUser = await interaction.guild.members.fetch(interaction.message.interaction.user.id);
      await solicitanteUser.send(
        `🎉 ${interaction.user.tag} aceptó tu búsqueda!\n` +
        `Canal: https://discord.com/channels/${interaction.guildId}/${interaction.message.interaction.member.voice.channelId}`
      );

    } catch (error) {
      console.error('Error en buttonHandler:', error);
      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Error al procesar tu aceptación',
          ephemeral: true
        });
      }
    }
  }
};