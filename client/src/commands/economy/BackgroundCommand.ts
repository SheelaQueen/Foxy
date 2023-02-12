import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes, ButtonStyles } from 'discordeno/types';
import { createActionRow, createSelectMenu, createCustomId, createButton } from '../../utils/discord/Component';
import { bglist } from "../../structures/json/backgroundList.json"
import { bot } from '../../index';
import executeBackground from '../../structures/commands/modules/executeBackground';
import { MessageFlags } from '../../utils/discord/Message';
import GenerateImage from '../../structures/GenerateImage';

const choices = bglist.map(data => {
    if (data.blocked) return;
    return Object({ name: `${data.name} / ${data.foxcoins} Foxcoins`, value: data.id })
});
const BackgroundCommand = createCommand({
    name: 'background',
    description: '[💵] Mude o background do seu perfil',
    descriptionLocalizations: {
        'en-US': '[💵] Change your profile background'
    },
    category: 'economy',
    options: [
        {
            name: "set",
            nameLocalizations: {
                "pt-BR": "definir"
            },
            description: "[💵] Defina o background do seu perfil",
            descriptionLocalizations: {
                "en-US": "[💵] Set your profile background"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
            name: "buy",
            nameLocalizations: {
                "pt-BR": "comprar"
            },
            description: "[💵] Compre um background",
            descriptionLocalizations: {
                "en-US": "[💵] Buy a background"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "background",
                    description: "Selecione o background que deseja comprar",
                    descriptionLocalizations: {
                        "en-US": "Select the background you want to buy"
                    },
                    type: ApplicationCommandOptionTypes.String,
                    required: true,
                    choices: choices
                }
            ]
        }
    ],

    commandRelatedExecutions: [executeBackground],
    execute: async (ctx, endCommand, t) => {
        const subcommand = ctx.getSubCommand();
        const userData = await bot.database.getUser(ctx.author.id);
        switch (subcommand) {
            case 'buy': {
                await ctx.defer(true);
                const code = ctx.getOption<string>('background', false),
                    background = await bglist.find((b) => b.id === code?.toLowerCase());

                if (userData.backgrounds.includes(code)) {
                    ctx.foxyReply({
                        content: t('commands:background.buy.alreadyOwned'),
                        flags: MessageFlags.Ephemeral
                    });

                    endCommand();
                    return;
                }
                const canvasGenerator = new GenerateImage(t, ctx.author, userData, 1436, 884, true, code);
                const profile = canvasGenerator.renderProfile();

                ctx.foxyReply({
                    content: ctx.makeReply(bot.emotes.success, `Background: **${background.name}**\n ${bot.emotes.daily} **|** ${t('commands:background.buy.price')}: **${background.foxcoins}**`),
                    file: [{
                        name: "preview.png",
                        blob: await profile
                    }],
                    components: [createActionRow([createButton({
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, code, background.foxcoins, subcommand),
                        label: t('commands:background.buy.purchase'),
                        style: ButtonStyles.Success,
                        emoji: bot.emotes.daily
                    })])]
                });

                endCommand();
                break;
            }
            case "set": {
                await ctx.defer(true);
                const fetchBackgrounds = userData.backgrounds;
                const backgrounds = await bglist.filter((b) => fetchBackgrounds.includes(b.id));

                ctx.foxyReply({
                    components: [createActionRow([createSelectMenu({
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, subcommand),
                        placeholder: t('commands:background.set.title'),
                        options: backgrounds.map((b) => Object({
                            label: b.name,
                            value: b.id,
                        }))
                    })])],
                    flags: MessageFlags.Ephemeral
                });
                endCommand();
                break;
            }
        }
    }
});

export default BackgroundCommand;