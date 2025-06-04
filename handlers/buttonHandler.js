module.exports = {
  async execute(interaction) {
    if (interaction.customId !== 'aceptar_busqueda') return;

    const embed = interaction.message.embeds[0];
    const solicitante = embed.title.split(' ')[0];

    // DM al solicitante
    await interaction.user.send(
      `✅ ${interaction.user.username} aceptó tu búsqueda!\n` +
      `Canal de voz: https://discord.com/channels/${interaction.guildId}/${interaction.member.voice.channelId}`
    );

    // Confirmación al aceptante
    await interaction.reply({
      content: `📩 Mensaje enviado a ${solicitante}!`,
      ephemeral: true
    });
  }
};