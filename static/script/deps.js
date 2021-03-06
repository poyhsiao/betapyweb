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
        'jquery.form': 'jquery.form.min',
        bsSwitch: 'bootstrapSwitch',
        bootbox: 'bootbox',
        bb: 'bb',
        psteps: 'jquery.psteps.min',
        ExtHandler: 'ExtHandler',
        trans: '/getTranslate?lang=trans-text'
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
        'jquery.ui.widget': {
            deps: ['jquery']
        },
        'timepicker': {
            deps: ['jquery', 'bootstrap']
        },
        'bsSwitch': {
            deps: ['jquery']
        },
        'bootbox': {
            deps: ['jquery', 'trans']
        },
        'fileupload': {
            dpes: ['jquery', 'iframeSupport', 'jqueryUI']
        },
        'jquery.form': {
            deps: ['jquery']
        },
        'bb': {
            deps: ['jquery', 'underscore', 'backbone', 'bootstrap', 'bootbox', 'trans']
        },
        'psteps': {
            deps: ['jquery', 'bootstrap']
        },
        'ExtHandler': {
            deps: ['jquery', 'underscore', 'backbone', 'bootstrap', 'bb', 'trans'],
            exports: "ExtHandler"
        }
    },
    waitSeconds: 15
});

require(['bb'], function() {
    return true;
});
