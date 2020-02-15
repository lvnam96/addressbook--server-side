const queryStringCreator = require('./queryStringCreator');
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
    expect(() => queryStringCreator.whereClauseMatchAccAndAdrsbook()).toThrow();
    expect(queryStringCreator.whereClauseMatchAccAndAdrsbook(contact.accId, contact.cbookId)).toEqual(
      "WHERE acc_id = 'accId' AND cbook_id = 'cbookId'"
    );
  });

  it('should throw an error for not passing an object or an array of multiple objects', () => {
    expect(() => queryStringCreator.getQueryStrToImportContacts()).toThrow();
  });

  it('should throw an error for importing ONLY ONE "contact" - not an array of contact(s)', () => {
    expect(() => queryStringCreator.getQueryStrToImportContacts(contact.toDB())).toThrow();
  });

  it('should return query string for importing ONLY ONE "contact"', () => {
    expect(queryStringCreator.getQueryStrToImportContacts([contact.toDB()])).toBe(
      'insert into "contact"("cbook_id","acc_id","name","labels","birth","note","email","website","phone","color","avatar_url") values(\'cbookId\',\'accId\',\'name\',\'["a","b","c"]\',\'1995-12-03T23:12:00.000+07:00\',\'note\',\'email\',\'website\',\'"\\"{\\"id\\":\\"abccccccc\\",\\"callingCode\\":\\"VN-84\\",\\"phoneNumb\\":\\"123456789\\"}\\""\',\'color\',\'avatarURL\')'
    );
  });

  it('should return query string for importing multiple "contacts" at once', () => {
    expect(queryStringCreator.getQueryStrToImportContacts([contact.toDB(), contact.toDB()])).toBe(
      'insert into "contact"("cbook_id","acc_id","name","labels","birth","note","email","website","phone","color","avatar_url") values(\'cbookId\',\'accId\',\'name\',\'["a","b","c"]\',\'1995-12-03T23:12:00.000+07:00\',\'note\',\'email\',\'website\',\'"\\"{\\"id\\":\\"abccccccc\\",\\"callingCode\\":\\"VN-84\\",\\"phoneNumb\\":\\"123456789\\"}\\""\',\'color\',\'avatarURL\'),(\'cbookId\',\'accId\',\'name\',\'["a","b","c"]\',\'1995-12-03T23:12:00.000+07:00\',\'note\',\'email\',\'website\',\'"\\"{\\"id\\":\\"abccccccc\\",\\"callingCode\\":\\"VN-84\\",\\"phoneNumb\\":\\"123456789\\"}\\""\',\'color\',\'avatarURL\')'
    );
  });

  it("should return query string for getting user's info", () => {
    expect(queryStringCreator.getUserInfo('1234')).toBe(
      "SELECT * FROM account AS a LEFT JOIN meta AS m ON a.id = m.acc_id WHERE a.id = '1234';"
    );
  });

  it('should return query string for selecting multiple "contact books" at once', () => {
    expect(queryStringCreator.getCbooksFromIdList(['1234', '5678'])).toBe(
      "SELECT * FROM contactsbook WHERE id IN ('1234','5678')"
    );
  });
});
