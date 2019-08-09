import { updatedDiff } from 'deep-object-diff';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import makeRootReducer from './reducers/index';

export default (initialState = {}) => {
    // ======================================================
    // Middleware Configuration
    // ======================================================
    let middleware = [thunk]

    // ======================================================
    // Store Enhancers
    // ======================================================
    const enhancers = []

    let composeEnhancers = compose

    if (ENV_DEV && !!process.browser) {
        // Execute this only in dev mode, on the client
        const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        if (typeof composeWithDevToolsExtension === 'function') {
            composeEnhancers = composeWithDevToolsExtension
        }
    }

    // ======================================================
    // Store Instantiation and HMR Setup
    // ======================================================
    const store = createStore(
        makeRootReducer(),
        initialState,
        composeEnhancers(
            applyMiddleware(...middleware),
            ...enhancers
        )
    )
    store.asyncReducers = {}

    if (module.hot) {
        module.hot.accept('./reducers/index', () => {
            const reducers = require('./reducers/index').default
            store.replaceReducer(reducers(store.asyncReducers))
        })
    }

    return store
}

// // ACTIONS
// export const setupShopifyData = (data) => {
//     return {
//         type: actionTypes.SETUP,
//         ...data
//     }
// }

// export const setupProductImages = (products) => {
//     return {
//         type: actionTypes.SETUP_PRODUCTS,
//         products
//     }
// }

// export const startEditCustomer = customerID => {
//     return {
//         type: actionTypes.START_EDIT_CUSTOMER,
//         id: customerID
//     }
// }

// export const updateCustomerDetails = customer => {
//     return {
//         type: actionTypes.UPDATE_EDIT_CUSTOMER,
//         customer
//     }
// }

// export const saveCustomerDetails = customer => {
//     return {
//         type: actionTypes.SAVE_CUSTOMER,
//         customer
//     }
// }


// export function initializeShopifyData(origin, accessToken) {
//     return dispatch => {
//         return fetchShopifyAPI('orders', origin, accessToken, { status: 'any' })
//             .then(parseShopifyOrders)
//             .then(preloadedState => dispatch(setupShopifyData(preloadedState)));
//     }
// }

// export function initializeProductImages(origin, accessToken) {
//     return dispatch => {
//         return fetchShopifyAPI('products', origin, accessToken)
//             .then(parseShopifyProducts)
//             .then(products => dispatch(setupProductImages(products)));
//     }
// }

// export function updateCustomer(prop, value) {
//     return (dispatch, getState) => {
//         const active = getState().editing_customer;
//         const editable = !!active ? { ...active } : false;
//         if (!!editable) {
//             if (prop) editable[prop] = value;
//             dispatch(updateCustomerDetails(editable));
//         }
//     }
// }

// export function saveCustomer() {
//     return (dispatch, getState) => {
//         const active = getState().editing_customer;
//         const editable = !!active ? { ...active } : false;
//         if (!!editable) {
//             return fetchInternalAPI(`customers/${active.id}`, {}, 'PUT', {
//                 customer: {
//                     id: editable.id,
//                     ...updatedDiff(getState().customers[editable.id], editable)
//                 }
//             }).then(newCust => {
//                 newCust = JSON.parse(newCust);
//                 if (!!newCust) {
//                     dispatch(showToaster('Saved!'));
//                     dispatch(saveCustomerDetails(newCust.customer));
//                 } else {
//                     dispatch(showToaster('Failed!', true));
//                 }
//             });
//         }
//     }
// }

// export function initializeStore(initialState = exampleInitialState) {
//     return createStore(
//         reducer,
//         initialState,
//         composeWithDevTools(applyMiddleware(thunk))
//     )
// }