// THIS MODEL SHOULD WORK LIKE TABS COMPONENT OF BOOTSTRAP:
// ONLY ONE TAB IS OPENED AT A TIME

class Stack {
  constructor (togglerNames) {
    this.data = [];
    if (togglerNames) {
      if (Array.isArray(togglerNames)) {
        this.data = [...togglerNames];
        // this.lastToggler = undefined;
      } else if (togglerNames instanceof Stack) {
        this.data = togglerNames.data;
      } else {
        throw new Error('Class Stack requires an array as first argument or its old instance');
      }
    }
  }

  pull () {
    this.data.pop();
    return new Stack(this.data);
  }

  push (item) {
    this.data.push(item);
    return new Stack(this.data);
  }

  get last () {
    return this.data[this.data.length - 1];
  }

  get len () {
    return this.data.length;
  }
}

export default Stack;
