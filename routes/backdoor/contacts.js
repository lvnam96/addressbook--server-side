const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const adbk = require('../../classes/adbk');
const CList = require('../../classes/ContactsList');

// '/backdoor/contacts' route

// TESTED
router.post('/add', (req, res, next) => {
  adbk.contact
    .add(req.body.contact)
    .then((contact) => {
      contact = contact.toJSON();
      res.json({ res: true, contact });
      return contact;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// TESTED
router.post('/edit', (req, res, next) => {
  adbk.contact
    .edit(req.body.contact)
    .then((contact) => {
      contact = contact.toJSON();
      res.json({ res: true, contact });
      return contact;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// TESTED
router.post('/delete', (req, res, next) => {
  adbk.contact
    .del(req.body.contact)
    .then((contact) => {
      contact = contact.toJSON();
      res.json({ res: true, contact });
      return contact;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// TESTED
router.post('/delete-multiple', (req, res, next) => {
  adbk.contact
    .delMulti(req.user.id, req.body.contacts)
    .then((contacts) => {
      contacts = contacts.map((contact) => contact.toJSON());
      res.json({ res: true, contacts });
      return contacts;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// TESTED
router.post('/delete-all', (req, res, next) => {
  adbk.contact
    .delAll(req.user.id, req.body.cbookId)
    .then((contacts) => {
      contacts = contacts.map((contact) => contact.toJSON());
      res.json({ res: true, contacts });
      return contacts;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// TESTED
router.post('/import', (req, res, next) => {
  const availMode = adbk.contact.import.mode;
  let importingMode;
  switch (req.query.mode) {
    case 'replace':
      importingMode = availMode.REPLACE_ALL;
      break;
    case 'overwrite':
      importingMode = availMode.OVERWRITE;
      break;
    default:
      importingMode = availMode.KEEP_ALL;
      break;
  }

  adbk.contact
    .import(req.body.contacts, req.user.id, req.body.cbookId, importingMode)
    .then((contacts) => {
      contacts = contacts.map((contact) => contact.toJSON());
      res.json({ res: true, contacts });
      return contacts;
    })
    .catch(() => {
      res.json({ res: false });
    });
});

// this route is not ready to be used, check it later
router.get('/', (req, res, next) => {
  if (req.query.cbookId) {
    adbk.contact
      .getContactsOfCbook(req.user.id, req.query.cbookId)
      .then((contacts) => {
        contacts = contacts.toJSON();
        res.json({ res: true, contacts });
        return contacts;
      })
      .catch(() => {
        res.json({ res: false });
      });
  } else {
    res.sendStatus(403);
    res.end();
  }
});

module.exports = router;
