import merge from 'lodash.merge';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { fetchShopifyAPI, parseShopifyOrders, parseShopifyProducts, fetchInternalAPI } from './shopify-data';
import { updatedDiff } from 'deep-object-diff';

const exampleInitialState = {
    customers: {},
    orders: {},
    products: {},
    currency: "",
    _initialized: false,
    loader_visible: true,
    editing_customer: null,
    toaster: null
};

export const actionTypes = {
    START_SETUP: 'INITIALIZE',
    SETUP: 'SHOPIFY_SETUP',
    SAVE_CUSTOMER: 'SAVE_CUSTOMER',
    UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
    UPDATE_EDIT_CUSTOMER: 'UPDATE_EDIT:CUSTOMER',
    START_EDIT_CUSTOMER: 'START_EDIT:CUSTOMER',
    SETUP_PRODUCTS: 'SHOPIFY_PRODUCTS',
    END_SETUP: 'INITIALIZE_COMPLETE',
    SHOW_LOADER: 'SHOW_LOADER',
    HIDE_LOADER: 'HIDE_LOADER',
    SHOW_TOASTER: 'SHOW_TOASTER',
    HIDE_TOASTER: 'HIDE_TOASTER',
}

// REDUCERS
export const reducer = (state = {}, action) => {
    let editing = {};
    let customers = {};
    switch (action.type) {
        case actionTypes.SETUP:
            return {
                ...state,
                customers: action.customers,
                orders: action.orders,
                stats: action.stats,
                products: action.products,
                currency: action.currency || ''
            };
        case actionTypes.SETUP_PRODUCTS:
            const products = merge({}, state.products, action.products);

            return { ...state, products };
        case actionTypes.START_SETUP:
            return { ...state, _initialized: false };
        case actionTypes.END_SETUP:
            return { ...state, _initialized: true };
        case actionTypes.SHOW_LOADER:
            return { ...state, loader_visible: true };
        case actionTypes.HIDE_LOADER:
            return { ...state, loader_visible: false };
        case actionTypes.SHOW_TOASTER:
            return { ...state, toaster: { ...action.toaster } };
        case actionTypes.HIDE_TOASTER:
            return { ...state, toaster: null };
        case actionTypes.START_EDIT_CUSTOMER:
            editing = { ...state.customers[action.id] };

            return { ...state, editing_customer: editing };
        case actionTypes.UPDATE_EDIT_CUSTOMER:
            let editing = { ...action.customer };
            return { ...state, editing_customer: editing };
        case actionTypes.SAVE_CUSTOMER:
            customers = { ...state.customers };
            customers[action.customer.id] = { ...action.customer };

            // In case of a save, stop editing
            return { ...state, customers, editing_customer: null };
        default:
            return state
    }
}

// ACTIONS
export const setupShopifyData = (data) => {
    return {
        type: actionTypes.SETUP,
        ...data
    }
}

export const setupProductImages = (products) => {
    return {
        type: actionTypes.SETUP_PRODUCTS,
        products
    }
}

export const startEditCustomer = customerID => {
    return {
        type: actionTypes.START_EDIT_CUSTOMER,
        id: customerID
    }
}

export const updateCustomerDetails = customer => {
    return {
        type: actionTypes.UPDATE_EDIT_CUSTOMER,
        customer
    }
}

export const saveCustomerDetails = customer => {
    return {
        type: actionTypes.SAVE_CUSTOMER,
        customer
    }
}

export const startInit = () => ({ type: actionTypes.START_SETUP });
export const finishInit = () => ({ type: actionTypes.END_SETUP });

export const showLoader = () => ({ type: actionTypes.SHOW_LOADER });
export const hideLoader = () => ({ type: actionTypes.HIDE_LOADER });

export const showToaster = (message, error = false) => ({ type: actionTypes.SHOW_TOASTER, toaster: { error, message } });
export const hideToaster = () => ({ type: actionTypes.HIDE_TOASTER });

export function initializeShopifyData(origin, accessToken) {
    return dispatch => {
        return fetchShopifyAPI('orders', origin, accessToken, { status: 'any' })
            .then(parseShopifyOrders)
            .then(preloadedState => dispatch(setupShopifyData(preloadedState)));
    }
}

export function initializeProductImages(origin, accessToken) {
    return dispatch => {
        return fetchShopifyAPI('products', origin, accessToken)
            .then(parseShopifyProducts)
            .then(products => dispatch(setupProductImages(products)));
    }
}

export function updateCustomer(prop, value) {
    return (dispatch, getState) => {
        const active = getState().editing_customer;
        const editable = !!active ? { ...active } : false;
        if (!!editable) {
            if (prop) editable[prop] = value;
            dispatch(updateCustomerDetails(editable));
        }
    }
}

export function saveCustomer() {
    return (dispatch, getState) => {
        const active = getState().editing_customer;
        const editable = !!active ? { ...active } : false;
        if (!!editable) {
            return fetchInternalAPI(`customers/${active.id}`, {}, 'PUT', {
                customer: {
                    id: editable.id,
                    ...updatedDiff(getState().customers[editable.id], editable)
                }
            }).then(newCust => {
                newCust = JSON.parse(newCust);
                if (!!newCust) {
                    dispatch(showToaster('Saved!'));
                    dispatch(saveCustomerDetails(newCust.customer));
                } else {
                    dispatch(showToaster('Failed!', true));
                }
            });
        }
    }
}

export function initializeStore(initialState = exampleInitialState) {
    return createStore(
        reducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunk))
    )
}