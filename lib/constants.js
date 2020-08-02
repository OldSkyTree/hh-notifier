'use strict';

const millisecond = 1;
const second = millisecond * 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

module.exports = {
    time: {
        millisecond,
        second,
        minute,
        hour,
        day
    }
};
