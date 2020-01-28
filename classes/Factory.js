class Factory {
  constructor (data) {
    this._isSerializable = this._isSerializable || new Set();
    for (const keyname of [
      /* serializable keynames go here */
    ]) {
      this._isSerializable = this._isSerializable.add(keyname);
    }
  }

  toJSON () {
    return this._normalize();
  }

  _normalize () {
    // const data = Object.assign({}, this.data);
    const serializableKeys = this._isSerializable || [];
    const plainObj = {};
    for (const key of serializableKeys) {
      if (this[key] && !(this[key] instanceof Date) && typeof this[key].toJSON === 'function') {
        plainObj[key] = this[key].toJSON();
      } else {
        plainObj[key] = this[key];
      }
    }

    return plainObj;
  }

  toDB () {
    return this._normalize();
  }

  static fromJSON (json) {
    const CurrentClass = this;
    return new CurrentClass(json);
  }

  static fromDB (data) {
    const CurrentClass = this;
    return new CurrentClass(data);
  }
}

module.exports = Factory;
