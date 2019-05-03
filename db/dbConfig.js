let configObj = {
    user: 'garyle',
    host: 'localhost',
    database: 'adrsbook',
    password: 'bdd8OC0qgd',
    port: 5432
};

if (process.env.DATABASE_URL) {// for heroku
    configObj = {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    };
}

module.exports = configObj;
