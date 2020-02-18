const path = require('path');
const _get = require('lodash/get');
const _isEmpty = require('lodash/isEmpty');
const debugController = require('debug')('contactsbook:server:controller');
const fs = require('fs');
const ms = require('ms');
const User = require('./User');
const Cbook = require('./Contactsbook');
const CList = require('./ContactsList');
const Contact = require('./Contact');
const { jwt, passwd } = require('../services/');
const db = require('../db/');

// NOTES ON MAINTAINING FUNCTIONS HERE:
// - with functions handling API requests, we user handleError directly inside functions here (not passing it to error-handling middleware), then throw that error to let router know that task has been failed
// - with normal functions handling GET request that users can visit via browser, unless we have a reason for directly handling errors, otherwise we should always pass errors to next(), so the error-handling middleware can let user know an error occurs

/*
 **************************
 *** ERRORS & DEBUGGING ***
 **************************
 */

const debug = (text) => {
  debugController(text);
};

const handleError = (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
};

/*
 ******************************
 *** PERMISSIONS & CHECKING ***
 ******************************
 */

const checkUserDefaultCbook = async (user, cbookId) => {
  const lastActivatedCbookId = _get(user, 'meta.lastActivatedCbookId');
  if (lastActivatedCbookId) {
    return lastActivatedCbookId === cbookId;
  } else {
    const userMeta = await db.data.getUserMeta(user.id);
    return userMeta.lastActivatedCbookId === cbookId;
  }
};

// "belong" means user can read this cbook, no matter this cbook is a shared one or not
const checkCbookBelongToUser = async (user, cbookId) => {
  if (
    Array.isArray(user.cbooks) &&
    user.cbooks.length > 1 &&
    Array.isArray(user.sharedCbooks) &&
    user.sharedCbooks.length > 1
  ) {
    return (
      user.cbooks.findIndex((cbook) => cbook.id === cbookId) !== -1 ||
      user.sharedCbooks.findIndex((cbook) => cbook.id === cbookId) !== -1
    );
  } else {
    const userCbookRela = await db.data.getUserCbookRelationship(user.id, cbookId);
    return !_isEmpty(userCbookRela);
  }
};

// return true if this user is the ONLY one can "update" this cbook
const checkUserOwnCbook = async (user, cbookId) => {
  if (Array.isArray(user.cbooks) && user.cbooks.length > 1) {
    return user.cbooks.findIndex((cbook) => cbook.id === cbookId) !== -1;
  } else {
    const cbookData = await db.data.getCbook(cbookId);
    return cbookData.accId === user.id;
  }
};

// return true if this user is the ONLY one can "update" the Cbook containing this contact
const checkUserOwnContact = async (user, cbookId) => {
  if (Array.isArray(user.cbooks) && user.cbooks.length > 1) {
    return user.cbooks.findIndex((cbook) => cbook.id === cbookId) !== -1;
  } else {
    const cbookData = await db.data.getCbook(cbookId);
    return cbookData.accId === user.id;
  }
};

/*
 **********************
 *** AUTHENTICATION ***
 **********************
 */

const signUp = async (json) => {
  try {
    const rawUserData = await User.signUp(json);
    let user;
    if (rawUserData) {
      user = User.fromJSON(rawUserData).toJSON();
    }
    return user;
  } catch (err) {
    handleError(err);
    throw err; // something's wrong: hashing password, do transactions in database,...
  }
};

const signIn = async (uname, rawPasswd) => {
  try {
    const user = await User.findBy('uname', uname);
    if (!user) {
      throw new Error(`Cannot find user with username ${uname}`);
    }

    const { passwd: saltedPasswd } = await passwd.getSaltedPasswd(rawPasswd, user.salt);
    const isMatched = await passwd.bcrypt.compare(saltedPasswd, user.passwd);
    return isMatched ? user : null;
  } catch (err) {
    handleError(err);
    throw err; // couldnt find user or something's wrong while querying database
  }
};

const findUserBy = async (type, val) => {
  try {
    const user = await User.findBy(type, val);
    return user; // could be falsy value (null) because user was not found
  } catch (err) {
    handleError(err);
    throw err; // something's wrong while querying database
  }
};

const findById = async (id) => findUserBy('id', id);
const findByUname = async (uname) => findUserBy('uname', uname);
const findByEmail = async (email) => findUserBy('email', email);

const signJWT = async (payload) => {
  return jwt.sign(payload); // return promise contains JWT if resolved
};

const verifyJWT = async (token) => {
  return jwt.verify(token); // return promise contains { xsrfToken } if resolved
};

/*
 *********************
 *** DATA HANDLING ***
 *********************
 */

const addContact = (json) => {
  return Contact.create(json);
};

const addContact = async (json) => {
  try {
    return Contact.create(json);
  } catch (err) {
    handleError(err);
    throw err;
  }
};

const editContact = async (json) => {
  try {
    return Contact.update(json);
  } catch (err) {
    handleError(err);
    throw err;
  }
};

const delContact = async (json) => {
  try {
    return Contact.fromJSON(json).selfDelete();
  } catch (err) {
    handleError(err);
    throw err;
  }
};

const delMultiContacts = async (accId, arrOfContacts) => {
  try {
    const ids = Array.isArray(arrOfContacts) ? arrOfContacts.map((json) => json.id) : [];
    return Contact.delete(accId, ids);
  } catch (err) {
    handleError(err);
    throw err;
  }
};

const delAllContacts = async (accId, cbookId) => {
  try {
    return Contact.deleteAll(accId, cbookId);
  } catch (err) {
    handleError(err);
    throw err;
  }
};

// WORKING (client controller has been setup to test only this function)
const importingMode = {
  KEEP_ALL: 'keep all existing contacts, import new (non-duplicated) ones',
  REPLACE_ALL: 'replace all existing contacts by new ones',
  OVERWRITE: 'overwrite duplicated contacts, keep the rest, import as new',
};
// NOTE: special case: duplicated contacts (which have same id) appear in both database & imported data
const importContacts = async (json = [], accId, cbookId, mode = importingMode.KEEP_ALL) => {
  // 1. there is duplicated contacts appear in both imported list & current cbook
  // - (1) Overwrite duplicates, keep the rest, import the new ones
  // - (2) Keep all, import AS NEW (this is what importAsNew() does)
  // - (3) Replace all by the new ones (this is what replaceAllContacts() does)
  // 2. there is no duplicated contacts
  // - (2) Keep all, import AS NEW (this is what importAsNew() does)
  // - (3) Replace all by the new ones (this is what replaceAllContacts() does)
  // => 3 options (these options should be decided by user)

  const contacts = json
    .map((contact) => {
      // update obsoleted values in old data
      return {
        ...contact,
        accId,
        cbookId,
      };
    })
    .map((contact) => Contact.fromJSON(contact).toDB());
  try {
    switch (mode) {
      case importingMode.REPLACE_ALL: {
        // (3)
        const rows = await Contact.replace(contacts, accId, cbookId);
        return rows.map((rawData) => Contact.fromDB(rawData));
      }
      case importingMode.OVERWRITE: // (1)
        // this feature is not completed because it is implemented in a different way at client-side:
        // first, import all contacts as new
        // then, let users choose which contacts should be overwrite and which ones should be kept
        break;
      case importingMode.KEEP_ALL: // (2)
      default: {
        await Contact.import(contacts, accId, cbookId);
        const result = await getContactsOfCbook(accId, cbookId);
        return result.data;
      }
    }
  } catch (err) {
    handleError(err);
    throw err;
  }
};
importContacts.mode = importingMode;

const getContactsOfCbook = async (accId, cbookId) => {
  try {
    const rows = await db.data.getContactsOfCbook(cbookId, accId);
    return CList.fromDB(rows);
  } catch (err) {
    handleError(err);
    throw err;
  }
};

const loadAllData = async (accId) => {
  try {
    const rawData = await db.data.getAllData(accId);
    const cbooks = rawData.cbooks.map((cbook) => Cbook.fromDB(cbook));
    const user = User.fromDB(rawData.user);
    user.cbooks = cbooks;
    const contacts = new CList(rawData.contacts.map((contact) => Contact.fromDB(contact))); // convert to CList.fromDB(rawData.contacts)
    const data = {
      ...rawData,
      user,
      cbooks,
      contacts,
    };
    return data;
  } catch (err) {
    handleError(err);
    throw err;
  }
};

const createCbook = async (json) => {
  try {
    return Cbook.create(json);
  } catch (err) {
    handleError(err);
    throw err;
  }
};

const updateCbook = async (user, json) => {
  const accId = user.id;
  const cbookId = json.id;

  try {
    const isCbookBelongToUser = await checkUserOwnCbook(user, cbookId);
    if (isCbookBelongToUser) {
      return Cbook.update(accId, json);
    } else {
      throw new Error(`Contactbook ${cbookId} does not belong to user ${accId}`);
    }
  } catch (err) {
    handleError(err);
    throw err;
  }
};

// @condition: requesting user must:
// - have "updating" permission for this cbook
// - have another cbook as default cbook AND
const deleteCbook = async (user, json) => {
  const accId = user.id;
  const cbookId = json.id;

  try {
    const isDefaultCbook = await checkUserDefaultCbook(user, cbookId);
    if (isDefaultCbook) {
      throw new Error(`Cannot delete default cbook ${cbookId} of user ${accId}`);
    }

    const isCbookBelongToUser = await checkUserOwnCbook(user, cbookId);
    if (isCbookBelongToUser) {
      return Cbook.delete(accId, cbookId);
    } else {
      throw new Error(`Contactbook ${cbookId} does not belong to user ${accId}`);
    }
  } catch (err) {
    handleError(err);
    throw err;
  }
};

// @condition: the cbookId must belong to requesting user
const setDefaultCbook = async (user, cbookId) => {
  try {
    const isDefaultCbook = await checkUserDefaultCbook(user, cbookId);
    if (isDefaultCbook) return Promise.resolve();

    const isCbookBelongToUser = await checkUserOwnCbook(user, cbookId);
    if (isCbookBelongToUser) {
      return user.setDefaultCbook(cbookId);
    } else {
      throw new Error(`Cbook ${cbookId} does not belong to user ${user.id}`);
    }
  } catch (err) {
    handleError(err);
    throw err;
  }
};

class Controller {
  constructor() {
    this.dev = {
      isDev: process.env.NODE_ENV === 'development',
      debug,
    };
    this.secret = {
      cookie: fs.readFileSync('./bin/cookie-secret.key', { encoding: 'utf-8' }),
    };
    this.jwt = {
      ...jwt,
      sign: signJWT,
      verify: verifyJWT,
      cookieOption: {
        signed: true,
        secure: !(process.env.NODE_ENV === 'development'),
        path: '/',
        maxAge: ms('2d'),
        httpOnly: true,
      },
      cookieName: 'xsrf-jwt',
    };
    this.xsrf = {
      cookieOption: {
        ...this.jwt.cookieOption,
        secure: false,
        httpOnly: false, // allow JS at client to read this cookie
      },
    };
    this.cache = {
      static: {
        maxAge: ms('1y'), // time in milliseconds or valid string for `ms` package (express use `ms` internally)
      },
    };
    this.handleError = handleError;
    this.user = {
      signUp,
      signIn,
      findById,
      findByUname,
      findByEmail,
      loadAll: loadAllData,
      // activate: activateUser,
      // deactivate: deactivateUser,
    };
    this.check = {
      // pay attention using these methods: they are not error-handled because they are supposed to only be helpers for other methods here and other methods are handling errors properly
      checkUserDefaultCbook,
      checkCbookBelongToUser,
      checkUserOwnCbook,
      checkUserOwnContact,
    };
    this.cbook = {
      create: createCbook,
      setDefault: setDefaultCbook,
      update: updateCbook,
      delete: deleteCbook,
    };
    this.contact = {
      add: addContact,
      edit: editContact,
      del: delContact,
      delAll: delAllContacts,
      delMulti: delMultiContacts,
      import: importContacts,
      getContactsOfCbook: getContactsOfCbook,
    };
  }
}

// CONTROLLER
const adbk = new Controller();

module.exports = adbk;
