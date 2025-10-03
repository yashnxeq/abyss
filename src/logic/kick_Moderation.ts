import {
    User,
    Message,
    GuildMember,
    EmbedBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction
} from "discord.js";


export default
async (s: ChatInputCommandInteraction | Message) => {

    if (!s.guild)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("This command can only be used in a guild!!!")
            ],
        });


    if (!(s.member as GuildMember).permissions.has(PermissionFlagsBits.Administrator))
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('You need to have `Administrator` privileges to use this command!!!')
            ]
        });

    let user: User | undefined;
    let reason;
    if (s instanceof ChatInputCommandInteraction) {
        user   = s.options.getUser('member')!;
        reason = s.options.getString('reason');
    }
    else {
        user = s.mentions.users.first();
        const args = s.content.trim().split(/\s+/);
        reason = args.slice(2).join(" ");
    }

    if (!user)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Mention a valid Member!')
            ]
        });

    const member = s.guild?.members.cache.get(user.id);

    if (!member)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Invalid member!')
            ]
        });

    if (!member.kickable)
        return await s.reply({
            embeds: [
                new EmbedBuilder().setDescription(
                    `I cannot kick ${member.user.tag}! They may have higher or equal roles, or I lack permissions.`
                ),
            ],
        });

    await member.kick(reason ?? 'No reason provided!');
    return await s.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription(`You kicked ${member}.\nReason: ${reason}`)
        ]
    });
}
