const { pool, query, getClient, pDB, pgpHelpers } = require('./pool');
const { getQueryStrToImportContacts, whereClauseMatchAccAndAdrsbook } = require('./queryStringCreator');
const { dbUtils: { mapUserData } } = require('../helpers/index');
const waterfall = require('async/waterfall');
const Contact = require('../classes/Contact');

// IMPORTANT: getAllContacts functions are not finished yet!

// NOT FINISHED
const getAllContacts = (userId, cb) => {
    return query(`SELECT
        c.id,
        c.addressbook_id AS adrsbookId,
        c.account_id AS accountId,
        c.birth,
        c.email,
        c.phone,
        c.note,
        c.name,
        c.color,
        c.labels,
        c.avatar_url
        FROM account AS a
        LEFT JOIN account_addressbook AS aab
            ON a.id = aab.account_id
        LEFT JOIN contact AS c
            ON aab.addressbook_id = c.addressbook_id AND a.id = c.account_id
        WHERE a.id = $1`,
        [userId], cb
    );
};

const asyncGetContactsInAdrsbook = (accountId, adrsbookId) => {
    return query(`SELECT *
        FROM contact
        WHERE account_id = $1 AND addressbook_id = $2`,
        [accountId, adrsbookId]
    ).then(res => {
        return res.rows;
    }).catch(err => console.error(err));
};

const getAllData = (userId, cb) => {
    if (cb) {
        return waterfall([
            getUserInfo,
            getAdrsbooks,
            getAdrsbook,
            getContacts
        ], cb);
    } else {
        return new Promise((resolve, reject) => {
            waterfall([
                getUserInfo,
                getAdrsbooks,
                getAdrsbook,
                getContacts
            ], (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        // OR use this promise version
    }

    function getUserInfo (cb) {
        return query('SELECT * FROM account WHERE id = $1', [userId])
            .then(res => {
                cb(null, {
                    user: mapUserData(res.rows[0])
                });
            })
            .catch(err => console.error(err));
    }

    function getAdrsbooks (data, cb) {
        return query('SELECT * FROM account_addressbook WHERE account_id = $1', [userId])
            .then(res => {
                cb(null, {
                    ...data,
                    adrsbookId: res.rows[0].addressbook_id// for now each user has only 1 adrsbook
                });
            })
            .catch(err => console.error(err));
    }

    function getAdrsbook (data, cb) {
        return query('SELECT * FROM addressbook WHERE id = $1', [data.adrsbookId])
            .then(res => {
                cb(null, {
                    ...data,
                    adrsbook: res.rows[0]// for now each user has only 1 adrsbook
                });
            })
            .catch(err => console.error(err));
    }

    function getContacts (data, cb) {
        return asyncGetContactsInAdrsbook(data.user.id, data.adrsbook.id).then(contacts => {
            cb(null, {
                ...data,
                contacts
            });
        });
    }
};

const addAdrsbook = (adrsbook, cb) => {
    return query(`INSERT
        INTO addressbook (name, color)
        VALUES ($1, $2) RETURNING *`, [
        adrsbook.name,
        adrsbook.color
    ], cb);
};

const addAccountAdrsbookRelationship = (userId, adrsbookId, cb) => {
    return query('INSERT INTO account_addressbook (account_id, addressbook_id) VALUES ($1, $2) RETURNING *', [
        userId,
        adrsbookId
    ], cb);
};

const addContact = (contact, cb) => {
    const { birth, adrsbookId, accountId, email, phone, note, name, color, labels, website, avatarURL } = contact;

    return query('INSERT INTO contact (addressbook_id, account_id, birth, email, phone, note, name, color, website, labels, avatar_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [
        adrsbookId,
        accountId,
        birth,
        email,
        phone,
        note,
        name,
        color,
        website,
        labels,
        avatarURL
    ], cb);
};

const editContact = (contact, cb) => {
    const { id, birth, email, phone, note, name, color, website, labels, avatarURL } = contact;
    return query(`UPDATE contact SET
        birth = $2,
        email = $3,
        phone = $4,
        note = $5,
        name = $6,
        color = $7,
        website = $8,
        labels = $9,
        avatar_url = $10
        WHERE id = $1 RETURNING *`, [
            id, birth, email, phone, note, name, color, website, labels, avatarURL
        ], cb);
};

const removeContact = (contact, cb) => {
    // contact: shape of {
    //     accountId: string
    //     id: string
    //     adrsbookId: string
    // }
    return query('DELETE FROM contact WHERE account_id = $1 AND id = $2 AND addressbook_id = $3 RETURNING *', [
        contact.accountId,
        contact.id,
        contact.adrsbookId
    ], cb);
};

const removeMultiContacts = (accountId, adrsbookId, contactIds, cb) => {
    // accountId: string
    // adrsbookId: string
    // contactIds: array of strings
    const formatIdsList = ids => ids.map(id => "'" + id + "'"),
        idsStr = formatIdsList(contactIds).join(','),
        whereClause = whereClauseMatchAccAndAdrsbook(accountId, adrsbookId);
    return pDB.any('DELETE FROM contact $1:raw AND id IN ($2:raw) RETURNING *', [whereClause, idsStr], cb);
};

const removeAllContacts = (accountId, adrsbookId, cb) => {
    // accountId: string
    // adrsbookId: string
    return query('DELETE FROM contact WHERE account_id = $1 AND addressbook_id = $2 RETURNING *', [accountId, adrsbookId], cb);
};

// BUG: should cover special case: duplicated contacts appear in both database & imported data
const importContacts = (contacts) => {
    const queryStr =  getQueryStrToImportContacts(contacts);
    return query(queryStr);
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
    //     // const addressbookIds = [];
    //     // const accountIds = [];
    //     // const births = [];
    //     // const emails = [];
    //     // const phones = [];
    //     // const notes = [];
    //     // const names = [];
    //     // const colors = [];
    //     // const avtURLs = [];
    //     for (let contact of data) {
    //         addressbookIds.push(contact.adrsbookId);
    //         accountIds.push(contact.id);
    //         births.push(contact.birth);
    //         emails.push(contact.email);
    //         phones.push(contact.phone);
    //         notes.push(contact.note);
    //         names.push(contact.name);
    //         colors.push(contact.color);
    //         avtURLs.push(contact.avtURL);
    //     }
    //     let query = 'INSERT INTO contact (addressbook_id, account_id, birth, email, phone, note, name, color, avatar_url) SELECT * FROM UNNEST ($1::uuid[], $2::uuid[], $3::date[], $4::text[], $5::text[], $6::text[], $7::text[], $8::text[], $9::text[])';
    //     const params = [
    //         addressbookIds,
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
const replaceAllContacts = (contacts, accountId, adrsbookId) => {
    return pDB.tx('replace-all-contacts', t => {
        return t.any('DELETE FROM contact WHERE account_id = $1 AND addressbook_id = $2 RETURNING *', [accountId, adrsbookId]).then(deletedContacts => {
            const importQueryStr = getQueryStrToImportContacts(contacts);
            return t.any(importQueryStr);
        });
    })
};

module.exports = {
    getAllContacts,
    getAllData,
    addAdrsbook,
    addAccountAdrsbookRelationship,
    addContact,
    editContact,
    removeContact,
    removeMultiContacts,
    removeAllContacts,
    importContacts,
    replaceAllContacts,
};
