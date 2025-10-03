import { ChannelType, Message } from "discord.js";


import lock$unlock_Channel from './logic/lock-unlock_Moderation';
import timeout$untimeout   from "./logic/timeout-untimeout_Moderation";
import give$remove_Role    from './logic/give-remove_Moderation';
import ban$unban_User      from "./logic/ban-unban_Moderation";
import kick_Member         from './logic/kick_Moderation';

import avatar_Display      from "./logic/avatar_General";


export default
async (message: Message, command: string, args: string[]) => {
    switch (command) {

        case 'say': {
            if (message.channel.type !== ChannelType.GuildText)
                return await message.reply({
                    content: 'This command can only be used in a `GuildText` channel!'
                });
            const text = args.join(" ");
            await message.channel.send(text || "** **");
            break;
        }

        /*
         * Moderation Commands
         */
        case 'lock':
            await lock$unlock_Channel(message, 'LOCK'); break;
        case 'unlock':
            await lock$unlock_Channel(message, 'UNLOCK'); break;

        case 'give':
            await give$remove_Role(message, 'GIVE'); break;
        case 'remove':
            await give$remove_Role(message, 'REMOVE'); break;

        case 'kick':
            await kick_Member(message); break;

        case 'timeout':
            await timeout$untimeout(message, 'GIVE'); break;
        case 'untimeout':
            await timeout$untimeout(message, 'REMOVE'); break;

        case 'ban':
            await ban$unban_User(message, 'BAN'); break;
        case 'unban':
            await ban$unban_User(message, 'UNBAN'); break;

        /*
         * General Commands
         */
        case 'avatar':
            await avatar_Display(message); break;
    }
}
