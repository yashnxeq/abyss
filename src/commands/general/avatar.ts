import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import display_Avatar from "../../logic/avatar_General";


export const slashCommand =
new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Displays an user's profile picture.")
    .addUserOption(opt =>
        opt
            .setName('user')
            .setDescription('Select the user whoose avatar you want to display.')
            .setRequired(true)
    );


export const executeInteraction =
async (i: ChatInputCommandInteraction) => {
    return await display_Avatar(i);
}
