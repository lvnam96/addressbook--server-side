const dbUtils = require('./dbUtils');
const User = require('../classes/User');
const Cbook = require('../classes/Contactsbook');
const Contact = require('../classes/Contact');

describe('Query String Creators suite:', () => {
  describe('mapUserData helper:', () => {
    it('should return class-ready data', () => {
      const sampleUserData = {
        id: '83d783ee-d425-4a40-ba40-699081da01a6',
        username: 'abcd',
        password: '$2a$10$ggG9oHxRt23pFREbhDFZruWnEusbPsC0I.NXLWeGVsg0bSnLmTdtu',
        email: null,
        facebook_id: null,
        birth: null,
        phone: null,
        nicename: null,
        created_on: '2020-02-06T12:22:32.079Z',
        salt: 'b7417fe96eb2c3d6f395c03702707143',
        cbooks: undefined,
        last_activated_cbook_id: 'fe0803cd-fc16-4ba7-b794-6c444d0a3552',
        last_login: null,
        is_active: true,
      };
      const user = new User(dbUtils.mapUserData(sampleUserData));

      expect(() => dbUtils.mapUserData()).toThrow();
      expect(user.id).toBe(sampleUserData.id);
      expect(user.uname).toBe(sampleUserData.username);
      expect(user.passwd).toBe(sampleUserData.password);
      expect(user.fbId).toBe(sampleUserData.facebook_id);
      expect(user.createdOn).toEqual(new Date(sampleUserData.created_on));
      expect(user.meta.lastActivatedCbookId).toBe(sampleUserData.last_activated_cbook_id);
      expect(user.meta.lastLogin instanceof Date).toBe(true);
      expect(user.meta.isActive).toBe(sampleUserData.is_active);
    });
  });

  describe('mapCbookData helper:', () => {
    it('should return class-ready data', () => {
      const sampleCbookData = {
        id: 'fe0803cd-fc16-4ba7-b794-6c444d0a3552',
        acc_id: '83d783ee-d425-4a40-ba40-699081da01a6',
        name: 'asfasf asf sa',
        color: '#094589',
      };
      const cbook = new Cbook(dbUtils.mapCbookData(sampleCbookData));

      expect(() => dbUtils.mapCbookData()).toThrow();
      expect(cbook.id).toEqual(sampleCbookData.id);
      expect(cbook.accId).toEqual(sampleCbookData.acc_id);
    });
  });

  describe('mapContactData helper:', () => {
    it('should return class-ready data', () => {
      const sampleContactData = {
        id: 'b3f5da3d-a746-4178-9047-b4120eb2d14e',
        cbook_id: 'fe0803cd-fc16-4ba7-b794-6c444d0a3552',
        acc_id: '83d783ee-d425-4a40-ba40-699081da01a6',
        birth: null,
        email: null,
        phone: '{"id":"e54ffa61-2725-4fe2-9912-2c9b04dbaf85","callingCode":"VN-84","phoneNumb":""}',
        labels: '[]',
        note: null,
        name: 'erg erg eraaaabbbb',
        color: '#0a6b1b',
        website: null,
        avatar_url: null,
      };
      const contact = new Contact(dbUtils.mapContactData(sampleContactData));

      expect(() => dbUtils.mapContactData()).toThrow();
      expect(contact.id).toBe(sampleContactData.id);
      expect(contact.cbookId).toBe(sampleContactData.cbook_id);
      expect(contact.accId).toBe(sampleContactData.acc_id);
      expect(contact.labels).toEqual(JSON.parse(sampleContactData.labels));
      expect(contact.avatarURL).toBe(sampleContactData.avatar_url);
    });
  });
});
