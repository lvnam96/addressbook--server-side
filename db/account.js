const { query } = require('./pool');
const { createCbook } = require('./cbook');
const {
  random: { getRandomColor },
  dbUtils: { mapUserData },
} = require('../helpers/index');
const waterfall = require('async/waterfall');

function regAcc(userData, callback) {
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
      userData.passwd,
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
  }

  // convert this to SQL transaction so it can rollback when an error occurs
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
                  isActive: true,
                },
              },
            });
          }
        );
      },
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

function changePasswd(id, newPasswd, salt) {
  const queryStr = 'UPDATE account SET password = $1, salt = $2 WHERE id = $3 RETURNING *';
  const queryPara = [newPasswd, salt, id];
  return query(queryStr, queryPara).then(({ rows }) => {
    return mapUserData(rows[0]);
  });
}

function findBy(type = 'id', val) {
  let queryStr;
  const queryPara = [val];
  switch (type) {
    case 'id':
      queryStr = 'SELECT * FROM account WHERE id = $1';
      break;
    case 'uname':
      queryStr = 'SELECT * FROM account WHERE username = $1;';
      break;
    case 'email':
      queryStr = 'SELECT * FROM account WHERE email = $1;';
      break;
    default:
      throw new Error('"type" agrument is not valid!');
  }
  return query(queryStr, queryPara).then(({ rows }) => {
    return rows.length > 0 ? mapUserData(rows[0]) : false;
  });
}

module.exports = {
  regAcc,
  findBy,
  changeUname,
  changePasswd,
};
