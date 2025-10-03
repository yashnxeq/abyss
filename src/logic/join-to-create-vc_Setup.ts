import {
    ChannelType,
    EmbedBuilder,
    ChatInputCommandInteraction,
    Message, PermissionFlagsBits, VoiceChannel, VoiceState
} from "discord.js";
import execQuery from "../database/do/execQuery";
import { QueryStatus } from "../database/types";
import { tempVCs } from "../data";


export default
async (message: Message) => {

    if (!message.member?.permissions.has(PermissionFlagsBits.Administrator))
        return await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('You need to have `Administrator` privileges to use this command')
            ]
        })

    const mentionedChannel = message
                                .mentions
                                .channels
                                .filter(channel =>
                                        channel.type === ChannelType.GuildVoice).first();

    if (!mentionedChannel)
        return await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Mention a valid Voice Channel!")
            ]
        });

    join_to_create_vc_channel_Setup(mentionedChannel,
                                    message);
}


export async function join_to_create_vc_channel_Setup(
    channel: VoiceChannel,
    s: ChatInputCommandInteraction | Message
) {
    const [_, status] = await execQuery(`
        INSERT INTO Guilds (guild_id, join_to_create_vc_channel)
        VALUES ($1, $2)
        ON CONFLICT (guild_id)
        DO UPDATE SET join_to_create_vc_channel = $2
    `, [channel.guildId, channel.id]);

    if (status === QueryStatus.SUCCESS)
        await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('`Join-to-create-vc` channel set to ' + channel)
            ]
        });
    else
        await s.reply({
            content: 'Failed to update the channel in the database.',
            ephemeral: true
        });
}


export async function onJoin(newState: VoiceState) {

    if (!newState.member) return;

    const channelId = newState.channelId;
    const guildId   = newState.guild.id;

    const [res, _] =
    await execQuery(`SELECT join_to_create_vc_channel 
                     FROM Guilds
                     WHERE guild_id = $1 AND join_to_create_vc_channel = $2`,
                     [guildId, channelId]);

    if (res.rowCount > 0) {
        console.log(newState.member?.id, "Joined", channelId);
        const newVC = await newState.guild.channels.create({
            name: `${newState.member?.user.username}'s VC`,
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


export async function onLeave(oldState: VoiceState) {
    const channel = oldState.channel;
    if (tempVCs.has(channel?.id!)) {
      if (channel?.members.size === 0) {
        await channel.delete();
        tempVCs.delete(channel.id);
      }
    }
}


