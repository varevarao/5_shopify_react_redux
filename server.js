// Required by koa shopify auth
require('isomorphic-unfetch');
// The express based server architecture
const Koa = require('koa');
// React based UI builder
const next = require('next');
// Load process.env from .env file
const dotenv = require('dotenv-flow');
// Support for sessions
const session = require('koa-session');

// Shopify specifics
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');

// Load the env config
dotenv.config();

// Setup the app, using Next.js
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Pick up the Shopify keys
const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY } = process.env;

// Setup the app
app.prepare().then(() => {
    // Use the Koa architecture for our app
    const server = new Koa();
    // Use sessions on this server
    server.use(session(server));
    // Setup the secret to be used by the server
    // Multiple keys can be added for key rotation
    server.keys = [SHOPIFY_API_KEY];

    // Setup Shopify auth
    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_products', 'read_customers', 'write_customers', 'read_orders'],
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

