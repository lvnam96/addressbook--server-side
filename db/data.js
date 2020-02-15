const { query, pDB } = require('./pool');
const queryStringCreator = require('./queryStringCreator');
const {
  dbUtils: { mapUserData, mapCbookData, mapContactData, mapUserMetaData, mapUserCbookRela },
} = require('../helpers/index');
const cbookQueries = require('./cbook');
const contactQueries = require('./contact');
const accountQueries = require('./account');

// NOTE: Here we don't handle errors but throw it, consumers (CONTROLLER) will handle them

const getUser = async (accId) => {
  const { rows } = await query(queryStringCreator.getUserInfo(accId));
  return mapUserData(rows[0]);
};

const getCbookIds = async (accId) => {
  const res = await query('SELECT * FROM account_contactsbook WHERE acc_id = $1', [accId]);
  return res.rows.map((accCbookRela) => accCbookRela.cbook_id);
};

const getCbooks = async (cbookIds) => {
  const formattedCbookIdsStr = queryStringCreator.getCbooksFromIdList(cbookIds);
  const res = await query(formattedCbookIdsStr);
  return res.rows.map((cbook) => mapCbookData(cbook));
};

// const getContacts = async (cbookId) => {
//   const res = await query(
//     `SELECT *
//         FROM contact
//         WHERE cbook_id = $1`,
//     [cbookId]
//   );
//   return res.rows.map((contact) => mapContactData(contact));
// };

const getAllData = async (accId) => {
  // output: data: { plain props as DB column names
  // user: {id, username, password, facebook_id, birth, email, phone, nicename, created_on, salt, meta: {acc_id, last_activated_cbook_id, last_login, is_active}},
  // cbookIds: [id, id,...]
  // cbooks: [{}]
  // contacts: [{id, cbook_id, acc_id, birth, email, phone, note, name, color, website, labels, avatar_url}]
  // }

  const data = {};
  data.user = await getUser(accId);
  data.cbookIds = await getCbookIds(data.user.id);
  data.cbooks = await getCbooks(data.cbookIds);
  const defaultCbookId = data.user.meta.lastActivatedCbookId;
  if (data.cbookIds.includes(defaultCbookId)) {
    // data.contacts = await getContacts(defaultCbookId);
    data.contacts = await contactQueries.getContactsOfCbook(defaultCbookId);
  } else throw new Error('This default cbook does not belong to user. WTF?!');

  return data;
};

const addAccountCbookRelationship = async (accId, cbookId) => {
  const queryStr = 'INSERT INTO account_contactsbook (acc_id, cbook_id) VALUES ($1, $2) RETURNING *'; // note: createCbook() also implementing this query
  const queryParams = [accId, cbookId];
  const { rows } = await query(queryStr, queryParams);
  if (rows.length === 1) return mapUserCbookRela(rows[0]);
};

const getUserCbookRelationship = async (accId, cbookId) => {
  const queryStr = 'SELECT * FROM account_contactsbook WHERE acc_id = $1 AND cbook_id = $2';
  const queryParams = [accId, cbookId];
  const { rows } = await query(queryStr, queryParams);
  if (rows.length === 1) return mapUserCbookRela(rows[0]);
};

const getUserMeta = async (accId) => {
  const queryStr = 'SELECT * FROM meta WHERE acc_id = $1';
  const queryParams = [accId];
  const { rows } = await query(queryStr, queryParams);
  if (rows.length === 1) return mapUserMetaData(rows[0]);
  else throw new Error('This user does not have metadata. WTF?!');
};

// const isDefaultCbook = (accId, cbookId) => {
//   const queryStr = 'SELECT * FROM meta WHERE acc_id = $1';
//   const queryParams = [accId];
//   return query(queryStr, queryParams)
//     .then((res) => {
//       return res.rows[0].last_activated_cbook_id === cbookId;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

const updateDefaultCbook = async (accId, cbookId) => {
  const queryStr = 'UPDATE meta SET last_activated_cbook_id = $2 WHERE acc_id = $1';
  const queryParams = [accId, cbookId];
  return query(queryStr, queryParams);
};

module.exports = {
  getAllData,
  addAccountCbookRelationship,
  getUserCbookRelationship,
  getUserMeta,
  updateDefaultCbook,
  ...accountQueries,
  ...cbookQueries,
  ...contactQueries,
};
