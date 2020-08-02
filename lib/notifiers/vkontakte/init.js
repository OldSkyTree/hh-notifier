'use strict';

const _ = require('lodash');

const Scene = require('node-vk-bot-api/lib/scene');
const Session = require('node-vk-bot-api/lib/session');
const Stage = require('node-vk-bot-api/lib/stage');
const Markup = require('node-vk-bot-api/lib/markup');

const specializations = require('../../hh-jsons/specializations.json');
const industries = require('../../hh-jsons/industries.json');
const areas = require('../../hh-jsons/areas.json');
const { experience, employment, schedule } = require('../../hh-jsons/dictionaries.json');
const { flattenHHJson, getHHJsonNames, getHHJsonIdByName } = require('./utils');

const userIdsToNotify = [];

const addFilterScene = (vacanciesSearcher) => new Scene('add_filter',
    (ctx) => {
        ctx.session.filter = {};

        ctx.reply(`
            Введите необходимые параметры для фильтра вакансий (прочерк, если хотите пропустить)

            Ключевые слова:
        `);

        ctx.scene.next();
    },
    (ctx) => {
        ctx.session.filter.text = ctx.message.text;

        ctx.scene.next();
        ctx.reply('Профессиональная область: (https://api.hh.ru/specializations)');
    },
    (ctx) => {
        ctx.session.filter.specialization = getHHJsonIdByName(flattenHHJson(specializations, 'specializations'), ctx.message.text);

        ctx.scene.next();
        ctx.reply('Отрасль компании: (https://api.hh.ru/industries)');
    },
    (ctx) => {
        ctx.session.filter.industry = getHHJsonIdByName(flattenHHJson(industries, 'industries'), ctx.message.text);

        ctx.scene.next();
        ctx.reply('Регион: (https://api.hh.ru/areas)');
    },
    (ctx) => {
        ctx.session.filter.area = getHHJsonIdByName(flattenHHJson(areas, 'areas'), ctx.message.text);

        ctx.scene.next();
        ctx.reply('Уровень заработной платы: (в рублях)');
    },
    (ctx) => {
        ctx.session.filter.salary = ctx.message.text;

        ctx.scene.next();
        ctx.reply(`Требуемый опыт работы: [${getHHJsonNames(experience)}]`);
    },
    (ctx) => {
        ctx.session.filter.experience = getHHJsonIdByName(experience, ctx.message.text);

        ctx.scene.next();
        ctx.reply(`Тип занятости: [${getHHJsonNames(employment)}]`);
    },
    (ctx) => {
        ctx.session.filter.employment = getHHJsonIdByName(employment, ctx.message.text);

        ctx.scene.next();
        ctx.reply(`График работы: [${getHHJsonNames(schedule)}]`);
    },
    (ctx) => {
        ctx.session.filter.schedule = getHHJsonIdByName(schedule, ctx.message.text);

        ctx.scene.leave();
        ctx.reply(`Спасибо! Вскоре вам начнут приходить уведомления о вакансиях по данному фильтру\n\n${JSON.stringify(ctx.session)}`);

        vacanciesSearcher.addFilter(ctx.session.filter);
    }
);

const commands = {
    '/start': {
        regExp: /^\/start$/,
        handler: function (ctx) {
            const { message: { from_id } } = ctx;
    
            if (_.indexOf(userIdsToNotify, from_id) === -1) {
                userIdsToNotify.push(from_id);
                ctx.reply('Отлично, вы подписаны!');
            }
            
            ctx.reply('Вы уже подписаны!');
        }
    },
    '/stop': {
        regExp: /^\/stop$/,
        handler: function (ctx) {
            const { message: { from_id } } = ctx;
    
            if (_.indexOf(userIdsToNotify, from_id) !== -1) {
                _.remove(userIdsToNotify, (userId) => userId === from_id);
                ctx.reply('Вы успешно отписались!');
            }
            
            ctx.reply('Вы еще не подписаны!');
        }
    },
    '/set_interval {число}': {
        regExp: /^\/set_interval (\d+)$/,
        handler: function (ctx) {
            const { message: { text }, regExpRes } = ctx;
            const interval = Array.isArray(regExpRes) ? regExpRes[1] : regExpRes;
    
            ctx.reply(`Вы успешно установили интервал в ${interval} часа(ов)`);
        }
    },
    '/add_filter {имя}': {
        regExp: /^\/add_filter ([\w\d]+)$/,
        handler: function (ctx) {
            ctx.scene.enter('add_filter');
        }
    },
    '/list': {
        regExp: /^\/list$/,
        handler: function (ctx) {

        }
    },
    '/help': {
        regExp: /^\/help$/,
        handler: function (ctx) {
            const comandList = ['/start', '/stop', '/set_interval {число}', '/help'];
    
            ctx.reply(`Доступны следующие команды:\n${comandList.join('\n')}`);
        }
    }
};

const initCommands = (bot, vacanciesSearcher) => {
    const session = new Session();
    const stage = new Stage(addFilterScene(vacanciesSearcher));

    bot.use(session.middleware());
    bot.use(stage.middleware());
    
    bot.command('/select', (ctx) => {
        ctx.reply('Select your age', null, Markup
            .keyboard([
                '10-20',
                '20-30',
                '40-50',
                '50-60',
            ], { columns: 2 })
            .inline(),
        );
    });

    bot.event('message_new', (ctx) => {
        const handler = _.get(_.find(commands, ({ h, regExp }) => {
            ctx.regExpRes = ctx.message.text.match(regExp)

            return Boolean(ctx.regExpRes);
        }), 'handler');

        if (handler) {
            handler(ctx, vacanciesSearcher);
        } else {
            ctx.reply("Неверная команда!\nДля получения списка доступных команд наберите '/help'");
        }
    });
};

module.exports = {
    initCommands
};
