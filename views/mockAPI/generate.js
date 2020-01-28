const apiSchema = require('./schema.json');
const jsf = require('json-schema-faker');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const chokidar = require('chokidar');

jsf.extend('faker', () => require('faker/locale/vi'));

jsf.extend('chance', () => new (require('chance'))());

generateFakeJSON();

if (process.env.IS_DEV_API) {
  watchFile([path.join(__dirname, './schema.contacts.json'), path.join(__dirname, './schema.json')]);
}

function generateFakeJSON (schema = apiSchema) {
  jsf
    .resolve(schema)
    .then((sample) => {
      fs.writeFile(path.join(__dirname, './db.json'), JSON.stringify(sample), (err) => {
        if (err) return console.error(err);
        console.log('Random data JSON file for mock API is created');
      });
    })
    .catch(console.error);
}

function watchFile (filePaths, cb) {
  let prevMd5 = {};
  let fsWait = false;

  filePaths.forEach((filePath) => {
    prevMd5[filePath] = md5(fs.readFileSync(filePath));
  });

  chokidar
    .watch(filePaths, {
      ignored: /(^|[/\\])\../,
    })
    .on('change', (path, event) => {
      if (fsWait) return;
      fsWait = setTimeout(() => {
        fsWait = false;
      }, 100);
      const currMd5 = md5(fs.readFileSync(path));
      if (currMd5 === prevMd5[path]) return;
      prevMd5[path] = currMd5;
      console.log(path);
      generateFakeJSON();
    });
}
