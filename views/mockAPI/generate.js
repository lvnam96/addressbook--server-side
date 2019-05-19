const schema = require('./schema.json');
const jsf = require('json-schema-faker');
const fs = require('fs');
const path = require('path');

jsf.extend('faker', () => require('faker/locale/vi'));

jsf.extend('chance', () => new (require('chance'))());

jsf
  .resolve(schema)
  .then((sample) => {
    fs.writeFile(path.join(__dirname, './db.json'), JSON.stringify(sample), (err) => {
      if (err) return console.error(err);
      console.log('Random data JSON file for mock API is created');
    });
  })
  .catch(console.error);
