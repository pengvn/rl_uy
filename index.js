require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, guildId } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ]
});

// Cargar eventos
const fs = require('fs');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
}

// Registrar comandos al iniciar
client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} listo!`);
  
  try {
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: [{ name: 'buscar-equipo', description: 'Busca equipo para Rocket League' }] }
    );
    console.log('✅ Comandos registrados!');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
});

client.login(process.env.TOKEN || token);