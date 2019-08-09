import { reducer as toastrReducer } from 'react-redux-toastr';
import { combineReducers } from 'redux';
import shopReducer from './shop';
import customersReducer from './customers';
import errorReducer from './errors';
import ordersReducer from './orders';
import productsReducers from './products';
import uiReducer from './ui';

export const makeRootReducer = asyncReducers => {
	const defaults = {
		...asyncReducers,
		shop: shopReducer,
		customers: customersReducer,
		orders: ordersReducer,
		products: productsReducers,
		ui: uiReducer,
		toastr: toastrReducer
	};

	if (ENV_DEV) {
		defaults.errors = errorReducer;
	}

	return combineReducers(defaults);
}

export const injectReducer = (store, { key, reducer }) => {
	if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

	store.asyncReducers[key] = reducer;
	store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
