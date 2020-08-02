'use strict';

const _ = require('lodash');
const moment = require('moment');
const EventEmitter = require('events');
const crypto = require('crypto');
const Promise = require('bluebird');

const api = require('./api');

module.exports = class VacanciesSearcher extends EventEmitter {
    static create(options) {
        return new VacanciesSearcher(options);
    }

    constructor(options) {
        super();

        const { interval: intervalInHours } = options;

        this._options = options;
        this._interval = moment.duration(intervalInHours, 'hours');
        this._filters = [{
            text: 'Frontend разработчик',
            // experience: 'noExperience',
            employment: ['full', 'probation'],
            schedule: ['fullDay', 'remote'],
            area: [131], // Симферополь
            specialization: [1], // Информационные технологии, интернет, телеком
            date_from: moment().utc(3).subtract(1, 'hour').toISOString(),
            per_page: 100
        }];
        this._timerPromise = null;
    }

    addFilter(filter) {
        this._filters.push({
            filter,
            hash: this._getHashFromObject(filter),
            muted: false
        });
    }
    removeFilter(filterHash) {
        _.remove(this._filters, (filter) => filter.hash === filterHash);
    }
    getFilters() {
        return _.filter(this._filters, { muted: false });
    }

    async start() {
        this._timerPromise = Promise.delay(this._interval.asMilliseconds(), function tick() {
            console.log('tick');
            this.search();

            return Promise.delay(this._interval.asMilliseconds(), tick);
        });

        await this._timerPromise
    }
    stop() {
        clearTimeout(this._timerId);
    }

    async search() {
        const vacanciesByFilters = await Promise.all(this.getFilters().map(({ filter, hash }) => ({
            vacancies: api.vacancies.findByFilter(filter),
            filterHash: hash
        })));

        for (const { vacancies, filterHash } of vacanciesByFilters) {
            this.emit(`find_${filterHash}`, vacancies, filterHash);
        }
    }

    _getHashFromObject(obj) {
        return crypto
            .createHash('md5')
            .update(JSON.stringify(obj))
            .digest('hex');
    }
};