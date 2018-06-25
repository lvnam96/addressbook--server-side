### Note in `./gulpfile.js`

At line 60-67:
``` javascript
bs.init({
    server: {
        baseDir: srcPath,
        routes : {// https://stackoverflow.com/questions/39301788/browser-sync-serve-node-modules-out-of-src-directory
            '/vendor' : './node_modules'
        }
    }
});
```
Whenever we want to reference to a package/module in `./node_modules/` directory in `./src/*.html`, we use this pattern for file's URL: `/vendor/[module-name]/path-to-file`. There is an xample at line 8 in [`./src/signin.html`](./src/signin.html).

### How to develop:

```
npm start
```

### How to build: (minify, etc...)

```
npm run build
```
