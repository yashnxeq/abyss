import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import ban from "../../logic/ban-unban_Moderation"


export const slashCommand =
new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a specific user.')
    .addUserOption(opt =>
        opt
            .setName('member')
            .setDescription('Select the member you want to ban.')
            .setRequired(true)
    )
    .addStringOption(opt =>
        opt
            .setName('reason')
            .setDescription('Reason for banning this user.')
    );


export const executeInteraction =
async (interaction: ChatInputCommandInteraction) => {
    return await ban(interaction, 'BAN');
};
