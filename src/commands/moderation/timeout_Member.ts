import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import timeout from "../../logic/timeout-untimeout_Moderation"


export const slashCommand =
new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout selected user.')
    .addUserOption(opt =>
        opt
            .setName('member')
            .setDescription('Select the member you want to timeout.')
            .setRequired(true)
    )
    .addNumberOption(opt =>
        opt
            .setName('duration')
            .setDescription('Duration of the timeout period.')
            .setMinValue(60)
            .setMaxValue(2419200)
    );


export const executeInteraction =
async (interaction: ChatInputCommandInteraction) => {
    return await timeout(interaction, true);
};

