import Grid from "@material-ui/core/Grid";
import { TitleBar } from "@shopify/app-bridge-react";
import { AppProvider } from "@shopify/polaris";
import { useRouter } from 'next/router';
import { connect } from "react-redux";
import CustomerList from "../components/customer-list";
import ContainedPage from "../components/shopify/contained-page";

const AllCustomers = ({ }) => {
    const router = useRouter();
    return (
        <AppProvider>
            <ContainedPage
                separator fullWidth
                breadcrumbs={[{ content: 'Back', onAction: () => router.back() }]} >
                <TitleBar title="All Customers" />
                <Grid container alignItems='flex-start' justify='center' spacing={2}>
                    <Grid item xs={12}>
                        <CustomerList />
                    </Grid>
                </Grid>
            </ContainedPage>
        </AppProvider>
    )
}

export default connect()(AllCustomers);