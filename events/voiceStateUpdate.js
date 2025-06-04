module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const { voiceCreateChannelId } = require('../../config.json');
    
    if (newState.channelId === voiceCreateChannelId) {
      const channel = await newState.guild.channels.create({
        name: `Equipo ${newState.member.displayName}`,
        type: 2, // GUILD_VOICE
        parent: newState.channel.parent
      });
      newState.setChannel(channel);
    }
  }
};