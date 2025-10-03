import {
    User,
    Message,
    type ChatInputCommandInteraction,
    type GuildMember,
    EmbedBuilder,
    PermissionFlagsBits
} from "discord.js";



export default
async (s: ChatInputCommandInteraction | Message, give: 'GIVE' | 'REMOVE') => {
    let mentionedUser: GuildMember | undefined;
    let duration: number;
    let reason: string;


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


    if (s instanceof Message) {
        const args    = s.content.trim().split(/\s+/).slice(1);
        mentionedUser = s.mentions.members?.first();

        if (!args || !args[0])
            return await s.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('Provide a valid duration')
                ]
            });

        duration      = parseDuration(args[0]) ?? 60;
        reason = args.slice(1).join(" ") || 'No reason provided';
    } else {
        mentionedUser = s.options.getMember('user') as GuildMember;
        duration      = s.options.getNumber('duration') ?? 60;
        reason        = s.options.getString('reason') ?? 'No reason provided';
    }

    if (!mentionedUser)
        return await s.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Mention a valid member!')
            ]
        });

    if (give === 'GIVE')
        giveTimeout(mentionedUser,
                    duration,
                    reason);
    else
        removeTimeout(mentionedUser,
                      reason);
}



export async function giveTimeout(
  member: GuildMember,
  duration: number,
  reason?: string
) {
  if (!member.moderatable) {
    throw new Error(`I cannot timeout ${member.user.tag}`);
  }
  await member.timeout(duration, reason);
}


export async function removeTimeout(
    member: GuildMember,
    reason?: string
) {
  if (!member.moderatable) {
    throw new Error(`I cannot untimeout ${member.user.tag}`);
  }

  await member.timeout(null, reason);
  return `${member.user.tag} has been un-timed out`;
}


function parseDuration(input: string): number | null {
    const match = input.match(/^(\d+)([smhdw])$/i);
    if (!match || !match[1] || !match[2]) return null;

    const value = parseInt(match[1], 10);
    const unit  = match[2].toLowerCase();

    switch (unit) {
        case "s": return value * 1000;
        case "m": return value * 60_000;
        case "h": return value * 3_600_000;
        case "d": return value * 86_400_000;
        case "w": return value * 604_800_000;
        default:  return null;
    }
}
