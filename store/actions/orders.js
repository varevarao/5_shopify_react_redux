import { API_TYPES, fetchInternalAPI } from '../../helpers/internal-fetch';
import { orders as actionTypes } from './actionTypes';
import { logError, ERROR_TYPES } from './errors';

export const orderListFetched = orders => ({
    type: actionTypes.FETCHED,
    payload: orders
})

export const setupInitialState = () => dispatch => {
    // Fetch the orders list
    return fetchInternalAPI(API_TYPES.orders(), {})
        .then(({ data, err }) => {
            if (!!data) {
                const { orders } = JSON.parse(data);
                // Store it in the form of a map keyed by the customer ID's
                dispatch(orderListFetched(orders.reduce((ords, curr) => ords[curr.id] = curr, {})));
            } else if (!!err) {
                dispatch(logError(ERROR_TYPES.http, err));
            }
        })
}