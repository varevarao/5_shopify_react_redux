import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';
import { SBadge } from './shopify';

const CustomerProfileHeader = ({ customer }) => {
    const { default_address, phone, created_at, email } = customer;
    const addressLine = (!default_address) ? '' : `${default_address.city || ''}${default_address.city && default_address.country ? ', ' : ''}${default_address.country || ''}`;
    const activeSince = new Date(created_at);

    return (
        <Grid container alignItems='center' justify='flex-start' spacing={2}>
            {created_at && <Grid item><PaddedBadge>🗓️ {activeSince.toLocaleString('default', { month: 'long' })} {activeSince.getFullYear()}</PaddedBadge></Grid>}
            {addressLine && <Grid item><PaddedBadge>🏠 {addressLine}</PaddedBadge></Grid>}
            {phone && <Grid item><PaddedBadge>📞 {phone}</PaddedBadge></Grid>}
            {email && <Grid item><PaddedBadge>📧 {email}</PaddedBadge></Grid>}
        </Grid>
    );
};

const PaddedBadge = styled(SBadge)`
    padding: 0.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
`;

export default CustomerProfileHeader;