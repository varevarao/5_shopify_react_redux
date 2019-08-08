require('isomorphic-unfetch');

const formatQueryString = (params) => Object.entries(params).reduce((str, [key, value], i) => `${i > 0 ? '&' : '?'}${str}${key}=${value}`, '');

module.exports = {
    fetchShopifyAPI: async (apiName, origin, token, params = {}, method = 'GET', body = null) => {
        try {
            const queryString = formatQueryString(params);
            const options = Object.assign({
                method,
                headers: {
                    'X-Shopify-Access-Token': token,
                    'Content-Type': 'application/json'
                }
            }, (body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}));

            const res = await fetch(`https://${origin}/admin/api/2019-07/${apiName}.json${queryString}`, options);
            // console.log(`${origin} responded with (${res.status}) ${res.statusText} Body: ${options.body} Response: ${JSON.stringify(res)}`);
            // console.log(`Response: ${await res.text()}`);

            if (res.status === 200) {
                return await res.text();
            } else {
                console.error(res);
                return null
            }
        } catch (e) {
            console.error('Error fetching initial data: ', e);
            return null;
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