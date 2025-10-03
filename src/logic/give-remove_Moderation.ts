import {
    User,
    Role,
    Message,
    GuildMember,
    EmbedBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
} from "discord.js";


export default
async (s: ChatInputCommandInteraction | Message, give: 'GIVE' | 'REMOVE') => {

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

    let user:  User   | undefined;
    let roles: Role[] | undefined;
    if (s instanceof ChatInputCommandInteraction) {
        user  = s.options.getUser('user')!;
        roles = [s.options.getRole('role')! as Role];
    } else {
        user  = s.mentions.users.first()
        roles = [...s.mentions.roles.values()]
    }

    if (!user)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(give ?
                        'Mention a user to give them role!!!' :
                        'Mention a user to remove their role!!!')
            ]
        });

    const member = s.guild?.members.cache.get(user.id);

    if (!member)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Invalid member!!!')
            ]
        });

    const memberRoles = member.roles.cache;

    const botMember = s.guild.members.me;
    if (!botMember) return;

    for (const role of roles) {
        if (role.position >= botMember.roles.highest.position)
            return await s.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("I cannot manage the role" + role +
                                        "because it's higher or equal to my highest role!")
                ],
            });

        if (memberRoles.has(role.id) === (give === 'GIVE'))
            await s.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${member} ${give === 'GIVE' ?
                            'already has' :
                            'dont have'
                        } ${role} role!!!`)
                ]
            });
        else {
            give ? await member.roles.add(role.id) : await member.roles.remove(role.id);
            await s.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(give ?
                                        `${user} gave ${member} ${role} role!!!` :
                                        `${user} removed ${role} role from ${member}!!!`)
                ]
            })
        }
    }
}
