module.exports = {
    SHOPIFY_API_VERSION: '2019-07',
    enabled_apis: {
        products: {
            scopes: ['read_products'],
            fields: []
        },
        orders: {
            scopes: ['read_orders'],
            fields: []
        },
        customers: {
            scopes: ['read_customers', 'write_customers'],
            fields: []
        }
    }
}