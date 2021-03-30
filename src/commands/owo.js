const { InteractionResponseType } = require('discord-interactions');

module.exports = {
    execute: async ({ interaction, response }) => {
        // Get the raw values from Discord
        const rawText = ((interaction.data.options.find(opt => opt.name === 'message') || {}).value || '').trim()
        owoify = rawText.replace(/(?:r|l)/g, 'w')
            .replace(/(?:R|L)/g, 'W')
            // n[aeiou] with ny[aeiou]
            .replace(/n([aeiou])/g, 'ny$1')
            .replace(/N([aeiou])/g, 'Ny$1')
            .replace(/N([AEIOU])/g, 'Ny$1')
            // ove with uv
            .replace(/ove/g, 'uv')
        // Go!
        return response({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: owoify
            },
        });
    },
};

