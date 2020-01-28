const { query } = require('./pool');
const { createCbook, addAccountCbookRelationship } = require('./data');
const passwdServ = require('../services/passwdServ');
const {
  random: { getStrongCryptoRandomStr, getRandomColor },
  dbUtils: { mapUserData },
} = require('../helpers/index');
const waterfall = require('async/waterfall');

function createUserMeta({ userId, cbookId }, cb) {
  const queryStr = `INSERT INTO meta (
      acc_id,
      last_activated_cbook_id,
      last_login,
      is_active
    ) VALUES (
      $1, $2, $3, $4
    ) RETURNING *;`;
  const queryPara = [userId, cbookId, null, true];

  if (typeof cb === 'function') {
    return query(queryStr, queryPara, (err, res) => {
      cb(err, res);
    });
  }
  return query(queryStr, queryPara)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
}

function createNewAcc(userData, cb) {
  passwdServ.getHash(userData.passwd + userData.salt, (hashedPasswd) => {
    const queryStr = `INSERT INTO account (
      username,
      password,
      facebook_id,
      birth,
      email,
      phone,
      nicename,
      created_on,
      salt
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING *;`;
    const queryPara = [
      userData.uname,
      hashedPasswd,
      userData.fbid ? userData.fbid : undefined,
      userData.birth ? userData.birth : undefined,
      userData.email ? userData.email : undefined,
      userData.phone ? userData.phone : undefined,
      userData.nicename ? userData.nicename : undefined,
      new Date(),
      userData.salt,
    ];
    // return query(queryStr, queryPara);
    query(queryStr, queryPara, (err, res) => {
      cb(err, res.rows[0]);
    });
  });
}

function regAcc(userData, callback) {
  waterfall(
    [
      (cb) => {
        createNewAcc(userData, (err, rawData) => {
          cb(err, mapUserData(rawData));
        });
      },
      (user, cb) => {
        createCbook(
          {
            name: 'Your Contacts Book',
            color: getRandomColor(),
            accId: user.id,
          },
          (err, cbook) => {
            cb(err, {
              user,
              cbook,
            });
          }
        );
      },
      (data, cb) => {
        createUserMeta(
          {
            userId: data.user.id,
            cbookId: data.cbook.id,
          },
          (err) => {
            cb(err, {
              ...data,
              user: {
                ...data.user,
                meta: {
                  lastActivatedCbookId: data.cbook.id,
                  lastLogin: null,
                  is_active: true,
                },
              },
            });
          }
        );
      },
      // (data, cb) => {
      //   addAccountCbookRelationship(data.user.id, data.cbook.id, (err, uselessData) => {
      //     cb(err, data);
      //   });
      // },
    ],
    (err, data) => {
      callback(err, data.user);
    }
  );
}

function changeUname(id, newUname, cb) {
  query('UPDATE account SET username = $1 WHERE id = $2 RETURNING *', [newUname, id], (err, res) => {
    if (err) console.error(err);
    cb(mapUserData(res.rows[0]));
  });
}

function changePasswd(id, newPasswd, salt, cb) {
  passwdServ.getHash(newPasswd + salt, (hashedPasswd) => {
    query(
      'UPDATE account SET password = $1, salt = $2 WHERE id = $3 RETURNING *',
      [hashedPasswd, salt, id],
      (err, res) => {
        cb(err, mapUserData(res.rows[0]));
      }
    );
  });
}

function findById(id, cb) {
  query('SELECT * FROM account WHERE id = $1', [id], (err, res) => {
    if (err) {
      // please do something on UI to let user know about
      // this f*cking error while querrying database
      return cb(err);
    }
    if (!res.rows[0]) {
      return cb(new Error(`User ID ${id} is not found!`));
    }
    return cb(null, mapUserData(res.rows[0]));
  });
}

function findByUname(uname, cb) {
  const queryStr = 'SELECT * FROM account WHERE username = $1;';
  const queryPara = [uname];
  if (cb) {
    return query(queryStr, queryPara, (err, res) => {
      if (err) {
        // please do something on UI to let user know about
        // this f*cking error while querrying database
        return cb(err);
      }
      if (res.rows.length === 0) {
        return cb(null, false);
      }
      return cb(null, res.rows.length > 0 ? mapUserData(res.rows[0]) : false);
    });
  } else {
    return query(queryStr, queryPara).then((res) => {
      return res.rows.length > 0 ? mapUserData(res.rows[0]) : false;
    });
  }
}

function findByEmail(email, cb) {
  const queryStr = 'SELECT * FROM account WHERE email = $1;';
  const queryPara = [email];
  if (cb) {
    return query(queryStr, queryPara, (err, res) => {
      if (err) {
        // please do something on UI to let user know about
        // this f*cking error while querrying database
        return cb(err);
      }
      if (res.rows.length === 0) {
        return cb(null, false);
      }
      return cb(null, res.rows.length > 0 ? mapUserData(res.rows[0]) : false);
    });
  } else {
    return query(queryStr, queryPara).then((res) => {
      return res.rows.length > 0 ? mapUserData(res.rows[0]) : false;
    });
  }
}

module.exports = {
  regAcc,
  findById,
  findByUname,
  findByEmail,
  changeUname,
  changePasswd,
};
