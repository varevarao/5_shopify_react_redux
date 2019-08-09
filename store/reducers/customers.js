import { customers as actionTypes } from '../actions/actionTypes';

const initialState = {
    editing_customer: null
};

const customersReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCHED_ALL:
            return {
                ...state,
                ...action.payload
            }
        case actionTypes.FETCHED:
        case actionTypes.UPDATE:
            return {
                ...state,
                [action.payload.id]: { ...action.payload }
            }
        case actionTypes.START_EDITING:
        case actionTypes.UPDATE_EDITING:
            return {
                ...state,
                editing_customer: { ...action.payload }
            }
        case actionTypes.SAVE:
            return {
                ...state,
                editing_customer: null,
                [state.editing_customer.id]: { ...state.editing_customer }
            }
    }

    return state;
}

export default customersReducer;