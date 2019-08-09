import { shop as actionTypes } from '../actions/actionTypes';

const initialState = {
    address1: '',
    city: '',
    country: '',
    customer_email: '',
    currency: '',
    domain: '',
    email: '',
    id: null,
    money_format: '',
    phone: '',
    shop_owner: '',
    zip: '',
    created_at: null
};

const shopReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCHED:
            const { created_at: shopCreated, ...others } = action.payload;
            return {
                ...state,
                ...others,
                created_at: new Date(shopCreated)
            }
    }

    return state;
}

export default shopReducer;