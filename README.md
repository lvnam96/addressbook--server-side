> This README is intentionally for my future employers. If you want to participate or use this app, please read [this](DEVELOPING.md).

Contacts Book
===
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/lvnam96/contactsbook/draft?color=blue&style=flat-square)

### Tech stack:

- [Express.js](https://github.com/expressjs/express)
- [PostgreSQL](https://github.com/brianc/node-postgres)
- [React.js](https://github.com/facebook/react)

### What I have done in this project:

#### Server-side
- Login by username & password
<!-- - Login by Google account using OAuth2 *(in development)* -->

#### Client-side
<!-- - Use service worker to have offline access *(v2)* -->
- Use cache by setting HTTP cache header & the service worker
- Form validation by [`formik`](https://github.com/jaredpalmer/formik) & [`yup`](https://github.com/jquense/yup)
<!-- - User roles (maybe different permissions between users of the same role as well): `admin` (for app's settings & stats), `free`|`premium` user *(v2)* -->

#### Security
- Client hashes password using SHA512 before sending over HTTPS
- Server receives hashed password from client, then encrypt it using [`bcrypt`](https://github.com/dcodeIO/bcrypt.js) with strongly crypto-randomed salt for each account
- Prevent XSRF attacks using JWT following [this](https://github.com/pillarjs/understanding-csrf) & [this](https://stackoverflow.com/questions/27067251/where-to-store-jwt-in-browser-how-to-protect-against-csrf)
<!-- - Limit submitting times (block IP/MAC address, use Google's reCAPTCHA) *(in development)* -->
<!-- - Prevent attacks via API requests *(how???)* -->
- Use `helmet` with its additional middlewares:
  - Feature-Policy
  - Content-Security-Policy (CSP) (including nonce)
    - At the moment report-only mode is used to have an overview of the CSP behavior while testing app in production
    - Due to [`react-color`](https://github.com/casesandberg/react-color/) is adding inline styles but hasn't support nonce yet, therefore `style-src` directive must have `'unsafe-inline'` but cannot have `'nonce-{random}'`
- Force SSL (on production)
- Force request's body to be JSON on API routes (via express.json middleware)
- Enable HSTS header
  - Note: cannot submit this site to [Chrome's HSTS preload list](https://hstspreload.org/?domain=contacts.garyle.me) to ensure that it is successfully preloaded (i.e. to get the full protection of the intended configuration) because this app's main domain is a subdomain.
- Validate host to prevent [DNS Rebinding](https://www.npmjs.com/package/host-validation#what-is-dns-rebinding-and-why-should-i-care)

#### UX (it's important, isn't it? 😊)
- Key press event listeners (Esc, Enter,...) while opening popups, filling in forms,...

#### Performance
- Improve critical rendering path
  - Move Google Fonts from inside CSS (@import) to external link tag in HTML (see f7b478596dd4bddbb099a9a9ab143f04c5f0e50d)
- Reduce bundle's size (tree-shaking, optimize bundling, replace not-really-neccessary heavy modules by lighter ones,...)
  - Not transpiling ES6 module with `@babel/preset-env` so `webpack` can do its optimization (tree-shaking)
  - Use chery-picking when import module (`yup`, `jssha`, `lodash`, `date-fns`, `react-router`, `react-bootstrap`,...)
  - Remove React's `prop-types` validation code in production build
  - Replaced modules:
    - `date-fns` instead of `luxon`
- Code-splitting by using dynamic ESM's `import()`
- **Results:**
  - Bundle files size:

    | Entrypoints  |                 Unoptimized |                   Optimized |
    | ------------ | --------------------------: | --------------------------: |
    | **Main app** |                       198KB |                       133KB |
    | **Sign up**  |                       191KB |                       150KB |
    | **Sign in**  |                       181KB |                       141KB |
    | Overview     | [screenshoot][bundlesize-1] | [screenshoot][bundlesize-2] |

  - Performance: (Google LightHouse's audits in Chrome Dev Tools)

    | Entrypoints  | Unoptimized     | Optimized       |
    | ------------ | --------------- | --------------- |
    | **Main app** | [PDF][main-1]   | [PDF][main-2]   |
    | **Sign up**  | [PDF][signup-1] | [PDF][signup-2] |
    | **Sign in**  | [PDF][signin-1] | [PDF][signin-2] |

[bundlesize-1]: ./reports/bundle-files-size-unoptimized.png
[bundlesize-2]: ./reports/bundle-files-size-optimized.png
[main-1]: ./reports/main-perf-audit-before-optimized.pdf
[main-2]: ./reports/main-perf-audit-after-optimized.pdf
[signup-1]: ./reports/signup-perf-audit-before-optimized.pdf
[signup-2]: ./reports/signup-perf-audit-after-optimized.pdf
[signin-1]: ./reports/signin-perf-audit-before-optimized.pdf
[signin-2]: ./reports/signin-perf-audit-after-optimized.pdf
