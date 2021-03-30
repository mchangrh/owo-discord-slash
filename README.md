# OWOify in Discord with slash commands
or, https://github.com/mchangrh/owo-discord with slash commands

Highlights:
- owoify in discord
- slash commands
- Cloudflare workers
 
## How to use
`/owo`

## How to selfhost
- change `wrangler.toml` to reflect your Cloudflare account & route
- fill in `wrangler secrets put` with:
  - your Client ID in `CLIENT_ID`
  - **bot token** in `BOT_TOKEN`
  - public key in `CLIENT_PUBLIC_KEY` 
  - Optionally `GUILDID` for guild-targeted commands.