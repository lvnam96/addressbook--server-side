## **DEVELOP ON LOCALHOST**

#### Step-by-step
To build front-end app before deploy server on localhost: `npm run build:dev`

OR run tasks seperately: `npm run build:ssr && npm run build:app-dev`

Then deploy the Node server: `nodemon ./bin/www`

#### OR

Run `npm start` on project's root directory.

---

## **DEPLOY PRODUCTION**

To build production front-end app: `npm run build`

Then deploy the Node server (`node ./bin/www` on project's root directory).

#### OR

Run `npm run deploy` on project's root directory.
