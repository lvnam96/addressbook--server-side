const { pool, query, getClient, pDB } = require('./pool');
const { getQueryStrToImportContacts, whereClauseMatchAccAndAdrsbook } = require('./queryStringCreator');
const queryStringCreator = require('./queryStringCreator');
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
  // contact: shape of {
  //     accId: string
  //     id: string
  //     cbookId: string
  // }
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

// BUG: these too queries should cover this special case: duplicated contacts appear in both database & imported data => 2 resolving way:
// - remove old ones, then import new ones (replaceAllContacts)
// - import & modify duplicated ones (importContacts)

const importContacts = async (contacts) => {
  const queryStr = getQueryStrToImportContacts(contacts);
  const res = await query(queryStr);
  return handleMultiContactsData(res);
  // getClient((err, client, done) => {
  //     const shouldAbort = (err) => {
  //         if (err) {
  //             console.error('Error in transaction', err.stack);
  //             client.query('ROLLBACK', (err) => {
  //                 if (err) {
  //                     console.error('Error rolling back client', err.stack);
  //                 }
  //                 // release the client back to the pool
  //                 done();
  //             });
  //         }
  //         return !!err;
  //     }
  //
  //     // const contactsbookIds = [];
  //     // const accountIds = [];
  //     // const births = [];
  //     // const emails = [];
  //     // const phones = [];
  //     // const notes = [];
  //     // const names = [];
  //     // const colors = [];
  //     // const avtURLs = [];
  //     for (let contact of data) {
  //         contactsbookIds.push(contact.cbookId);
  //         accountIds.push(contact.id);
  //         births.push(contact.birth);
  //         emails.push(contact.email);
  //         phones.push(contact.phone);
  //         notes.push(contact.note);
  //         names.push(contact.name);
  //         colors.push(contact.color);
  //         avtURLs.push(contact.avtURL);
  //     }
  //     let query = 'INSERT INTO contact (cbook_id, acc_id, birth, email, phone, note, name, color, avatar_url) SELECT * FROM UNNEST ($1::uuid[], $2::uuid[], $3::date[], $4::text[], $5::text[], $6::text[], $7::text[], $8::text[], $9::text[])';
  //     const params = [
  //         contactsbookIds,
  //         accountIds,
  //         births,
  //         emails,
  //         phones,
  //         notes,
  //         names,
  //         colors,
  //         avtURLs
  //     ];
  //
  //     // or use this approach: https://stackoverflow.com/questions/34990186/how-do-i-properly-insert-multiple-rows-into-pg-with-node-postgres
  //
  //     client.query('BEGIN', (err, res) => {
  //         if (shouldAbort(err)) return;
  //         // const promises = [];
  //         // for (contact of data) {
  //         //     const p = client.query('INSERT INTO contact...');
  //         //     promises.push(p);
  //         // }
  //         // Promise.all(promises, () => {
  //         //
  //         // });
  //         client.query(query, params, (err, res) => {
  //             if (shouldAbort(err)) return;
  //
  //         });
  //     });
  // });
};

// BUG: if there is at least 1 contact in db is also in the restored data, this query will be broken
// error: constraint 'contact pkey' is violented
const replaceAllContacts = (contacts, accId, cbookId) => {
  return pDB.tx('replace-all-contacts', async (t) => {
    const deletedContacts = await t.any('DELETE FROM contact WHERE acc_id = $1 AND cbook_id = $2 RETURNING *', [
      accId,
      cbookId,
    ]);
    const importQueryStr = `${queryStringCreator.getQueryStrToImportContacts(contacts)} RETURNING *`;
    const rows = await t.any(importQueryStr);
    return rows;
  });
};

module.exports = {
  getContactsOfCbook,
  addContact,
  editContact,
  removeContact,
  removeMultiContacts,
  removeAllContacts,
  importContacts,
  replaceAllContacts,
};
