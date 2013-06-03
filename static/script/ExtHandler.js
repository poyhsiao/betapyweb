/*
 * It's the extended js which will handle service, stats, and any other main menu operation
 * Author: Kim Hsiao
 * Date: 2013/05/31
 */

var eModel = Backbone.Model.extend({});

var eView = Backbone.View.extend({
    el: "div.popContent",
    events: {},
    inititalize: function() {
        console.log("eView is ready");
    },

    viewSNMP: function(o) {
    /* display snmp page  */
        var me = this, dat = me.model.attributes[1], t ;
        $.get("/getTpl?file=snmp", function(d) {
            t = _.template(d);
            me.$el.empty().html(t(dat)).find("table").css({
                width: "100%",
                height: "100%"
            }).find("input[type=text]").css({
                width: "90%"
            });

            require(['bsSwitch'], function() {
                me.$el.find("input[type=checkbox]").wrap('<div class="switch" data-on="primary" data-off="danger" data-on-label="<i class=\'icon-ok icon-white\'></i>" data-off-label="<i class=\'icon-remove\'></i>">').parent().bootstrapSwitch();

                $("#svSNMPEnable").parent().bootstrapSwitch('setState', dat["enable"]);
            });
        }, "html");
    },

    saveSNMP: function(o) {
    /* try to save SNMP setting */
        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    viewEmail: function(o) {
    /* display email page */
        var me = this, dat = me.model.attributes[1], t;
        $.get("/getTpl?file=email", function(d) {
            t = _.template(d);
            me.$el.empty().html(t(dat)).find("table").css({
                width: "100%",
                height: "100%"
            }).find("th, td").css({
                "text-align": "center"
            });

            me.$el.find("div.svToEamil").css({
                width: "100%"
            });

            require(["bsSwitch"], function() {
                me.$el.find("input[type=checkbox]").wrap('<div class="switch" data-on="primary" data-off="danger" data-on-label="<i class=\'icon-ok icon-white\'></i>" data-off-label="<i class=\'icon-remove\'></i>">').parent().bootstrapSwitch();

                me.changeEmail();
            });

            $("div.svEmail").on("click", "a.btn", function() {
            /* add or delete To email */
                var self = $(this), td = self.parents("td"), set;

                if(self.hasClass("btnAddToEmail")) {
                /* add new email */
                    set = self.parents("div.svToEamil").clone(true);
                    set.find("input").val('');
                    set.find(".btn").removeClass("disabled");
                    set.appendTo(td);
                } else if(self.hasClass("btnDelToEmail")){
                /* remove email */
                    if($("div.svToEamil").size() > 1) {
                        set = self.parents("div.svToEamil").remove();
                    }
                }
            });
        }, "html");
    },

    changeEmail: function(o) {
    /* when change email notification setting */
        var ct = $("div.svEmail");
        if(true === ct.find("input[type=checkbox]").is(":checked")) {
            ct.find("tbody tr").removeClass("inactive");
        } else {
            ct.find("tbody tr").addClass("inactive");
        }
    },
});

var ExtHandler = {
    /* extend handler for main menu operation */
    model: false,
    view: false,
    snmp: function() {
    /* snmp handler */
        var me = this;
        delete(me.model);
        delete(me.view);
        $.getJSON('/service/snmp', function(d) {
            me.model = new eModel(d),
            me.view = new eView({
                model: me.model,
                events: {
                    "change div.svSNMP input": "saveSNMP"
                }
            });

            return me.view.viewSNMP();
        });
    },

    email: function() {
    /* snmp email notification */
        var me = this;
        delete(me.model);
        delete(me.view);
        $.getJSON("/service/email", function(d) {
            me.model = new eModel(d);
            me.view = new eView({
                model: me.model,
                events: {
                    "switch-change div.switch": "changeEmail",
                    "change div.svEmail input": "saveSNMP"
                }
            });

            return me.view.viewEmail();
        });
    }
};
