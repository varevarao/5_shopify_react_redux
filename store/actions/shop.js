import { API_TYPES, fetchInternalAPI } from '../../helpers/internal-fetch';
import { shop as actionTypes } from './actionTypes';
import { ERROR_TYPES, logError } from './errors';

export const metaFetched = meta => ({
    type: actionTypes.FETCHED,
    payload: { ...meta }
});

export const fetchAppMeta = () => (
    async dispatch => {
        const { shopConfig, err } = await fetchInternalAPI(API_TYPES.shop(), {});
        if (shopConfig) {
            dispatch(metaFetched(JSON.parse(shopConfig)));
        } else if (err) {
            dispatch(logError(ERROR_TYPES.http, err));
        }
    }
)