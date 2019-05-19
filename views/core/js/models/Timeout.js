// the only reason to do timeout in OOP style is for learning OOP purpose
// it's a fucking waste of memory storage
class Timeout {
  constructor (callback, amountOfTime) {
    this.cb = callback;
    this.time = amountOfTime;
    this.ref = null;
    this._isTiming = false;
  }

  get isTiming () {
    return this._isTiming;
  }

  set () {
    this.ref = setTimeout(this.cb, this.time);
    this._isTiming = true;
  }

  clear () {
    clearTimeout(this.ref);
    this._isTiming = false;
  }

  reset () {
    this.clear();
    this.set();
  }
}

// module.exports = Timeout;
export default Timeout;
