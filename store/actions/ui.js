import { ui as actionTypes } from './actionTypes';

export const showLoader = () => ({
    type: actionTypes.SHOW_LOADER
});

export const hideLoader = () => ({
    type: actionTypes.HIDE_LOADER
});

export const showToaster = (message, error = false) => ({
    type: actionTypes.SHOW_TOASTER,
    payload: { error, message }
});

export const hideToaster = () => ({
    type: actionTypes.HIDE_TOASTER
});