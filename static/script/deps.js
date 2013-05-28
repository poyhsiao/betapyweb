/*
 * for require js define
 *
 * */

requirejs.config({
    //baseUrl: '/script',
    paths: {
        jquery: 'jquery',
        underscore: 'underscore',
        backbone: 'backbone',
        bootstrap: 'bootstrap',
        blockUI: 'jquery.blockUI',
        jqueryUI: 'jquery-ui',
        timepicker: 'bootstrap-timepicker.min',
        bb: 'bb'
    },
    shim: {
        'undersocre': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'blockUI': {
            deps: ['jquery']
        },
        'jqueryUI': {
            deps: ['jquery']
        },
        'timepicker': {
            deps: ['jquery', 'bootstrap']
        },
        'bb': {
            deps: ['jquery', 'underscore', 'backbone', 'bootstrap', 'blockUI', 'jqueryUI', 'timepicker']
        }
    },
    waitSeconds: 15
});

require(['jquery', 'underscore', 'backbone', 'bootstrap','blockUI', 'jqueryUI', 'timepicker', 'bb'], function($, _, Backbone) {
    return true;
});
