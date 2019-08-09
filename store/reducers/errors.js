import { errors as actionTypes } from '../actions/actionTypes';

const initialState = {
    messages: [],
    error_types: {}
};

const errorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.THROW:
            const { type, error } = action.payload;
            const messages = [...state.messages];
            const errorsOfType = [ ...(state.error_types[type] || []) ];

            const errString = error.toString();
            messages.push(errString);
            errorsOfType.push(errString);
            
            return {
                ...state,
                messages,
                error_types: { ...state.error_types, [type]: errorsOfType }
            }
    }

    return state;
}

export default errorsReducer;