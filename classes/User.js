const serv = require('../services/');
const db = require('../db/');
const Account = require('./Account');
const { pool } = db.poolInitiator;

class User extends Account {
    constructor (data) {
        super(data);
        this.nicename = data.nicename;
        this.birth = data.birth;
        this.phone = data.phone;
    }
}

module.exports = User;
