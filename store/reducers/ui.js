import { ui as actionTypes } from '../actions/actionTypes';

const initialState = {
    loader_visible: true,
    toaster: null,
    initialized: false
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
        case actionTypes.INIT_START:
            return {
                ...state,
                initialized: 'started'
            }
        case actionTypes.INIT_COMPLETE:
            return {
                ...state,
                initialized: true
            }
    }

    return state;
}

export default uiReducer;