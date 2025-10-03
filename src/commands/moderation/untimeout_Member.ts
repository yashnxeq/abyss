import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import timeout from "../../logic/timeout-untimeout_Moderation"


export const slashCommand =
new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Removed timeout from selected user.')
    .addUserOption(opt =>
        opt
            .setName('member')
            .setDescription('Select the member you want to untimeout.')
            .setRequired(true)
    );


export const executeInteraction =
async (interaction: ChatInputCommandInteraction) => {
    return await timeout(interaction, false);
};

