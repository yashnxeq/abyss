import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import remove from "../../logic/give-remove_Moderation"


export const slashCommand =
new SlashCommandBuilder()
    .setName('role')
    .setDescription('Remove a specific role of the selected user.')
    .addRoleOption(opt =>
        opt
            .setName('role')
            .setDescription('Select the role you want to remove.')
            .setRequired(true)
    )
    .addUserOption(opt =>
        opt
            .setName('member')
            .setDescription('Select the member you want to remove this role from.')
            .setRequired(true)
    );


export const executeInteraction =
async (interaction: ChatInputCommandInteraction) => {
    return await remove(interaction, false);
};
