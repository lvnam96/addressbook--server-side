// const Factory = require('./Factory');
const User = require('./User');
const Addressbook = require('./Addressbook');
// const ContactsList = require('./ContactsList');
const Contact = require('./Contact');
const serv = require('../services/');
const db = require('../db/');

function signUp (json, cb) {
    const user = User.fromJSON(json).toDB();
    User.signUp(user, (err, rawUserData) => {
        let user;
        if (rawUserData) {
            user = User.fromJSON(rawUserData).toJSON();
        }
        return cb(err, user);
    });
}

function signIn (req, uname, rawPasswd, done) {
    User.signIn(uname, rawPasswd, (err, user) => {
        const flash = { errMsg: 'Wrong username/password' };
        if (err) {
            console.error(err);
            return done(err, false, flash);
        }

        serv.passwd.isRawMatchHashedPasswd(rawPasswd + user.salt, user.passwd, isMatched => {
            if (!isMatched) {
                console.error(new Error(flash.errMsg));
                return done(null, false, flash);
            }
            return done(null, user);
        });
    });
}

function findById (id, done) {
    User.findById(id, (err, userObj) => {
        done(err, userObj);
    });
}

function addContact (json) {
    const contact = Contact.fromJSON(json).toDB();
    return db.data.addContact(contact)
        .then(rawData => Contact.fromJSON(rawData));
}

function editContact (json) {
    const contact = Contact.fromJSON(json).toDB();
    return db.data.editContact(contact)
        .then(rawData => Contact.fromJSON(rawData));
}

function delContact (json) {
    // contact: shape of {
    //     accountId: string
    //     id: string
    //     adrsbookId: string
    // }
    const contact = Contact.fromJSON(json).toDB();
    return db.data.removeContact(contact)
        .then(rawData => Contact.fromJSON(rawData));
}

function delMultiContacts (contacts) {
    // accountId: string
    // adrsbookId: string
    // contactIds: array of contacts
    const accountId = contacts[0].accountId,
        adrsbookId = contacts[0].adrsbookId,
        contactIds = contacts.map((contact) => contact.id);
    return db.data.removeMultiContacts(accountId, adrsbookId, contactIds)
        .then(rows => {
            return rows.map(rawData => Contact.fromJSON(rawData));
        });
}

function delAllContacts (accountId, adrsbookId) {
    // accountId: string
    // adrsbookId: string
    return db.data.removeAllContacts(accountId, adrsbookId);
}

function importContacts (contacts) {
    contacts = contacts.map(contact => Contact.fromJSON(contact).toDB());
    return db.data.importContacts(contacts);
}

function replaceAllContacts (contacts, accountId, adrsbookId) {
    contacts = contacts.map(contact => Contact.fromJSON(contact).toDB());
    return db.data.replaceAllContacts(contacts, accountId, adrsbookId);
}

function loadAllContacts () {
    return db.data.getAllContacts().then(({ rows }) => rows.map(rawData => Contact.fromJSON(rawData)));
}

function loadAllData (accountId) {
    return db.data.getAllData(accountId).then(rawData => {
        const data = {
            user: User.fromDB(rawData.user),
            adrsbook: Addressbook.fromDB({
                ...rawData.adrsbook,
                contacts: rawData.contacts
            })
        };
        return data;
    });
}

// CONTROLLER
const adbk = {
    user: {
        signUp,
        signIn,
        findById,
        loadAll: loadAllData,
    //     activate: activateUser,
    //     deactivate: deactivateUser
    },
    // adrsbook: {
    //     add: addAdrsbook,
    //     edit: editAdrsbook,
    //     del: delAdrsbook,
    // },
    contact: {
        add: addContact,
        edit: editContact,
        del: delContact,
        delAll: delAllContacts,
        delMulti: delMultiContacts,
        import: importContacts,
        replaceAll: replaceAllContacts,
        loadAllContacts: loadAllContacts,
    }
};

module.exports = adbk;
