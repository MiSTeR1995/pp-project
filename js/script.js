'use strict';

// импорты по стандарту ES6 размещаются всегда сверху
import tabs from './modules/tabs';
import modal from './modules/modal';
import timer from './modules/timer';
import cards from './modules/cards';
import forms from './modules/forms';
import calc from './modules/calc';
import slider from './modules/slider';
import {openModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {

    // Будем создавать этот таймер глобально в основном скрипте
    // потому что он используется в других модулях и не раз
    // колбэек функция запустится через определенный промежуток времени, которая
    // внутри себя уже запустит openModal
    // в переменной хранится айдишник таймера, чтобы мы по нему могли оста навливать таймер
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 300000);

    tabs(
        '.tabheader__item',
        '.tabcontent',
        '.tabheader__items',
        'tabheader__item_active'
        );

    modal('[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2021-02-12');
    cards();
    forms('form', modalTimerId);
    calc();

    // передадим объект настроек, которые можно будет деструктуризировать
    // порядок передачи не влияет
    slider({
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        slide: '.offer__slide',
        totalCounter: '#total',
        currenCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'

    });

});



    // импорты с помощью commonJS
    // const
    //     tabs = require('./modules/tabs'),
    //     modal = require('./modules/modal'),
    //     timer = require('./modules/timer'),
    //     cards = require('./modules/cards'),
    //     forms = require('./modules/forms'),
    //     calc = require('./modules/calc'),
    //     slider = require('./modules/slider');
