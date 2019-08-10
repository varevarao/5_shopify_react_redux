import { API_TYPES, fetchInternalAPI } from '../../helpers/internal-fetch';
import { customers as actionTypes } from './actionTypes';
import { logError, ERROR_TYPES } from './errors';

/*************** Synchronous actions *****************/
export const customerListFetched = customers => ({
    type: actionTypes.FETCHED_ALL,
    payload: customers
});

export const customerFetched = customer => ({
    type: actionTypes.FETCHED,
    payload: customer
});

export const updateCustomer = customer => ({
    type: actionTypes.UPDATE,
    payload: customer
});

export const saveEdits = () => ({
    type: actionTypes.SAVE
})

/************ Thunk actions **************/
export const setupInitialState = () => dispatch => {
    // Fetch the customer list
    return fetchInternalAPI(API_TYPES.customers(), {})
        .then(({ data, err }) => {
            if (!!data) {
                const { customers } = JSON.parse(data);
                const formatted = customers.reduce((custs, curr) => {
                    custs[curr.id] = { ...curr };
                    return custs;
                }, {});
                
                // Store it in the form of a map keyed by the customer ID's
                dispatch(customerListFetched(formatted));
            } else if (!!err) {
                dispatch(logError(ERROR_TYPES.http, err));
            }
        })
}