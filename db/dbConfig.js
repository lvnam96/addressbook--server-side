let configObj = require('./db-config.json');

if (process.env.DATABASE_URL) {
  // for heroku
  configObj = {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  };
}

module.exports = configObj;
