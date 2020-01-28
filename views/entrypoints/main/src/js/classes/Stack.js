class Stack {
  constructor (items) {
    this._data = [];
    if (items) {
      if (Array.isArray(items)) {
        this._data = [...items];
        // this.lastToggler = undefined;
      } else if (items instanceof Stack) {
        this._data = items.data;
      } else {
        throw new Error('Class Stack requires an array as first argument or its old instance');
      }
    }
  }

  pull () {
    this._data.pop();
    return this;
  }

  push (item) {
    this._data.push(item);
    return this;
  }

  immutatePull () {
    this._data.pop();
    return new Stack(this._data);
  }

  immutatePush (item) {
    this._data.push(item);
    return new Stack(this._data);
  }

  get last () {
    return this._data[this._data.length - 1];
  }

  get len () {
    return this._data.length;
  }
}

export default Stack;
