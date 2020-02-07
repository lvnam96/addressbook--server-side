const { whereClauseMatchAccAndAdrsbook, getQueryStrToImportContacts } = require('./queryStringCreator');
const Contact = require('../classes/Contact');

describe('Query String Creators suite:', () => {
  const contact = new Contact({
    id: 'id',
    cbookId: 'cbookId',
    accId: 'accId',
    name: 'name',
    labels: new Set(['a', 'b', 'c']),
    birth: new Date(Date.parse('04 Dec 1995 00:12:00 GMT+8')),
    note: 'note',
    email: 'email',
    website: 'website',
    phone: '"{"id":"abccccccc","callingCode":"VN-84","phoneNumb":"123456789"}"',
    color: 'color',
    avatarURL: 'avatarURL',
  });
  // beforeAll(() => {});
  it('should return SQL-formatted WHERE clause', () => {
    expect(() => whereClauseMatchAccAndAdrsbook()).toThrow();
    expect(whereClauseMatchAccAndAdrsbook(contact.accId, contact.cbookId)).toEqual(
      "WHERE acc_id = 'accId' AND cbook_id = 'cbookId'"
    );
  });

  it('should throw an error for not passing an object or an array of multiple objects', () => {
    expect(() => getQueryStrToImportContacts()).toThrow();
  });

  it('should throw an error for importing ONLY ONE "contact" - not an array of contact(s)', () => {
    expect(() => getQueryStrToImportContacts(contact.toDB())).toThrow();
  });

  it('should return query string for importing ONLY ONE "contact"', () => {
    expect(getQueryStrToImportContacts([contact.toDB()])).toBe(
      'insert into "contact"("cbook_id","acc_id","name","labels","birth","note","email","website","phone","color","avatar_url") values(\'cbookId\',\'accId\',\'name\',\'["a","b","c"]\',\'1995-12-03T23:12:00.000+07:00\',\'note\',\'email\',\'website\',\'"\\"{\\"id\\":\\"abccccccc\\",\\"callingCode\\":\\"VN-84\\",\\"phoneNumb\\":\\"123456789\\"}\\""\',\'color\',\'avatarURL\')'
    );
  });

  it('should return query string for importing multiple "contacts" at once', () => {
    expect(getQueryStrToImportContacts([contact.toDB(), contact.toDB()])).toBe(
      'insert into "contact"("cbook_id","acc_id","name","labels","birth","note","email","website","phone","color","avatar_url") values(\'cbookId\',\'accId\',\'name\',\'["a","b","c"]\',\'1995-12-03T23:12:00.000+07:00\',\'note\',\'email\',\'website\',\'"\\"{\\"id\\":\\"abccccccc\\",\\"callingCode\\":\\"VN-84\\",\\"phoneNumb\\":\\"123456789\\"}\\""\',\'color\',\'avatarURL\'),(\'cbookId\',\'accId\',\'name\',\'["a","b","c"]\',\'1995-12-03T23:12:00.000+07:00\',\'note\',\'email\',\'website\',\'"\\"{\\"id\\":\\"abccccccc\\",\\"callingCode\\":\\"VN-84\\",\\"phoneNumb\\":\\"123456789\\"}\\""\',\'color\',\'avatarURL\')'
    );
  });
});
