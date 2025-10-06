import {
    REST,
    Routes,
    Client,
    MessageFlags,
    GatewayIntentBits,
    ChannelType,
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
import { tempVCs } from './data';

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
        if (!newState.member || !newState.channel) return;
        if (newState.channel.name === 'create') {
            console.log(newState.member.id, "Joined", newState.channelId);
            const newVC = await newState.guild.channels.create({
                name: `${newState.member.user.username}'s VC`,
                type: ChannelType.GuildVoice,
                parent: newState.channel?.parent,
                permissionOverwrites: [
                  {
                    id: newState.member.id,
                    allow: ["Connect", "ManageChannels"],
                  },
                ]
            });
            await newState.setChannel(newVC);
            tempVCs.add(newVC.id);
        }
    }

    // user leaves a VC
    else if (oldState.channelId && !newState.channelId) {
        const channel = oldState.channel;
        if (tempVCs.has(channel?.id!)) {
            if (channel?.members.size === 0) {
                await channel.delete();
                tempVCs.delete(channel.id);
            }
        }
    }

    // user switches VC
    else if (oldState.channelId && newState.channelId &&
             oldState.channelId !== newState.channelId) {}
});



// Server Join / Server Leave
client.on('guildCreate', async (guild) => {});
client.on('guildDelete', async (guild) => {});


// Login
client.login(process.env.TOKEN);
