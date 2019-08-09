import { products as actionTypes } from './actionTypes'

export const productsFetched = proucts => ({
    type: actionTypes.FETCHED,
    payload: proucts
})