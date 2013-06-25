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
        'jquery.ui.widget': 'jquery-ui',
        timepicker: 'bootstrap-timepicker.min',
        iframeSupport: 'jquery.iframe-transport',
        fileupload: 'jquery.fileupload',
        bsSwitch: 'bootstrapSwitch',
        bb: 'bb',
        psteps: 'jquery.psteps.min',
        ExtHandler: 'ExtHandler'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
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
            deps: ['jquery', 'jqueryUI']
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
            dpes: ['jquery', 'iframeSupport', 'jqueryUI']
        },
        'bb': {
            deps: ['jquery', 'underscore', 'backbone', 'bootstrap']
        },
        'psteps': {
            deps: ['jquery', 'bootstrap']
        },
        'ExtHandler': {
            deps: ['jquery', 'underscore', 'backbone', 'bootstrap', 'bb']
        }
    },
    waitSeconds: 15
});

require(['bb'], function() {
    return true;
});
