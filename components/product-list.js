import { Stack } from '@shopify/polaris';
import React from 'react';
import { connect } from 'react-redux';
import { uid } from 'react-uid';
import { TIMESCALE, toTimescale } from '../utils/date-utils';
import ProductDetails from './product-details';
import SectionTitle from './section-title';

const ProductList = ({ title, limit, productData }) => {
    return (
        <React.Fragment>
            <SectionTitle>{title}</SectionTitle>
            <Stack vertical alignment="fill" distribution="fill" spacing="tight">
                {
                    productData.map((cd, i) => {
                        return (i >= limit) ? null :
                            (
                                <ProductDetails key={uid(cd, i)} icon={cd.image} title={cd.name} stats={cd.stats} />
                            );
                    })
                }
            </Stack>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        productData: Object.values(state.products)
            .sort((a, b) => b.orders_count - a.orders_count)
            .map(product => {
                let netWeeks = toTimescale(new Date().getTime() - product.first_order_ts, TIMESCALE.WEEK);
                if (netWeeks < 1) netWeeks = 1;
                
                return {
                    name: `${product.title}${product.variant_title ? ', ' + product.variant_title : ''}`,
                    image: (product.image ? product.image.src : ''),
                    stats: {
                        "Orders Per Week": parseFloat((product.orders_count / netWeeks).toFixed(1)),
                        "Total Orders": product.orders_count
                    }
                };
            })
    };
};

export default connect(mapStateToProps)(ProductList);