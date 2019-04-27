import Factory from './Factory';
import ContactsList from './ContactsList';
import axios, { getJSONData, handleFailedRequest } from '../services/requestServices';

// IN: obj
// FROM: json obj from server, old inst, example empty obj
// obj = {
//     contacts: iterable.isRequired,
//     id | _id: string.isRequired,
//     accountId | accountid | account_id: string.isRequired,
//     name: string.isRequired,
//     color: string.isRequired,
// }

// OUT: obj
// HOW: new Contact() | Contact.fromJSON() | Contact.fromScratch()
// obj = {
//     contacts: iterable.isRequired.jsonizable,
//     id: string.isRequired.jsonizable,
//     accountId: string.isRequired.jsonizable,
//     name: string.jsonizable,
//     color: string.jsonizable,
// }

// private fields (props, methods) feature is coming with Babel 7 https://stackoverflow.com/a/52237988/5805244
class Addressbook extends Factory {
    constructor (data) {
        super(data);
        this._contactsList = ContactsList.fromJSON(data.contacts);
        this._data = data;
        this._id = data.id;
        this._accountId = data.accountId;
        this._name = data.name || null;
        this._color = data.color || null;
        this._isSerializable = this._isSerializable || new Set();
        for (let keyname of [
            'id', 'accountId', 'name', 'color', 'contacts'
        ]) {
            this._isSerializable = this._isSerializable.add(keyname);
        }
    }

    static fromJSON (data) {
        return super.fromJSON(data);
    }

    get contacts () {
        return this._contactsList;
    }

    set contacts (contacts) {
        if (isIterable(contacts)) {
            this._contactsList = new ContactsList(contacts);
        }
    }

    get id () {
        return this._id;
    }

    set id (x) { return; }

    get accountId () {
        return this._accountId;
    }

    set accountId (x) { return; }

    get name () {
        return this._name;
    }

    set name (newName) {
        // let server know to modify adrsbook's name
        // then set
        // this._name = newName;
        return;
    }

    get color () {
        return this._color;
    }

    set color (newColor) {
        // let server know to modify adrsbook's color
        // then set
        // this._color = newColor;
        return;
    }

    // _loadData () {
    //     axios.get('/').then().catch();
    //     return this;
    // }

    addContact (newData) {
        this._contactsList = this._contactsList.add(newData);
        return this;
    }

    rmContact (id) {
        this._contactsList = this._contactsList.remove(id);
        return this;
    }
}

export default Addressbook;
