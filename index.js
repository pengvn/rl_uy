require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, Partials } = require('discord.js');
const { token, guildId } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// Manejo de comandos
client.commands = new Map();
const commandFiles = ['buscar-equipo.js'].map(file => require(`./commands/${file}`));
commandFiles.forEach(command => {
  client.commands.set(command.data.name, command);
});

// Eventos
client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} listo!`);

  // Registrar comandos
  try {
    const rest = new REST({ version: '10' }).setToken(token);
    
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: commandFiles.map(c => c.data) }
    );
    console.log('🔄 Comandos registrados correctamente');
  } catch (error) {
    console.error('🔥 Error al registrar comandos:', error.stack);
  }
});

// Manejo de interacciones
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error en comando ${interaction.commandName}:`, error);
      await interaction.reply({ 
        content: '⚠️ Ocurrió un error al ejecutar el comando', 
        ephemeral: true 
      });
    }
  }

  // Manejo de modals
  if (interaction.isModalSubmit()) {
    require('./handlers/modalHandler').execute(interaction);
  }

  // Manejo de botones
  if (interaction.isButton()) {
    require('./handlers/buttonHandler').execute(interaction);
  }
});

// Debugging
client.on('debug', console.log);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(token);