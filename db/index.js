// export create from './create';
// export read from './read';
// export update from './update';
// export delete from './delete';
const { Pool } = require('pg'),
    dbInfo = {
        user: 'garyle',
        host: 'localhost',
        database: 'adrsbook',
        password: 'bdd8OC0qgd',
        port: 5432
    },
    pool = new Pool(dbInfo);

module.exports.account = require('./account');
