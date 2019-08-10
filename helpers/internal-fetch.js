const stringUtils = require('../helpers/string-utils');

module.exports = {
    API_TYPES: {
        shop: () => 'shop',
        customers: (path) => `customers${!!path ? `/${path}` : ''}`,
        orders: (path) => `orders${!!path ? `/${path}` : ''}`
    },

    /**
     * Fetches the raw data at the given API endpoint on the same server
     * Returns the raw string data received.
     */
    fetchInternalAPI: async (apiName, { params = {}, method = 'GET', body = null }) => {
        try {
            const queryString = stringUtils.formatQueryString(params);
            const options = Object.assign({
                method,
            }, body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {});

            const res = await fetch(`/api/${apiName}${queryString}`, options);

            // Wait till we receive the entire response
            const rawText = await res.text();
            if (res.status === 200) {
                // All good, reply with the data
                return { data: rawText, err: null };
            }
            else {
                // Something went wrong in the request
                throw new Error(`Server responded with status '${res.status}' and text: ${rawText}`);
            }
        } catch (e) {
            console.error(`Error in '${method}' on internal api '${apiName}'`, e);
            // Propogate the error only, for specific handling
            return { data: null, err: e };
        }
    },
}