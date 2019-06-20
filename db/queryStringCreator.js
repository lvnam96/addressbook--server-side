const { getClient, pDB, pgpHelpers } = require('./pool');
const {
  dbUtils: { mapUserData },
} = require('../helpers/index');

const pgpQueryFormat = pDB.$config.pgp.as.format;

module.exports = {
  whereClauseMatchAccAndAdrsbook: (accountId, adrsbookId) => {
    if (accountId === undefined || adrsbookId === undefined) {
      throw new Error('Inputs are missing');
    } else {
      return pgpQueryFormat('WHERE account_id = $1 AND addressbook_id = $2', [accountId, adrsbookId]);
    }
  },
  getQueryStrToImportContacts: (contacts) => {
    if (typeof contacts !== 'object') {
      throw Error('Argument "contacts" is required');
    }
    // don't use old ID when importing backed up contacts
    return pgpHelpers.insert(
      contacts,
      [
        'addressbook_id',
        'account_id',
        'name',
        'labels',
        'birth',
        'note',
        'email',
        'website',
        'phone',
        'color',
        'avatar_url',
      ],
      'contact'
    );
  },
};
