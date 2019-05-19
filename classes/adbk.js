// const Factory = require('./Factory');
const User = require('./User');
const Addressbook = require('./Addressbook');
// const ContactsList = require('./ContactsList');
const Contact = require('./Contact');
const serv = require('../services/');
const db = require('../db/');

function signUp (json, cb) {
  const user = User.fromJSON(json).toDB(); // convert to User obj from JSON data
  User.signUp(user, (err, rawUserData) => {
    if (err) {
      console.error(err);
    }
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

    serv.passwd.isRawMatchHashedPasswd(rawPasswd + user.salt, user.passwd, (isMatched) => {
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
  return db.data
    .addContact(contact)
    .then((contact) => Contact.fromJSON(contact))
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

function editContact (json) {
  const contact = Contact.fromJSON(json).toDB();
  return db.data
    .editContact(contact)
    .then((contact) => Contact.fromJSON(contact))
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

function delContact (json) {
  // contact: shape of {
  //     accountId: string
  //     id: string
  //     adrsbookId: string
  // }
  const contact = Contact.fromJSON(json).toDB();
  return db.data
    .removeContact(contact)
    .then((contact) => Contact.fromJSON(contact))
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

function delMultiContacts (contacts) {
  // accountId: string
  // adrsbookId: string
  // contactIds: array of contacts
  const accountId = contacts[0].accountId;
  const adrsbookId = contacts[0].adrsbookId;
  const contactIds = contacts.map((contact) => contact.id);
  return db.data
    .removeMultiContacts(accountId, adrsbookId, contactIds)
    .then((rows) => {
      return rows.map((rawData) => Contact.fromJSON(rawData));
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

function delAllContacts (accountId, adrsbookId) {
  // accountId: string
  // adrsbookId: string
  return db.data
    .removeAllContacts(accountId, adrsbookId)
    .then((rows) => {
      return rows.map((rawData) => Contact.fromJSON(rawData));
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

function importContacts (contacts) {
  contacts = contacts.map((contact) => Contact.fromJSON(contact).toDB());
  return db.data
    .importContacts(contacts)
    .then((rows) => {
      return rows.map((rawData) => Contact.fromJSON(rawData));
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

function replaceAllContacts (contacts, accountId, adrsbookId) {
  contacts = contacts.map((contact) => Contact.fromJSON(contact).toDB());
  return db.data
    .replaceAllContacts(contacts, accountId, adrsbookId)
    .then((rows) => {
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((rawData) => Contact.fromJSON(rawData));
      }
      return [];
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

function loadAllContacts () {
  return db.data
    .getAllContacts()
    .then(({ rows }) => {
      return rows.map((contact) => Contact.fromJSON(contact));
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

function loadAllData (accountId) {
  return db.data
    .getAllData(accountId)
    .then((rawData) => {
      const data = {
        user: User.fromDB(rawData.user),
        adrsbook: Addressbook.fromDB({
          ...rawData.adrsbook,
          contacts: rawData.contacts,
        }),
      };
      return data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
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
  },
};

module.exports = adbk;
