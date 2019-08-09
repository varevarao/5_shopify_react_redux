import { createSelector } from 'reselect';

const getCustomers = (state) => Object.values(state.customers);
const getOrders = (state) => Object.values(state.orders);

// Computed Stats
export const total_customers = createSelector([getCustomers], (customers) => {
    return Object.keys(customers).filter(id => id !== 'editing_customer').length;
});

export const total_orders = createSelector([getOrders], (orders) => {
    return Object.keys(orders).length;
});