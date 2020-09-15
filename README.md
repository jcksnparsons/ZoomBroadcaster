# Zoom Broadcaster

Alert Nashville Software School students when Zoom has processed the recording of the their class lecture after the meeting.

Allow instructors to add a summary to recordings

## Running Locally

1. Globally install the firebase tools with `npm install -g firebase-tools`
1. Install the latest [JDK](https://www.oracle.com/java/technologies/javase-downloads.html). (This is needed to run the firestore emulator)
1. `cd` into the `/functions` directory and `npm install`
1. From the `/functions` directory run `npm run build`
1. Add an `env.local.json` file to the `/functions` directory structured like this (see me for Zoom and Slack tokens):

   ```json
   {
     "env": {
       "zoom": {
         "verificationToken": "<YOUR_ZOOM_TOKEN>"
       },
       "slack": {
         "botAccessToken": "<YOUR_SLACK_ACCESS_TOKEN>"
       },
       "app": {
         "url": "http://localhost:3000"
       }
     }
   }
   ```

1. `cd` into the `/client` directory and `npm install`
1. From the `/client` directory create a `.env` file and add the following (see me for values)
   ```
   VUE_APP_API_KEY=TODO
   VUE_APP_AUTH_DOMAIN=TODO
   VUE_APP_DATABASE_URL=TODO
   VUE_APP_PROJECT_ID=TODO
   VUE_APP_APP_ID=TODO
   VUE_APP_MEASUREMENT_ID=TODO
   VUE_APP_SLACK_SEARCH_URL=TODO
   ```
1. From the `/client` directory run `npm run serve:dev`. The firebase console will be served on `localhost:4000` and your Vue client will be served on `localhost:3000`
1. Go to `localhost:3000/login` and login using gmail. You'll be shown a message that you're pending approval
1. Go to `localhost:4000/firestore` and find your user. Select `+ Add field` and add a field name `isApproved`, give it a type of `boolean`, and set it to `true`
1. Go to `localhost:3000`
