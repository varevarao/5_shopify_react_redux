import { createSelector } from 'reselect';

const getCustomers = (state) => state.customers;
const getOrders = (state) => state.orders;

// Computed Stats
export const total_customers = createSelector([getCustomers], (customers) => {
    return Object.keys(customers).filter(id => id !== 'editing_customer').length;
});

export const total_orders = createSelector([getOrders], (orders) => {
    return Object.keys(orders).length;
});