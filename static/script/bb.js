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
    el: "div.popContent",
    /* initial container, most of item will refer to this, set it as default */

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
            "subtitle": self.text(),
            "current": self.attr("opt")
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
        me.$el.append(t());
        $("div.systemSummaryTimer").css({
            "position": "relative",
            "bottom": "20px",
            "right": "10px"
        });
    },

    viewSysSummary: function(tpl, id, selector) {
    /* summary display */
        var me = this, tpl = tpl || "#t_summary", id = id || "div.systemSummary", selector = me.model.attributes[selector] || me.model.attributes, t = _.template($(tpl).html());
        $(id).remove();
        /* remove and clean-up current data */
        me.$el.append(t(selector));
        /* because the SysSummaryTimer is shown before, just append it*/
        $(id).children("table").css({
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

    viewDNS: function(o) {
    /* it is about DNS get */
        var me = this, t = _.template($("#t_SystemDNS").html()), data = {"items": me.model.attributes[1]};
        me.$el.html(t(data));
        $("div.SystemDNS").children("table").css({
            "width": "100%",
            "height": "100%"
        }).find("input").css("width", "90%");
        return $("div.popContent").unblock();
    },

    viewSaveDNS: function(o) {
    /* when the input items is changed, triggler this function */
        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    viewVLAN: function(o) {
    /* it is about VLAN get */
        var me = this, t = _.template($("#t_SystemVLAN").html());
        me.$el.html(t(me.model.attributes[1]));
        $("div.SystemVLAN").children("table").css({
            "width": "100%",
            "height": "100%"
        }).find("button").css({
            "width": "90%"
        });
        return $("div.popContent").unblock();
    },

    editVlan: function(o) {
    /* add vlan item */
        var me = this, dom = $("div.addSysVLAN"), ct = $("div.SystemVLAN");

        dom.dialog({
            modal: true,
            closeOnEscape: false,
            close: function(e, u) {
                $(this).find("input").val("");
                $(this).dialog("destroy");
            },
            buttons: [{
                text: "OK",
                click: function() {
                    dom.find("input").clone().attr("type", "hidden").removeAttr("id").appendTo($("div.SystemVLAN table"));
                    me.runOpApply();
                    me.runOpReload();
                    $(this).dialog("close");
                }
            }, {
                text: "Cancel",
                click: function() {
                    $(this).dialog("close");
                }
            }]
        }).children("table").css({
            "width": "100%",
            "height": "100%",
            "text-align": "center"
        }).find("input").css({
            "width": "90%"
        });
    },

    delVlan: function(o) {
    /* delete vlan item */
        var me = this, self = $(o.target);
        self.parents("tr").hide("slow", function() {
            $(this).remove();
        });
        return me.viewSaveVLAN(o);
    },

    viewSaveVLAN: function(o) {
    /* when modify any of vlan item, display apply and able to save the value */
        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    viewBridge: function(o) {
    /* it is about Bridge get */
        var me = this, t = _.template($("#t_SystemBridge").html()), dat = me.model.attributes[1];
        me.$el.html(t(dat));
        $("div.SystemBridge").children("table").css({
            "width": "100%",
            "height": "100%"
        }).find("button").css({
            "width": function() {
                return $(this).hasClass("brAdd") ? "90%" : "45%";
            }
        });

        return $("div.popContent").unblock();
    },

    editBridge: function(o) {
    /* add new bridge, which will pop-up a jQuery dialog */
        var me = this, self = $(o.target), ct = $("div.editSystemBridge"), ck = self.text() + " " + $("span.subtitle").text(), opt;

        ct.find("input").val("");
        ct.find("tr.brInterface").remove();
        /* reset all input data and other item */

        if(self.hasClass("brEdit")) {
            /* edit existing bridge */
            opt = self.attr("opt");
            /* data for current bridge setting */
            ck += " (" + self.siblings('input[name="name"]').val() + ")";

            $("#br_name").val( self.siblings('input[name="name"]').val() );  /* name */
            $.each(self.siblings('input[name="interface"]').val().split(','), function(k, v) {  /* interface editor */
                var tr = $("<tr />").addClass("brInterface").insertAfter("tr.addBrInterface");
                $("<td />").text(v).appendTo($("tr.addBrInterface")).appendTo(tr);
                $("<td />").addClass("text-center").html($("button.btnDelBrInterface").clone(true)).appendTo(tr);
            });
            if("true" === self.siblings('input[name="STP"]').val()) {  /* stp setting */
                $("#brSTP").attr("checked", "checked");
            }
            $("#br-hello_time").val( self.siblings('input[name="hello_time"]').val() );  /* hello time setting */
            $("#br-max_message_age").val( self.siblings('input[name="max_message_age"]').val() );  /* max message age setting */
            $("#br-forward_delay").val( self.siblings('input[name="forward_delay"]').val() );  /* forward delay setting */
        }

        ct.children("table").css({
            "width": "100%",
            "height": "100%"
        }).find("input, button").css({
            "width": "90%"
        });

        ct.find(".btnSmt").css({
            "width": "30%"
        });

        ct.dialog({
            modal: true,
            title: ck,
            closeOnEscape: false,
            close: function() {
                $(this).dialog("destroy");
            },
            buttons: [{
                text: "OK",
                click: function() {
                    me.saveBridge(ct, opt);
                    $("#oApply").show("slow");
                    /* show "Apply" link/button */
                    return ct.dialog("close");
                }
            }, {
                text: "Cancel",
                click: function() {
                    $(this).dialog("close");
                }
            }]
        });
    },

    delBridge: function(o) {
    /* delete existing bridge setting */
        me = this, self = $(o.target), row = self.parents("tr"), opt = self.attr("opt"), dat = $("div.SystemBridge").data(), res = [];
        row.remove();
        delete(dat['br'][opt]);
        $.each(dat['br'], function(k, v) {
            if("undefined" !== v) {
                res.push(v);
            }
        });
        var result = {'br': res};

        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    saveBridge: function(dom, opt) {
    /*
        when click ok in dialog will save the new / edited bridge
            dom: is the dialog jquery object not whole dialog  object
            opt: when edit exist item, assign the opt as the identification. if opt is not given, means it's new one
    */
        var ct = $("div.SystemBridge").children("table"), tr = $("<tr />"), td = $("<td />"), self, row;
        if(opt) {
            /* edit exist bridge */
            self = $('.brEdit[opt="' + opt + '"]');
            row = self.parents("tr");
            row.find("td.brName").text( $("#br_name").val() );
            row.find("td.brInterface").text('(s0e2)');
            row.find('input[name="name"]').val( $("#br_name").val() );
            row.find('input[name="STP"]').val( $("#brSTP").is(":checked") );
            row.find('input[name="hello_time"]').val( $("#br-hello_time").val() );
            row.find('input[name="max_message_age"]').val( $("#br-max_message_age").val() );
            row.find('input[name="forward_delay"]').val( $("#br-forward_delay").val() );
        } else {
            $("<td />").addClass("brName").text( $("#br_name").val() ).appendTo(tr);
            $("<td />").addClass("brInterface").text('(s0e2)').appendTo(tr);
            $("div.brBtnTpl button").clone(true).attr({
                "opt": function() {
                    if($("button.brDel").size() > 0) {
                        /* now at least one bridge exists */
                        return ~~$("button.brDel:last").attr("opt") + 1;
                    } else {
                        return 0;
                    }
                }
            }).appendTo(td);
            $("#br_name").clone().removeAttr("id").attr("type", "hidden").appendTo(td);
            $("#br-Interface").clone().removeAttr("id").appendTo(td);
            $("<input />").attr({
                "type": "hidden",
                "name": "STP",
                "value": function() {
                    return $("#brSTP").is(":checked");
                }
            }).appendTo(td);
            $("#br-hello_time").clone().removeAttr("id").attr("type", "hidden").appendTo(td);
            $("#br-max_message_age").clone().removeAttr("id").attr("type", "hidden").appendTo(td);
            $("#br-forward_delay").clone().removeAttr("id").attr("type", "hidden").appendTo(td);

            td.appendTo(tr);
            tr.appendTo(ct);
        }
    },

    viewIpAddress: function(o) {
    /* ip address setup page display */
        var me = this, t = _.template($("#t_SystemIpAddress").html()), dat = me.model.attributes[1], ct = $("div.popContent");
        me.$el.html(t(dat));

        me.$el.find("table").css({
            "width": "100%",
            "height": "100%"
        }).find("select, button, input").css({
            "width": "90%"
        });

        me.$el.find("button.btnSmt").css({
            "width": "45%"
        });

        return me.$el.unblock();
    },

    changeIpAddress: function(o) {
    /* when change interface will display the matched setting */
        var val = $("#ipSelecter").val();
        $("div.SystemIpV4, div.SystemIpV6").addClass("inactive");
        $('div.SystemIpV4[opt="' + val + '"], div.SystemIpV6[opt="' + val + '"]').removeClass("inactive");
    },

    addIpAddress: function(o) {
    /* add new a ip address which will pop-up an dialog */
        var me = this, self = $(o.target), dom = $("div.IpEditor"), inf = $("#ipSelecter").val(), title;

        dom.find("input").val('');
        /* reset all input value */
        if(self.hasClass("btnSI4Add")) {
            /* add IPv4 address */
            title = $("th.IpV4title:first").text();
            $("#IpV46_address").attr("name", inf + "-ipv4_address");
            $("#IpV46_prefix").attr("name", inf + "-ipv4_prefix");
            dom.attr("opt", "SystemIpV4");
            /* set the parameter for item which tr added for */
        } else {
            /* add IPv6 address */
            title = $("th.IpV6title:first").text();
            $("#IpV46_address").attr("name", inf + "-ipv6_address");
            $("#IpV46_prefix").attr("name", inf + "-ipv6_prefix");
            dom.attr("opt", "SystemIpV6");
            /* set the parameter for item which tr added for */
        }

        $('label[for="IpV46_address"]').text(title);

        dom.dialog({
            title: title,
            modal: true,
            closeOnEscape: false,
            close: function() {
                $(this).dialog("destroy");
            },
            buttons: [{
                text: "OK",
                click: function() {
                    /* click save new ip address */
                    var tr = $("<tr />"), td = $("<td />"), ct = $('div.' + dom.attr("opt") + '[opt="' + inf + '"]').children("table"), add = $("#IpV46_address"), prefix = $("#IpV46_prefix");
                    $("<td />").text( add.val() ).appendTo(tr);
                    $("<td />").text( prefix.val() ).appendTo(tr);
                    $("span.ipv46Tpl button").clone(true).appendTo(td);
                    add.clone().removeAttr("id").attr("type", "hidden").appendTo(td);
                    prefix.clone().removeAttr("id").attr("type", "hidden").appendTo(td);
                    td.appendTo(tr);
                    tr.appendTo(ct);

                    $("#oApply").show("slow");
                    /* show "Apply" link/button */

                    dom.dialog("close");
                }
            }, {
                text: "Cancel",
                click: function() {
                    $(this).dialog("close");
                }
            }]
        });
    },

    delIpAddress: function(o) {
    /* delete exist ip address setting */
        var me = this; self = $(o.target);
        self.parents("tr").hide("slow", function() {
            $(this).remove();
        });

        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    viewRoutingTable: function(o) {
    /* routing table display */
        var me = this, t = _.template($("#t_SystemRoutingTable").html()), dat = {"items": me.model.attributes};
        me.$el.html(t(dat));

        me.$el.find("table").css({
            "width": "100%",
            "height": "100%"
        }).find("select, button, input").css({
            "width": "90%"
        });

        me.$el.find("button.btnSmt").css({
            "width": "45%"
        });

        $('ul.nav-rt li > a[href="#"]').on("click", function() {
            /* navigation tabs display contorl */
            var opt = $(this).attr("opt");
            if(!$(this).parent().hasClass("active")) {
                me.$el.find("ul.nav-tabs li").removeClass("active");
                $(this).parent().addClass("active");
                $("div.SystemRoutingTable-rt").addClass("inactive");
                $("div.SystemRoutingTable-" + opt).removeClass("inactive");
            }
        });

        return me.$el.unblock();
    },

    delRoutingTable: function(o) {
    /* delete existing routing table rule */
        me = this, self = $(o.target);
        self.parents("tr").hide("slow", function() {
            $(this).remove();
        });

        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    addRoutingTable: function(o) {
    /* add new rule for routing table */
        var me = this, self = $(o.target), opt = self.attr("opt"), dom = $("div.SystemRoutingTable-edit"), title;

        title = self.text() + " " + me.$el.find("ul.nav-rt li.active a").text();

        $("#rtIpv46Dest, #rtIpv46PreL, #rtIpv46GW, #rtIpv46Intf").attr({
            "name": function(i, v) {
                /* assign name attribute for each input field */
                return opt + "-" + $(this).attr("opt");
            }
        });

        dom.dialog({
            modal: true,
            title: title,
            closeOnEscape: false,
            open: function() {
                /* on opening, get available NIC name */
                dom.block();
                $('option[rt="new"]').remove();
                /* remove all existing NIC options and get new */
                $.getJSON("/system/getInterfaces", function(d) {
                    /* return an array of NIC names */
                    $.each(d, function(k, v) {
                        $("<option />").attr("rt", "new").val(v).text(v).appendTo("#rtIpv46Intf");
                    });
                    dom.unblock();
                });
            },
            close: function() {
                $(this).dialog("destroy");
            },
            buttons: [{
                text: "OK",
                click: function() {
                    var ct = $("div.SystemRoutingTable-" + opt).find("table"), inputs = $("#rtIpv46Dest, #rtIpv46PreL, #rtIpv46GW, #rtIpv46Intf"), td = $("<td />"), tr = $("<tr />");
                    inputs.each(function(k, v) {
                        $("<td />").text( $(this).val() ).appendTo(tr);
                    });
                    $("span.rtv46tpl button").clone(true).appendTo(td);
                    $("#rtIpv46Dest, #rtIpv46PreL, #rtIpv46GW").clone().removeAttr("id").attr("type", "hidden").appendTo(td);
                    $("<input />").attr({
                        "type": "hidden",
                        "name": function() {
                            return $("#rtIpv46Intf").attr("name");
                        },
                        "value": function() {
                            return $("#rtIpv46Intf").val();
                        }
                    }).appendTo(td);
                    td.appendTo(tr);
                    tr.appendTo(ct);

                    $("#oApply").show("slow");
                    /* show "Apply" link/button */
                    inputs.val('');
                    /* empty all input value */
                    return dom.dialog("close");
                }
            }, {
                text: "Cancel",
                click: function() {
                    $(this).dialog("close");
                }
            }]
        });
    },

    runOpApply: function(o) {
    /*
        when the form is savable, click Apply button will call this function
    */
        var me = this, current = $(".subtitle").attr("current"), data = [], url, obj;
        switch(current) {
            case "dns":
            /* for dns saving */
                url = "/system/sdns";
                obj = $("div.SystemDNS");
                break;
            case "vlan":
            /* for vlan saving */
                url = "/system/svlan";
                obj = $("div.SystemVLAN");
                break;
            case "bridge":
            /* for bridge saving */
                url = "/system/sbridge";
                obj = $("div.SystemBridge");
                break;
            case "ip":
            /* for ip address saving */
                url = "/system/sip";
                obj = $("div.SystemIpV46All");
                break;
            case "route":
                url = "/system/sroute";
                obj = $("div.SystemRoutingTable");
                break;
            default:
                break;
        }

        if(url.length) {
            obj.wrap('<form id="theForm" />');
            $.post(url, $("#theForm").serialize(), function(d) {
                console.log(d);
                if(!d[0]) {
                    if(confirm("System Fail\n\nReload the Page?")) {
                        return me.execMenu(current);
                    }
                } else {
                    return me.runOpReload();
                }
            });
        }
    },

    runOpReload: function(o) {
    /*
        when click reload link/button
        will just reload the popContent
    */
        var me = this, opt = $("span.subtitle").attr("current");
        $("#oApply").hide();
        /* hide save/apply link */
        return me.execMenu(opt);
    },

    runOpHelp: function(o) {
    /*
        when click Help link/button, will triggle this function
        for now, it's under construction
    */
        return true;
    },

    execMenu: function(o) {
    /* when click menu item will separate model/template with this function */
        try {
            clearInterval(timer);
            /* remove auto-refresh timer */
            timer_v = 0;
            /* reset auto-refresh option */
        } catch(e) {}

        $("div.popContent").block();
        try {
        /* this should be remove once every function is ready */
            return MainOperation[o]();
        } catch(e) {}
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
        $.getJSON("/system/ssys", function(d) {
            var me = this;
            if(o) {
                $('.systemSummary, systemSummaryPort').remove();
            } else {
                $('div.popContent').children().remove();

                var cview = new View({
                    events: {
                        "change #summary_timer": "setSysSummaryTimer"
                        /* set auto-refresh timer */
                    }
                });

                cview.viewSysSummaryTimer();
            }
            /* clean up popContent its children dom */

            $.getJSON("/system/s_port", function(data) {
                /* retrieval port summary information */
                var pmodel = new Model(data),
                pview = new View({
                    model: pmodel,
                    el: "div.popContent"
                });
                pview.viewSysSummary("#t_summaryPort", "div.systemSummaryPort", 1);
            });

            me.model = new Model(d);
            me.view = new View({
                model: me.model,
            });

            return me.view.viewSysSummary();
        });
    },

    dns: function(o) {
    /* get DNS setting */
        var me = this;
        $.getJSON("/system/gdns", function(d) {
            me.model = new Model(d);
            me.view = new View({
                model: me.model,
                events: {
                    "input input": "viewSaveDNS"
                }
            });

            return me.view.viewDNS();
        });
    },

    vlan: function(o) {
    /* get VLAN setting */
        var me = this;
        $.getJSON("/system/gvlan", function(d) {
            me.model = new Model(d),
            me.view = new View({
                model: me.model,
                events: {
                    "click button.btnVlanAdd": "editVlan",
                    "click button.btnVlanDel": "delVlan",
                    "input input": "viewSaveVLAN"
                }
            });

            return me.view.viewVLAN();
        });
    },

    bridge: function(o) {
    /* get Bridge setting */
        var me = this;
        $.getJSON("/system/gbridge", function(d) {
            me.model = new Model(d);
            me.view = new View({
                model: me.model,
                events: {
                    "click button.brAdd": "editBridge",
                    "click button.brDel": "delBridge",
                    "click button.brEdit": "editBridge"
                }
            });

            return me.view.viewBridge();
        });
    },

    ip: function(o) {
    /* get ip address setting */
        var me = this;
        $.getJSON("/system/gip", function(d) {
            me.model = new Model(d);
            me.view = new View({
                model: me.model,
                events: {
                    "change #ipSelecter": "changeIpAddress",
                    "click button.btnIpAdd": "addIpAddress",
                    "click button.btnIpDel": "delIpAddress"
                }
            });

            return me.view.viewIpAddress();
        });
    },

    route: function(o) {
    /* get routing table setting */
        var me = this;
        delete(me.model);
        delete(me.view);
        $.getJSON("/system/groute", function(d) {
            me.model = new Model(d);
            me.view = new View({
                model: me.model,
                events: {
                    "click button.btnRTDel": "delRoutingTable",
                    "click button.btnRTAdd": "addRoutingTable"
                }
            });

            return me.view.viewRoutingTable();
        });
    }
};

(function() {
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
            $.getScript("/script/jquery-ui.js", function() {
                $("div.MainMenu:first").trigger("click");
                $("div.SubMenu:first").trigger("click");
                /* initial the view, open every first item of the menu as default */
            });
        });
    });
}).call(this);