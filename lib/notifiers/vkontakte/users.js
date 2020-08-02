'use strict';

module.exports = class Users {
    static create() {
        return new Users();
    }

    constructor() {
        this.users = [];
        this.filters = [];
    }
};
