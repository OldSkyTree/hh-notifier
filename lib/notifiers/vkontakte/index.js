'use strict';

const _ = require('lodash');

const VkBot = require('node-vk-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const { initCommands } = require('./init');

const run = (vacanciesSearcher) => {
    const app = express();
    const port = process.env.PORT || 3000;
    
    const bot = new VkBot({
        token: process.env.TOKEN,
        group_id: process.env.GROUP_ID,
        secret: process.env.SECRET,
        confirmation: process.env.CONFIRMATION
    });
    
    initCommands(bot, vacanciesSearcher);
    
    app.use(bodyParser.json());
    
    app.post('/', bot.webhookCallback);
      
    app.listen(port, () => {
        console.log(`VK bot listening at http://localhost:${port}`)
    });
};

module.exports = {
    run
};
