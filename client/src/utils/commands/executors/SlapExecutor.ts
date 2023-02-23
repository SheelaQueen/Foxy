import ComponentInteractionContext from "../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../index";
import { createEmbed } from "../../../utils/discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import gifs from 'nekos.life';
const gif = new gifs();

const SlapExecutor = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const slapGif = await gif.slap();
    const embed = createEmbed({});

    embed.title = bot.locale('commands:slap.success', { user: context.author.username, author: user  }),
        embed.image = {
            url: slapGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:slap.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                id: bot.emotes.FOXY_SCARED,
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}

export default SlapExecutor;