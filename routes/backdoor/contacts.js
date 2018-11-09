const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const adbk = require('../../classes/adbk');

// '/backdoor/contacts' route

// TESTED
router.post('/add', (req, res, next) => {
    adbk.contact.add(req.body.contact).then(contact => {
        res.json({ res: true, contact });
    }).catch(err => {
        console.error(err);
        res.json({ res: false });
    });
});

// TESTED
router.post('/edit', (req, res, next) => {
    adbk.contact.edit(req.body.contact).then(contact => {
        res.json({ res: true, contact });
    }).catch(err => {
        console.error(err);
        res.json({ res: false });
    });
});

// TESTED
router.post('/delete', (req, res, next) => {
    adbk.contact.del(req.body.contact).then(contact => {
        res.json({ res: true, contact });
    }).catch(err => {
        console.error(err);
        res.json({ res: false });
    });
});

// TESTED
router.post('/delete-multiple', (req, res, next) => {
    adbk.contact.delMulti(req.body.contacts).then(contacts => {
        res.json({ res: true, contacts });
    }).catch(err => {
        console.error(err);
        res.json({ res: false });
    });
});

// TESTED
router.post('/delete-all', (req, res, next) => {
    adbk.contact.delAll(req.user.id, req.body.adrsbookId).then(contacts => {
        res.json({ res: true, contacts });
    }).catch(err => {
        console.error(err);
        res.json({ res: false });
    });
});

// TESTED
router.post('/import', (req, res, next) => {
    adbk.contact.import(req.body.contacts, req.user.id, req.body.adrsbookId).then(contacts => {
        res.json({ res: true, contacts });
    }).catch(err => {
        console.error(err);
        res.json({ res: false });
    });
});

// TESTED
router.post('/replace-all', (req, res, next) => {
    adbk.contact.replaceAll(req.body.contacts, req.user.id, req.body.adrsbookId).then(data => {
        res.json({ res: true, data });
    }).catch(err => {
        console.error(err);
        res.json({ res: false });
    });
});

router.get('/', (req, res, next) => {
    adbk.contact.loadAllContacts().then(contacts => {
        res.json({ res: true, contacts });
    }).catch(err => {
        console.error(err);
        res.json({ res: false });
    });
});

module.exports = router;
