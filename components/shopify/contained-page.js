import Grid from '@material-ui/core/Grid';
import { Page } from '@shopify/polaris';
import styled, { css } from 'styled-components';

const _ContainedPage = styled(Grid)`
    /* Default */
    width: 100%;
    max-width: 100rem;
    ${props => !!props.maxwidth && css`
        /* In case we're provided a user value */
        max-width: props.maxWidth;
    `}
`;

const ContainedPage = ({ maxWidth, className, children, ...pageProps }) => (
    <Grid container alignItems="flex-start" justify="center" className={className}>
        <_ContainedPage item maxwidth={maxWidth}>
            <Page {...pageProps}>
                {children}
            </Page>
        </_ContainedPage>
    </Grid>
)

export default ContainedPage;