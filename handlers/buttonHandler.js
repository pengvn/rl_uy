module.exports = {
  async execute(interaction) {
    try {
      // Desactivar botones inmediatamente
      await interaction.update({ components: [] });
      
      const embed = interaction.message.embeds[0];
      const userId = interaction.customId.split('_')[2];
      
      // Enviar mensajes privados
      await interaction.user.send(
        `✅ Has aceptado la búsqueda de ${embed.title.split(' ')[1]}!\n` +
        `Canal de voz: https://discord.com/channels/1377066791670386733/${embed.footer.text.split('| ')[1]}`
      );
      
      const targetUser = await interaction.guild.members.fetch(userId);
      await targetUser.send(
        `🎉 ${interaction.user.tag} aceptó tu búsqueda!\n` +
        `Canal: https://discord.com/channels/1377066791670386733/${embed.footer.text.split('| ')[1]}`
      );
      
    } catch (error) {
      console.error('💥 Error en buttonHandler:', error);
      await interaction.reply({
        content: '❌ Error al procesar tu aceptación',
        ephemeral: true
      });
    }
  }
};