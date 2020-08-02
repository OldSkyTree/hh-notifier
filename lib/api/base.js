'use strict';

const got = require('got');

const { baseAPIUrl } = require('./constants');

const baseRequest = async (partialUrl, options) => {
    const { body } = await got(`${baseAPIUrl}/${partialUrl}`, options);

    return JSON.parse(body);
};

module.exports = {
    baseRequest
};
