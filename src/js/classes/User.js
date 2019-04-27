import Account from './Account';
import Adrsbook from './Addressbook';
import ContactsList from './ContactsList';
import axios, { getJSONData, handleFailedRequest } from '../services/requestServices';

// IN: obj
// FROM: json obj from server, old inst, example empty obj
// obj = {
//     // Account's input requirement,
//     isActive: bool.isRequired,
//     nicename: string.default(null),
//     birth: string.default(null),
//     phone: string.default(null),
// }

// OUT: obj
// HOW: new Contact() | Contact.fromJSON() | Contact.fromScratch()
// obj = {
//     isActive: bool.jsonizable,
//     nicename: string.jsonizable,
//     birth: string.jsonizable,
//     phone: string.jsonizable,
// }

class User extends Account {
    constructor (data) {
        super(data);
        this._data = data;
        this.isActive = data.isActive || true;
        this.nicename = data.nicename || null;
        this.birth = data.birth || null;
        this.phone = data.phone || null;
        this._isSerializable = this._isSerializable || new Set();
        for (let keyname of [
            'isActive', 'nicename', 'birth', 'phone'
        ]) {
            this._isSerializable = this._isSerializable.add(keyname);
        }
    }

    static fromJSON (data) {
        return super.fromJSON(data);
    }

    get adrsbook () {
        return this._adrsbook;
    }

    init () {
        return this;
    }
}

export default User;
