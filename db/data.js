const { query, pDB } = require('./pool');
const queryStringCreator = require('./queryStringCreator');
const {
  dbUtils: { mapUserData, formatIdsList },
} = require('../helpers/index');
const waterfall = require('async/waterfall');
const _isEmpty = require('lodash/isEmpty');
const pgpQueryFormat = pDB.$config.pgp.as.format;

const getContactsOfCbook = (accId, cbookId) => {
  return query(
    `SELECT c.* FROM account_contactsbook AS acb
        RIGHT JOIN contact AS c
            ON c.cbook_id = acb.cbook_id
        WHERE acb.acc_id = $1 AND acb.cbook_id = $2`,
    [accId, cbookId]
  );
};

const getAllData = (accId, cb) => {
  // output: data: { plain props as DB column names
  // user: {id, username, password, facebook_id, birth, email, phone, nicename, created_on, salt, meta: {acc_id, last_activated_cbook_id, last_login, is_active}},
  // cbookIds: [id, id,...]
  // cbooks: [{}]
  // contacts: [{id, cbook_id, acc_id, birth, email, phone, note, name, color, website, labels, avatar_url}]
  // }
  if (cb) {
    return waterfall([getUserInfo, getCbookIds, getCbooks, getContacts], cb);
  } else {
    return new Promise((resolve, reject) => {
      waterfall([getUserInfo, getCbookIds, getCbooks, getContacts], (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  function getUserInfo (cb) {
    return query(queryStringCreator.getUserInfo(accId))
      .then((res) => {
        const newData = {
          user: mapUserData(res.rows[0]),
          // user: res.rows[0],
        };
        cb(null, newData);
        return newData;
      })
      .catch((err) => {
        throw err;
      });
  }

  function getCbookIds (data, cb) {
    return query('SELECT * FROM account_contactsbook WHERE acc_id = $1', [accId])
      .then((res) => {
        const newData = {
          ...data,
          cbookIds: res.rows.map((accCbookRela) => accCbookRela.cbook_id),
        };
        cb(null, newData);
        return newData;
      })
      .catch((err) => {
        throw err;
      });
  }

  function getCbooks (data, cb) {
    const formattedCbookIdsStr = pgpQueryFormat('SELECT * FROM contactsbook WHERE id IN ($1:raw)', [
      formatIdsList(data.cbookIds, true),
    ]);
    return query(formattedCbookIdsStr)
      .then((res) => {
        const newData = {
          ...data,
          cbooks: res.rows,
        };
        cb(null, newData);
        return newData;
      })
      .catch((err) => {
        throw err;
      });
  }

  function getContacts (data, cb) {
    // const asyncGetContactsInCbook = (accId, cbookId) => {
    //   return query(
    //     `SELECT *
    //     FROM contact
    //     WHERE acc_id = $1 AND cbook_id = $2`,
    //     [accId, cbookId]
    //   )
    //     .then((res) => res.rows)
    //     .catch((err) => {
    //       throw err;
    //     });
    // };
    return query(
      `SELECT *
        FROM contact
        WHERE acc_id = $1 AND cbook_id = $2`,
      [data.user.id, data.user.meta.lastActivatedCbookId]
    ).then((res) => {
      const newData = {
        ...data,
        contacts: res.rows,
      };
      cb(null, newData);
      return newData;
    });
  }
};

const createCbook = ({ name, color, accId }, cb) => {
  const queryStr = 'INSERT INTO contactsbook (name, color, acc_id) VALUES ($1, $2, $3) RETURNING *';
  const queryParams = [name, color, accId];
  let cbook;

  return pDB
    .tx('transaction-create-contactbook', async (t) => {
      // t.ctx = transaction context object

      cbook = await t.one(queryStr, queryParams);
      return t.batch([
        t.none('INSERT INTO account_contactsbook (acc_id, cbook_id) VALUES ($1, $2)', [accId, cbook.id]),
      ]);
    })
    .then((res) => {
      // res = as returned from the transaction's callback
      if (cb) return cb(null, cbook);
      return cbook;
    })
    .catch((err) => {
      if (cb) cb(err);
      throw err;
    });
};

const addAccountCbookRelationship = (accId, cbookId, cb) => {
  const queryStr = 'INSERT INTO account_contactsbook (acc_id, cbook_id) VALUES ($1, $2) RETURNING *';
  const queryParams = [accId, cbookId];
  if (typeof cb === 'function') {
    return query(queryStr, queryParams, (err, res) => cb(err, res.rows[0]));
  }
  return query(queryStr, queryParams)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      throw err;
    });
};

const checkCbookBelongToUser = (accId, cbookId) => {
  const queryStr = 'SELECT * FROM account_contactsbook WHERE acc_id = $1 AND cbook_id = $2';
  const queryParams = [accId, cbookId];
  return query(queryStr, queryParams)
    .then((res) => !_isEmpty(res.rows[0]))
    .catch((err) => {
      throw err;
    });
};

const getUserMeta = (accId) => {
  const queryStr = 'SELECT * FROM meta WHERE acc_id = $1';
  const queryParams = [accId];
  return query(queryStr, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      throw err;
    });
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

const updateDefaultCbook = (accId, cbookId) => {
  const queryStr = 'UPDATE meta SET last_activated_cbook_id = $2 WHERE acc_id = $1';
  const queryParams = [accId, cbookId];
  return query(queryStr, queryParams);
};

const updateCbook = (accId, { id, name, color }) => {
  const queryStr = 'UPDATE contactsbook SET name = $3, color = $4 WHERE id = $1 AND acc_id = $2 RETURNING *';
  const queryParams = [id, accId, name, color];
  return query(queryStr, queryParams)
    .then((res) => {
      if (res.rows.length === 1) return res.rows[0];
      else throw new Error('There is error while updating contactsbook');
    })
    .catch((err) => {
      throw err;
    });
};

const deleteCbook = (accId, cbookId) => {
  const queryStr = 'DELETE FROM contactsbook WHERE acc_id = $1 AND id = $2 RETURNING *';
  const queryParams = [accId, cbookId];
  return query(queryStr, queryParams)
    .then((res) => {
      if (res.rows.length === 1) return res.rows[0];
      else throw new Error('There is error while deleting contactsbook');
    })
    .catch((err) => {
      throw err;
    });
};

const addContact = (contact) => {
  const { cbookId, accId, birth, email, phone, note, name, color, website, labels, avatarURL } = contact;
  const queryStr =
    'INSERT INTO contact (cbook_id, acc_id, birth, email, phone, note, name, color, website, labels, avatar_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *';
  const queryParams = [cbookId, accId, birth, email, phone, note, name, color, website, labels, avatarURL];

  return query(queryStr, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

const editContact = ({ id, birth, email, phone, note, name, color, website, labels, avatarURL }) => {
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
  return query(queryStr, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

const removeContact = (contact) => {
  // contact: shape of {
  //     accId: string
  //     id: string
  //     cbookId: string
  // }
  const queryStr = 'DELETE FROM contact WHERE acc_id = $1 AND id = $2 AND cbook_id = $3 RETURNING *';
  const queryParams = [contact.accId, contact.id, contact.cbookId];
  return query(queryStr, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

const removeMultiContacts = (accId, contactIds) => {
  // accId: string
  // contactIds: array of strings
  const idsStr = formatIdsList(contactIds, true);
  const queryStr = 'DELETE FROM contact WHERE acc_id = $1 AND id IN ($2:raw) RETURNING *';
  const queryParams = [accId, idsStr];
  const formattedQueryStr = pgpQueryFormat(queryStr, queryParams);
  return pDB
    .any(formattedQueryStr)
    .then((rows) => {
      return rows;
    })
    .catch((err) => {
      throw err;
    });
};

const removeAllContacts = (accId, cbookId) => {
  // accId: string
  // cbookId: string
  const queryStr = 'DELETE FROM contact $1:raw RETURNING *';
  const whereClause = queryStringCreator.whereClauseMatchAccAndAdrsbook(accId, cbookId);
  const queryParams = [whereClause];
  const formattedQueryStr = pgpQueryFormat(queryStr, queryParams);
  return query(formattedQueryStr)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      throw err;
    });
};

// BUG: these too queries should cover this special case: duplicated contacts appear in both database & imported data => 2 resolving way:
// - remove old ones, then import new ones (replaceAllContacts)
// - import & modify duplicated ones (importContacts)

const importContacts = (contacts) => {
  const queryStr = queryStringCreator.getQueryStrToImportContacts(contacts);
  return query(queryStr)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      throw err;
    });
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
  return pDB.tx('replace-all-contacts', (t) => {
    return t
      .any('DELETE FROM contact WHERE acc_id = $1 AND cbook_id = $2 RETURNING *', [accId, cbookId])
      .then((deletedContacts) => {
        const importQueryStr = queryStringCreator.getQueryStrToImportContacts(contacts) + 'RETURNING *';
        return t
          .any(importQueryStr)
          .then((rows) => rows)
          .catch((err) => {
            throw err;
          });
      });
  });
};

module.exports = {
  getContactsOfCbook,
  getAllData,
  createCbook,
  updateCbook,
  deleteCbook,
  addAccountCbookRelationship,
  checkCbookBelongToUser,
  getUserMeta,
  updateDefaultCbook,
  addContact,
  editContact,
  removeContact,
  removeMultiContacts,
  removeAllContacts,
  importContacts,
  replaceAllContacts,
};
