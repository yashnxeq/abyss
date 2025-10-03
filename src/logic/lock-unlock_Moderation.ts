import {
    Message,
    EmbedBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    ChannelType,
    GuildMember,
} from "discord.js";


export default
async (s: ChatInputCommandInteraction | Message, lock: 'LOCK' | 'UNLOCK') => {

    let channel = s.channel!;

    if (!s.guild)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('This command can only be used in a guild!!!')
            ]
        });

    if (channel.type !== ChannelType.GuildText)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('This command can only be used in a text channel!!!')
            ]
        });

    if (!(s.member as GuildMember).permissions.has(PermissionFlagsBits.Administrator))
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('You need to have `Administrator` privileges to use this command!!!')
            ]
        });

    if (!channel
            .permissionsFor(channel.guild.roles.everyone)
            .has(PermissionFlagsBits.SendMessages))
        return await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription('This channel is already unlocked!!!')
            ]
        });

    channel
        .permissionOverwrites
        .edit(channel.guild.roles.everyone, { SendMessages: !lock });
    channel.send({
        embeds: [
            new EmbedBuilder()
                .setDescription(`${s.member?.user} ${
                    lock ? 'locked' : 'unlocked'
                } this Channel!!!`)
        ]
    });
}
