require('isomorphic-unfetch');
const cookies = require('next-cookies');
const SHOPIFY_API_VERSION = require('../config/index').SHOPIFY_API_VERSION;

const formatQueryString = (params) => Object.entries(params).reduce((str, [key, value], i) => `${i > 0 ? '&' : '?'}${str}${key}=${value}`, '');

module.exports = {
    API_TYPES: {
        shop: () => 'shop',
        customers: (path) => `customers${!!path ? `/${path}` : ''}`,
        orders: (path) => `orders${!!path ? `/${path}` : ''}`,
        products: (path) => `products${!!path ? `/${path}` : ''}`,
    },

    fetchShopifyAPI: async (apiName, { shopOrigin, accessToken, ctx = null, params = {}, method = 'GET', body = null }) => {
        // If provided the Next.js context, use that to pick up cookies
        if (!!ctx) {
            const cooks = cookies(ctx);
            shopOrigin = cooks.shopOrigin;
            accessToken = cooks.accessToken;
        }

        try {
            // Prepare the query string params
            const queryString = formatQueryString(params);
            // Setup common headers, and body
            const options = Object.assign({
                method,
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json'
                }
            }, (body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}));

            const res = await fetch(`https://${shopOrigin}/admin/api/${SHOPIFY_API_VERSION}/${apiName}.json${queryString}`, options);
            // console.log(`${origin} responded with (${res.status}) ${res.statusText} Body: ${options.body} Response: ${JSON.stringify(res)}`);
            // console.log(`Response: ${await res.text()}`);

            // Wait till we receive the entire response
            const rawText = await res.text();
            if (res.status === 200) {
                // All good, reply with the data
                return { data: rawText, err: null };
            } else {
                // Something went wrong in the request
                throw new Error(`Server '${shopOrigin}' responded with status '${res.status}' and text: ${rawText}`);
            }
        } catch (e) {
            console.error(`Error in '${method}' on shopify api '${apiName}'`, e);
            // Propogate the error only, for specific handling
            return { data: null, err: e };
        }
    },

    parseShopifyOrders: async (data) => {
        const shopifyData = data ? JSON.parse(data) : {};
        const result = { customers: {}, orders: {}, products: {} };

        if (shopifyData['orders']) {
            shopifyData['orders'].forEach(order => {
                // Stats
                if (!result.currency) {
                    result.currency = order.currency;
                }

                // Maps
                result.customers[order.customer.id] = order.customer;
                result.orders[order.id] = order;

                order.line_items.forEach(product => {
                    if (product.product_id in result.products) {
                        result.products[product.product_id].orders_count++;
                        let orderedAt = new Date(order.created_at).getTime();
                        if (orderedAt > result.products[product.product_id].last_order_ts) {
                            result.products[product.product_id].last_order_ts = orderedAt;
                        }
                        if (orderedAt < result.products[product.product_id].first_order_ts) {
                            result.products[product.product_id].first_order_ts = orderedAt;
                        }
                    } else {
                        result.products[product.product_id] = product;
                        result.products[product.product_id].orders_count = 1;
                        result.products[product.product_id].first_order_ts = new Date(order.created_at).getTime();
                        result.products[product.product_id].last_order_ts = new Date(order.created_at).getTime();
                    }
                });
            });
        }

        result._initialized = true;
        return result;
    },

    parseShopifyProducts: async (data) => {
        const shopifyData = data ? JSON.parse(data) : {};

        if (shopifyData['products']) {
            const products = {};
            shopifyData['products'].forEach(product => {
                // Existing entry, shouldn't exist
                if (!(product.id in products)) {
                    products[product.id] = product;
                } else {
                    Object.assign(products[product.id], product);
                }
            });

            return products;
        }

        return {};
    }
}