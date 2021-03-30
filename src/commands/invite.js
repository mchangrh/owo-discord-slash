const { InteractionResponseType } = require('discord-interactions');
const { createEmbed } = require('../utils/embed');

module.exports = {
    name: 'invite',
    description: 'Get a link to add DNS over Discord to your server',
    execute: async ({ response }) => response({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: "test"
        },
    }),
};
