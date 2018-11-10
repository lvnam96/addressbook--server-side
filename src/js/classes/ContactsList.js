import Factory from './Factory';
import Contact from "./Contact";
import { isIterable } from '../helpers/utilsHelper';

class ContactsList extends Factory {
    constructor (rawContacts) {
        super(rawContacts);
        this._data = Array.isArray(rawContacts.data) ? rawContacts.data.map((contact) => new Contact(contact)) : null;
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

    static fromJSON (data) {
        return super.fromJSON(data);
    }

    get data () {
        return this._data;
    }

    add (newContact) {
        this._data.concat(new Contact(newContact));
        return this;
    }

    remove (contactId) {
        this._data.find((contact) => contact.id === contactId).del();
        return this;
    }
}

export default ContactsList;
