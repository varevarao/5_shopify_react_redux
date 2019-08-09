import { ui as actionTypes } from '../actions/actionTypes';

const initialState = {
    loader_visible: true,
    toaster: null
};

const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_LOADER:
            return {
                ...state,
                loader_visible: true
            }
        case actionTypes.HIDE_LOADER:
            return {
                ...state,
                loader_visible: false
            }
        case actionTypes.SHOW_TOASTER:
            return {
                ...state,
                toaster: { ...action.payload }
            }
        case actionTypes.HIDE_TOASTER:
            return {
                ...state,
                toaster: null
            }
    }

    return state;
}

export default uiReducer;