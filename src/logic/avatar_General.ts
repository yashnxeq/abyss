import { ChatInputCommandInteraction, EmbedBuilder, Message, User } from "discord.js";


export default
async (s: ChatInputCommandInteraction | Message) => {

    let user: User;
    if (s instanceof ChatInputCommandInteraction)
        user = s.options.getUser('user')!;
    else
        user = s.mentions.users.first()!;

    if (!user)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Mention a valid Member!')
            ]
        });

    await s.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(`${user.username}'s avatar...`)
                .setImage(user.displayAvatarURL({ size: 1024 }))
                .setFooter({
                    text:    'Requested by ' + s.member?.user.username,
                    iconURL: (s.member?.user as User).displayAvatarURL()
                })
        ]
    })
}
