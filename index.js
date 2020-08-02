#!/usr/bin/env node

const _ = require('lodash');

const api = require('./lib/api');
const moment = require('moment');

const notifiers = require('./lib/notifiers');
const VacanciesSearcher = require('./lib/vacancies-searcher');

const runNotifiers = (vacanciesSearcher) => {
    _.forEach(notifiers, (notifier) => notifier.run(vacanciesSearcher));
};

const main = async () => {
    const vacanciesSearcher = VacanciesSearcher.create({
        interval: 1
    });

    runNotifiers(vacanciesSearcher);

    // const noExperienceVacancies = await api.vacancies.findByFilter({
    //     text: 'Frontend разработчик',
    //     experience: 'noExperience',
    //     employment: ['full', 'probation'],
    //     schedule: ['fullDay', 'remote'],
    //     area: [131], // Симферополь
    //     specialization: [1], // Информационные технологии, интернет, телеком
    //     date_from: moment().utc(3).subtract(1, 'hour').toISOString(),
    //     per_page: 100
    // });

    // console.dir(noExperienceVacancies.items.length);
};

(async () => await main())();
