const { InteractionType, InteractionResponseType, InteractionResponseFlags, verifyKey } = require('discord-interactions');
const commands = require('./build/data/commands.json');

// Util to send a JSON response
const jsonResponse = obj => new Response(JSON.stringify(obj), {
    headers: {
        'Content-Type': 'application/json',
    },
});

// Util to send a perm redirect response
const redirectResponse = url => new Response(null, {
    status: 301,
    headers: {
        'Location': url,
    },
});

// Util to verify a Discord interaction is legitimate
const handleInteractionVerification = (request, bodyBuffer) => {
    const timestamp = request.headers.get('X-Signature-Timestamp') || '';
    const signature = request.headers.get('X-Signature-Ed25519') || '';
    return verifyKey(bodyBuffer, signature, timestamp, CLIENT_PUBLIC_KEY);
};

// Process a Discord interaction POST request
const handleInteraction = async ({ request, wait }) => {
    // Get the body as a buffer and as text
    const bodyBuffer = await request.arrayBuffer();
    const bodyText = (new TextDecoder('utf-8')).decode(bodyBuffer);

    // Verify a legitimate request
    if (!handleInteractionVerification(request, bodyBuffer))
        return new Response(null, { status: 401 });

    // Work with JSON body going forward
    const body = JSON.parse(bodyText);

    // Handle a PING
    if (body.type === InteractionType.PING)
        return jsonResponse({
            type: InteractionResponseType.PONG,
        });

    // Otherwise, we only care for commands
    if (body.type !== InteractionType.APPLICATION_COMMAND)
        return new Response(null, { status: 501 });

    // Locate the command data
    const commandData = commands[body.data.id];
    if (!commandData)
        return new Response(null, { status: 404 });

    try {
        // Load in the command
        const command = require(`./commands/${commandData.file}`);

        // Execute
        return await command.execute({ interaction: body, response: jsonResponse, wait });
    } catch (err) {
        // Catch & log any errors
        console.log(body);
        console.error(err);

        // Send an ephemeral message to the user
        return jsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'An unexpected error occurred when executing the command.',
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        });
    }
};

// Process all requests to the worker
const handleRequest = async ({ request, wait }) => {
    const url = new URL(request.url);

    // Send interactions off to their own handler
    if (request.method === 'POST' && url.pathname === '/interactions')
        return await handleInteraction({ request, wait });

    // Otherwise, we only care for GET requests
    if (request.method !== 'GET')
        return new Response(null, { status: 404 });

    // Health check route
    if (url.pathname === '/health')
        return new Response('OK', {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Expires': '0',
                'Surrogate-Control': 'no-store',
            },
        });
    
    // Invite redirect
    if (url.pathname === '/invite')
        return redirectResponse(`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=applications.commands`);

    // Discord redirect
    if (url.pathname === '/server')
        return redirectResponse('https://discord.gg/JgxVfGn');

    // GitHub redirect
    if (url.pathname === '/github')
        return redirectResponse('https://github.com/MattIPv4/DNS-over-Discord/');

    // Docs redirect
    if (url.pathname === '/')
        return redirectResponse('https://developers.cloudflare.com/1.1.1.1/fun-stuff/dns-over-discord');

    // Not found
    return new Response(null, { status: 404 });
};

// Register the worker listener
addEventListener('fetch', event => {
    // Process the event
    return event.respondWith(handleRequest({
        request: event.request,
        wait: event.waitUntil.bind(event)
    }).catch(err => {
        // Log & re-throw any errors
        console.error(err);
        throw err;
    }));
});

