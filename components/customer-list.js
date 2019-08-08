import { Stack } from '@shopify/polaris';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import { uid } from 'react-uid';
import { currencyString } from '../utils/currency-utils';
import CustomerLine, { CustomerHeader } from './customer-line';
import SectionTitle from './section-title';

const CustomerList = ({ title, limit, customerData }) => {
    return (
        <React.Fragment>
            <SectionTitle>{title}</SectionTitle>
            <Stack vertical alignment="fill" distribution="fill" spacing="tight">
                <CustomerHeader />
                {
                    customerData.map((cd, i) => {
                        return (!isNaN(limit) && limit > 0 && i >= limit) ? null :
                            (
                                <CustomerLine key={uid(cd, i)} data={cd} />
                            );
                    })
                }
                {limit &&
                    <Link href="/all-customers"><a style={{ color: 'black' }}>&gt; view all customers</a></Link>
                }
            </Stack>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    const currency = state.currency;
    return {
        customerData: Object.values(state.customers).sort((a, b) => parseFloat(b.total_spent) - parseFloat(a.total_spent)).map(customer => {
            return {
                id: customer.id,
                name: `${customer.first_name} ${customer.last_name}`,
                image: "",
                lastOrder: new Date(state.orders[customer.last_order_id].created_at).getTime(),
                clv: `${currencyString(currency, parseFloat(customer.total_spent))} (${currencyString(currency, parseFloat((parseFloat(customer.total_spent) / customer.orders_count).toFixed(1)))})`
            };
        })
    };
};

export default connect(mapStateToProps)(CustomerList);