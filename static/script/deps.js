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
        iframeSupport: 'jquery.iframe-transport',
        fileupload: 'jquery.fileupload',
        bsSwitch: 'bootstrapSwitch',
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
        'bsSwitch': {
            deps: ['jquery']
        },
        'fileupload': {
            dpes: ['iframeSupport', 'jqueryUI']
        },
        'bb': {
            deps: ['jquery', 'underscore', 'backbone', 'bootstrap', 'blockUI', 'jqueryUI', 'timepicker', 'fileupload', 'bsSwitch']
        }
    },
    waitSeconds: 15
});

require(['jquery', 'underscore', 'backbone', 'bootstrap','blockUI', 'jqueryUI', 'timepicker', 'bb'], function($, _, Backbone) {
    return true;
});
