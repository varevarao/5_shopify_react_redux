import { enabled_apis } from '../../config';
import * as customers from './customers';
import * as orders from './orders';
import * as products from './products';
import { fetchAppMeta } from './shop';

/**
 * Map of API's which support the initial state method
 */
const API_MAP = {
    orders,
    customers,
    products
}

/**
 * The method name invoked for setting up state
 */
const INIT_METHOD = 'setupInitialState';

/**
 * Wrapper method to invoke all the initial setup methods
 * @param ctx Application context (from Next.js)
 */
export default async function setupServerStores(ctx) {
    const { dispatch } = ctx.store;

    // 1. Always fetch the shop metadata
    await dispatch(fetchAppMeta(ctx));

    // 2. Call the fetchInitData on each enabled api
    const enabledKeys = Object.keys(enabled_apis);
    for (let key of enabledKeys) {
        if (API_MAP[key]) {
            // If there exists a setupInitialState action, call it
            if (INIT_METHOD in API_MAP[key]) await dispatch(API_MAP[key][INIT_METHOD].call(this, ctx));
        } else {
            throw new Error(`Unsupported API ${key} configured for app. In case of new API, please check if the mapping is configured under store/actions/index.js. Supported types: ${JSON.stringify(enabledKeys)}`);
        }
    }
}