import {
    ChannelType,
    EmbedBuilder,
    VoiceChannel,
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits
} from 'discord.js';
import { join_to_create_vc_channel_Setup } from '../../logic/join-to-create-vc_Setup';


export const slashCommand = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup your server!?')

    .addSubcommand(cmd =>
        cmd
            .setName('join-to-create-vc-channel')
            .setDescription('Set join to create vc channel.')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Select a voice channel')
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildVoice)
            )
    )

    .addSubcommandGroup(grp =>
        grp
            .setName('sticky-messages')
            .setDescription('Setup sticky messages for your server.')
            .addSubcommand(cmd =>
                cmd
                    .setName('add')
                    .setDescription('Add sticky message for the selected channel.')
            )
            .addSubcommand(cmd =>
                cmd
                    .setName('remove')
                    .setDescription('Remove existing sticky messages.')
            )
            .addSubcommand(cmd =>
                cmd
                    .setName('list')
                    .setDescription('List all sticky messages.')
            )
    )


export const executeInteraction =
async (i: ChatInputCommandInteraction) => {

    if (!i.guild)
        return await i.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("This command can only be used in a guild!!!")
            ],
        });

    switch (i.options.getSubcommand()) {
        case 'join-to-create-vc-channel': {

            if (!i.memberPermissions?.has(PermissionFlagsBits.Administrator))
                return await i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('You need to have `Administrator` privileges to use this command')
                    ]
                })

            const channel = i.options.getChannel('channel')!;
            join_to_create_vc_channel_Setup(channel as VoiceChannel, i);
            break;
        }
    }
}
