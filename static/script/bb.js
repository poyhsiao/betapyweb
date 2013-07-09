/***
* Created by Kim Hsiao
***/

"use strict";

jQuery.error = console.error;
/* this is for jquery debugger */

$.ajaxSetup({ cache: false });
/* prevent ajax cache especially in IE */

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
            $("div.borderArrow").addClass("hide");
            changeResolution.changePopC();
            try {
            	Wizard.dialog("option", "width", $(window).width() - 50);
            	Wizard.dialog("option", "height", $(window).height() - $("div.footer").height() - $("div.head").height());
            } catch(e) {}
        }

        if(ckWindow.notDesktop()) {
            return $("div.popContent").css("height", "400px");
            /* in mobile device, set the height to fixed 400px */
        } else {
        /* for tablet */
        	$("div.borderArrow").removeClass("hide");
            return changeResolution.changePopC();
        }
    },

    runMenuMain: function(o) {
    /* handling the click event for main menu items, o is current object which is clicked */
        var me = this, self = $(o.target), mainmenu = $("div.MainMenu"), arrow = $("div.borderArrow"), mtitle = $("span.maintitle");
        if("wizard" === self.attr("opt")) {
        	return me.viewWizard();
        } else {
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
        var me = this, dat = {"items": me.model.attributes[1], "nic": ''}, t;
        Ajax = $.get("/getTpl?file=vlan", function(d) {
        	Ajax = $.getJSON("/system/getInterfaces", function(nic) {
        		dat["nic"] = nic["real"];

        		t = _.template(d);
                me.$el.html(t(dat));

                $("div.borderArrow").show("fast");
                /* show arrow image */

                $("div.SystemVLAN").find("table").css({
                    "width": "100%",
                    "height": "100%"
                }).find("button").css({
                    "width": "90%"
                });
        	});
        }, "html");
    },

    addVlan: function(o) {
    /* add vlan item */
        var me = this, self = $(o.target), tr = self.parents("tr"), dom = $("div.addSysVLAN"), ct = $("div.SystemVLAN"), tpl;
        tpl = $("tbody.newVlan").clone(true);

        tpl.find("tr").hide().insertAfter(tr).show("slow", function() {
            $("#oApply").show("slow");
            /* show "Apply" link/button */
        });
        return false;
    },

    delVlan: function(o) {
    /* delete vlan item */
        var me = this, self = $(o.target), tr = self.parents("tr");
        tr.hide("slow", function() {
            $(this).remove();
            $("#oApply").show("slow");
        });
        return false;
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
                	var i;

                    dom.block();
                    /* enable mask before everything is ready */

                    //dom.find(".switch").bootstrapSwitch();
                    require(['bsSwitch'], function() {
                        dom.find("input[type=checkbox]").wrap('<div class="switch switch-mini" data-on="primary" data-off="danger" data-on-label="<i class=\'icon-ok icon-white\'></i>" data-off-label="<i class=\'icon-remove\'></i>">').parent().bootstrapSwitch();
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
        var me = this, self = $(o.target);
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
    	var me = this, self = $(o.target), tr = self.parents("tr"), inf = $("#ipSelecter"), chk = self.attr("chk"), opt = self.attr("opt"), tpl;
    	tpl = $("tbody.newIpAddress[opt='" + opt + "']").clone(true);
    	tpl.find(":input").attr({
    		name: function() {
    			return chk + "-" + $(this).attr("opt");
    		}
    	});

    	tpl.find("tr").hide().insertAfter(tr).show("slow", function() {
    		me.viewSaveVLAN();
    	});

    	return false;
    },

    delIpAddress: function(o) {
    /* delete exist ip address setting */
        var me = this; self = $(o.target);
        self.parents("tr").hide("slow", function() {
            $(this).remove();
            return me.viewSaveVLAN();
        });

        return false;
    },

    viewRoutingTable: function(o) {
    /* routing table display */
    	var me = this, str = '', dat, t;

    	if(false === me.model.attributes[0]) {
    		$.each(me.model.attributes[1], function(k, v) {
    			str += ' ' + v;
    		});

    		bootbox.alert(str);
    	}

    	Ajax = $.getJSON("/system/getInterfaces", function(nic) {
    		/* return an array of NIC names */
    		dat = {"items": me.model.attributes[1], "nic": nic["all"]};

    		Ajax = $.get("/getTpl?file=routing_table", function(d) {
    			t = _.template(d);
    			me.$el.html(t(dat));

    			$("div.borderArrow").show("fast");
                /* show arrow image */

                me.$el.find("table").css({
                    "width": "100%",
                    "height": "100%"
                });

                me.$el.find("button.btnSmt").css({
                    "width": "45%"
                });
    		}, "html");
    	}, "json");
    },

    delRoutingTable: function(o) {
    /* delete existing routing table rule */
        var me = this, self = $(o.target), tr = self.parents("tr");
        tr.hide("slow", function() {
            $(this).remove();
            $("#oApply").show("slow");
            /* show "Apply" link/button */
        });
    },

    addRoutingTable: function(o) {
    /* add new rule for routing table */
    	var me = this, self = $(o.target), tr = self.parents("tr"), opt = self.attr("opt"), tpl;
    	tpl = $("tbody.newSysRt").clone(true);

    	tpl.find(":input").attr({
    		name: function() {
    			return opt + "-" + $(this).attr("opt");
    		}
    	});

    	tpl.find("tr").hide().insertAfter(tr).show("slow", function() {
    		$("#oApply").show("slow");
    		/* show "Apply" link/button */
    	});

    	return false;
    },

    viewArpTable: function(o) {
    /* ip address setup page display */
        var me = this, dat = {"items": me.model.attributes[1], "nic": ''}, t;
        Ajax = $.get("/getTpl?file=arp_table", function(d) {
        	Ajax = $.getJSON("/system/getInterfaces", function(nic) {
        		dat["nic"] = nic["interface"];

        		$.each(dat["items"], function(k, v) {
                    v["protocol"] = k.split("_")[0];
                    v["type"] = k.split("_")[1];
                });

        		 t = _.template(d);
                 me.$el.html(t(dat));

                 $("div.borderArrow").show("fast");
                 /* show arrow image */

                 me.$el.find("table").css({
                     "width": "100%",
                     "height": "100%"
                 });

                 me.$el.find("button.btnSmt").css({
                     "width": "45%"
                 });

                 require(['bsSwitch'], function() {
                     me.$el.find("input[type='checkbox']").one("change", function() {
                         $("#oApply").show("slow");
                         /* show "Apply" link/button */
                     }).wrap('<div class="switch switch-mini" data-on="primary" data-off="danger" data-on-label="<i class=\'icon-ok icon-white\'></i>" data-off-label="<i class=\'icon-remove\'></i>">').parent().bootstrapSwitch();
                 });
        	});

        }, "html");
    },

    delArpTable: function(o) {
    /* delete existing arp static ip */
      var me = this, self = $(o.target);
      self.parents("tr").hide("fast", function() {
          $(this).remove();
          me.viewSaveVLAN();
          /* show "Apply" link/button */
      });
      return false
    },

    addArpTable: function(o) {
    /* add new arp static ip */
    	var me = this, self = $(o.target), tr = self.parents("tr"), opt = self.attr("opt"), tpl;
    	tpl = $("tbody.newArpTable[opt='" + opt + "']").clone(true);
    	console.log(opt);
    	console.log(tpl);
    	tpl.find(":input").attr({
    		"name": function() {
    			return opt + "-" + $(this).attr("opt");
    		}
    	});

    	tpl.find("tr").hide().insertAfter(tr).show("slow", function() {
    		me.viewSaveVLAN();
    	});

    	return false;
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

    viewWizard: function(o) {
    /* display wizard page */
        var me = this, border = 20, t;
        Ajax = $.get("/getTpl?file=wizard", function(d) {
        	require(["psteps", "jqueryUI", "blockUI"], function() {
        		t = _.template(d);

        		Wizard = $($.parseHTML(d)[1]);

        		Wizard.on("click", "a.btnAddIps", me.addWzIps)
        		.on("click", "a.btnDelIps", me.delWzIps)
        		.on("click", "a.btnAddWzSLB", me.addWzSLB)
        		.on("click", "a.btnDelWzSLB", me.delWzSLB)
        		.on("click", "a.btnAddWzAppPort, a.btnAddWzRealServer", me.addWzAppRS)
        		.on("click", "a.btnDelWzAppPort, a.btnDelWzRealServer", me.delWzAppRS);

        		Wizard.dialog({
                     closeOnEscape: false,
                     draggable: false,
                     resizable: false,
                     modal: true,
                     width: $("#PageTailer").innerWidth(),
                     height: $("div.body").innerHeight() + $("div.info").innerHeight(),
                     position: {my: "center top",
                    	 		at: "center" + " top+" + $("div.head").height() },
                     open: function() {
                    	 Wizard.psteps({
                      	    steps_width_percentage: true,
                      	    alter_width_at_viewport: '500',
                      	    steps_height_equalize: true
                      	});

                    	 Wizard.find("table").css("height", "100%");

                    	 require(["bsSwitch"], function() {
                    		 Wizard.find("input[type=checkbox]").wrap('<div class="switch switch-mini" data-on="primary" data-off="danger" data-on-label="<i class=\'icon-ok icon-white\'></i>" data-off-label="<i class=\'icon-remove\'></i>">').parent().bootstrapSwitch();
                    		 Wizard.find("th, td").css({
                            	 "text-align": "center",
                            	 "vertical-align": "middle"
                             });
                         });
                     },
                     close: function() {
                    	 Wizard.dialog("destroy");
                    	 $.unblockUI();
                     },
                     destroy: function() {
                    	 Wizard.andSelf().remove();
                     },
                     buttons: [{
                    	 text: "Back",
                    	 class: "btnWzBack hide",
                    	 click: function() {
                    		 var current = $("div.step-active");
                    		 if(current.hasClass("pstep2")) {
                			 /* back to check dns setting */
                    			 $(".pstep1", "div.wizard-dialog").trigger("go_to_step");
            					 $(".btnWzBack").addClass("hide");
                			 } else if(current.hasClass("pstep3")) {
                			 /* back to check mode setting */
                    			 $(".pstep2", "div.wizard-dialog").trigger("go_to_step");
                			 } else if(current.hasClass("pstep4")) {
            				 /* back to check vrrp setting */
                				 $(".pstep3", "div.wizard-dialog").trigger("go_to_step");
                			 } else if(current.hasClass("pstep5")) {
            				 /* back to check s0e2 setting*/
                				 $(".pstep4", "div.wizard-dialog").trigger("go_to_step");
                			 } else if(current.hasClass("pstep6")) {
            				 /* back to s0e1 setting and add hide(done) button and show(next) button */
                				 $(".pstep5", "div.wizard-dialog").trigger("go_to_step");
                				 $(".btnWzDone").addClass("hide");
                				 $(".btnWzNext").removeClass("hide");
                			 }
                    	 }
                     }, {
                    	 text: "Next",
                    	 class: "btnWzNext",
                    	 click: function() {
                    		 var current = $("div.step-active"), data;
                    		 if(current.hasClass("pstep1")) {
                			 /* check dns setting */
                    			 $("div.wzDNS").wrap("<form id='wzForm' />");
                    			 data = $("#wzForm").serialize();
                    			 $("div.wzDNS").unwrap();
                    			 Ajax = $.post("/wizard/ckDNS", data, function(d) {
                    				 if(true === d[0]) {
                    					 $("div.pstep2", "div.wizard-dialog").trigger("go_to_step");
                    					 $(".btnWzBack").removeClass("hide");
                					 } else {
                						 bootbox.alert(d[1].toString());
            						 }
                				 }, "json");
                    			 return false;
                			 } else if(current.hasClass("pstep2")) {
            				 /* check mode setting */
                				 $("div.wzMode").wrap("<form id='wzForm' />");
                    			 data = $("#wzForm").serialize();
                    			 $("div.wzMode").unwrap();
                    			 Ajax = $.post("/wizard/ckMode", data, function(d) {
                    				 if(true === d[0]) {
                    					 $("div.pstep3", "div.wizard-dialog").trigger("go_to_step");
                					 } else {
                						 bootbox.alert(d[1].toString());
            						 }
                				 }, "json");
                    			 return false;
                			 } else if(current.hasClass("pstep3")) {
            				 /* check vrrp setting */
                				 $("div.wzVRRP").wrap("<form id='wzForm' />");
                    			 data = $("#wzForm").serialize();
                    			 $("div.wzVRRP").unwrap();
                    			 Ajax = $.post("/wizard/ckVRRP", data, function(d) {
                    				 if(true === d[0]) {
                    					 $("div.pstep4", "div.wizard-dialog").trigger("go_to_step");
                					 } else {
                						 bootbox.alert(d[1].toString());
            						 }
                				 }, "json");
                    			 return false;
                			 } else if(current.hasClass("pstep4")) {
            				 /* check s0e2 setting */
                				 $("div.wzS0e2").wrap("<form id='wzForm' />");
                    			 data = $("#wzForm").serialize();
                    			 $("div.wzS0e2").unwrap();
                    			 Ajax = $.post("/wizard/cks0e2", data, function(d) {
                    				 if(true === d[0]) {
                    					 $("div.pstep5", "div.wizard-dialog").trigger("go_to_step");
                					 } else {
                						 bootbox.alert(d[1].toString());
            						 }
                				 }, "json");
                    			 return false;
                			 } else if(current.hasClass("pstep5")) {
            				 /* check s0e1 setting */
                				 $("div.wzS0e1").wrap("<form id='wzForm' />");
                    			 data = $("#wzForm").serialize();
                    			 $("div.wzS0e1").unwrap();
                    			 Ajax = $.post("/wizard/cks0e1", data, function(d) {
                    				 if(true === d[0]) {
                    					 $("div.pstep6", "div.wizard-dialog").trigger("go_to_step");
                    					 $(".btnWzNext").addClass("hide");
                    					 $(".btnWzDone").removeClass("hide");
                					 } else {
                						 bootbox.alert(d[1].toString());
            						 }
                				 }, "json");
                    			 return false;
                			 }
                    	 }
                     }, {
                    	 text: "Done",
                    	 class: "btnWzDone hide",
                    	 click: function() {
                		 /* check slb setting and save data if everything correct */
                    		 var data;
                    		 $("div.wzSLB").wrap("<form id='wzForm' />");
                			 data = $("#wzForm").serialize();
                			 $("div.wzSLB").unwrap();
                			 Ajax = $.post("/wizard/ckSLB", data, function(d) {
                				 if(true === d[0]) {
                					 bootbox.confirm("Are you sure to reboot system right now?", function(res) {
                						 if(true === res) {
                							 Ajax = $.post("/system/smaintenance", {"act": "reboot"}, function(d) {
                								 console.log(d);
            								 });
                						 }
                					 });
            					 } else {
            						 bootbox.alert(d[1].toString());
        						 }
            				 }, "json");
                			 return false;
                    	 }
                     }]
        		});

        	});
        }, "html");
    },

    addWzIps: function(o) {
	/* add new ip set for s0e2 and s0e1 in wizard */
    	var me = this, self = $(o.target), opt = self.parents("tr").attr("opt"), tr = self.parents("table").find("tr[opt]"), tpl;
    	tpl = $(tr.get(0)).clone(true);
    	tpl.find(":input").val("");

    	tpl.hide().insertAfter( self.parents("tr") ).show("slow", function() {
    		return self.parents("table").find("a.btnDelIps").removeClass("disabled");
    	});
    	return false;
    },

	delWzIps: function(o) {
	/* delete ip set for s0e2 and s0e1 in wizard */
		var me = this, self = $(o.target), opt = self.parents("tr").attr("opt"), table = self.parents("table"), tr = table.find("tr[opt='" + opt + "']");
		if(tr.length > 1) {
			self.parents("tr").hide("slow", function() {
				$(this).remove();
				console.log(tr);
				if(2 === tr.length) {
					tr.find("a.btnDelIps").addClass("disabled");
				}
			});
		}
		return false;
	},

	addWzSLB: function(o) {
	/* add new slb rule in wizard */
		var me = this, self = $(o.target), gnumber = _.uniqueId(), table = self.parents("table"), tpl;
		tpl = $("tbody.newWzSLB").clone(true);
		tpl.find(":input").attr({
			name: function() {
				return gnumber + "@@" + $(this).attr("chk")
			}
		});

		tpl.find("tr[opt=newWzSLB]").hide().insertAfter( table.find("tr.hd") ).show("slow", function() {
			table.find("a.btnDelWzSLB").removeClass("disabled");
		});
		return false;
	},

	delWzSLB: function(o) {
	/* delete existing slb rule in wizard */
		var me = this, self = $(o.target), tr = self.parents("tr"), table = self.parents("table");
		if(table.find("tr:has(a.btnDelWzSLB)").length > 1) {
			tr.hide("slow", function() {
				$(this).remove();
				if(1 === table.find("tr:has(a.btnDelWzSLB)").length) {
					table.find("a.btnDelWzSLB").addClass("disabled");
				}
			});
		}
		return false;
	},

	addWzAppRS: function(o) {
	/* add application port or real server of SLB */
		var me = this, self = $(o.target), tr = self.parents("tr[opt]"), opt = tr.attr("opt"), tr = self.parents("tr[opt='" + opt + "']"), table = tr.parents("table[opt='" + opt + "']"), tpl;
		tpl = $("tfoot.newWzSLB").clone(true);
		tpl.find("tr[opt='" + opt + "']").hide().insertAfter(tr).show("slow", function() {
			$(this).find("input").attr("name", table.find("input[name]").attr("name"));
		});
		return false;
	},

	delWzAppRS: function(o) {
	/* delete application or real server of SLB */
		var me = this, self = $(o.target), tr = self.parents("tr[opt]"), opt = tr.attr("opt");
		self.parents("tr[opt='" + opt + "']").hide("slow", function() {
			$(this).remove();
		});
		return false;
	},

    viewAdmin: function(o) {
    /* display admin page */
        var me = this, dat = me.model.attributes[1], t, conf_file, fw_file, fwForm;
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
                    }
                }
            });

            $("div.borderArrow").show("fast");
            /* show arrow image */

            require(['fileupload'], function() {
                conf_file = $("#fileUSConf");

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

//                fw_file.fileupload({
//                /* firmware file upload */
//                    url: "/system/supload_fw",
//                    add: function(e, d) {
//                        console.log(d);
//                        $("a.btnFileKeyUpload, a.btnFileFWUpload").removeClass("inactive").one("click", function() {
//                            $(this).text("Uploading...");
//                            d.submit();
//                        });
//                    },
//                    done: function(e, d) {
//                    /* TBD */
//                        var res = d.response();
//                        console.log(res.result);
//                        /* return information */
//                    }
//                });
            });

            fw_file = $("#saFirmware").find("table");
            fwForm = fw_file.wrap("<form action='/system/supload_fw' method='post' enctype='multipart/form-data' id='theFWForm'></form>");
            fwForm.on("change", "input[type=file]", function() {
            	$(this).siblings("a.btn").removeClass("inactive");
            });
            fwForm.on("click", "a.btn", function() {
            	require(['jquery.form'], function() {
            		$('#theFWForm').ajaxSubmit({
                		success: function(d) {

                			console.log(d);
                		}
                	});
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
        	bootbox.confirm($("#SysString").find("span.strAlertFactoryDefault").text(), function(d) {
        		if(true === d) {
        			$.post("/system/smaintenance", {"act": "factory_default"}, function(d) {
                        console.log(d);
                    });
        		}
        	});
        } else {
        	bootbox.confirm($("#SysString").find("span.strAlertReboot").text(), function(d) {
        		if(true === d) {
        			$.post("/system/smaintenance", {"act": "reboot"}, function(d) {
                        console.log(d);
                    });
        		}
        	});
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
            case "slb":
                url = "/service/slb";
                obj = $("div.svSlb");
                break;
            case "connect":
                url = "/service/connect";
                obj = $("div.svConnect");
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
            	var str = '';
            	obj.unwrap();
                /* remove form */
                console.log(d);
                if(false === d[0]) {
            		$.each(d[1], function(k, v) {
            			str += "<br />" + v;
            		});

            		str += '<br />System Fail<br /><br />Reload the Page?'

            		bootbox.confirm(str, function(res) {
            			if(true === res) {
                            return me.execMenu(current);
            			}
            		});
                } else {
                    return me.runOpReload();
                }
            }, "json");
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
        	if("object" == Ajax) {
        		Ajax.abort();
        	}
            /* Stop all ajax request */
        } catch(e) {}

        try {
            clearInterval(timer);
            /* remove auto-refresh timer */
            window.timer_v = 0;
            /* reset auto-refresh option */
        } catch(e) {}

        try {
        	if("object" === typeof(ov) && "group" in ov) {
        		delete(ov["group"]);
                /* delete vrrp model clone (ov) */
        	}
        } catch(e) {}

        checkSlb = 0;
        /* reset checkSlb flag as 0 */

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
ckWindow, changeResolution, menuview, windowview, infoview, MainOperation, timer, tools, Ajax, ov, slbset, checkSlb, Wizard, timer_v = 0;

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
    var pop = this.pop, menu = $("div.leftMenu"), bias = ckWindow.notDesktop() ? 60 : 30, val;
    pop.css({
      height: function() {
        var border = 60;
        /* this is work for define all the border width */
        val = $(window).height() - $("div.head").outerHeight() - $("div.info").outerHeight() - $("div.footer").outerHeight() - border + "px";
        return val;
      },
      width: function() {
    	  if(!ckWindow.notDesktop()) {
	    	  return $("#PageTailer").width() - menu.position().left - menu.width() - bias;
    	  } else {
    		  return menu.width() - bias;
    	  }
      }
    });
    return (ckWindow.notDesktop()) ? pop.css("margin-left", "0") : pop.css("margin-left", "-60px");
  },

  changeArrow: function(op) {
    /* change the position of the arrow image, if op is given as the jquery obj, the position will be located based on given op */
    var actopt = $("span.subtitle").attr("opt"),
    pop = $("div.popContent"),
    itm = op || $("div.selectItem[opt=" + actopt +"]"),
    // offset = ("wild" == ckWindow.text()) ? 40 : 50,
    bias = -30,
    offset = -60,
    arrow = this.arrow;

    arrow.css({
      top: function() {
    	  try {
    		  return itm.position().top + "px";
    	  } catch(e) {}
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
                    "click a.btnAddVlan": "addVlan",
                    "click a.btnDelVlan": "delVlan",
                    "click a.btnEditVlan": "viewSaveVLAN"
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
                    "click a.btnIpAdd": "addIpAddress",
                    "click a.btnIpDel": "delIpAddress",
                    "click a.btnEdit": "viewSaveVLAN"
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
                    "click a.btnRTDel": "delRoutingTable",
                    "click a.btnRTAdd": "addRoutingTable",
                    "click a.btnEditRT": "viewSaveVLAN"
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
                    "click a.btnArpDel": "delArpTable",
                    "click a.btnArpAdd": "addArpTable",
                    "click a.btnEdit": "viewSaveVLAN"
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