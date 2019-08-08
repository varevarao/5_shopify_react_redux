const withCSS = require('@zeit/next-css');
const webpack = require('webpack');
const dotenv = require('dotenv-flow');

dotenv.config();

// Configure the Next.js build using a webpack interceptor
module.exports = withCSS({
    webpack: (config) => {
        const env = { API_KEY: JSON.stringify(process.env.SHOPIFY_API_KEY) };
        config.plugins.push(new webpack.DefinePlugin(env));
        
        return config;
    },
    env: {
        SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY
    }
});