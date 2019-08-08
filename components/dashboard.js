import Grid from '@material-ui/core/Grid';
import React from 'react';
import { connect } from 'react-redux';
import { uid } from 'react-uid';
import { currencyString } from '../utils/currency-utils';
import { avgValueFreq, avgValueItems, avgValueOrders, avgValueSpends, maxValueFreq, maxValueItems, maxValueOrders, maxValueSpends, minValueFreq, minValueItems, minValueOrders, minValueSpends, returnCustomers, total_revenue } from '../utils/selectors';
import DataContainer from './data-container';
import SectionTitle from './section-title';

const Dashboard = ({ title, stats, rows = 2 }) => {
    const stacks = stats &&
        stats.map((dp, j) => (
            <Grid item xs={6} md={3} key={uid(dp, j)}>
                <DataContainer
                    primary={dp.primary}
                    caption={dp.caption}
                    positive={dp.positive}
                    negative={dp.negative}
                />
            </Grid>
        ));

    return (
        <React.Fragment>
            <SectionTitle>{title}</SectionTitle>
            <Grid container direction="row" alignItems="center" justify="space-evenly" spacing={2}>
                {stacks}
            </Grid>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    const currency = state.currency;
    return {
        stats: [
            {
                primary: Object.values(state.customers).length.toString(),
                caption: "Customers"
            },
            {
                primary: Object.values(state.orders).reduce((prev, curr) => prev + (new Date(curr.created_at).getFullYear() === new Date().getFullYear() ? 1 : 0), 0).toString(),
                caption: "Orders This Year"
            },
            {
                primary: currencyString(currency, parseFloat(total_revenue(state).toFixed(2))),
                caption: "Revenue This Year"
            },
            {
                primary: parseFloat(returnCustomers(state).toFixed(2)).toString(),
                caption: "Returning Customers"
            },
            {
                primary: currencyString(currency, parseFloat(avgValueSpends(state).toFixed(2))),
                caption: "Avg Customer Value",
                positive: {
                    key: "HIGH",
                    value: parseFloat(maxValueSpends(state).toFixed(2))
                },
                negative: {
                    key: "LOW",
                    value: parseFloat(minValueSpends(state).toFixed(2))
                }
            },
            {
                primary: currencyString(currency, parseFloat(avgValueOrders(state).toFixed(2))),
                caption: "Avg Order Value",
                positive: {
                    key: "HIGH",
                    value: parseFloat(maxValueOrders(state).toFixed(2))
                },
                negative: {
                    key: "LOW",
                    value: parseFloat(minValueOrders(state).toFixed(2))
                }
            },
            {
                primary: parseFloat(avgValueItems(state).toFixed(1)),
                caption: "Avg Items per Order",
                positive: {
                    key: "HIGH",
                    value: parseFloat(maxValueItems(state).toFixed(1))
                },
                negative: {
                    key: "LOW",
                    value: parseFloat(minValueItems(state).toFixed(1))
                }
            },
            {
                primary: parseFloat(avgValueFreq(state).toFixed(1)),
                caption: "Avg Orders per Year",
                positive: {
                    key: "HIGH",
                    value: parseFloat(maxValueFreq(state).toFixed(1))
                },
                negative: {
                    key: "LOW",
                    value: parseFloat(minValueFreq(state).toFixed(1))
                }
            }
        ]
    }
}

export default connect(mapStateToProps)(Dashboard);