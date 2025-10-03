import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import give from "../../logic/give-remove_Moderation"


export const slashCommand =
new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give a specific role to the selected user.')
    .addRoleOption(opt =>
        opt
            .setName('role')
            .setDescription('Select the role you want to give.')
            .setRequired(true)
    )
    .addUserOption(opt =>
        opt
            .setName('member')
            .setDescription('Select the member you want to give this role to.')
            .setRequired(true)
    );


export const executeInteraction =
async (interaction: ChatInputCommandInteraction) => {
    return await give(interaction, true);
};
