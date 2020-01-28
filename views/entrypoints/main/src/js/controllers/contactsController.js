import Contact from '../classes/Contact';

class ContactsController {
  constructor () {
    this.accId = null;
    this.cbookId = null;
  }

  newContact (rawContact) {
    rawContact.adrsbookId = rawContact.adrsbookId || this.cbookId;
    rawContact.accountId = this.accId;
    return new Contact(rawContact);
  }
}

const contactsController = new ContactsController();
export default contactsController;
