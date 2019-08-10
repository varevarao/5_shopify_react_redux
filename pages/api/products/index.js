import { fetchShopifyAPI } from '../../../helpers/shopify-fetch';

const handlers = {
    GET: async (req, res) => {
        const { shopOrigin, accessToken } = req.cookies;
        // console.log(`Updating data for ${id} with token ${accessToken} and updates: ${body}`)
        const { data: response, err } = (!!accessToken) ?
            await fetchShopifyAPI(`products`, { shopOrigin, accessToken, method: 'GET' }) :
            { data: null, err: 'Invalid cookies' };

        // console.log(response);
        res.setHeader('Content-Type', 'application/json')
        if (!!response) {
            res.statusCode = 200
            res.body = response;
        } else {
            res.statusCode = 400;
            console.error(err);
        }

        res.send(response || 'Invalid request');
    }
}

export default (req, res) => {
    // Handle customer updates
    if (req.method in handlers) {
        handlers[req.method](req, res);
    } else {
        res.statusCode = 400;
        res.send('Invalid request method.');
    }
}