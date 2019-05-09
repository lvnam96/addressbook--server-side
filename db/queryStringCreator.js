const { getClient, pDB, pgpHelpers } = require('./pool');
const { dbUtils: { mapUserData } } = require('../helpers/index');

const pgpQueryFormat = pDB.$config.pgp.as.format;

module.exports.whereClauseMatchAccAndAdrsbook = (accountId, adrsbookId) => {
    return pgpQueryFormat('WHERE account_id = $1 AND addressbook_id = $2', [accountId, adrsbookId]);
};

// don't use old ID when importing backed up contacts
module.exports.getQueryStrToImportContacts = contacts => pgpHelpers.insert(contacts, ['addressbook_id', 'account_id', 'name', 'labels', 'birth', 'note', 'email', 'website', 'phone', 'color', 'avatar_url'], 'contact');
