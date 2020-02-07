const debug = require('debug')('contactsbook:server:database');
const { Pool } = require('pg');
const dbInfo = require('./dbConfig');
const pool = new Pool(dbInfo);
// note: access to pgp without exported via pDB.$config.pgp
const pgp = require('pg-promise')({
  capSQL: true,
  error(err, e) {
    debug(err);

    if (e.cn) {
      // this is a connection-related error
      // cn = safe connection details passed into the library:
      //      if password is present, it is masked by #
    }
    if (e.query) {
      // query string is available
      if (e.params) {
        // query parameters are available
      }
    }
    if (e.ctx) {
      // occurred inside a task or transaction
    }
  },
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    debug('Connected to database:', cp.database);
  },
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    debug('Disconnecting from database:', cp.database);
  },
});
const pDB = pgp(dbInfo);

pool.on('error', (err, client) => {
  debug('Unexpected error on idle client', err);
  throw err; // process.exit(-1);
});

// log connection status when initialing server
pool
  .connect()
  .then((client) => {
    client.release();
    debug('Database is connected!');
    return client;
  })
  .catch((err) => {
    // pool.end(); // client.release();
    debug('Database connection failed', err.stack);
  });

module.exports = {
  pDB,
  pool,
  query: (text, params, cb) => {
    // if callback is not provided, a promise will be returned,
    // it means that functionality wants to handle error by itself
    if (cb) {
      const start = Date.now();
      return pool.query(text, params, (err, res) => {
        if (err) {
          return cb(err);
        }
        const duration = Date.now() - start;
        debug(`Executed query: ${text}, Duration: ${duration}ms, Rows: ${res.rows.length}`);
        cb(null, res);
      });
    } else {
      return pool.query(text, params);
    }
  },
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query.bind(client);

      // monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.lastQuery = args;
        client.query.apply(client, args);
      };

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        debug('A client has been checked out for more than 5 seconds!');
        debug(`The last executed query on this client was: ${client.lastQuery}`);
      }, 5000);

      const release = (err) => {
        // call the actual 'done' method, returning this client to the pool
        done(err);
        // clear our timeout
        clearTimeout(timeout);
        // set the query method back to its old un-monkey-patched version
        client.query = query;
      };

      callback(err, client, done);
    });
  },
};
