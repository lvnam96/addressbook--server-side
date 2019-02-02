const Factory = require('./Factory');
const serv = require('../services/');
const db = require('../db/');
const { isIterable } = require('../helpers/');

class Contact extends Factory {
    constructor(rawData) {
        super(rawData);
        if (typeof rawData.labels === 'string') {
            rawData.labels = JSON.parse(rawData.labels);
        }
        if (!Array.isArray(rawData.labels)) {
            // prepare for bugs with labels
        }
        this._id = rawData.id;
        this.adrsbookId = rawData.adrsbookId || rawData.adrsbookid || rawData.addressbook_id;
        this.accountId = rawData.accountId || rawData.accountid || rawData.account_id || null;
        this.name = rawData.name || null;
        this._labels = new Set(rawData.labels);// if rawData.labels is null OR undefined, this Set will be empty
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

    toDB () {
        const jsoned = this.toJSON();
        jsoned.labels = JSON.stringify(jsoned.labels);
        jsoned.addressbook_id = jsoned.adrsbookId;
        jsoned.account_id = jsoned.accountId;
        jsoned.avatar_url = jsoned.avatarURL;
        return jsoned;
    }

    static fromJSON (json) {
        return super.fromJSON(json);
    }

    static fromDB (data) {
        return super.fromDB(data);
    }

    get id () {
        return this._id;
    }

    set id (x) { return; }

    get labels () {
        return Array.from(this._labels);
    }

    set labels (labels) {
        if (isIterable(labels) && typeof labels !== 'string') {
            this._labels = new Set(labels);
        }
    }

    del () {
        // do delete this contact in db
        // return promise
        return db.data.removeContact(this).then();
    }

    update (newData) {
        // edit this contact in db
        // then update this modal
        // return promise
        const contact = {
            ...this,
            ...newData
        }
        return db.data.editContact(contact).then();
    }
}

module.exports = Contact;
