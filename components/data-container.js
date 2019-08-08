import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import * as Shopify from './shopify';

/**
 * A 3 line data container:
 * - The first line contains the large text display (primary)
 * - The second is the caption for the data (caption)
 * - The third is any supplied react element
 * @param {*} param0 
 */
const DataContainer = ({ primary, caption, positive, negative }) => {
    const hasOneExtra = !!(positive || negative);
    const hasBothExtra = !!(positive && negative);
    return (
        <DataCard>
            <DataText size="medium">{primary}</DataText>
            <DataCaption size="medium">{caption}</DataCaption>
            {hasOneExtra &&
                <Extra>
                    <Grid container direction="row" alignItems="center" justify="center">
                        {positive &&
                            <React.Fragment>
                                {typeof positive === 'string' &&
                                    <Grid item>
                                        <ExtraText variation="positive">{positive}</ExtraText>
                                    </Grid>
                                }
                                {typeof positive === 'object' &&
                                    <React.Fragment>
                                        <Grid item xs={2}>
                                            <ExtraText variation="subdued">{positive.key}</ExtraText>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <ExtraText variation="positive">{positive.value}</ExtraText>
                                        </Grid>
                                    </React.Fragment>
                                }
                            </React.Fragment>
                        }
                        {hasBothExtra &&
                            <Grid item xs={1}>
                                |
                            </Grid>
                        }
                        {negative &&
                            <React.Fragment>
                                {typeof negative === 'string' &&
                                    <Grid item>
                                        <ExtraText variation="negative">{negative}</ExtraText>
                                    </Grid>
                                }
                                {typeof negative === 'object' &&
                                    <React.Fragment>
                                        <Grid item xs={2}>
                                            <ExtraText variation="subdued">{negative.key}</ExtraText>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <ExtraText variation="negative">{negative.value}</ExtraText>
                                        </Grid>
                                    </React.Fragment>
                                }
                            </React.Fragment>
                        }
                    </Grid>
                </Extra>
            }
        </DataCard>
    );
};

const DataCard = styled(Shopify.SCard)`
    padding: 1.5rem;
`;

const Data = styled(Shopify.SDisplayText)`
    text-align: center;
`;

const DataText = styled(Data)`
    /* font-size: 2rem; */
`;

const DataCaption = styled(Data)`
    font-size: 1.6rem;
    font-weight: 300;
    padding-top: 1rem;
`;

const Extra = styled.div`
    padding-top: 0.5rem;
    text-align: center;
`;

const ExtraText = styled(Shopify.STextStyle)`
    font-size: 1.2rem;
`;

DataContainer.propTypes = {
    primary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    caption: PropTypes.string.isRequired,
    positive: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    negative: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default DataContainer;