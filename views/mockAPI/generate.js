const schema = require('./schema.json');
const jsf = require('json-schema-faker');
const fs = require('fs');

jsf.extend('faker', () => require('faker/locale/vi'));

jsf.extend('chance', () => (new require('chance')()));

jsf.resolve(schema).then(sample => {
    fs.writeFile(__dirname + '/db.json', JSON.stringify(sample), (err) => {
        if (err) return console.error(err);
        console.log('Random datas for mock API are created');
    });
}).catch(console.error);
