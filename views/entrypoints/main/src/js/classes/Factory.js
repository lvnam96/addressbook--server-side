class Fatory {
    constructor (data) {
        this._isSerializable = this._isSerializable || new Set();
        for (let keyname of [
            /* serializable keynames go here */
        ]) {
            this._isSerializable = this._isSerializable.add(keyname);
        }
    }

    toJSON () {
        const data = Object.assign({}, this.data);
        const serializableKeys = this._isSerializable || [];
        const plainObj = {};
        for (let key of serializableKeys) {
            if (this[key] && typeof this[key].toJSON === 'function') {
                plainObj[key] = this[key].toJSON();
            } else {
                plainObj[key] = this[key];
            }
        }

        return plainObj;
    }

    static fromJSON (data) {
        const CurrentClass = this;
        return new CurrentClass(data);
    }
}

export default Fatory;
