import { Grid } from '@material-ui/core';
import { TitleBar } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CustomerProfileHeader from '../components/customer-profile-header';
import CustomerProfileStats from '../components/customer-profile-stats';
import CustomerPurchases from '../components/customer-purchases';
import ImageGrid from '../components/image-grid';
import ContainedPage from '../components/shopify/contained-page';

const CustomerProfile = ({ customers, orders, products, showToaster }) => {
    const router = useRouter();
    const { id } = router.query;

    // Find the customer
    const customer = customers[id];
    if (!customer) {
        // Do something to handle a missing cutomer (Add an error page)
        return null;
    }

    // Reduce the orders
    const latestOrders = Object.values(orders)
        // Filter by customer
        .filter(order => order.customer.id === customer.id)
        // Sort by latest orders first
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Each order can have multiple line items
    const purchases = latestOrders.reduce((prev, curr) => prev.concat(curr.line_items.map(l => products[l.product_id] || null)), []).filter(p => p !== undefined && !!p);
    // Build the closet
    const closet = purchases.filter(p => !!p.image).map(p => (
        {
            src: p.image.src || '',
            alt: p.title
        }
    ));

    return (!!customer &&
        <AppProvider>
            <ContainedPage
                title={`${customer.first_name} ${customer.last_name}`}
                separator fullWidth
                breadcrumbs={[{ content: 'Back', onAction: () => router.back() }]}>
                <TitleBar title={`${customer.first_name} ${customer.last_name}'s Profile`}
                    primaryAction={{
                        content: 'Edit',
                        onAction: () => { router.push({ pathname: '/edit-customer', query: { id } }) }
                    }} />
                <SectionedGrid container alignItems="flex-start" justify="center" spacing={2}>
                    <Grid item xs={12}>
                        <CustomerProfileHeader customer={customer} />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomerProfileStats customer={customer} purchases={purchases} />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomerPurchases title="Last Purchases" orders={latestOrders} limit={4} />
                    </Grid>
                    <Grid item xs={6}>
                        <ImageGrid title={`${customer.first_name}'s Closet`} images={closet} limit={9} />
                    </Grid>
                </SectionedGrid>
            </ContainedPage>
        </AppProvider>
    );
}

const SectionedGrid = styled(Grid)`
    margin-top: 2rem;
`;

const mapStateToProps = state => {
    return {
        customers: state.customers,
        products: state.products,
        orders: state.orders,
    }
}

export default connect(mapStateToProps)(CustomerProfile);