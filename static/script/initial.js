/**
 * @author Kim Hsiao
 */

require(["jquery", "underscore", "backbone", "jquery-ui"], function($, _) {
    $.getScript("/script/bb.js", function() {
        /* initial the JS, call and execute this portion */
        var menuview, windowview, infoview, opview;
        menuview = new View({
            el: "#menu-template",
            /* triggle dom, all the events and handler will be based on this dom */
            events: {
                "click .MainMenu": "runMenuMain",
                "click .SubMenu": "runMenuSub",
                "click .itemHover": "runMenuSub",
                "mouseenter .SubMenu": "runHoverMenuSub",
                "mouseleave .itemHover": "runHoverMenuSub"
            }
        });

        windowview = new View({
        /* work for window size and resolution changed */
            el: window,
            events: {
                "resize": "runWindowResize"
            }
        });

        infoview = new View({
        /* bind all elements on info div */
            el: "div.info",
            events: {
                "click #oLogout": "runInfoLogout"
            }
        });

        opview = new View({
            el: "div.user-op",
            events: {
                "click #oApply": "runOpApply",
                "click #oReload": "runOpReload",
                "click #oHelp": "runOpHelp"
            }
        });

        $.getScript("/script/bootstrap.js", function() {
            $.getScript("/script/jquery.blockUI.js", function() {
                $("div.MainMenu:first").trigger("click");
                $("div.SubMenu:first").trigger("click");
                /* initial the view, open every first item of the menu as default */
            });
        });
    });
});