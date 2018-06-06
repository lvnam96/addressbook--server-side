const { Pool } = require('pg'),
    dbInfo = {
        user: 'garyle',
        host: 'localhost',
        database: 'adrsbook',
        password: 'bdd8OC0qgd',
        port: 5432
    },
    pool = new Pool(dbInfo);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// log connection status when initialing server
pool.connect()
    .then(client => {
        client.release();
        console.log('Database is connected!');
    })
    .catch(err => {
        client.release();
        console.error('Database connection failed', err.stack);
    });

module.exports = {
    pool,
    query: (text, params, cb) => {
        // if callback not provided, promise will be returned,
        // it means that functionality want to handle error by itself
        if (cb) {
            const start = Date.now();
            return pool.query(text, params, (err, res) => {
                if (err) {
                    console.error('pool.js', err);
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
            }

            // set a timeout of 5 seconds, after which we will log this client's last query
            const timeout = setTimeout(() => {
                console.error('A client has been checked out for more than 5 seconds!')
                console.error(`The last executed query on this client was: ${client.lastQuery}`)
            }, 5000)

            const release = (err) => {
                // call the actual 'done' method, returning this client to the pool
                done(err)

                // clear our timeout
                clearTimeout(timeout);

                // set the query method back to its old un-monkey-patched version
                client.query = query;
            }

            callback(err, client, done);
        });
    }
};
