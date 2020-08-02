'use strict';

const _ = require('lodash');

const flattenHHJson = (hhJson, name) => {
    return _(hhJson)
        .map((value) => {
            const outerValue = _.pick(value, ['id', 'name']);
            const innerValues = _.map(_.get(value, name, []), (v) => _.pick(v, ['id', 'name']));

            return _.concat(outerValue, innerValues);
        })
        .flatten()
        .value();
};

const getHHJsonNames = (json) => {
    return _.map(json, 'name').join(' || ');
};

const getHHJsonIdByName = (json, value) => {
    return _.get(_.find(json, ({ name }) => name === value), 'id');
};

module.exports = {
    flattenHHJson,
    getHHJsonNames,
    getHHJsonIdByName
};
