const Factory = require('./Factory');
const serv = require('../services/');
const db = require('../db/');
const Contact = require('./Contact');

class ContactsList extends Factory {
    constructor (contactsList) {
        super(contactsList);
        this._data = Array.isArray(contactsList) ? contactsList.map((contact) => new Contact(contact)) : null;
        this._isSerializable = this._isSerializable || new Set();
        for (let keyname of [
            'data'
        ]) {
            this._isSerializable = this._isSerializable.add(keyname);
        }
    }

    toJSON () {
        const jsoned = super.toJSON();
        jsoned.data = this._data.map((contact) => contact.toJSON());
        return jsoned;
    }

    static fromJSON (json) {
        return super.fromJSON(json.data);
    }

    static fromDB (data) {
        return super.fromDB(data);
    }

    get data () {
        return this._data;
    }

    find (contactId) {
        return this._data.find((elem, idx) => elem.id === contactId);
    }

    delContact (contactId) {
        return this.find(contactId).del();
    }

    editContact (contact) {
        contact = new Contact(contact);
        return this.find(contact.id).update(contact);
    }

    addContact (newContact) {
        db.data.addContact(newContact).then(res => {
            this._data = [...this._data, new Contact(newContact)];
        }).catch(err => console.error(err));
        return this;
    }
}

module.exports = ContactsList;
