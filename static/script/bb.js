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

            if(_.isUndefined(mtitle.attr("opt")) || self.attr("opt") === mtitle.attr("opt")) {
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
        var me = this, dat = me.model.attributes, t;
        Ajax = $.get("/getTpl?file=pagnation", function(d) {
            t = _.template(d);
            me.$el.html(t(dat));
        }, "html");
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

    viewSysSummaryTimer: function(d, kp) {
    /* d is important now, which include data passed from system information */
        var me = this, t, smodel, sview, updateInfo;

        updateInfo = function() {
            var dat = d;
            Ajax = $.getJSON("/system/s_port", function(data) {
                /* retrieval port summary information */
                var pmodel = new Model(data),
                pview = new View({
                    model: pmodel
                });
                pview.viewSysSummary("summary_port", "div.systemSummaryPort", 1);
            });

            smodel = new Model(dat);
            sview = new View({
                model: smodel,
            });

            return sview.viewSysSummary();
        };

        if(!kp) {
            Ajax = $.get("/getTpl?file=summary_control", function(d) {
                t = _.template(d);
                me.$el.append(t());

                $("div.borderArrow").show("fast");
                /* show arrow image */

                $("div.systemSummaryTimer").css({
                    "position": "relative",
                    "bottom": "20px",
                    "right": "10px"
                });


                updateInfo();
            }, "html");
        } else {
            return updateInfo();
        }
    },

    viewSysSummary: function(file, id, selector) {
    /* summary display */
        var me = this, id = id || "div.systemSummary", selector = me.model.attributes[selector] || me.model.attributes, f = file || "summary", t;
        $(id).remove();
        /* remove and clean-up current data */

        Ajax = $.get("/getTpl?file=" + f, function(d) {
            t = _.template(d)
            me.$el.append(t(selector));
            /* because the SysSummaryTimer is shown before, just append it*/

            $(id).children("table").css({
                "width": "100%",
                "height": "100%"
            });

            require(['blockUI'], function() {
                return $("div.popContent").unblock();
            });
        }, "html");
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
                $(".systemSummary, .systemSummaryPort").remove();
                MainOperation.summary("keep");
            }, val);
        }
    },

    viewDNS: function(o) {
    /* it is about DNS get */
        var me = this, dat = {"items": me.model.attributes[1]}, t;
        Ajax = $.get("/getTpl?file=dns", function(d) {
            t = _.template(d);
            me.$el.html(t(dat));

            $("div.borderArrow").show("fast");
            /* show arrow image */

            $("div.SystemDNS").find("table").css({
                "width": "100%",
                "height": "100%"
            }).find("input").css("width", "90%");
        }, "html");
    },

    viewSaveDNS: function(o) {
    /* when the input items is changed, triggler this function */
        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    viewVLAN: function(o) {
    /* it is about VLAN get */
        var me = this, dat = me.model.attributes[1], t;
        Ajax = $.get("/getTpl?file=vlan", function(d) {
            t = _.template(d);
            me.$el.html(t(dat));

            $("div.borderArrow").show("fast");
            /* show arrow image */

            $("div.SystemVLAN").children("table").css({
                "width": "100%",
                "height": "100%"
            }).find("button").css({
                "width": "90%"
            });
        }, "html");
    },

    editVlan: function(o) {
    /* add vlan item */
        var me = this, dom = $("div.addSysVLAN"), ct = $("div.SystemVLAN");

        require(['jqueryUI'], function() {
            dom.dialog({
                modal: true,
                closeOnEscape: false,
                width: "auto",
                open: function() {
                    dom.block();
                    /* block dialog when getting interface data */
                    $('option[vl="new"]').remove();
                    /* remove all existing NIC options and get new */
                    Ajax = $.getJSON("/system/getInterfaces", function(d) {
                        /* return an array of NIC names */
                        $.each(d["real"], function(k, v) {
                            $("<option />").attr("vl", "new").val(v).text(v).appendTo("#lan-interface");
                        });

                        dom.unblock();
                    });
                },
                close: function(e, u) {
                    dom.find("input").val("");
                    dom.dialog("destroy");
                },
                buttons: [{
                    text: "OK",
                    click: function() {
                        $("<input />").attr({
                            "type": "hidden",
                            "value": $("#lan-interface").val(),
                            "name": $("#lan-interface").attr("name")
                        }).appendTo($("div.SystemVLAN table"));
                        dom.find("input").clone().removeAttr("id").attr("type", "hidden").appendTo($("div.SystemVLAN table"));
                        me.runOpApply();
                        me.runOpReload();
                        dom.dialog("close");
                    }
                }, {
                    text: "Cancel",
                    click: function() {
                        dom.dialog("close");
                    }
                }]
            });
        });
    },

    delVlan: function(o) {
    /* delete vlan item */
        var me = this, self = $(o.target);
        self.parents("tr").hide("fast", function() {
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
        var me = this, dat = me.model.attributes[1], t;
        Ajax = $.get("/getTpl?file=bridge", function(d) {
            t = _.template(d);
            me.$el.html(t(dat));

            $("div.borderArrow").show("fast");
            /* show arrow image */

            $("div.SystemBridge").children("table").css({
                "width": "100%",
                "height": "100%"
            }).find("button").css({
                "width": function() {
                    return $(this).hasClass("brAdd") ? "90%" : "45%";
                }
            });
        }, "html");
    },

    editBridge: function(o) {
    /* add new bridge, which will pop-up a jQuery dialog */
        var me = this, self = $(o.target), dom = $("div.editSystemBridge").clone(), ck = self.text() + " " + $("span.subtitle").text(), sel = dom.find("select.nicSelect"), opt, title;

        dom.on("click", "button.btnDelBrInterface", function() {
        /* clicking delete bridge interface */
            var opt = $(this).attr("opt");
            $("<option />").attr("br", "new").val(opt).text(opt).appendTo(sel);
            $(this).parents("tr.brInterface").hide("fast", function() {
               $(this).remove();
            });
        });

        dom.on("click", "button.btnAddBrInterface", function() {
        /* clicking add bridge interface */
            if($(sel).find("option").size()) {
                var val = $(sel).val(), op = $(sel).children('option[value="' + val + '"]'), tr = $("<tr />").addClass("brInterface").insertAfter("tr.addBrInterface:last");
                op.remove();
                /* remove selected item */
                $("<td />").text(val).appendTo($("tr.addBrInterface:last")).appendTo(tr);
                $("<td />").addClass("text-center").append( $("span button.btnDelBrInterface:last").clone().attr("opt", val) ).appendTo(tr);
            }
        });

        require(['jqueryUI'], function() {
            dom.dialog({
                modal: true,
                title: ck,
                closeOnEscape: false,
                width: "auto",
                open: function() {
                    dom.block();
                    /* enable mask before everything is ready */

                    //dom.find(".switch").bootstrapSwitch();
                    require(['bsSwitch'], function() {
                        dom.find("input[type=checkbox]").wrap('<div class="switch" data-on="primary" data-off="danger" data-on-label="<i class=\'icon-ok icon-white\'></i>" data-off-label="<i class=\'icon-remove\'></i>">').parent().bootstrapSwitch();
                    });

                    me.$el.children("table").css({
                        width: "100%",
                        height: "100%"
                    }).find('input[type="number"], select, button').css({
                        width: "90%"
                    });

                    if(!$("#br-hello_time").children("option").size()) {
                    /* hello time range is 1 to 10 */
                        for(i = 1; i < 11; i++) {
                            $("<option />").val(i).text(i).appendTo(dom.find("#br-hello_time"));
                        }
                    }

                    if(!$("#br-max_message_age").children("option").size()) {
                    /* max message age range is 6 to 41 */
                        for(i = 6; i < 41; i++) {
                            $("<option />").val(i).text(i).appendTo(dom.find("#br-max_message_age"));
                        }
                    }

                    if(!$("#br-forward_delay").children("option").size()) {
                    /* forward delay range is 2 to 31 */
                        for(i = 2; i < 31; i++) {
                            $("<option />").val(i).text(i).appendTo(dom.find("#br-forward_delay"));
                        }
                    }

                    Ajax = $.getJSON("/system/getInterfaces", function(d) {
                        var dat = d["interface"], cif = [], inf = self.attr("opt");
                        /* available interfaces as an array */

                        me.$el.find('input[name="interface"]').each(function(k, v) {
                            cif = _.union(cif, $(v).val().split(","));
                            /* remove all interfaces is exists in other bridge */
                        });

                        dat = _.difference(dat, cif);
                        /* find the oterh available interfaces */

                        if(self.hasClass("brEdit")) {
                        /* edit existing bridge */
                            self.siblings("input").each(function(k, v) {
                                var vname = $(v).attr("name");
                                if("interface" === vname) {
                                    cif = $(v).val().split(',');
                                    /* re-generate the interfaces as an array */
                                    $.each(dat, function(kk, vv) {
                                        /* generate available interfaces options */
                                        $("<option />").attr("br", "new").val(vv).text(vv).appendTo(sel);
                                    });

                                    $.each(cif, function(kk, vv) {
                                        /* generate exists interfaces */
                                       var tr = $("<tr />").addClass("brInterface").insertAfter("tr.addBrInterface:last"), td = $("<td />").addClass("text-center");
                                       $("<td />").text(vv).appendTo(tr);
                                       $("span.brBtnTpl button.btnDelBrInterface:last").clone().attr("opt", vv).appendTo(td);
                                       td.appendTo(tr);
                                    });

                                } else if("STP" === vname) {
                                    if("true" === $(v).val()) {
                                        dom.find('input[name="' + vname + '"]').trigger("click");
                                        /* make sure checkbox is checked on all browsers */
                                    }
                                } else {
                                    dom.find('select[name="' + vname + '"]').val( $(v).val() );
                                    if("name" === vname) {
                                        dom.find("span.br_name").text( $(v).val() );
                                    }
                                }
                            });

                            dom.dialog({title: dom.dialog("option", "title") + " - " + self.attr("opt")});
                            /* update dialog title */
                        } else {
                        /* add new bridge */
                            dom.find("span.br_name").text("Auto");
                            $("#br_name").val(_.uniqueId("Auto-"));
                            /* auto set bridge name, set New */

                            $.each(dat, function(k, v) {
                               $("<option />").attr("br", "new").val(v).text(v).appendTo(sel);
                            });
                        }

                        dom.find("button").css("width", "90%");

                        dom.unblock();
                    });
                },
                close: function() {$('option[br="new"]').remove();
                    /* remove all added options*/
                    $("tr.brInterface").remove();
                    /* remove all interfaces for previous setting */
                    dom.find('input[type="hidden"], select').val('');
                    dom.find('input[type="checkbox"]').removeAttr("checked");

                    dom.find(".switch").bootstrapSwitch("destroy");
                    dom.find("input[type=checkbox]").parent().unwrap();

                    dom.off("click");

                    dom.dialog("destroy");
                },
                buttons: [{
                    text: "OK",
                    click: function() {
                        if(self.hasClass("brEdit")) {
                        /* edit existing bridge */
                            var tr = self.parents("tr"), interfaces;
                            interfaces = dom.find("tr.brInterface").map(function() {
                                return $(this).children("td:first").text();
                            }).get().join();
                            tr.find("td.brInterface").text(interfaces);
                            dom.find('select[name]').each(function(k, v) {
                                var name = $(v).attr("name"), val = $(v).val();
                                tr.find('input[name="' + name + '"]').val(val);
                            });
                            tr.find('input[name="interface"]').val(interfaces);
                        } else {
                        /* add new bridge */
                            var tr = $("<tr />").appendTo($("div.SystemBridge table")), td = $("<td />"), val = $("#br_name").val(), interfaces;
                            interfaces = dom.find("tr.brInterface").map(function() {
                                return $(this).children("td:first").text();
                            }).get().join();
                            console.log(interfaces);
                            $("<td />").text( $("#br_name").val() ).appendTo(tr);
                            $("<td />").addClass("brInterface").text(interfaces).appendTo(tr);
                            dom.find("span.brBtnTpl button.brDel").clone().css("width", "45%").attr("opt", val).appendTo(td);
                            dom.find("span.brBtnTpl button.brEdit").clone().css("width", "45%").attr("opt", val).appendTo(td);
                            dom.find('input, select[name]').each(function(k, v) {
                                var name = $(v).attr("name"), val = $(v).val();
                                if("STP" === name) {
                                    $("<input />").attr({
                                        name: name,
                                        type: "hidden"
                                    }).val( $(v).is(":checked").toString() ).appendTo(td);
                                } else {
                                    $("<input />").attr({
                                        name: name,
                                        type: "hidden"
                                    }).val(val).appendTo(td);
                                }
                            });
                            $("<input />").attr({
                                name: "interface",
                                type: "hidden"
                            }).val(interfaces).appendTo(td);

                            td.appendTo(tr);
                        }

                        $("#oApply").show("fast");

                        return dom.dialog("close");
                    }
                }, {
                    text: "Cancel",
                    click: function() {
                        return dom.dialog("close");
                    }
                }]
            });
        });
    },

    delBridge: function(o) {
    /* delete existing bridge setting */
        me = this, self = $(o.target);
        self.parents("tr").hide("fast", function() {
            $(this).remove();
        });

        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    viewIpAddress: function(o) {
    /* ip address setup page display */
        var me = this, dat = me.model.attributes[1], t;
        Ajax = $.get("/getTpl?file=ip_address", function(d) {
            t = _.template(d);
            me.$el.html(t(dat));

            $("div.borderArrow").show("fast");
            /* show arrow image */

            me.$el.find("table").css({
                "width": "100%",
                "height": "100%"
            }).find("select, button, input").css({
                "width": "90%"
            });

            me.$el.find("button.btnSmt").css({
                "width": "45%"
            });
        }, "html");
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

        require(['jqueryUI'], function() {
            dom.dialog({
                title: title,
                modal: true,
                closeOnEscape: false,
                width: "auto",
                close: function() {
                    dom.wrap("<form />");
                    dom.parent()[0].reset();
                    dom.unwrap();
                    dom.dialog("destroy");
                },
                buttons: [{
                    text: "OK",
                    click: function() {
                        /* click save new ip address */
                        var tr = $("<tr />"), td = $("<td />"), ct = $('div.' + dom.attr("opt") + '[opt="' + inf + '"]').children("table"), add = $("#IpV46_address"), prefix = $("#IpV46_prefix");
                        $("<td />").text( add.val() ).appendTo(tr);
                        $("<td />").text( prefix.val() ).appendTo(tr);
                        $("span.ipv46Tpl button").clone(true).css("width", "90%").appendTo(td);
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
                        dom.dialog("close");
                    }
                }]
            });
        });
    },

    delIpAddress: function(o) {
    /* delete exist ip address setting */
        var me = this; self = $(o.target);
        self.parents("tr").hide("fast", function() {
            $(this).remove();
        });

        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    viewRoutingTable: function(o) {
    /* routing table display */
        var me = this, dat = {"items": me.model.attributes}, t;
        Ajax = $.get("/getTpl?file=routing_table", function(d) {
            t = _.template(d);
            me.$el.html(t(dat));

            $("div.borderArrow").show("fast");
            /* show arrow image */

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
                // navigation tabs display contorl
                var opt = $(this).attr("opt");
                if(!$(this).parent().hasClass("active")) {
                    me.$el.find("ul.nav-tabs li").removeClass("active");
                    $(this).parent().addClass("active");
                    $("div.SystemRoutingTable-rt").addClass("inactive");
                    $("div.SystemRoutingTable-" + opt).removeClass("inactive");
                }
            });
        }, "html");
    },

    delRoutingTable: function(o) {
    /* delete existing routing table rule */
        me = this, self = $(o.target);
        self.parents("tr").hide("fast", function() {
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

        require(['jqueryUI'], function() {
            dom.dialog({
                modal: true,
                title: title,
                closeOnEscape: false,
                width: "auto",
                open: function() {
                    /* on opening, get available NIC name */
                    dom.block();
                    $('option[rt="new"]').remove();
                    /* remove all existing NIC options and get new */
                    Ajax = $.getJSON("/system/getInterfaces", function(d) {
                        /* return an array of NIC names */
                        $.each(d["all"], function(k, v) {
                            $("<option />").attr("rt", "new").val(v).text(v).appendTo("#rtIpv46Intf");
                        });
                        dom.unblock();
                    });
                },
                close: function() {
                    // inputs.val('');
                    dom.wrap("<form />");
                    dom.parent()[0].reset();
                    dom.unwrap();
                    /* empty all input value */
                    $(this).dialog("destroy");
                },
                buttons: [{
                    text: "OK",
                    click: function() {
                        var ct = $("div.SystemRoutingTable-" + opt).find("table"), inputs = $("#rtIpv46Dest, #rtIpv46PreL, #rtIpv46GW, #rtIpv46Intf"), td = $("<td />"), tr = $("<tr />");
                        inputs.each(function(k, v) {
                            $("<td />").text( $(this).val() ).appendTo(tr);
                        });
                        $("span.rtv46tpl button").clone(true).css("width", "90%").appendTo(td);
                        $("#rtIpv46Dest, #rtIpv46PreL, #rtIpv46GW").clone().removeAttr("id").attr("type", "hidden").appendTo(td);
                        $("<input />").attr({
                            "type": "hidden",
                            "name": $("#rtIpv46Intf").attr("name"),
                            "value": $("#rtIpv46Intf").val()
                        }).appendTo(td);
                        td.appendTo(tr);
                        tr.appendTo(ct);

                        $("#oApply").show("slow");
                        /* show "Apply" link/button */
                        return dom.dialog("close");
                    }
                }, {
                    text: "Cancel",
                    click: function() {
                        $(this).dialog("close");
                    }
                }]
            });
        });
    },

    viewArpTable: function(o) {
    /* ip address setup page display */
        var me = this, dat = me.model.attributes[1], t;
        Ajax = $.get("/getTpl?file=arp_table", function(d) {
            $.each(dat, function(k, v) {
                v["protocol"] = k.split("_")[0];
                v["type"] = k.split("_")[1];
            });

            dat = {"items" : dat};

            t = _.template(d);
            me.$el.html(t(dat));

            $("div.borderArrow").show("fast");
            /* show arrow image */

            me.$el.find("table").css({
                "width": "100%",
                "height": "100%"
            }).find("select, button, input").css({
                "width": "90%"
            });

            me.$el.find("button.btnSmt").css({
                "width": "45%"
            });

            $("div.SystemArpTable").find("a:first").trigger("click");

            require(['bsSwitch'], function() {
                me.$el.find("input[type='checkbox']").one("change", function() {
                    $("#oApply").show("slow");
                    /* show "Apply" link/button */
                }).wrap('<div class="switch" data-on="primary" data-off="danger" data-on-label="<i class=\'icon-ok icon-white\'></i>" data-off-label="<i class=\'icon-remove\'></i>">').parent().bootstrapSwitch();
            });

        }, "html");
    },

    delArpTable: function(o) {
    /* delete existing arp static ip */
      var me = this, self = $(o.target);
      self.parents("tr").hide("fast", function() {
          $(this).remove();
      });

      $("#oApply").show("slow");
      /* show "Apply" link/button */
    },

    addArpTable: function(o) {
    /* add new arp static ip */
        var me = this, self = $(o.target), dom = $("div.editSystemArpTable"), title = $("div.SystemArpTable").find("li.active").children("a").text(), opt = self.attr("opt"), apt = $("#arp-" + opt).children("table");

        require(['jqueryUI'], function() {
            dom.dialog({
                modal: true,
                title: title,
                closeOnEscape: false,
                width: "auto",
                open: function() {
                    $('option[arp="new"]').remove();
                    /* remove listed interfaces */
                    dom.block();
                    Ajax = $.getJSON("/system/getInterfaces", function(d) {
                        /* return an array of NIC names */
                        $.each(d["interface"], function(k, v) {
                            $("<option />").attr("arp", "new").val(v).text(v).appendTo("#editArpInterface");
                        });
                        dom.unblock();
                    });
                },
                close: function() {
                    dom.wrap("<form />");
                    dom.parent()[0].reset();
                    dom.unwrap();
                    dom.dialog("destroy");
                },
                buttons: [{
                    text: "OK",
                    click: function() {
                        var tr = $("<tr />").appendTo(apt), td = $("<td />"), btn = dom.find("button.btnArpDel").clone(true).css("width", "90%");
                        $("<td />").text( $("#editArpInterface").val() ).appendTo(tr);
                        $("<td />").text( $("#editArpIp").val() ).appendTo(tr);
                        $("<td />").text( $("#editArpMac").val() ).appendTo(tr);
                        btn.appendTo(td);
                        dom.find("input, select").each(function(k, v) {
                            $("<input />").attr({
                                type: "hidden",
                                name: function() {
                                    return opt + "-" + $(v).attr("name");
                                }
                            }).val($(v).val()).appendTo(td);
                        });
                        td.appendTo(tr);

                        $("#oApply").show("slow");
                        /* show "Apply" link/button */

                        return dom.dialog("close");
                    }
                }, {
                    text: "Cancel",
                    click: function() {
                        dom.dialog("close");
                    }
                }]
            });
        });
    },

    viewDateTime: function(o) {
    /* date time setup page display */
        var me = this, dat = me.model.attributes[1], t;
        Ajax = $.get("/getTpl?file=datetime", function(d) {
            t = _.template(d);
            me.$el.html(t(dat));

            $("div.borderArrow").show("fast");
            /* show arrow image */

            me.$el.find('input[opt="dt"]').trigger("click");

            $("#oApply").hide();
            /* hide "Apply" link/button, which may appear because of the timepicker */
        }, "html");
    },

    editDateTime: function(o) {
    /* date time configuration */

        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    choiceDateTime: function(o) {
    /* show date/time selector */
        var me = this, self = $(o.target);
        if("date" === self.attr("name")) {
        /* date selector */
            require(['jqueryUI'], function() {
                return self.datepicker({
                    "dateFormat": "yy/mm/dd"
                });
            });
        } else {
        /* time selector */
            require(['timepicker'], function() {
                return self.timepicker({
                    minuteStep: 1,
                    secondStep: 5,
                    showInputs: false,
                    template: 'modal',
                    showSeconds: true,
                    showMeridian: false
                });
            });
        }
    },

    viewDiagnostic: function(o) {
    /* show diagnostic tools page */
        var me = this, t;
        Ajax = $.get("/getTpl?file=diagnostic", function(d) {
            t = _.template(d);
            me.$el.html(t()).find("textarea").css({
                resize: "none",
                background: "#fff",
                width: "90%",
                height: "200px"
            });

            $("div.borderArrow").show("fast");
            /* show arrow image */

        }, "html");
    },

    controlDiagnostic: function(o) {
    /* control all button events for diagnostic tools */
        var me = this, self = $(o.target), ct = $("textarea.dtARPoutput"), opt = self.attr("opt");
        if(self.hasClass("dtStartArpN-snd")) {  /* ARP & NDP fix */
            self.addClass("disabled");
            $("button.dtStartArpN-stp").removeClass("disabled");
            return Ajax = $.getJSON("/system/start_arping", function(d) {
                if(true === d[0]) {
                    $("div.dtDialog").appendTo("body").modal();
                    $("div.dtDialog").on("hide", function() {
                        self.removeClass("disabled");
                        $("button.dtStartArpN-stp").addClass("disabled");
                    });
                }
            });
        } else if(self.hasClass("dtStartArpN-stp") && !self.hasClass("disabled")) {  /* force stop ARP & NDP fix */
            return Ajax = $.getJSON("/system/stop_arping", function(d) {
                if(true === d[0]) {
                    $("div.dtDialog").appendTo("body").modal();
                    $("div.dtDialog").on("hide", function() {
                        self.removeClass("disabled");
                        $("button.dtStartArpN-stp").addClass("disabled");
                    });
                }
            });
        }

        if(!!$("#dtPingTracertName").val().length) {
            if(self.hasClass("start")) {  /* start to ping/traceroute the target */
                ct.wrap("<div />").parent().block();
                $("button.start").addClass("disabled");
                $("button.btnDtArpPT").removeClass("disabled").attr("opt", opt);
                return $.post("/system/start_" + opt, {"address": $("#dtPingTracertName").val()}, function(d) {
                    ct.val(d[1]);
                    $("button.start").removeClass("disabled");
                    $("button.btnDtArpPT").addClass("disabled").removeAttr("opt");
                    ct.parent().unblock();
                    ct.unwrap();
                }, "json");
            }
        }

        if(self.hasClass("stop") && !!self.attr("opt")) {  /* stop pinging / traceroute the target */
            Ajax = $.getJSON("/system/stop_" + opt, function(d) {
                ct.val('Terminated');
                $("button.start").removeClass("disabled");
                self.addClass("disabled").removeAttr("opt");
                ct.parent().unblock();
                ct.unwrap();
            });
        }
    },

    viewAdmin: function(o) {
    /* display admin page */
        var me = this, dat = me.model.attributes[1], t, conf_file, fw_file;
        Ajax = $.get("/getTpl?file=admin", function(d) {
            t = _.template(d);
            me.$el.html(t(dat)).find("table").css({
                width: "100%",
                height: "100%"
            }).find("button.btn, input[type='file']").css({
                width: function() {
                    if($(this).hasClass("btnSaAddAccount")) {
                        return "90%";
                    } else if($(this).hasClass("btnSaEditAccount") || $(this).hasClass("btnSaDelAccount")) {
                        return "45%";
                    } else {
                        return "90%";
                    }
                }
            });

            $("div.borderArrow").show("fast");
            /* show arrow image */

            require(['fileupload'], function() {
                conf_file = $("#fileUSConf");
                fw_file = $("#fileFWUpdate");

                conf_file.fileupload({
                /* configuration file upload */
                    url: "/system/supload_conf",
                    add: function(e, d) {
                        console.log(d);
                        $("button.btnFileUSConf").removeClass("inactive").one("click", function() {
                            $(this).text("Uploading...");
                            d.submit();
                        });
                    },
                    done: function(e, d) {
                    /* TBD */
                        var res = d.response();
                        console.log(res.result);
                        /* return information */
                    }
                });

                fw_file.fileupload({
                /* firmware file upload */
                    url: "/system/supload_fw",
                    add: function(e, d) {
                        console.log(d);
                        $("button.btnFileFWUpload").removeClass("inactive").one("click", function() {
                            $(this).text("Uploading...");
                            d.submit();
                        });
                    },
                    done: function(e, d) {
                    /* TBD */
                        var res = d.response();
                        console.log(res.result);
                        /* return information */
                    }
                });
            });

            require(['bsSwitch'], function() {
                $(".switch").bootstrapSwitch();
                /* enable iphone style switch */
            });

            $("div.SystemAdmin").on("click", "a[opt=cli]", function() {
            /* get SSH/Telnet status from server */
                Ajax = $.getJSON("/system/cli", function(d) {
                    var res = d[1];
                    if(true === d[0]) {
                        $("#sshEnable").parents(".switch").bootstrapSwitch('setState', res['ssh']);
                        $("#telnetEnable").parents(".switch").bootstrapSwitch('setState', res['telnet']);
                    }

                    $("input[type='checkbox']").parents('.switch').on("switch-change", function(e, d) {
                        $("#oApply").show("slow");
                        /* show "Apply" link/button */
                    });
                });
            });
        }, "html");
    },

    editAdmin: function(o) {
    /* edit/add user account */
        var me = this, self = $(o.target), prefix = self.text(), dom = $("div.editSaAccount"), ed, title, str;

        if(self.hasClass("btnSaAddAccount")) {
        /* new user */
            ed = "new";
            title = prefix;
            dom.find('input[name="name"]').removeAttr("readonly");
        } else {
        /* edit user */
            ed = "edit";
            str = self.siblings('input[name="name"]').val();
            title = prefix + ' - ' + str;

            dom.find('input[name="name"]').attr("readonly", "readonly");
            $.each(self.siblings("input"), function(k, v) {
                dom.find('input[name="' + $(v).attr("name") + '"]').val($(v).val());
            });

            dom.find("select").val( self.siblings('input[name="group"]').val() );
            $("#saAddEditConfirm").val( self.siblings('input[name="password"]').val() );
        }

        require(['jqueryUI', 'bsSwitch'], function() {
            dom.dialog({
                modal: true,
                closeOnEscape: false,
                title: title,
                width: "auto",
                close: function() {
                    dom.wrap("<form />");
                    dom.parent()[0].reset();
                    dom.unwrap();
                    dom.find("option").removeAttr("selected");
                    dom.dialog("destroy");
                },
                buttons: [{
                    text: "Ok",
                    click: function() {
                        if("new" === ed) {
                        /* add new account */
                            var tr = $("<tr />").appendTo(self.parents("table")), tpl = $("span.saAdminTpl").clone(), td = $("<td />"), name = dom.find('input[name="name"]').val();
                            $("<td />").text(name).appendTo(tr);
                            $("<td />").text( dom.find('select[name="group"]').val() ).appendTo(tr);
                            dom.find('input[name], select').each(function(k, v) {
                                tpl.find('input[name="' + $(v).attr("name") + '"]').val($(v).val());
                            });
                            tpl.find("button").attr("opt", name).css("width", "45%");
                            $("<td />").append(tpl.children()).appendTo(tr);

                        } else {
                        /* edit existing account */
                            $.each(dom.find('input[name], select'), function(k, v) {
                                self.siblings('input[name="' + $(v).attr("name") + '"]').val($(v).val());
                            });

                            self.parents("tr").find("td:nth-child(2)").text( dom.find('select[name="group"]').val() );
                        }

                        dom.dialog("close");

                        $("#oApply").show("slow");
                        /* show "Apply" link/button */
                    }
                }, {
                    text: "Cancel",
                    click: function() {
                        dom.dialog("close");
                    }
                }]
            });
        });
    },

    deleteAdmin: function(o) {
    /* delete selected user */
        var self = $(o.target);
        self.parents("tr").hide("fast", function() {
            $(this).remove();
        });

        $("#oApply").show("slow");
        /* show "Apply" link/button */
    },

    maintainAdmin: function(o) {
    /* system maintenance including return to factory default and reboot system */
        var me = this, self = $(o.target);
        if(self.hasClass("btnSaFDefault")) {
        /* set to Factory Default */
            tools.alert("confirm", {
                title: self.text(),
                content: $("#SysString").find("span.strAlertFactoryDefault").text()
            }, function() {
                $.post("/system/smaintenance", {"act": "factory_default"}, function(d) {
                    console.log(d);
                });
            }, self[0]);
        } else {
            tools.alert("confirm", {
                title: self.text(),
                content: $("#SysString").find("span.strAlertReboot").text()
            }, function() {
                $.post("/system/smaintenance", {"act": "reboot"}, function(d) {
                    console.log(d);
                });
            }, self[0]);
        }
    },

    saveAdminRCSConf: function(o) {
    /* Save Running Configuration as Startup Configuation */
        var me = this, self = $(o.target), flag, iframe;
        if(self.hasClass("btnSaveRSConf")) {
            flag = "save";
        } else if(self.hasClass("btnDLRConf")) {
            flag = "dl_running";
        } else if(self.hasClass("btnDLSConf")) {
            flag = "dl_startup";
        }
        return window.location.href = "/system/ssave_conf/?act=" + flag;
        /* download file */
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
            case "date":
                url = "/system/sdate";
                obj = $("div.editSystemDateTime");
                break;
            case "admin":
                url = $("div.SystemAdmin").find("a[opt=cli]").parent().hasClass("active") ? "/system/cli" : "/system/sadmin";
                obj = $("div.SystemAdmin").find("a[opt=cli]").parent().hasClass("active") ? $("#saCLI") : $("#saAccount");
                break;
            case "snmp":
                url = "/service/snmp";
                obj = $("div.svSNMP");
                break;
            case "email":
                url = "/service/email";
                obj = $("div.svEmail");
                break;
            case "vrrp":
                url = "/service/vrrp";
                obj = $("div.svVRRP");
                break;
            case "syslog":
                url = "/log/syslog";
                obj = $("div.logSyslog");
                break;
            default:
                break;
        }

        if(url.length) {
            obj.wrap('<form id="theForm" />');
            console.log($("#theForm").serialize());
            $.post(url, $("#theForm").serialize(), function(d) {
                console.log(d);
                if(!d[0]) {
                    if(confirm("System Fail\n\nReload the Page?")) {
                        obj.unwrap();
                        /* remove form */
                        return me.execMenu(current);
                    }
                } else {
                    obj.unwrap();
                    /* remove form */
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
        var ct = $("div.popContent");

        $("div.borderArrow").hide();
        /* hide arrow image */

        try {
            Ajax.abort();
            /* Stop all ajax request */
        } catch(e) {}

        try {
            clearInterval(timer);
            /* remove auto-refresh timer */
            timer_v = 0;
            /* reset auto-refresh option */
        } catch(e) {}

        try {
            delete(ov["group"]);
            /* delete vrrp model clone (ov) */
        } catch(e) {}

        $("div.popContent").off("click");
        $("div.popContent").off("change");
        $("div.popContent").off("input");
        /* reset all bind events */
        ct.empty();
        /* empty all popContent content */

        require(["blockUI"], function() {
            ct.block({
                onBlock: function() {
                    try {
                    /* this should be remove once every function is ready */
                        if(o in MainOperation) {
                            return MainOperation[o]();
                        } else {
                            require(['ExtHandler'], function() {
                                if(o in ExtHandler) {
                                    return ExtHandler[o]();
                                }
                            });
                        }
                    } catch(e) { console.error(e); }
                }
            });
        });
    }
}),
ckWindow, changeResolution, menuview, windowview, infoview, MainOperation, timer, tools, Ajax, ov, timer_v = 0;

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
        Ajax = $.getJSON("/system/ssys", function(d) {
            var me = this;
                if(o) {
                    $('.systemSummary, .systemSummaryPort').remove();
                } else {
                    $('div.popContent').children().remove();
                }

                var cview = new View({
                    events: {
                        "change #summary_timer": "setSysSummaryTimer"
                        /* set auto-refresh timer */
                    }
                });

                cview.viewSysSummaryTimer(d, o);
        });
    },

    dns: function(o) {
    /* get DNS setting */
        var me = this;
        Ajax = $.getJSON("/system/gdns", function(d) {
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
        Ajax = $.getJSON("/system/gvlan", function(d) {
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
        Ajax = $.getJSON("/system/gbridge", function(d) {
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
        Ajax = $.getJSON("/system/gip", function(d) {
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
        Ajax = $.getJSON("/system/groute", function(d) {
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
    },

    arp: function(o) {
    /* get arp table setting */
        var me = this;
        delete(me.model);
        delete(me.view);
        Ajax = $.getJSON("/system/garp", function(d) {
            me.model = new Model(d);
            me.view = new View({
                model: me.model,
                events: {
                    "click button.btnArpDel": "delArpTable",
                    "click button.btnArpAdd": "addArpTable"
                }
            });

            return me.view.viewArpTable();
        });
    },

    date: function(o) {
    /* get date setting */
        var me = this;
        delete(me.model);
        delete(me.view);
        Ajax = $.getJSON("/system/gdate", function(d) {
            me.model = new Model(d);
            me.view = new View({
                model: me.model,
                events: {
                    "change input,select": "editDateTime",
                    "click input[opt='dt']": "choiceDateTime"
                }
            });

            return me.view.viewDateTime();
        });
    },

    diagnostic: function(o) {
    /* diagnostic tools setting */
        var me = this;
        delete(me.model);
        delete(me.view);
        me.model = new Model();
        me.view = new View({
            events: {
                "click div.SystemDiagnostic button": "controlDiagnostic"
            }
        });

        return me.view.viewDiagnostic();
    },

    admin: function(o) {
    /* get admin setting */
        var me = this;
        delete(me.model);
        delete(me.view);
        Ajax = $.getJSON("/system/gadmin", function(d) {
            me.model = new Model(d);
            me.view = new View({
                model: me.model,
                events: {
                    "click button.btnSaEditAdd": "editAdmin",
                    "click button.btnSaDelAccount": "deleteAdmin",
                    "click button.btnSaFDefault": "maintainAdmin",
                    "click button.btnSaReboot": "maintainAdmin",
                    "click button.btnSaveRSConf": "saveAdminRCSConf",
                    "click button.btnDLRConf": "saveAdminRCSConf",
                    "click button.btnDLSConf": "saveAdminRCSConf"
                }
            });

            return me.view.viewAdmin();
        });
    }
};

tools = {
/* all global tools */
    str: {title: "Alert", content: "Alert"},
    /* this is the default string which will display as the message will show to users */
    cb: function() {
    /* this is the default callback which will return whole tools object */
        return this;
    },
    prefix: "/script/template/",
    /* path to template */
    alert: function(type, str, cb, obj) {
    /*
        to replace alert message
        type: (string) default is alert; confirm is alternative if necessary
        str: (object) the message to display
        cb: (function) callback function when click ok
        obj: (object[HTMLdom]) the trigger object
    */
        var me = this, type = type || "alert", str = str || me.str, cb = cb || me.cb, f, t, dom;
        f = ("alert" === type) ? "toolsAlert" : "toolsConfirm";
        Ajax = $.get("/getTpl?file=" + f, function(d) {
            t = _.template(d);
            $("body").append(t(str));

            dom = $("div.toolsAlert");
            dom.modal({keyboard: false}).modal("show");
            dom.on("click", ".btnTAOk", function() {
                cb();
                dom.modal("hide");
            }).on("click", ".btnTACancel", function() {
                dom.modal("hide");
            }).on("hidden", function() {
                dom.remove();
            });
        }, "html");
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

    $("div.MainMenu:first").trigger("click");
    $("div.SubMenu:first").trigger("click");
}).call(this);