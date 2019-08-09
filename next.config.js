const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const dotenv = require('dotenv-flow');

dotenv.config({
    path: 'config/',
    default_node_env: 'development'
});

// Configure the Next.js build using a webpack interceptor
module.exports = withCSS({
    serverRuntimeConfig: {
        API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY
    },
    publicRuntimeConfig: {
        ENV_DEV: (process.env.NODE_ENV === 'development'),
        API_KEY: process.env.SHOPIFY_API_KEY
    }
});