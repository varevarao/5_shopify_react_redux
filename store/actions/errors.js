import getConfig from 'next/config';
import { errors as actionTypes } from './actionTypes';

const { publicRuntimeConfig: { ENV_DEV } } = getConfig();

export const ERROR_TYPES = {
    http: 'http'
}

/*************** Synchronous actions *****************/
export const logError = (type, err) => ENV_DEV ? ({
    type: actionTypes.THROW,
    payload: { type, error: err }
}) : ({});

/************ Thunk actions **************/