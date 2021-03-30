# OWOify in Discord with slash commands
or, https://github.com/mchangrh/owo-discord with slash commands

Highlights:
- owoify in discord
- slash commands
- Cloudflare workers
 
## How to use
`/owo`

## How to selfhost
- change `wrangler.toml` to reflect your cloudflare account ID
- fill in `wrangler secrets put` with:
  - your Client ID in `APPID`
  - **bot token** in `TOKEN`
  - public key in `PUBLICKEY` 
  - Optionally `GUILDID` for guild-targeted commands.