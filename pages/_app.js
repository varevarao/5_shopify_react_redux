import { Loading, Provider as ShopifyProvider, Toast } from '@shopify/app-bridge-react';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/styles.css';
import 'isomorphic-unfetch';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies';
import { connect, Provider as DataProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import initializeStore from '../store';
import setupClientStores from '../store/actions';
import { hideLoader, hideToaster, showLoader } from '../store/actions/ui';

// API key is required by the app bridge
const { publicRuntimeConfig: { ENV_DEV, API_KEY } } = getConfig();

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
const _PageWithLoader = ({ NextPage, loading, toaster, hideToaster, dispatch, ...props }) => {
    if (process.browser) {
        // Setup the initial Redux stores on the client
        setupClientStores({ dispatch });
    }
    
    return (
        <div>
            {loading && <Loading />}
            {toaster && <Toast error={toaster.error} content={toaster.message} onDismiss={hideToaster} />}
            <NextPage {...props} />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        loading: state.loader_visible,
        toaster: state.toaster
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideToaster: () => dispatch(hideToaster()),
        dispatch
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
        shopOrigin: parseCookies()['shopOrigin']
    }

    constructor(props) {
        super(props);

        // Handle any page transitions with a loader
        this.toggleLoader = this.toggleLoader.bind(this);
    }

    /**
     * Called when the main app container mounts on the client,
     * 
     * In this case, we setup the initial redux store state.
     */
    componentDidMount() {
        // Start monitoring 
        Router.events.on('routeChangeStart', () => this.toggleLoader(true));
        Router.events.on('hashChangeStart', () => this.toggleLoader(true));
        Router.events.on('routeChangeComplete', () => this.toggleLoader(false));
        Router.events.on('hashChangeComplete', () => this.toggleLoader(false));
    }

    toggleLoader({ dispatch }, visible) {
        dispatch(visible ? showLoader() : hideLoader());
    }

    render() {
        const { Component, pageProps, store } = this.props;
        const providerConfig = {
            apiKey: API_KEY,
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

export default withRedux(initializeStore, { debug: ENV_DEV === 'true' })(MainApp);