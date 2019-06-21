const { Pool } = require('pg');
const dbInfo = require('./dbConfig');
const pool = new Pool(dbInfo);
const pgp = require('pg-promise')({
  capSQL: true,
  error (err, e) {
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
  connect (client, dc, useCount) {
    const cp = client.connectionParameters;
    console.log('Connected to database:', cp.database);
  },
  disconnect (client, dc) {
    const cp = client.connectionParameters;
    console.log('Disconnecting from database:', cp.database);
  },
}); // access to pgp without exported via pDB.$config.pgp
const pgpHelpers = pgp.helpers;
const pDB = pgp(dbInfo);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// log connection status when initialing server
pool
  .connect()
  .then((client) => {
    client.release();
    console.log('Database is connected!');
  })
  .catch((err) => {
    // pool.end(); // client.release();
    console.error('Database connection failed', err.stack);
  });

module.exports = {
  pDB,
  pgpHelpers,
  pool,
  query: (text, params, cb) => {
    // if callback not provided, promise will be returned,
    // it means that functionality want to handle error by itself
    console.log('Querying to database.. Is there a callback:', !!cb);
    if (cb) {
      const start = Date.now();
      return pool.query(text, params, (err, res) => {
        if (err) {
          return cb(err);
        }
        const duration = Date.now() - start;
        console.log(`Executed query: ${text}, Duration: ${duration}ms, Rows: ${res.rows.length}`);
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
      client.query = () => {
        client.lastQuery = arguments;
        client.query.apply(client, arguments);
      };

      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error(`The last executed query on this client was: ${client.lastQuery}`);
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
