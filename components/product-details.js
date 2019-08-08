import Grid from '@material-ui/core/Grid';
import { Thumbnail } from '@shopify/polaris';
import React from 'react';
import { uid } from 'react-uid';
import styled from 'styled-components';
import * as Shopify from './shopify';

const ProductDetails = ({ icon, title, stats }) => {
    return (
        <Shopify.BaseCard>
            <Grid container alignItems="center" justify="flex-start">
                <Grid item xs={3}>
                    <Thumbnail source={icon} alt={icon} />
                </Grid>
                <Grid item container xs={9}>
                    <Grid item xs={12}>
                        <Shopify.STextStyle variation="strong">{title}</Shopify.STextStyle>
                    </Grid>
                    <Grid item container direction="row" xs={12} justify="flex-start">
                        {stats &&
                            Object.entries(stats).map((e, i) => (
                                <Grid
                                    key={uid(e, i)} xs={12 / Object.keys(stats).length}
                                    item container direction="row" alignItems="baseline"
                                    justify="flex-start" spacing={1}
                                >
                                    <Grid item><StatValue size="small">{e[1]}</StatValue></Grid>
                                    <Grid item><StatCaption variation="subdued">{e[0]}</StatCaption></Grid>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Shopify.BaseCard>
    );
}

const StatValue = styled(Shopify.SDisplayText)`

`;

const StatCaption = styled(Shopify.STextStyle)`

`;

export default ProductDetails;