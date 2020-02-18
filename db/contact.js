const { pool, query, getClient, pDB } = require('./pool');
const { getQueryStrToImportContacts, whereClauseMatchAccAndAdrsbook } = require('./queryStringCreator');
const {
  dbUtils: { formatIdsList, mapContactData },
} = require('../helpers/index');
const pgpQueryFormat = pDB.$config.pgp.as.format;

// helpers:
const handleSingleContactData = ({ rows }) => {
  return mapContactData(rows[0]);
};
const handleMultiContactsData = ({ rows }) => {
  return rows.map((contact) => mapContactData(contact));
};

const getContactsOfCbook = async (cbookId, accId) => {
  // this query use accId to check on table "account_contactsbook", not the column "acc_id" in table "contact"
  // => so it's prepared for new feature: cbooks/contacts sharing
  const queryStr = `SELECT c.* FROM account_contactsbook AS acb
    RIGHT JOIN contact AS c ON c.cbook_id = acb.cbook_id
    WHERE acb.cbook_id = $1${accId ? ' AND acb.acc_id = $2' : ''}`;
  const queryParams = [cbookId];
  if (accId) queryParams.push(accId);
  const res = await query(queryStr, queryParams);
  return handleMultiContactsData(res);
};

const addContact = async (contact) => {
  const { cbookId, accId, birth, email, phone, note, name, color, website, labels, avatarURL } = contact;
  const queryStr =
    'INSERT INTO contact (cbook_id, acc_id, birth, email, phone, note, name, color, website, labels, avatar_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *';
  const queryParams = [cbookId, accId, birth, email, phone, note, name, color, website, labels, avatarURL];

  const res = await query(queryStr, queryParams);
  return handleSingleContactData(res);
};

const editContact = async ({ id, birth, email, phone, note, name, color, website, labels, avatarURL }) => {
  const queryStr = `UPDATE contact SET
    birth = $2,
    email = $3,
    phone = $4,
    note = $5,
    name = $6,
    color = $7,
    website = $8,
    labels = $9,
    avatar_url = $10
    WHERE id = $1 RETURNING *`;
  const queryParams = [id, birth, email, phone, note, name, color, website, labels, avatarURL];
  const res = await query(queryStr, queryParams);
  return handleSingleContactData(res);
};

const removeContact = async (contact) => {
  // accId: string
  // id: string
  // cbookId: string
  const queryStr = 'DELETE FROM contact WHERE acc_id = $1 AND id = $2 AND cbook_id = $3 RETURNING *';
  const queryParams = [contact.accId, contact.id, contact.cbookId];
  const res = await query(queryStr, queryParams);
  return handleSingleContactData(res);
};

const removeMultiContacts = async (accId, contactIds) => {
  // accId: string
  // contactIds: array of strings
  const idsStr = formatIdsList(contactIds, true);
  const queryStr = 'DELETE FROM contact WHERE acc_id = $1 AND id IN ($2:raw) RETURNING *';
  const queryParams = [accId, idsStr];
  const formattedQueryStr = pgpQueryFormat(queryStr, queryParams);
  const rows = await pDB.any(formattedQueryStr);
  return handleMultiContactsData({ rows });
};

const removeAllContacts = async (accId, cbookId) => {
  // accId: string
  // cbookId: string
  const queryStr = 'DELETE FROM contact $1:raw RETURNING *';
  const whereClause = whereClauseMatchAccAndAdrsbook(accId, cbookId);
  const queryParams = [whereClause];
  const formattedQueryStr = pgpQueryFormat(queryStr, queryParams);
  const res = await query(formattedQueryStr);
  return handleMultiContactsData(res);
};

const importAsNew = async (contacts = [], accId, cbookId) => {
  const importQueryStr = `${getQueryStrToImportContacts(contacts)} RETURNING *`;
  const res = await query(importQueryStr);
  return handleMultiContactsData(res);
};

const replaceAllContacts = (contacts = [], accId, cbookId) => {
  return pDB.tx('replace-all-contacts', async (t) => {
    const deletedContacts = await t.any('DELETE FROM contact WHERE acc_id = $1 AND cbook_id = $2 RETURNING *', [
      accId,
      cbookId,
    ]);
    const importQueryStr = `${getQueryStrToImportContacts(contacts)} RETURNING *`;
    const rows = await t.any(importQueryStr);
    return handleMultiContactsData({ rows });
  });
};

// this feature is not completed because it is implemented in a different way at client-side
// see importContacts() in CONTROLLER to understand why
const importAndOverwrite = async (contacts = [], accId, cbookId) => {
  return pDB.tx('import-and-overwrite-duplicated-contacts', async (t) => {
    // 1. get duplicated contacts
    const contactsExistingInCbook = (await getContactsOfCbook(accId, cbookId)).data;
    const duplicatedContacts =
      Array.isArray(contactsExistingInCbook) &&
      contactsExistingInCbook.length &&
      contactsExistingInCbook.filter((contact) => {
        return contacts.findIndex((importedContact) => importedContact.name === contact.name) >= 0;
      }) >= 0;
    const hasDuplicatedContacts = duplicatedContacts.length > 0;
    if (hasDuplicatedContacts) {
      // update the duplicated contacts first
    }
    // then import the rest
  });
};

module.exports = {
  getContactsOfCbook,
  addContact,
  editContact,
  removeContact,
  removeMultiContacts,
  removeAllContacts,
  importAsNew,
  replaceAllContacts,
};
