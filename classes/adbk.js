// const Factory = require('./Factory');
const User = require('./User');
const Cbook = require('./Contactsbook');
const CList = require('./ContactsList');
const Contact = require('./Contact');
const serv = require('../services/');
const db = require('../db/');

const handleError = (err) => {
  console.error(err);
};

const signUp = (json, cb) => {
  User.signUp(json, (err, rawUserData) => {
    if (err) {
      handleError(err);
    }
    let user;
    if (rawUserData) {
      user = User.fromJSON(rawUserData).toJSON();
    }
    return cb(err, user);
  });
};

const signIn = (req, uname, rawPasswd, done) => {
  User.signIn(uname, rawPasswd, done);
};

const findById = (id, done) => {
  User.findById(id, (err, userObj) => {
    done(err, userObj);
  });
};

const addContact = (json) => {
  return Contact.create(json);
};

const editContact = (json) => {
  return Contact.update(json);
};

const delContact = (json) => {
  return Contact.fromJSON(json).selfDelete();
};

const delMultiContacts = (accId, arrOfContacts) => {
  const ids = Array.isArray(arrOfContacts) ? arrOfContacts.map((json) => json.id) : [];
  return Contact.delete(accId, ids);
};

const delAllContacts = (accId, cbookId) => {
  return Contact.deleteAll(accId, cbookId);
};

// BUG: these too queries should cover this special case: duplicated contacts appear in both database & imported data => 2 resolving way:
// - remove old ones, then import new ones (replaceAllContacts)
// - import & modify duplicated ones (importContacts)
const importContacts = (contacts) => {
  // special case while importing: there is contact in current cbook:
  // which has 2 more cases as well:
  // 1. there is duplicated contacts appear in both imported list & current cbook
  // 1.1 Overwrite duplicates, keep the rest, import the new ones
  // 1.2 Keep all, import the new ones
  // 2. there is no duplicated contacts
  // 2.1 Overwrite all, import the new ones (what a stupid choice)
  // 2.2 Keep all, import the new ones

  // steps:
  // check whether current cbook has contacts
  // if yes:
  // check whether the list has duplicated contacts
  // if yes, 2 options:
  // 1.
  // Option 3: keep all, import new ones - CREATE multiple contacts with same accId & cbookId
  // if no, just go for it
  contacts = contacts.map((contact) => Contact.fromJSON(contact).toDB());
  return db.data
    .importContacts(contacts)
    .then((rows) => {
      return rows.map((rawData) => Contact.fromJSON(rawData));
    })
    .catch((err) => {
      handleError(err);
      throw err;
    });
};

const replaceAllContacts = (json, accId, cbookId) => {
  const contacts = json.map((contact) => Contact.fromJSON(contact).toDB());
  return db.data
    .replaceAllContacts(contacts, accId, cbookId)
    .then((rows) => {
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((rawData) => Contact.fromDB(rawData));
      }
      return [];
    })
    .catch((err) => {
      handleError(err);
      throw err;
    });
};

const getContactsOfCbook = (accId, cbookId) => {
  return db.data
    .getContactsOfCbook(accId, cbookId)
    .then(({ rows }) => CList.fromDB(rows))
    .catch((err) => {
      handleError(err);
      throw err;
    });
};

const loadAllData = (accId) => {
  return db.data
    .getAllData(accId)
    .then((rawData) => {
      const user = User.fromDB(rawData.user);
      user.cbooks = rawData.cbooks.map((cbook) => Cbook.fromDB(cbook));
      const contacts = new CList(rawData.contacts.map((contact) => Contact.fromDB(contact))); // convert to CList.fromDB(rawData.contacts)
      const data = {
        ...rawData,
        user,
        contacts,
      };
      return data;
    })
    .catch((err) => {
      handleError(err);
      throw err;
    });
};

const createCbook = (json) => {
  return Cbook.create(json);
};

const updateCbook = async (user, json) => {
  const accId = user.id;
  const cbookId = json.id;
  const isCbookBelongToUser = await db.data.checkCbookBelongToUser(accId, cbookId);
  if (isCbookBelongToUser) {
    return Cbook.update(accId, json);
  } else {
    const err = new Error(`Contactbook ${cbookId} does not belong to user ${accId}`);
    handleError(err);
    return Promise.reject(err);
  }
};

const checkDefaultCbook = async (accId, cbookId) => {
  const meta = await db.data.getUserMeta(accId);
  return meta.last_activated_cbook_id === cbookId;
};

const deleteCbook = async (user, json) => {
  const accId = user.id;
  const cbookId = json.id;
  const isDefaultCbook = await checkDefaultCbook(accId, cbookId);
  if (isDefaultCbook) {
    const err = new Error(`Cannot delete default cbook ${cbookId} of user ${accId}`);
    handleError(err);
    return Promise.reject(err);
  }
  return Cbook.delete(accId, cbookId);
};

const setDefaultCbook = async (user, cbookId) => {
  const isCbookBelongToUser = await db.data.checkCbookBelongToUser(user.id, cbookId);
  if (isCbookBelongToUser) {
    return user.setDefaultCbook(cbookId);
  } else {
    const err = new Error(`Cbook ${cbookId} does not belong to user ${user.id}`);
    handleError(err);
    return Promise.reject(err);
  }
};

// CONTROLLER
const adbk = {
  jwt: serv.jwt,
  handleError,
  user: {
    signUp,
    signIn,
    findById,
    loadAll: loadAllData,
    //     activate: activateUser,
    //     deactivate: deactivateUser
  },
  cbook: {
    create: createCbook,
    setDefault: setDefaultCbook,
    update: updateCbook,
    delete: deleteCbook,
  },
  contact: {
    add: addContact,
    edit: editContact,
    del: delContact,
    delAll: delAllContacts,
    delMulti: delMultiContacts,
    import: importContacts,
    replaceAll: replaceAllContacts,
    getContactsOfCbook: getContactsOfCbook,
  },
};

module.exports = adbk;
