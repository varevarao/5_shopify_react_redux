import { API_TYPES, fetchShopifyAPI } from '../../helpers/shopify-fetch';
import { shop as actionTypes } from './actionTypes';
import { ERROR_TYPES, logError } from './errors';

export const metaFetched = meta => ({
    type: actionTypes.FETCHED,
    payload: { ...meta }
});

export const fetchAppMeta = ctx => (
    async dispatch => {
        const { shopConfig, err } = await fetchShopifyAPI(API_TYPES.shop(), { ctx });
        if (shopConfig) {
            dispatch(metaFetched(JSON.parse(shopConfig)));
        } else if (err) {
            dispatch(logError(ERROR_TYPES.http, err));
        }
    }
)