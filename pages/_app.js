import { Loading, Provider as ShopifyProvider, Toast } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/styles.css';
import 'isomorphic-unfetch';
import Cookies from 'js-cookie';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { connect, Provider as DataProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import initializeStore from '../store';
import setupServerStores from '../store/actions';
import { hideLoader, hideToaster, showLoader } from '../store/actions/ui';

// Material UI breakpoints
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

/**
 * HOC for wrapping the app with a toaster, and loader bar
 */
const _PageWithLoader = ({ NextPage, loading, toaster, hideToaster, ...props }) => (
    <div>
        {loading && <Loading />}
        {toaster && <Toast error={toaster.error} content={toaster.message} onDismiss={hideToaster} />}
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


/**
 * Main app container
 */
class MainApp extends App {
    /**
     * On the client, this can be used directly from the app state
     * TODO: This can be moved into the store
     */
    state = {
        shopOrigin: Cookies.get('shopOrigin'),
        apiKey: SHOPIFY_API_KEY
    }

    constructor(props) {
        super(props);

        // Handle any page transitions with a loader
        this.toggleLoader = this.toggleLoader.bind(this);
    }

    /**
     * Called before creating the component,
     * Check for ctx.isServer, and execute any SSR requirements in this
     * 
     * In this case, we setup the initial redux store state.
     */
    static async getInitialProps({ Component, ctx }) {
        if (ctx.isServer) {
            // Setup the initial Redux stores on the server
            await setupServerStores(ctx);
        } else if (ctx.store && ctx.store.dispatch) {
            // If we're on the client, show the loader
            this.toggleLoader(ctx.store, true);
        }

        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        return { pageProps };
    }

    componentDidMount() {
        // Start monitoring 
        Router.events.on('routeChangeStart', () => this.toggleLoader(true));
        Router.events.on('hashChangeStart', () => this.toggleLoader(true));
        Router.events.on('routeChangeComplete', () => this.toggleLoader(false));
        Router.events.on('hashChangeComplete', () => this.toggleLoader(false));

        // Hide the loader when the main app loads
        // (the default state value stores this as visible)
        this.toggleLoader(this.props.store, false);
    }

    toggleLoader({ dispatch }, visible) {
        dispatch(visible ? showLoader() : hideLoader());
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
                            <AppProvider>
                                <PageWithLoader NextPage={Component} {...pageProps} />
                            </AppProvider>
                        </DataProvider>
                    </ShopifyProvider>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default withRedux(initializeStore, { debug: !!process.env.DEBUG_REDUX })(MainApp);