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
        console.log(this.model);
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
    }
};
