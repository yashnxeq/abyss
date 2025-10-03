import {
    REST,
    Routes,
    Client,
    MessageFlags,
    GatewayIntentBits,
} from 'discord.js';


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions
  ]
});


const PREFIX = ',';


import { commands, handlers } from './slash-commands';

client.on('clientReady', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID!, '1421361353641168959'),
        { body: commands }
    );
    console.log('Slash commands registered.');
});


client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const handler = handlers.get(interaction.commandName);
            if (handler) {
                try {
                    await handler(interaction);
                } catch (err) {
                    console.error(err);
                    await interaction.reply({
                        content: 'Error executing command. :(',
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        } else if (interaction.isButton()) {
            switch (interaction.customId) {
                default:
                    interaction.deferUpdate();
                    break;
          }
        }
    } catch (e) {
        console.error(e);
    }
});


import text_commands       from './text-commands';
import { onJoin, onLeave } from './logic/join-to-create-vc_Setup';

client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    console.log('Args: ', args, 'Command:', command);

    text_commands(message, command!, args);
});


// Join / Leave / Switch VC
client.on("voiceStateUpdate", async (oldState, newState) => {

    // user joins a VC
    if (!oldState.channelId && newState.channelId) {
        await onJoin(newState);
    }

    // user leaves a VC
    else if (oldState.channelId && !newState.channelId) {
        await onLeave(oldState);
    }

    // user switches VC
    else if (oldState.channelId && newState.channelId &&
             oldState.channelId !== newState.channelId) {}
});



// Server Join / Server Leave
import execQuery from './database/do/execQuery';

client.on('guildCreate', async (guild) =>
    await execQuery('INSERT INTO Guilds (guild_id) VALUES ($1)', [guild.id]));

client.on('guildDelete', async (guild) =>
    await execQuery('DELETE FROM Guilds WHERE guild_id = $1', [guild.id]));


// Login
client.login(process.env.TOKEN);
