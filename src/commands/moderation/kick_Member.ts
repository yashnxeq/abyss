import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import kick_Member from "../../logic/kick_Moderation";


export const slashCommand =
new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a specific user.')
    .addUserOption(opt =>
        opt
            .setName('member')
            .setDescription('Select the member you want to kick.')
            .setRequired(true)
    )
    .addStringOption(opt =>
        opt
            .setName('reason')
            .setDescription('Reason for kicking this user.')
    );


export const executeInteraction =
async (interaction: ChatInputCommandInteraction) => {
    return await kick_Member(interaction);
};
