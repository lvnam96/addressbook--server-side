const { getClient, pDB, pgpHelpers } = require('./pool');
const { dbUtils: { mapUserData } } = require('../helpers/index');

const pgpQueryFormat = pDB.$config.pgp.as.format;

module.exports.whereClauseMatchAccAndAdrsbook = (accountId, adrsbookId) => {
    return pgpQueryFormat('WHERE account_id = $1 AND addressbook_id = $2', [accountId, adrsbookId]);
};

module.exports.getQueryStrToImportContacts = contacts => pgpHelpers.insert(contacts, ['id', 'addressbook_id', 'account_id', 'name', 'labels', 'birth', 'note', 'email', 'website', 'phone', 'color', 'avatar_url'], 'contact');
