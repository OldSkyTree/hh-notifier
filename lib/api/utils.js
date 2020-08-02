'use strict';

const objectToPairs = (object) => {
    const pairs = [];

    for (const key in object) {
        const value = object[key];

        if (Array.isArray(value)) {
            value.forEach((val) => {
                pairs.push([key, val]);
            })
        } else {
            pairs.push([key, value]);
        }
    }

    return pairs;
};

const getURLSearchParams = (queryObj) => {
    return new URLSearchParams(objectToPairs(queryObj));
};

const findAll = async () => {

};

module.exports = {
    objectToPairs,
    getURLSearchParams,
    findAll
};
