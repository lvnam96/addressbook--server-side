const { query, pDB } = require('./pool');
const {
  dbUtils: { mapCbookData },
} = require('../helpers/index');

// must support callback version
const createCbook = async ({ name, color, accId }, cb) => {
  const queryStr = 'INSERT INTO contactsbook (name, color, acc_id) VALUES ($1, $2, $3) RETURNING *';
  const queryParams = [name, color, accId];
  let cbook;

  try {
    await pDB.tx('transaction-create-contactbook', async (t) => {
      // t.ctx = transaction context object
      cbook = await t.one(queryStr, queryParams);
      return t.batch([
        t.none('INSERT INTO account_contactsbook (acc_id, cbook_id) VALUES ($1, $2)', [accId, cbook.id]),
      ]);
    });
    // eslint-disable-next-line promise/no-callback-in-promise
    if (cb) return cb(null, cbook);
    return cbook;
  } catch (err) {
    // eslint-disable-next-line promise/no-callback-in-promise
    if (cb) cb(err);
    throw err;
  }
};

const getCbook = async (cbookId) => {
  const queryStr = 'SELECT * FROM contactsbook WHERE id = $1';
  const queryParams = [cbookId];
  const { rows } = await query(queryStr, queryParams);
  if (rows.length === 1) return mapCbookData(rows[0]);
  else throw new Error('There is error while getting contactsbook');
};

const updateCbook = async (accId, { id, name, color }) => {
  const queryStr = 'UPDATE contactsbook SET name = $3, color = $4 WHERE id = $1 AND acc_id = $2 RETURNING *';
  const queryParams = [id, accId, name, color];
  const { rows } = await query(queryStr, queryParams);
  if (rows.length === 1) return mapCbookData(rows[0]);
  else throw new Error('There is error while updating contactsbook');
};

const deleteCbook = async (accId, cbookId) => {
  const queryStr = 'DELETE FROM contactsbook WHERE acc_id = $1 AND id = $2 RETURNING *';
  const queryParams = [accId, cbookId];
  const { rows } = await query(queryStr, queryParams);
  if (rows.length === 1) return mapCbookData(rows[0]);
  else throw new Error('There is error while deleting contactsbook');
};

module.exports = {
  createCbook,
  getCbook,
  updateCbook,
  deleteCbook,
};
