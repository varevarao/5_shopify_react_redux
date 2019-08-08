import { Card, Stack, TextStyle } from '@shopify/polaris';
import React from 'react';
import styled from 'styled-components';
import { stringTimeSinceTS, TIMESCALE } from '../utils/date-utils';

const getDisplayTime = (purchaseTS) => {
    // Get the regular string representation,
    let stringRep = stringTimeSinceTS(purchaseTS, Date.now(), TIMESCALE.MONTH);

    // In case the time remaining is a month or more, we'll default to the date representation
    if (stringRep.endsWith(TIMESCALE.MONTH) || stringRep.endsWith(TIMESCALE.MONTH + TIMESCALE.PLURAL_SUFFIX)) {
        return new Date(purchaseTS).toDateString();
    }
    // Else 
    return `${stringRep} ago`;
};

export const PurchaseLine = ({ data }) => {
    const items = data.line_items.length;
    return (
        <Card sectioned>
            <Stack alignment="center" distribution="fillEvenly" spacing="loose">
                <TextStyle variation="strong">{data.total_price}</TextStyle>
                <TextStyle variation="subdued">{items + ' item' + (items > 1 ? 's' : '')}</TextStyle>
                <TextStyle variation="subdued">{getDisplayTime(new Date(data.created_at).getTime())}</TextStyle>
            </Stack>
        </Card>
    );
};

const BG = styled.div`
    background-color: rgb(246, 246, 246);
    border-radius: 0.5rem;
    padding: 1rem;
`;

export default PurchaseLine;