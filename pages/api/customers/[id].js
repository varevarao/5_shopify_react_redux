import { fetchShopifyAPI } from '../../../helpers/shopify-fetch';

const handlers = {
    PUT: async (req, res) => {
        const {
            query: { id },
            body
        } = req;

        const { shopOrigin, accessToken } = req.cookies;
        // console.log(`Updating data for ${id} with token ${accessToken} and updates: ${body}`)
        const { response, err } = (!!id && !!accessToken) ? await fetchShopifyAPI(`customers/${id}`, { shopOrigin, accessToken, method: 'PUT', body }) : null;

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

export default async (req, res) => {
    // Handle customer updates
    if (req.method in handlers) {
        handlers[req.method](req, res);
    } else {
        res.statusCode = 400;
        res.send('Invalid request method.');
    }
}