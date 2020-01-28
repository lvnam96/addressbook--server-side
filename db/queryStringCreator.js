const { pDB } = require('./pool');
// const {
//   dbUtils: { mapUserData },
// } = require('../helpers/index');

const pgp = pDB.$config.pgp;
const pgpQueryFormat = pgp.as.format;
const pgpHelpers = pgp.helpers;

const getUserInfo = (userId) => {
  return pgpQueryFormat('SELECT * FROM account AS a LEFT JOIN meta AS m ON a.id = m.acc_id WHERE a.id = $1;', [userId]);
};

module.exports = {
  getUserInfo,
  whereClauseMatchAccAndAdrsbook: (accId, cbookId) => {
    if (accId === undefined || cbookId === undefined) {
      throw new Error('Inputs are missing');
    } else {
      return pgpQueryFormat('WHERE acc_id = $1 AND cbook_id = $2', [accId, cbookId]);
    }
  },
  getQueryStrToImportContacts: (contacts) => {
    if (!Array.isArray(contacts)) {
      throw Error('Array of contacts is required');
    }

    const cs = new pgpHelpers.ColumnSet([
      {
        name: 'cbook_id',
        prop: 'cbookId',
      },
      {
        name: 'acc_id',
        prop: 'accId',
      },
      'name',
      'labels',
      'birth',
      'note',
      'email',
      'website',
      'phone',
      'color',
      {
        name: 'avatar_url',
        prop: 'avatarURL',
      },
    ], {
      table: 'contact'
    });
    // don't use old ID when importing backed up contacts
    return pgpHelpers.insert(contacts, cs, 'contact');
  },
};
