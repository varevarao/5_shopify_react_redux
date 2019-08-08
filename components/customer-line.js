import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ActionList, Avatar, Icon, Popover, Stack, TextStyle } from '@shopify/polaris';
import { MobileVerticalDotsMajorMonotone } from '@shopify/polaris-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { stringTimeSinceTS } from '../utils/date-utils';
import * as Shopify from './shopify';

export const CustomerHeader = () => {
    return (
        <Grid container direction="row" alignItems="center" justify="space-between">
            <Grid item xs={false} md={6}><p hidden>Name</p></Grid>
            <Grid item xs={false} md={3}><TextStyle variation="subdued">Last Order</TextStyle></Grid>
            <Grid item xs={false} md={3}><TextStyle variation="subdued">CLV (AOV)</TextStyle></Grid>
        </Grid>
    );
}

export const CustomerLine = ({ data }) => {
    const router = useRouter();
    const [actionsVisible, setActionsVisible] = useState(false);

    return (
        <Shopify.BaseCard>
            <Grid container direction="row" alignItems="center" justify="space-between">
                <Grid item xs={12} md={6}>
                    <Stack alignment="center" distribution="leading">
                        <Avatar size="small" name={data.name} initials={data.name.split(' ').map(p => p[0]).join('')} />
                        <Link href={{ pathname: "/customer-profile", query: { id: data.id } }} >
                            <a style={{ color: 'black' }}>{data.name}</a>
                        </Link>
                    </Stack>
                </Grid>
                <Grid item xs={2}>
                    <TextStyle variation="positive">{stringTimeSinceTS(data.lastOrder)}</TextStyle>
                </Grid>
                <Grid item xs={3}>
                    <TextStyle>{data.clv}</TextStyle>
                </Grid>
                <Grid item xs={1}>
                    <Popover
                        fullWidth
                        active={actionsVisible}
                        activator={<Button onClick={() => setActionsVisible(!actionsVisible)}><Icon source={MobileVerticalDotsMajorMonotone} /></Button>}
                        onClose={() => setActionsVisible(!actionsVisible)}
                    >
                        <ActionList items={[
                            {
                                content: 'Edit',
                                onAction: () => router.push({ pathname: '/edit-customer', query: { id: data.id } })
                            }
                        ]} />
                    </Popover>
                </Grid>
            </Grid>
        </Shopify.BaseCard>
    );
};

export default CustomerLine;