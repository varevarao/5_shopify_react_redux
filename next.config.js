const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const dotenv = require('dotenv-flow');

dotenv.config({
    path: 'config/',
    default_node_env: 'development'
});

// Configure the Next.js build using a webpack interceptor
module.exports = withCSS({
    webpack: (config) => {
        const env = {
            ENV_DEV: process.env.NODE_ENV === 'development',
            SHOPIFY_API_KEY: JSON.stringify(process.env.SHOPIFY_API_KEY),
            SHOPIFY_API_SECRET_KEY: JSON.stringify(process.env.SHOPIFY_API_SECRET_KEY)
        };
        config.plugins.push(new webpack.DefinePlugin(env));

        return config;
    }
});