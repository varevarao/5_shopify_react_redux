import { Loading, Toast, Provider as ShopifyProvider } from '@shopify/app-bridge-react';
import '@shopify/polaris/styles.css';
import 'isomorphic-unfetch';
import Cookies from 'js-cookie';
import cookies from 'next-cookies';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { connect, Provider as DataProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { finishInit, hideLoader, initializeProductImages, initializeShopifyData, initializeStore, showLoader, startInit, hideToaster } from '../store';

const theme = {
    breakpoints: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1500
    }
};

const _PageWithLoader = ({NextPage, loading, toaster, hideToaster,  ...props}) => (
    <div>
        { loading && <Loading /> }
        { toaster && <Toast error={toaster.error} content={toaster.message} onDismiss={hideToaster} /> }
        <NextPage {...props} />
    </div>
);

const mapStateToProps = state => {
    return {
        loading: state.loader_visible,
        toaster: state.toaster
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideToaster: () => dispatch(hideToaster())
    }
}

const PageWithLoader = connect(mapStateToProps, mapDispatchToProps)(_PageWithLoader);

class MainApp extends App {
    state = {
        shopOrigin: Cookies.get('shopOrigin'),
        apiKey: process.env.SHOPIFY_API_KEY
    }

    constructor(props) {
        super(props);

        this.toggleLoader = this._toggleLoader.bind(this); 
    }

    static async getInitialProps({ Component, ctx }) {
        if (ctx.isServer) {
            ctx.store.dispatch(startInit());

            const { shopOrigin, accessToken } = cookies(ctx);
            
            await ctx.store.dispatch(initializeShopifyData(shopOrigin, accessToken));
            await ctx.store.dispatch(initializeProductImages(shopOrigin, accessToken));
            
            ctx.store.dispatch(finishInit());
        }

        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        return { pageProps };
    }

    componentDidMount() {
        Router.events.on('routeChangeStart', () => this.toggleLoader(true));
        Router.events.on('hashChangeStart', () => this.toggleLoader(true));
        Router.events.on('routeChangeComplete', () => this.toggleLoader(false));
        Router.events.on('hashChangeComplete', () => this.toggleLoader(false));

        this.toggleLoader(false);
    }

    _toggleLoader(visible) {
        this.props.store.dispatch(visible ? showLoader() : hideLoader());
    }

    render() {
        const { Component, pageProps, store } = this.props;
        const providerConfig = {
            apiKey: this.state.apiKey,
            shopOrigin: this.state.shopOrigin,
            // Force a redirect to the admin app if not loaded in an iframe
            forceRedirect: true
        };

        return (
            <React.Fragment>
                <Head>
                    <title>Shopify App</title>
                    <meta charSet='utf-8' />
                </Head>
                <ThemeProvider theme={theme}>
                    <ShopifyProvider config={providerConfig}>
                        <DataProvider store={store}>
                            <PageWithLoader NextPage={Component} {...pageProps} />
                        </DataProvider>
                    </ShopifyProvider>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default withRedux(initializeStore, { debug: !!process.env.DEBUG_REDUX })(MainApp);