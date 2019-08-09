// Required by koa shopify auth
require('isomorphic-unfetch');
// The express based server architecture
const Koa = require('koa');
// React based UI builder
const next = require('next');
// Support for sessions
const session = require('koa-session');
// Next config
const getConfig = require('next/config').default;
// Shopify specifics
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');

// Pick up the Shopify keys
// const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY } = process.env;

const APP_CONFIG = require('./config/index');

// Setup the app, using Next.js
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Setup the app
app.prepare().then(() => {
    const { serverRuntimeConfig: { API_SECRET_KEY }, publicRuntimeConfig: { API_KEY } } = getConfig();
    // Use the Koa architecture for our app
    const server = new Koa();
    // Use sessions on this server
    server.use(session(server));
    // Setup the secret to be used by the server
    // Multiple keys can be added for key rotation
    server.keys = [API_KEY];

    // Setup Shopify auth
    server.use(
        createShopifyAuth({
            apiKey: API_KEY,
            secret: API_SECRET_KEY,
            scopes: Object.values(APP_CONFIG.enabled_apis).reduce((scopes, curr) => scopes.concat(curr.scopes), []),
            afterAuth(ctx) {
                // Pick up the private details
                const { shop, accessToken } = ctx.session;
                // Set the shop shopOrigin in the user cookie, to allow access later
                ctx.cookies.set('shopOrigin', shop, { httpOnly: false });
                ctx.cookies.set('accessToken', accessToken, { httpOnly: false });

                // Go back to the app landing page
                ctx.redirect('/');
            }
        })
    );

    // Session management middleware
    server.use(verifyRequest());

    // Delegate all requests to Next
    server.use(async (ctx) => {
        // Wait for Next to handle the request
        await handle(ctx.req, ctx.res);
        // Ask Koa not to handle the response
        // https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxrespond
        ctx.respond = false;
        // All OK
        ctx.res.statusCode = 200;
        return;
    });

    // Start the server
    server.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
});

