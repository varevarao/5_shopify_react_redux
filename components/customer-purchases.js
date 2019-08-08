import { Stack } from '@shopify/polaris';
import React from 'react';
import { uid } from 'react-uid';
import PurchaseLine from './purchase-line';
import SectionTitle from './section-title';

const CustomerPurchases = ({ title, orders, limit }) => {
    return (
        <React.Fragment>
            {title && <SectionTitle>{title}</SectionTitle>}
            <Stack vertical alignment="fill" distribution="fill" spacing="tight">
                {orders &&
                    orders.map((p, i) => {
                        return (limit > 0 && i >= limit) ? null :
                            (
                                <PurchaseLine key={uid(p, i)} data={p} />
                            );
                    })
                }
            </Stack>
        </React.Fragment>
    );
};

export default CustomerPurchases;