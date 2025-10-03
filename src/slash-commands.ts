import { readdirSync } from 'fs';
import { join } from 'path';


export const commands: any[] = [];
export const handlers = new Map();


const commands_dir = readdirSync('./src/commands');
for (const command_sub_dir of commands_dir) {
    for (const command_file of readdirSync('./src/commands/' + command_sub_dir)) {
        const { slashCommand, executeInteraction } 
            = await import(join(process.cwd() +
                           '/src/commands/'   +
                            command_sub_dir   +
                           '/' + command_file));
        if (slashCommand && executeInteraction) {
            commands.push(slashCommand.toJSON());
            handlers.set(slashCommand.name, executeInteraction);
        }
    }
}
