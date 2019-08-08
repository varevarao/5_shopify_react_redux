import getSymbolFromCurrency from 'currency-symbol-map';

export const currencyString = (currencyCode, value) => {
    let symbol = getSymbolFromCurrency(currencyCode);
    let prefix = "";
    if(symbol) prefix = `${symbol} `;
    return `${prefix}${value}`;
}