const { whereClauseMatchAccAndAdrsbook, getQueryStrToImportContacts } = require('./queryStringCreator');
const Contact = require('../classes/Contact');

describe('Query String Creators suite:', () => {
  const contact = new Contact({
    _id: 'id',
    adrsbookId: 'adrsbookId',
    accountId: 'accountId',
    name: 'name',
    _labels: new Set(['a', 'b', 'c']), // if rawData.labels is null OR undefined, this Set will be empty
    birth: new Date(Date.parse('04 Dec 1995 00:12:00 GMT')),
    note: 'note',
    email: 'email',
    website: 'website',
    phone: 'phone',
    color: 'color',
    avatarURL: 'avatarURL',
    isMarked: 'isMarked',
    hpbd: 'hpbd',
  });
  // beforeAll(() => {});
  it('should return SQL-formatted WHERE clause', () => {
    expect(() => whereClauseMatchAccAndAdrsbook()).toThrow('Inputs are missing');
    expect(whereClauseMatchAccAndAdrsbook(contact.accountId, contact.adrsbookId)).toEqual(
      "WHERE account_id = 'accountId' AND addressbook_id = 'adrsbookId'"
    );
  });

  it('should throw an error for not passing an object or an array of multiple objects', () => {
    expect(() => {
      getQueryStrToImportContacts();
    }).toThrow('');
  });

  it('should return query string for importing ONLY ONE "contact"', () => {
    expect(getQueryStrToImportContacts(contact.toDB())).toBe(
      'INSERT INTO "contact"("addressbook_id","account_id","name","labels","birth","note","email","website","phone","color","avatar_url") VALUES(\'adrsbookId\',\'accountId\',\'name\',\'[]\',\'1995-12-04T00:12:00.000Z\',\'note\',\'email\',\'website\',\'phone\',\'color\',\'avatarURL\')'
    );
  });

  it('should return query string for importing multiple "contacts" at once', () => {
    expect(getQueryStrToImportContacts([contact.toDB(), contact.toDB()])).toBe(
      "INSERT INTO \"contact\"(\"addressbook_id\",\"account_id\",\"name\",\"labels\",\"birth\",\"note\",\"email\",\"website\",\"phone\",\"color\",\"avatar_url\") VALUES('adrsbookId','accountId','name','[]','1995-12-04T00:12:00.000Z','note','email','website','phone','color','avatarURL'),('adrsbookId','accountId','name','[]','1995-12-04T00:12:00.000Z','note','email','website','phone','color','avatarURL')"
    );
  });
});
