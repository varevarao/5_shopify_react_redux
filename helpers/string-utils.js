module.exports = {
    formatQueryString: (params) => Object.entries(params).reduce((str, [key, value], i) => `${i > 0 ? '&' : '?'}${str}${key}=${value}`, ''),
}