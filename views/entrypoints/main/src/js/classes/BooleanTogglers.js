// THIS MODEL SHOULD WORK LIKE TABS COMPONENT OF BOOTSTRAP:
// ONLY ONE TAB IS OPENED AT A TIME

class BooleanTogglers {
  constructor (togglerNames) {
    if (Array.isArray(togglerNames)) {
      this.data = {};
      for (let togglerName of togglerNames) {
        this.data[togglerName] = false;
      }
      this.lastToggler = undefined;
    } else if (typeof togglerNames === 'object') {
      // for immutability
      this.data = { ...togglerNames.data };
      this.lastToggler = togglerNames.lastToggler;
    } else {
      throw new Error('Class BooleanTogglers requires an array as first argument');
    }
  }

  toggle (unactivatedToggler) {
    // if this method is called for the first time & no argument passed, nothing will be changed
    // once this method called, it can be called with no argument passed, and the previous toggler will be toggled
    if (this.lastToggler !== undefined && !unactivatedToggler) {
      return this._togglePreviousActivatedToggler();
    }
    if (unactivatedToggler) {
      const isUnactivatedTogglerExisted = Object.keys(this.data).includes(unactivatedToggler);
      if (isUnactivatedTogglerExisted) {
        this.data = {
          ...this.data,
          [unactivatedToggler]: !this.data[unactivatedToggler],
        };
        // this.data[unactivatedToggler] = !this.data[unactivatedToggler];
        this.lastToggler = unactivatedToggler;
      }
      return new BooleanTogglers(this);
    }
    return this;
  }

  _togglePreviousActivatedToggler () {
    this.data = {
      ...this.data,
      [this.lastToggler]: !this.data[this.lastToggler],
    };
    return new BooleanTogglers(this);
  }

  _turnAllOff () {
    // return new BooleanTogglers(Object.keys(this.data));

    Object.keys(this.data).forEach((toggler) => {
      this.data = { ...this.data };
      this.data[toggler] = false;
    });
    return this;
  }

  reset () {
    return this._turnAllOff();
  }

  toggleOff (activatingToggler) {
    const isActivatingTogglerExisted = Object.keys(this.data).includes(activatingToggler);
    if (activatingToggler && isActivatingTogglerExisted && this.data[activatingToggler]) {
      this.lastToggler = activatingToggler;
      return this._turnAllOff();
    }
    return this;
  }

  toggleOn (unactivatedToggler) {
    if (unactivatedToggler) {
      if (this.lastToggler) {
        this._turnAllOff();
      }
      this.toggle(unactivatedToggler);
      return new BooleanTogglers(this);
    }
    return this;
  }

  get activatedToggler () {
    return Object.keys(this.data).find((toggler) => !!this.data[toggler]);
  }
}

export default BooleanTogglers;
