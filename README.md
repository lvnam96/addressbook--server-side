> This README is intentionally for my future employers. If you want to participate or use this app, please read [this](DEVELOPING.md).

Contacts Book
===
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/lvnam96/contactsbook/draft?color=blue&style=flat-square)

### Tech stack:

- [Passport.js](https://github.com/jaredhanson/passport)
- [Express.js](https://github.com/expressjs/express)
- [PostgreSQL](https://github.com/brianc/node-postgres)
- [React.js](https://github.com/facebook/react)

### What I have done in this project:

#### Server-side
- Login by username & password
- Login by Google account using OAuth2 *(in development)*

#### Client-side
- Use service worker to have offline access *(v2)*
- Use cache by setting HTTP cache header & the service worker
- Form validation by [`formik`](https://github.com/jaredpalmer/formik) & [`yup`](https://github.com/jquense/yup)
- User roles (maybe different permissions between users of the same role as well): `admin` (for app's settings & stats), `free`|`premium` user *(v2)*
- Recover password *(impossible without an email-sending service)*

#### Security
- Client hashes password before sending over HTTPS
- Server receives password MD5 hash from client, then encrypt it using [`bcrypt`](https://github.com/dcodeIO/bcrypt.js) with strongly crypto-randomed salt for each account
- XSRF protection using JWT with RSA-512 algorithm *(now it's still)*
- Limit submitting times (block IP/MAC address, use Google's reCAPTCHA) *(in development)*
- Prevent attacks via API requests *(how???)*

#### UX (it's important, isn't it? 😊)
- Key press event listeners (Esc, Enter,...) while opening popups, filling in forms,...
