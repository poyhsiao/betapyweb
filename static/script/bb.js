/***
* Created by Kim Hsiao
***/

jQuery.error = console.error;
/* this is for jquery debugger */

var Model = Backbone.Model.extend({}),
/* keep the model blank if need to retrieval data from Ajax */
View = Backbone.View.extend({
/* This is the view portion for most of the object was presented in this site */
    inititalize: function() {
        /* initial the view, just for check. Not necessary */
        console.log("The view is ready");
    },

    events: {
        /* all the event handler, keep it blank and define it when necessary */
    },

    selector: function(o)  {
        /* Kim defined
            if the parmeter is not correct, selector will choose the correct method to handler the process
        */
    },

    runWindowResize: function(o) {
    /* when window size changed, everthing will change it iss attribute */
        if(!ckWindow.notDesktop() && !$("div.borderArrow").is(":hidden")) {
            /* if display is desktop and arrow is shown */
            changeResolution.changePopC();
            return changeResolution.changeArrow();
        } else {
            $("div.borderArrow").hide();
        }

        if(ckWindow.notDesktop()) {
            return $("div.popContent").css("height", "400px");
            /* in mobile device, set the height to fixed 400px */
        } else {
        /* for tablet */
            return changeResolution.changePopC();
        }
    },

    runMenuMain: function(o) {
    /* handling the click event for main menu items, o is current object which is clicked */
        var me = this, self = $(o.target), mainmenu = $("div.MainMenu"), arrow = $("div.borderArrow"), mtitle = $("span.maintitle");
        if(self.hasClass("closeMenu")) {
            $("div.openMenu").removeClass("openMenu").addClass("closeMenu").siblings("ul.inactive").slideUp("slow");
            self.removeClass("closeMenu").addClass("openMenu").siblings("ul.inactive").slideDown("slow");
            /* open selected menu which has closeMenu class name */

            if("undefined" === typeof(mtitle.attr("opt")) || self.attr("opt") === mtitle.attr("opt")) {
            /* when switch to other menu item, hide arrow image by checking the page navigation options */
                arrow.show("slow");
            } else {
                arrow.hide();
            }
        }
    },

    runMenuSub: function(o) {
    /* handling the click event for sub menu items */
        var me = this, self = $(o.target), main = self.parents("ul.inactive").siblings(".MainMenu"), model, view;

        $("div.selectItem").removeClass("selectItem").addClass("SubMenu").removeClass("itemHover");
        /* fix sometimes lost all the classname */
        self.removeClass("SubMenu").addClass("selectItem");

        model = new Model({
            "opt": main.attr("opt"),
            "maintitle": main.text(),
            "subtitle": self.text()
        });
        /* for page navigation data */

        view = new View({
            el: "#Paganation",
            model: model,
            events: {
                "click .maintitle": "runPagination",
                "click .subtitle": "runPagination"
            }
        });
        /* for page navigation control */

        changeResolution.changePopC(self).fadeIn("slow");
        changeResolution.changeArrow(self).fadeIn("slow");
        /* set both pop content and arrow to correct position and display them */

        me.execMenu(self.attr("opt"));
        /* submenu item selector and action handler */

        return view.viewPagination();
        /* display page navigation */
    },

    runHoverMenuSub: function(o) {
    /* when mouse enter or leave the sub items of the menu, will change its style */
        var me = this, self = $(o.target);
        if(!self.hasClass('selectItem')) {
            self.toggleClass('itemHover').toggleClass('SubMenu');
            /* add/remove itemHover and SubMenu for hover handle */
        }
    },

    viewPagination: function(o) {
    /* page navigation display */
        var me = this, template = _.template($("#t_pagnation").html());
        return me.$el.html(template(me.model.attributes));
    },

    runPagination: function(o) {
    /* when click item on page navigation will triggle menu click event */
        var me = this, opt = $(o.target).attr("opt");
        $("div[opt=" + opt + "]").trigger("click");
    },

    runInfoLogout: function(o) {
    /* logout the page */
        window.location = '/logout';
    },

    viewSysSummaryTimer: function(o) {
        var me = this, t = _.template($("#t_summery_control").html());
        me.$el.html(t());
        $("div.systemSummaryTimer").css({
            "position": "absolute",
            "bottom": "20px",
            "right": "10px"
        });
    },

    viewSysSummary: function(o) {
    /* summary display */
        var me = this, t = _.template($("#t_summary").html());
        $("div.systemSummary").remove();
        /* remove and clean-up current data */
        me.$el.append(t(me.model.attributes));
        /* because the SysSummaryTimer is shown before, just append it*/
        $("div.systemSummary table").css({
            "width": "100%",
            "height": "100%"
        });
        return $("div.popContent").unblock();
    },

    setSysSummaryTimer: function(o) {
    /* set Summary auto-refresh timer */
        var me = this, self = $(o.target), val;
        timer_v = self.val();
        try {
            clearInterval(timer);
            /* make sure timer is reset when everytime change the item */
        } catch(e) {}
        if("0" === timer_v) {
            if("object" == typeof(timer)) {
                clearInterval(timer);
            }
        } else {
            val = parseInt(timer_v) * 1000;
            /* conver the given value to second */
            timer = setInterval(function() {
                $("systemSummary").remove();
                MainOperation.summary("keep");
            }, val);
        }
    },

    execMenu: function(o) {
    /* when click menu item will separate model/template with this function */
        try {
            clearInterval(timer);
            /* remove auto-refresh timer */
            timer_v = 0;
            /* reset auto-refresh option */
        } catch(e) {}
        $.getScript("/script/jquery.blockUI.js", function() {
            $("div.popContent").block();
            try {
            /* this should be remove once every function is ready */
                return MainOperation[o]();
            } catch(e) {}
        });
    }
}),
ckWindow, changeResolution, menuview, windowview, infoview, MainOperation, timer, timer_v = 0;

ckWindow = {
    /* check if the device resolution */
    text: function() {
        if($(window).width() >= 1200) {
            /* it is wild or large display*/
           return "wild";
        } else if($(window).width() <= 980 && $(window).width() >= 768) {
            /* it is display between desktop and tablet */
           return "big";
        } else if($(window).width() < 768 && $(window).width() > 480) {
            /* it is tablet */
            return "tablet";
        } else if($(window).width() <= 480) {
            /* it is mobile phone */
           return "phone";
        } else {
            /* it is default and normal display */
           return "normal";
        }
    },

    isDesktop: function() {
        return $(window).width() >= 980;
    },
    isTablet: function() {
        return ($(window).width() > 480 && $(window).width() < 980);
    },
    isPhone: function() {
        return ($(window).width() <= 480);
    },
    notDesktop: function() {
        return ($(window).width() < 768);
    },
    notTablet: function() {
        return (($(window).width() < 768 && $(window).width() > 480) || ($(window).width() > 980));
    },
    notPhone: function() {
        return ($(window).width() > 480);
    }
};

changeResolution = {
  /* define relative DOM position for initial or change resolution. this is defined as private method */
  pop: $("div.popContent"),
  arrow: $("div.borderArrow"),

  changePopC: function(op) {
    /* for the height of popContent adjustment */
    var pop = this.pop;
    pop.css({
      height: function() {
        var border = 60;
        /* this is work for define all the border width */
        val = $(window).height() - $("div.head").outerHeight() - $("div.info").outerHeight() - $("div.footer").outerHeight() - border + "px";
        return val;
      }
    });
    return (ckWindow.notDesktop()) ? pop.css("margin", "0px") : pop.css("margin", "0 0 0 -60px");
  },

  changeArrow: function(op) {
    /* change the position of the arrow image, if op is given as the jquery obj, the position will be located based on given op */
    var actopt = $("span.subtitle").attr("opt"),
    pop = $("div.popContent"),
    itm = op || $("div[opt=" + actopt +"]"),
    // offset = ("wild" == ckWindow.text()) ? 40 : 50,
    bias = -30,
    offset = -60,
    arrow = this.arrow;
    arrow.css({
      top: function() {
        return itm.position().top + "px";
      },
      left: function() {
        // return itm.position().left + itm.width() - offset + "px";
        return pop.position().left + bias + offset + "px";
      }
    }).addClass("hidden-phone");
    return op ? arrow : true;
  }
};

MainOperation = {
    view: '',
    model: '',
    summary: function(o) {
    /*
        system summary handling
        o: keep the auto-refresh item or not, if not set, will remove all
    */
        $.getJSON("/system/summary", function(d) {
            var me = this, cview;
            if(o) {
                $('#systemSummary').remove();
            } else {
                $('div.popContent').children().remove();

                cview = new View({
                    el: "div.popContent",
                    events: {
                        "change #summary_timer": "setSysSummaryTimer"
                        /* set auto-refresh timer */
                    }
                });

                cview.viewSysSummaryTimer();
            }
            /* clean up popContent its children dom */

            if('' !== me.model) {
                delete me.model;
            }
            if('' !== me.view) {
                delete me.view;
            }

            me.model = new Model(d);
            me.view = new View({
                model: me.model,
                el: "div.popContent"
            });

            return me.view.viewSysSummary();
        });
    }
};

(function() {
/* initial the JS, call and execute this portion */
    var menuview, windowview, infoview;
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

    $.getScript("/script/bootstrap.js", function() {
        $("div.MainMenu:first").trigger("click");
        $("div.SubMenu:first").trigger("click");
        /* initial the view, open every first item of the menu as default */
    });
}).call(this);