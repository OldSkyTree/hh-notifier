'use strict';

const { baseRequest } = require('./base');
const { getURLSearchParams, findAll } = require('./utils');

const getById = async (vacancyId) => {
    return baseRequest(`vacancies/${vacancyId}`);
};

const findByFilter = async (searchFilter) => {
    return baseRequest(`vacancies`, {
        searchParams: getURLSearchParams(searchFilter)
    });
};

const findSimilarByFilter = async (vacancyId, searchFilter) => {
    return baseRequest(`vacancies/${vacancyId}/similar_vacancies`, {
        searchParams: getURLSearchParams(searchFilter)
    });
};

module.exports = {
    getById,
    findByFilter,
    findSimilarByFilter
};
