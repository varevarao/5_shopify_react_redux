import Grid from '@material-ui/core/Grid';
import React from 'react';
import { connect } from 'react-redux';
import { uid } from 'react-uid';
import { currencyString } from '../utils/currency-utils';
import { TIMESCALE, toTimescale } from '../utils/date-utils';
import DataContainer from './data-container';

const CustomerProfileStats = ({ customer, purchases, currency }) => {
    const timeActive = toTimescale(Date.now() - new Date(customer.created_at).getTime(), TIMESCALE.YEAR);
    const stats = [
        {
            primary: currencyString(currency, customer.total_spent),
            caption: "Lifetime Value"
        },
        {
            primary: currencyString(currency, parseFloat((parseFloat(customer.total_spent) / customer.orders_count).toFixed(2))),
            caption: "Avg Order Value"
        },
        {
            primary: parseFloat((purchases.length / customer.orders_count).toFixed(2)).toString(),
            caption: "Avg Items per Order"
        },
        {
            primary: parseFloat((customer.orders_count / (timeActive < 1 ? 1 : timeActive)).toFixed(1)).toString(),
            caption: "Avg Orders per Year"
        }
    ];

    return (
        <Grid container direction='row' alignItems='center' justify='space-evenly' spacing={2}>
            {stats.map((stat, i) => (
                <Grid item key={uid(stat, i)} xs={6} md={3}>
                    <DataContainer {...stat} />
                </Grid>
            ))}
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        curency: state.currency
    }
}

export default connect(mapStateToProps)(CustomerProfileStats);