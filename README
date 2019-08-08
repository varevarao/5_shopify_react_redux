### Setup
This app runs on a Node backend, with Next.js serving pages, and routes, and Koa handling the architecture. In order to setup the app:
1. Clone the repo
2. Run `npm i` to update all the dependencies
3. Run `npm run dev` to start the local server at port 3000
4. Navigate to `http://localhost:3000` to see the running app
5. Connect your Shopify store to the app:
    - Run `ngrok http 3000` to get an https tunnel setup
    - Create a development store on the Shopify partner portal
    - Create an app on the Shopify partner portal
    - Create a `.env` file and add the keys `SHOPIFY_API_KEY`, and `SHOPIFY_API_SECRET_KEY` with the corersponding values from the portal
    - To add the development app to the store visit `https://<your ngrok url>.io/auth?shop=<your Shopify store name>.myshopify.com`
    - In case of an error `The page you’re looking for couldn’t be found`, re-attempt access to the above URL
    - Authorize the app on your store
6. DONE!! You can now visit your store URL, and in the apps section you should see the development app
