module.exports = {
    /**
     * Fetches the raw data at the given API endpoint on the same server
     * Returns the raw string data received.
     */
    fetchInternalAPI: async (apiName, params = {}, method = 'GET', body = null) => {
        try {
            const queryString = formatQueryString(params);
            const options = Object.assign({
                method,
            }, body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {});
    
            const res = await fetch(`/api/${apiName}${queryString}`, options);
    
            if (res.status === 200) {
                return await res.text();
            }
            else {
                return null;
            }
        } catch (e) {
            console.error('Error fetching initial data: ', e);
            return null;
        }
    },
}