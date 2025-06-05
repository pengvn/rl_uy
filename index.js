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

// ─── Manejo de Comandos ──────────────────────────────────
client.commands = new Map();
const commandFiles = ['buscar-equipo.js'].map(file => require(`./commands/${file}`));
commandFiles.forEach(command => {
  client.commands.set(command.data.name, command);
});

// ─── Evento Ready ────────────────────────────────────────
client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} listo!`);

  try {
    const rest = new REST({ version: '10' }).setToken(token);
    
    // Limpiar comandos antiguos primero
    await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: [] });
    
    // Registrar solo los comandos necesarios
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: commandFiles.map(c => c.data) }
    );
    console.log('🔄 Comandos registrados correctamente');
  } catch (error) {
    console.error('🔥 Error al registrar comandos:', error.stack);
  }
});

// ─── Manejo de Interacciones Mejorado ────────────────────
client.on('interactionCreate', async interaction => {
  try {
    // Comandos slash
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      
      await command.execute(interaction);
      return;
    }

    // Modals
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('buscarEquipoModal_')) {
        return require('./handlers/modalHandler').execute(interaction);
      }
    }

    // Botones
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('aceptar_busqueda_')) {
        // Verificar si ya fue procesado
        if (interaction.message.components.length === 0) {
          return interaction.reply({
            content: '⚠️ Esta búsqueda ya fue aceptada',
            ephemeral: true
          });
        }
        return require('./handlers/buttonHandler').execute(interaction);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en interactionCreate:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ 
        content: '⚠️ Ocurrió un error al procesar tu solicitud', 
        ephemeral: true 
      });
    }
  }
});

// ─── Manejo de Errores Global ────────────────────────────
process.on('unhandledRejection', error => {
  console.error('⚠️ Unhandled Rejection:', error);
});

client.on('error', error => {
  console.error('🚨 Client Error:', error);
});

// ─── Inicio del Bot ─────────────────────────────────────
client.login(token)
  .then(() => console.log('🔗 Conectando a Discord...'))
  .catch(error => {
    console.error('⛔ Error de login:', error);
    process.exit(1);
  });