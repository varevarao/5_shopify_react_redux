import Grid from '@material-ui/core/Grid';
import { TitleBar } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import { connect } from 'react-redux';
import ContainedPage from '../components/shopify/contained-page';
import { total_customers, total_orders } from '../store/selectors';

const Index = ({ customerCount, orderCount, errors }) => {
    return (
        <AppProvider>
            <ContainedPage title="Overview" separator fullWidth>
                <TitleBar breadcrumbs={[]} />
                <Grid container alignItems="flex-start" justify="center" spacing={2}>
                    <Grid item xs={12}>
                        <span>Customers length: {customerCount}</span>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <span>Orders length: {orderCount}</span>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <span>Errors length: {errors}</span>
                    </Grid>
                </Grid>
            </ContainedPage>
        </AppProvider>
    );
}

const mapStateToProps = (state) => {
    return {
        customerCount: total_customers(state),
        orderCount: total_orders(state),
        errors: process.env.NODE_ENV === 'development' ? state.errors.messages.length : 'unknown'
    }
}

export default connect(mapStateToProps)(Index);