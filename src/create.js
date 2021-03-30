const { DiscordInteractions, ApplicationCommandOptionType } = require("slash-commands");

commands = [
  {
    name: 'owo',
    description: 'owo-ify',
    options: [
      {
        name: 'message',
        description: 'Your message',
        type: ApplicationCommandOptionType.STRING,
        required: true,
      }
    ],
  }
]
module.exports.commands = commands

async function createInteraction() { 
  const interaction = new DiscordInteractions({
    applicationId: APPID,
    authToken: TOKEN,
    publicKey: PUBLICKEY,
  });
  for (command in Object.keys(commands)) {
    await interaction
      .createApplicationCommand(command, GUILDID)
      .then(console.log)
      .catch(console.error);
  }
}

const start = async function() {
  await createInteraction();
}
start();
