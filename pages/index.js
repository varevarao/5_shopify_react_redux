import Grid from '@material-ui/core/Grid';
import { TitleBar } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import { connect } from 'react-redux';
import CustomerList from '../components/customer-list';
import Dashboard from '../components/dashboard';
import ProductList from '../components/product-list';
import ContainedPage from '../components/shopify/contained-page';
import { currencyString } from '../utils/currency-utils';
import { avgValueFreq, avgValueItems, avgValueOrders, avgValueSpends, maxValueFreq, maxValueItems, maxValueOrders, maxValueSpends, minValueFreq, minValueItems, minValueOrders, minValueSpends, returnCustomers, total_revenue } from '../utils/selectors';

const Index = ({ dashboardStats }) => {
    return (
        <AppProvider>
            <ContainedPage title="Overview" separator fullWidth>
                <TitleBar breadcrumbs={[]} />
                <Grid container alignItems="flex-start" justify="center" spacing={2}>
                    <Grid item xs={12}>
                        <Dashboard title="Dashboard" stats={dashboardStats} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CustomerList title="Best Customers" limit={4} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ProductList title="Best Selling Products" limit={4} />
                    </Grid>
                </Grid>
            </ContainedPage>
        </AppProvider>
    );
}

const mapStateToProps = (state) => {
    const currency = state.currency;
    return {
        dashboardStats: [
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

export default connect(mapStateToProps)(Index);