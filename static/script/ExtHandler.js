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
        Ajax = $.get("/getTpl?file=snmp", function(d) {
            t = _.template(d);
            me.$el.html(t(dat)).find("table").css({
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
        Ajax = $.get("/getTpl?file=email", function(d) {
            t = _.template(d);
            me.$el.html(t(dat)).find("table").css({
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

    viewVrrp: function(o) {
    /* display of VRRPv2 page */
        var me = this, dat = me.model.attributes[1], t;
        Ajax = $.get("/getTpl?file=vrrp", function(d) {
            t = _.template(d);
            Ajax = dat;
            me.$el.html(t(dat)).find("td, th").css({
                "vertical-align": "middle",
                "text-align": "center"
            });
        }, "html");
    },

    addSvVrrpG: function(o) {
    /* add new VRRP group */
        var me = this, self = $(o.target), ct = $("div.svVRRP"), uid = new Date().getTime(), tr, td;

        tr = $("<tr />", {
            group: "Auto-" + uid
        }).appendTo(ct.find("table"));

        $("<td />", {
        }).append(
            ct.find("span.svVrrpTpl a.btnSvVrrpDelGp").clone()
        ).appendTo(tr);

        $("<td />", {
            text: "Auto-" + uid
        }).appendTo(tr);

        $("<th />", {
            colspan: 3
        }).append(
            ct.find("span.svVrrpTpl span.svVrrpNewInst").clone()
        ).appendTo(tr);

        ct.find("td, th").css({
            "vertical-align": "middle",
            "text-align": "center"
        });
    },

    updateSvVrrpGpName: function(o) {
    /* Change and update group name */
        var me = this, self = $(o.target), uid = new Date().getTime(), orgVal = self.data("group"), val = self.siblings("input").val(), inputs;
        if(!val.length) {
        /* for empty value will auto-set group name */
            val = "Auto-" + uid;
            self.siblings("input").val(val);
        }

        inputs = $("input[name^='" + orgVal + "@@']");

        console.log(inputs);
        inputs.each(function(k, v) {
            $(v).attr("name", function(i, name) {
                ov = new RegExp('^' + orgVal + '@@');
                return name.replace(ov, val + "@@", "g");
            });
            $(v).data("group", val);
            /* when update data-group, the html code will not change, but still can get the updated number with data("group") */
        });

        console.log(inputs);
    },

    deleteSvVrrp: function(o) {
    /* remove VRRP group or instance */
        var me = this, self = $(o.target), tr = self.parents("tr"), gp = self.parents("tr").attr("group");

        if(self.hasClass("btnSvVrrpDelGp")) {
            $("tr[group='" + gp + "']").hide("fast", function() {
                $(this).remove();
            });

        } else {
        /* remove an instance of a group */
            tr.hide("fast", function() {
                $(this).remove();
            });
        }

        return me.saveSNMP();
    },

    viewView: function(o) {
    /* display view log */
        var me = this, dat = me.model.attributes[1], t, txa;
        Ajax = $.get("/getTpl?file=views", function(d) {
            t = _.template(d);
            me.$el.html(t()).find("textarea").css({
                resize: "none",
                background: "#fff",
                width: "90%",
                height: "200px"
            });

            $.each(dat, function(k, v) {
                me.$el.find("textarea").val(function(i, vv) {
                    return vv + v;
                });
            });

            txa = me.$el.find("textarea");
            txa.scrollTop(
                txa[0].scrollHeight - txa.height()
            );
        }, "html");
    },

    refeshViews: function(o) {
    /* press views refresh button */
        return $("#oReload").trigger("click");
    },

    viewSyslog: function(o) {
    /* display syslog */
        var me = this, dat = me.model.attributes[1], t;
        console.log(dat);
        Ajax = $.get("/getTpl?file=syslog", function(d) {
            t = _.template(d);
            me.$el.html(t(dat));
        }, "html");
    }
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
        Ajax = $.getJSON('/service/snmp', function(d) {
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
        Ajax = $.getJSON("/service/email", function(d) {
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
    },

    vrrp: function() {
    /* vrrpv2 setting */
        var me = this;
        delete(me.model);
        delete(me.view);
        Ajax = $.getJSON("/service/vrrp", function(d) {
            me.model = new eModel(d);
            me.view = new eView({
                model: me.model,
                events: {
                    "click a.btnSvVrrpAddGp": "addSvVrrpG",
                    "click a.btnSvVrrpEditGpName": "updateSvVrrpGpName",
                    "click a.btnSvVrrpDel": "deleteSvVrrp"
                }
            });

            return me.view.viewVrrp();
        });
    },

    views: function() {
    /* Log -> view */
        var me = this;
        delete(me.model);
        delete(me.view);
        Ajax = $.getJSON("/log/view", function(d) {
            me.model = new eModel(d);
            me.view = new eView({
                model: me.model,
                events: {
                    "click a.btn": "refeshViews"
                }
            });

            return me.view.viewView();
        });
    },

    syslog: function() {
    /* Log -> Syslog */
        var me = this;
        delete(me.model);
        delete(me.view);
        Ajax = $.getJSON("/log/syslog", function(d) {
            me.model = new eModel(d);
            me.view = new eView({
                model: me.model,
                events: {
                    "change input": "saveSNMP",
                    "change select": "saveSNMP"
                }
            });

            return me.view.viewSyslog();
        });
    }
};
