import Grid from '@material-ui/core/Grid';
import { TitleBar } from '@shopify/app-bridge-react';
import { AppProvider, Card, Form, FormLayout, Icon, Layout, TextField } from '@shopify/polaris';
import { CustomersMajorTwotone, EmailMajorMonotone, HomeMajorMonotone, NoteMajorMonotone, PhoneMajorMonotone } from '@shopify/polaris-icons';
import { useRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { ContainedPage } from '../components/shopify';
import { saveCustomer, startEditCustomer, updateCustomer } from '../store';

const LabelledField = ({ icon, children }) => {
    return (
        <Grid container alignItems='center' justify='flex-start' spacing={2}>
            <Grid item xs={1}><Icon source={icon} color="black" /></Grid>
            <Grid item xs={11}>{children}</Grid>
        </Grid>
    );
};

const EditCustomer = ({ saveCustomer, updateCustomer, editing, customer }) => {
    const router = useRouter();

    const { first_name, last_name, phone, email, note } = editing;

    return (
        <AppProvider>
            <ContainedPage>
                {/* Use the customer state to display these items, else they update on updating details */}
                <TitleBar title={`Edit ${customer.first_name}'s Profile`}
                    breadcrumbs={[{ content: `${customer.first_name} ${customer.last_name}`, onAction: () => router.replace({ pathname: '/customer-profile', query: { id: editing.id } }) }]}
                    primaryAction={{
                        content: 'Save',
                        onAction: () => { saveCustomer(); router.replace({ pathname: '/customer-profile', query: { id: customer.id } }) }
                    }} />
                <Form onSubmit={saveCustomer}>
                    <Layout>
                        <Layout.AnnotatedSection
                            title={`${first_name} ${last_name}`}
                            description={`Update details for your customers. Click Save to persist changes.`}
                        >
                            <Card sectioned>
                                <FormLayout>
                                    <LabelledField icon={CustomersMajorTwotone}>
                                        <TextField
                                            labelHidden
                                            label="First Name"
                                            placeholder="First Name"
                                            id="first_name"
                                            value={first_name}
                                            onChange={updateCustomer}
                                        />
                                    </LabelledField>

                                    <LabelledField icon={CustomersMajorTwotone}>
                                        <TextField
                                            labelHidden
                                            label="Last Name"
                                            placeholder="Last Name"
                                            id="last_name"
                                            readOnly={false}
                                            disabled={false}
                                            value={last_name}
                                            onChange={updateCustomer}
                                        />
                                    </LabelledField>

                                    <LabelledField icon={PhoneMajorMonotone}>
                                        <TextField
                                            labelHidden
                                            label="Contact"
                                            placeholder="Contact"
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={updateCustomer}
                                        />
                                    </LabelledField>

                                    <LabelledField icon={EmailMajorMonotone}>
                                        <TextField
                                            labelHidden
                                            label="Email"
                                            placeholder="Email"
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={updateCustomer}
                                        />
                                    </LabelledField>

                                    <LabelledField icon={NoteMajorMonotone}>
                                        <TextField
                                            labelHidden
                                            label="Notes"
                                            placeholder="Add notes..."
                                            multiline
                                            id="note"
                                            value={note}
                                            onChange={updateCustomer}
                                        />
                                    </LabelledField>
                                </FormLayout>
                            </Card>
                        </Layout.AnnotatedSection>
                    </Layout>
                </Form>
            </ContainedPage>
        </AppProvider >
    );
}

EditCustomer.getInitialProps = ({ query, store }) => {
    // On the client
    const { id } = query;
    if (id) {
        store.dispatch(startEditCustomer(id));
    }

    return {};
}

const mapDispatchToProps = dispatch => {
    return {
        updateCustomer: (value, prop) => dispatch(updateCustomer(prop, value)),
        saveCustomer: () => dispatch(saveCustomer())
    }
}

const mapStateToProps = state => {
    return {
        editing: state.editing_customer,
        customer: state.editing_customer ? (state.customers[state.editing_customer.id] || null) : null
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer);