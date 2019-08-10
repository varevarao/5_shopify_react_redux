# Shopify Embedded App
[![Build Status](https://travis-ci.com/varevarao/potd_5_next_redux_shopify.svg?branch=master)](https://travis-ci.com/varevarao/potd_5_next_redux_shopify)  [![GitHub version](https://img.shields.io/github/package-json/v/varevarao/potd_5_next_redux_shopify)](https://github.com/varevarao/potd_5_next_redux_shopify)

This is boilerplate code for a Shopify Embedded Admin app running on the Next.js framework. It is easily configurable, and the UI can directly be plugged in for a functional setup.

## Technology
The project uses the following technology stack:
- **[Koa](https://github.com/koajs/koa) server**:  
    *Koa* is a modern server architecture based on the *Express.js* server.  
    It is used to set up a custom server, where we inject *Shopify* auth
- **[@shopify/koa-shopify-auth](https://github.com/Shopify/quilt/blob/master/packages/koa-shopify-auth/README.md)**:  
     *koa-shopify-auth* is an auth middleware, which uses the configured keys, to determine the shop and obtians an access token
- **[Shopify Admin API](https://help.shopify.com/en/api/reference)**:  
    The Admin API interface offered by *Shopify*, which is a JSON based communication interface
- **[Next.js](https://github.com/zeit/next.js/) framework**:   
     *Next.js* is a highly customizable react framework which includes support for isomorphic apps, and can be customized as either completely client, or server side.
- **[React.js](https://github.com/facebook/react) language features**:  
    *React.js* is a JS library that makes building for the web front end fun, and intuitive.
- **[Travis CI]()**:  
    *Travis-ci* is used to keep the project stable, and report any issues in a timely fashion. More information on the build lifecycle can be found [in their docs](https://docs.travis-ci.com/user/job-lifecycle/)

## Setup
This app runs on a Node backend, with Next.js serving pages, and routes, and Koa handling the architecture. In order to setup the app:

### Codebase
- Clone the repo
- Run `yarn install` to update all the dependencies
- To start the server at port 3000
    - `yarn dev` in development mode (includes error backtracking using Redux)
    - `yarn start` in production mode
- Navigate to `http://localhost:3000` to see the running app *(if you see an auth error that's fine for now)*

### Connect your Shopify store to the app
- Run `ngrok http 3000` to get an https tunnel setup
- Create a development store on the Shopify partner portal (transferrable)
- Create **two apps** on the Shopify [partner portal](https://partners.shopify.com): One for development, and the other production
- Create **two copies** of the `.env.template` file, and rename them as `.env.development`, and `.env.production`
- Add the keys `SHOPIFY_API_KEY`, and `SHOPIFY_API_SECRET_KEY` with the corersponding values from the portal (one app for each environment), into the corresponding `.env` file
- To add the development app to the store visit  
`https://<your ngrok url>.io/auth?shop=<your Shopify store name>.myshopify.com`
- In case of an error `The page you’re looking for couldn’t be found`, re-attempt access to the above URL
- Authorize the app on your store

DONE!! You can now visit your store URL, and in the apps section you should see the development (and production) app

## Customization
The app is built as a boilerplate for embedded shopify apps, and as such has the scaffolding to get and store all available shop, customer, and order data. In order to customize this behaviour, change the settings under `config/index.js`

Supported config options:
- `SHOPIFY_API_VERSION`:  
    - Admin API version to use for server requests
- `enabled_apis`:  
    - Map of enabled API endpoints, keyed by the API name, any key in here should have a corresponding entry in 'store/actions/index.js', and an action named 'setupInitialState' which populates the server side redux store

## Deployment
The app can be easily, and quickly deployed on [Heroku](https://www.heroku.com) using the [`heroku-cli`](https://devcenter.heroku.com/articles/heroku-cli) tools. Create a free account on Heroku before proceeding.
Run the following in the project root:
```
# In case you don't have an app assoicated with this repo
$> heroku create 

# If you already have an app on heroku, link the heroku remote to git
$> heroku git:remote -a <app_name>

# Push code directly to the heroku remote, where it will run npm build
$> git push heroku master
```
Once the push completes, you will receive the URL at which the app is available. Repeat the '*connect your store*' steps using the above url as the app endpoint.
