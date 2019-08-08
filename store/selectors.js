import { createSelector } from 'reselect';
import { TIMESCALE, toTimescale } from '../helpers/date-utils';

const getCustomers = (state) => Object.values(state.customers);
const getOrders = (state) => Object.values(state.orders);

// Computed Stats
export const total_revenue = createSelector([getOrders], (orders) => {
    return orders.reduce((revenue, order) => revenue + parseFloat(order.total_price), 0.0);
});

export const returnCustomers = createSelector([getCustomers], (customers) => {
    return customers.reduce((prev, curr) => prev + parseInt(curr.orders_count) > 1 ? 1 : 0, 0);
});

/** Customer spend **/
// Max
export const maxValueSpends = createSelector([getCustomers], (customers) => {
    return customers.length <= 0 ? 0 : customers.reduce((prev, curr) => {
        let total = parseFloat(curr.total_spent);
        return total > prev ? total : prev;
    }, 0);
});
// Min
export const minValueSpends = createSelector([getCustomers], (customers) => {
    return customers.length <= 0 ? 0 : customers.reduce((prev, curr) => {
        let total = parseFloat(curr.total_spent);
        return total < prev ? total : prev;
    }, Number.MAX_VALUE);
});
// Avg
export const avgValueSpends = createSelector([getCustomers], (customers) => {
    return customers.length <= 0 ? 0 : (customers.reduce((prev, curr) => prev + parseFloat(curr.total_spent), 0) / customers.length);
});

/** Orders per year **/
// Max
export const maxValueOrders = createSelector([getOrders], (orders) => {
    return orders.length <= 0 ? 0 : orders.reduce((prev, curr) => {
        let total = parseFloat(curr.total_price);
        return total > prev ? total : prev;
    }, 0.0);
});
// Min
export const minValueOrders = createSelector([getOrders], (orders) => {
    return orders.length <= 0 ? 0 : orders.reduce((prev, curr) => {
        let total = parseFloat(curr.total_price);
        return total < prev ? total : prev;
    }, Number.MAX_VALUE);
});
// Avg
export const avgValueOrders = createSelector([getOrders], (orders) => {
    return orders.length <= 0 ? 0 : (orders.reduce((prev, curr) => prev + parseFloat(curr.total_price), 0) / orders.length);
});

/** Items per order **/
// Max
export const maxValueItems = createSelector([getOrders], (orders) => {
    return orders.length <= 0 ? 0 : orders.reduce((prev, curr) => {
        let total = curr.line_items.length;
        return total > prev ? total : prev;
    }, 0);
});
// Min
export const minValueItems = createSelector([getOrders], (orders) => {
    return orders.length <= 0 ? 0 : orders.reduce((prev, curr) => {
        let total = curr.line_items.length;
        return total < prev ? total : prev;
    }, Number.MAX_VALUE);
});
// Avg
export const avgValueItems = createSelector([getOrders], (orders) => {
    return orders.length <= 0 ? 0 : (orders.reduce((prev, curr) => prev + curr.line_items.length, 0) / orders.length)
});

/** Buying frequency **/
// Max
export const maxValueFreq = createSelector([getCustomers], (customers) => {
    return customers.length <= 0 ? 0 : customers.reduce((prev, curr) => {
        const liveDuration = toTimescale((new Date().getTime() - new Date(curr.created_at).getTime()), TIMESCALE.YEAR);
        const freq = parseInt(curr.orders_count) / (liveDuration < 1 ? 1 : liveDuration);
        
        return freq > prev ? freq : prev;
    }, 0);
});
// Min
export const minValueFreq = createSelector([getCustomers], (customers) => {
    return customers.length <= 0 ? 0 : customers.reduce((prev, curr) => {
        const liveDuration = toTimescale((new Date().getTime() - new Date(curr.created_at).getTime()), TIMESCALE.YEAR);
        const freq = parseInt(curr.orders_count) / (liveDuration < 1 ? 1 : liveDuration);
        
        return freq < prev ? freq : prev;
    }, Number.MAX_VALUE);
});
// Avg
export const avgValueFreq = createSelector([getCustomers], (customers) => {
    return customers.length <= 0 ? 0 : (customers.reduce((prev, curr) => {
        const liveDuration = toTimescale((new Date().getTime() - new Date(curr.created_at).getTime()), TIMESCALE.YEAR);
        const freq = parseInt(curr.orders_count) / (liveDuration < 1 ? 1 : liveDuration);
        
        return prev + freq;
    }, 0) / customers.length);
});