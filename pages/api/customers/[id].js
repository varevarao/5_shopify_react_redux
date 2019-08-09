import { fetchShopifyAPI } from '../../../shopify-data';

export default async (req, res) => {
    const {
        query: { id },
        body
    } = req;

    if (req.method === 'PUT') {
        const { shopOrigin, accessToken } = req.cookies;
        // console.log(`Updating data for ${id} with token ${accessToken} and updates: ${body}`)
        const response = (!!id && !!accessToken) ? await fetchShopifyAPI(`customers/${id}`, { shopOrigin, accessToken, method: 'PUT', body }) : null;

        // console.log(response);
        res.setHeader('Content-Type', 'application/json')
        if (!!response) {
            res.statusCode = 200
            res.body = response;
        } else {
            res.statusCode = 400;
        }

        res.send(response || 'Invalid request');
    } else {
        res.statusCode = 400;
        res.send('Invalid request method.');
    }
}