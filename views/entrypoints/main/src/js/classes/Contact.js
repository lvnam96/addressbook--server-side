import Factory from './Factory';
import axios, { getJSONData, handleFailedRequest } from '../services/requestServices';
import { getRandomColor, isIterable, getRandomStr } from '../helpers/utilsHelper';

// IN: obj
// FROM: json obj from server, old inst, example empty obj
// obj = {
//     id | _id: string.isRequired,
//     adrsbookId | adrsbookid | adrsbook_id: string.isRequired,
//     accountId | accountid | account_id: string.isRequired,
//     name: string.default(null),
//     labels: iterable.default(null),
//     birth: string.default(null),
//     note: string.default(null),
//     email: string.default(null),
//     website: : string.default(null),
//     phone: string.default(null),
//     color: string.default(null),
//     avatarURL: string.default(null),
//     hpbd: bool.default(false),
// };

// OUT: obj
// HOW: new Contact() | Contact.fromJSON() | Contact.fromScratch()
// obj = {
//     id: <stringwq></stringwq>,
//     adrsbookId: string.jsonizable,
//     accountId: string.jsonizable,
//     name: string.jsonizable,
//     labels: array.default(emptyArray).jsonizable,
//     birth: string.jsonizable,
//     note: string.jsonizable,
//     email: string.jsonizable,
//     website: string.jsonizable,
//     phone: string.jsonizable,
//     color: string.jsonizable,
//     avatarURL: string.jsonizable,
//     isMarked: string,
//     hpbd: bool,
// }

class Contact extends Factory {
    constructor (rawData) {
        super(rawData);
        this._id = rawData.id || rawData._id;
        // this.id = rawData.id;
        this.adrsbookId = rawData.adrsbookId;
        this.accountId = rawData.accountId;
        this.name = rawData.name || null;
        this._labels = new Set(rawData.labels);
        this.birth = rawData.birth ? new Date(Date.parse(rawData.birth)) : null;
        this.note = rawData.note || null;
        this.email = rawData.email || null;
        this.website = rawData.website || null;
        this.phone = rawData.phone || null;
        this.color = rawData.color || null;
        this.avatarURL = rawData.avatarURL || null;
        this.isMarked = rawData.isMarked || false;
        this.hpbd = rawData.hpbd || false;
        for (let keyname of [
            'id', 'adrsbookId', 'accountId', 'name', 'labels', 'birth', 'note', 'email', 'website', 'phone', 'color', 'avatarURL'
        ]) {
            this._isSerializable = this._isSerializable.add(keyname);
        }
    }

    static fromJSON (data) {
        return super.fromJSON(data);
    }

    // static create (rawData) {
    //     return new Contact(rawData);
    // }

    static fromScratch (base) {
        if (isIterable(base)) {
            throw new Error('Contact.fromscratch() does not receive iterable obj');
        }
        return new Contact({
            ...base,
            id: getRandomStr(10),// use uuid created in database
            color: getRandomColor(),
            // birth: new Date()
        });
    }

    // get & set props will not be passed through, therefore we have to set this.id in constructor() (line 6)
    get id () {
        return this._id;
    }

    set id (x) { return; }

    get labels () {
        return Array.from(this._labels);
    }

    set labels (labels) {
        if (isIterable(labels)) {
            this._labels = new Set(labels);
        }
    }

    _updateProp (propName, value) {
        switch (propName) {
            case 'id':
                return;
            case '':

                break;
            default:
                this[propName] = value;
        }
    }

    del () {
        return axios.delete('/backdoor/removeContact', this)
            .then(getJSONData)
            .catch(handleFailedRequest);
    }

    updt (newData) {
        const props = Object.keys(newData);

        for (let prop of props) {
            this._updateProp(prop, newData[prop]);
        }
    }
}

export default Contact;
