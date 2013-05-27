#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
work for all system relative function which is always called by Ajax

Created on 2013/04/30

@author: Kim Hsiao
'''

import os
import sys
import cherrypy as _

from jinja2 import Environment, FileSystemLoader
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../middleware'))
# work for middleware access

env = Environment(loader = FileSystemLoader('static/template'), extensions = ['jinja2.ext.i18n'])

from libs.tools import *
# all necessary libs


class System(object):
    # def __init__(self, callable, *args, **kwargs):
    #     self.callable = callable
    #     self.args = args
    #     self.kwargs = kwargs

    # def __call__(self):
    #     return self.callable(*self.args, **self.kwargs)

    @_.expose
    def index(self, *args, **kwargs):
        print args
        print kwargs
        return 'Hello World!'

    def _getInterface(self):
        '''
            Get all interfaces or False if fail to get interfaces
            internal function
            filter:
                all -> all interfaces include bridge and vlan
                real -> only real NIC
                vlan -> only vlan
                interface -> include vlan and real NIC
                bridge -> only bridge
        '''
        import ml_w_ip_address as wip
        interfaces = {"all": [],
                      "real": [],
                      "interface": [],
                      "vlan": [],
                      "bridge": []}
        try:
            items = wip.get()[1]['ip']
            for its in items:
                interfaces["all"].append(its['interface'])
                if 'b' in its['interface']:
                    interfaces["bridge"].append(its["interface"])
                if 'b' not in its["interface"]:
                    interfaces["interface"].append(its["interface"])
                if '.' in its["interface"]:
                    interfaces["vlan"].append(its["interface"])
                if '.' not in its["interface"] and 'b' not in its["interface"]:
                    interfaces["real"].append(its["interface"])

            return interfaces
        except:
            return False


    @_.expose
    def ssys(self, **kwargs):
        '''
            System -> Summary access
        '''
        import ml_w_summary_system as wsys
        obj = wsys.get()
        print obj
        if not obj[0]:
            # some error occured
            return 'Fail'
        else:
            tpl = env.get_template('summary.json')
            trans = translation()
            env.install_gettext_translations(trans['obj'])
            # import gettext for language translation
            # _.response.headers['Content-Type'] = 'application/json'
            return tpl.render(info = obj[1])

    @_.expose
    def s_port(self, **kwargs):
        '''
            Retrieval summary of port information
        '''
        import ml_w_summary_port as wport
        obj = wport.get()
        print obj
        if not obj[0]:
            return "Fail"
        else:
            import json
            _.response.headers["Content-Type"] = "application/json"
            return json.dumps(obj)

    @_.expose
    def gdns(self, **kwargs):
        '''
            Retrieval dns information
        '''
        import ml_w_dns as dns
        import json
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(dns.get())

    @_.expose
    def sdns(self, **kwargs):
        '''
            Save DNS setting
        '''
        import ml_w_dns as dns
        import json
        import libs.tools
        # import unicodedata as codec
        for k in kwargs:
            kwargs[k] = libs.tools.convert(kwargs[k])
        res = dns.set(cfg = kwargs)
        _.response.headers["Content-Type"] = "application/json"
        # return json.dumps(kwargs)
        return json.dumps(res)

    @_.expose
    def gvlan(self, **kwargs):
        '''
            Get VLAN information
        '''
        import ml_w_vlan as vlan
        import json
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(vlan.get())

    @_.expose
    def svlan(self, **kwargs):
        '''
            Save VLAN setting
        '''
        import ml_w_vlan as vlan
        import json
        import libs.tools
        libs.tools.v(kwargs)
        op = []
        size = len(kwargs["interface"])
        if type(kwargs["interface"]).__name__ == "list":
            if len(kwargs["interface"]) > 0:
                for i in range(0, size):
                    if len(kwargs["interface"][i]) > 1 and len(kwargs["vlan_id"]) > 0:
                        op.append({"interface": libs.tools.convert(kwargs["interface"][i]), "vlan_id": int(kwargs["vlan_id"][i])})
        else:
            op.append({"interface": libs.tools.convert(kwargs["interface"]), "vlan_id": int(kwargs["vlan_id"])});

        dat = {"vconfig": op}
        libs.tools.v(dat)
        res = vlan.set(cfg = dat)
        libs.tools.v(res)
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(res)

    @_.expose
    def gbridge(self, **kwargs):
        '''
            get Bridge setting
        '''
        import ml_w_bridge as wbr
        import json
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wbr.get())

    @_.expose
    def sbridge(self, **kwargs):
        '''
            Save Bridge setting
        '''
        import ml_w_bridge as wbr
        import json
        import libs.tools
        libs.tools.v(kwargs)
        size = len(kwargs["name"])
        names = []
        op = []

        try:
            for na in kwargs["name"]:
                if not na.startswith("Auto"):
                    names.append(int(na.split("b")[1]))

            names.sort()
            max = names[-1] + 1
        except:
            max = 1

        for i in range(0, size):
            if kwargs["STP"][i] == "true":
                kwargs["STP"][i] = True
            else:
                kwargs["STP"][i] = False

            if kwargs["name"][i].startswith("Auto"):
                kwargs["name"][i] = "s0b" + str(max)
                max = max + 1
            else:
                kwargs["name"][i] = libs.tools.convert(kwargs["name"][i])

            kwargs["interface"][i] = libs.tools.convert(kwargs["interface"][i]).split(",")

            op.append({"name": kwargs["name"][i],
                "interface": kwargs["interface"][i],
                "STP": kwargs["STP"][i],
                "hello_time": int(kwargs["hello_time"][i]),
                "max_message_age": int(kwargs["max_message_age"][i]),
                "forward_delay": int(kwargs["forward_delay"][i])
            })

        libs.tools.v(op)
        res = wbr.set(cfg = {"br": op})
        return json.dumps(res)

    @_.expose
    def gip(self, **kwargs):
        '''
            get ip address from certain interface
        '''
        import ml_w_ip_address as wip
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wip.get())

    @_.expose
    def sip(self, **kwargs):
        '''
            save ip address for each interfaces
        '''
        import ml_w_ip_address as wip
        import json
        import libs.tools
        libs.tools.v(kwargs)
        print(kwargs)
        output = []
        interface = []
        for k in kwargs.keys():
            interface.append(k.split("-")[0])
        interface = set(interface)
        # find out unique interface has changed
        for inf in interface:
            ot = {"interface": inf, "ipv4": [], "ipv6": []}

            if inf + '-ipv4_address' in kwargs:
                if(type(kwargs[inf + '-ipv4_address']).__name__ == 'list'):
                    for ip in range(0, len(kwargs[inf + '-ipv4_address'])):
                        ot["ipv4"].append({"ipv4_address": libs.tools.convert(kwargs[inf + '-ipv4_address'][ip]),
                                           "ipv4_prefix": int(kwargs[inf + '-ipv4_prefix'][ip])
                                           })
                else:
                    ot["ipv4"].append({"ipv4_address": libs.tools.convert(kwargs[inf + '-ipv4_address']),
                                       "ipv4_prefix": int(kwargs[inf + '-ipv4_prefix'])
                                       })
            if inf + '-ipv6_address' in kwargs:
                if(type(kwargs[inf + '-ipv6_address']).__name__ == 'list'):
                    for ip in range(0, len(kwargs[inf + '-ipv6_address'])):
                        ot["ipv6"].append({"ipv6_address": libs.tools.convert(kwargs[inf + '-ipv6_address'][ip]),
                                           "ipv6_prefix": int(kwargs[inf + '-ipv6_prefix'][ip])
                                           })
                else:
                    ot["ipv6"].append({"ipv6_address": libs.tools.convert(kwargs[inf + '-ipv6_address']),
                                       "ipv6_prefix": int(kwargs[inf + '-ipv6_prefix'])
                                       })
            output.append(ot)

        output = {"ip": output}
        # change to correct format
        return json.dumps(wip.set(cfg = output))

    @_.expose
    def groute(self, **kwargs):
        '''
            Get routing table setting
        '''
        import ml_w_routing_table as wrt
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wrt.get())

    @_.expose
    def sroute(self, **kwargs):
        '''
            Set routing table setting
        '''
        import ml_w_routing_table as wrt
        import json
        import libs.tools
        libs.tools.v(kwargs)
        protocol = {"ipv4": [], "ipv6": []}
        for k in protocol.keys():
            if k + "-destination" in kwargs:
                if(type(kwargs[k + "-destination"]).__name__ == "list"):
                    for n in range(0, len(kwargs[k + "-destination"])):
                        protocol[k].append({"destination": libs.tools.convert(kwargs[k + "-destination"][n]),
                                            "prefix": int(kwargs[k + "-prefix"][n]),
                                            "gateway": libs.tools.convert(kwargs[k + "-gateway"][n]),
                                            "interface": libs.tools.convert(kwargs[k + "-interface"][n])
                                            })
                else:
                    protocol[k].append({"destination": libs.tools.convert(kwargs[k + "-destination"]),
                                        "prefix": int(kwargs[k + "-prefix"]),
                                        "gateway": libs.tools.convert(kwargs[k + "-gateway"]),
                                        "interface": libs.tools.convert(kwargs[k + "-interface"])
                                        })

        libs.tools.v(protocol)
        print(protocol)
        return json.dumps(wrt.set(cfg = protocol))

    @_.expose
    def garp(self):
        '''
            Get ARP table setting
        '''
        import ml_w_arp_table as wat
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wat.get())

    @_.expose
    def sarp(self, **kwargs):
        '''
            Set ARP table setting
        '''
        import ml_w_arp_table as wat
        import json
        import libs.tools
        libs.tools.v(kwargs)
        return json.dumps(kwargs)

    @_.expose
    def gdate(self, **kwargs):
        '''
            Get DateTime setting
        '''
        import ml_w_date_time as wdt
        import json
        import libs.tools

        timezone_set = ["Adelaide" , "Alaska" , "Amsterdam" , "Apia" , "Arizona" , "Astana" , "Asuncion" , "Athens" , "Atlantic/Azores" , "Auckland" , "Baghdad" , "Baku" , "Bangkok" , "Beijing" , "Beirut" , "Belgrade" , "Berlin" , "Bern" , "Bogota" , "Bratislava" , "Brazil" , "Brisbane" , "Brussels" , "Bucharest" , "Budapest" , "Buenos Aires" , "Canberra" , "Cape Verde" , "Caracas" , "Casablanca" , "Cayenne" , "Central Time (USA/Canada)" , "Copenhagen" , "Cuiaba" , "Dacca" , "Damascus" , "Darwin" , "Dubai" , "Dublin" , "East Indiana" , "Eastern Time" , "Fiji" , "Fortaleza" , "Georgetown" , "Guam" , "Harare" , "Hawaii" , "Helsinki" , "Hobart" , "Irkutsk" , "Islamabad" , "Istanbul" , "Jakarta" , "Kabul" , "Kaliningrad" , "Kathmandu" , "Krasnoyarsk" , "Kuala Lumpur" , "Kuwait" , "La Paz" , "Lima" , "Lisbon" , "Ljubljana" , "London" , "Madrid" , "Magadan" , "Manaus" , "Mazatlan" , "Mexico City" , "Minsk" , "Monrovia" , "Monterrey" , "Montevideo" , "Moscow" , "Mountain Time (USA/Canada)" , "Muscat" , "Nairobi" , "New Delhi" , "Newfoundland" , "Nicosia" , "Noumea" , "Pacific" , "Perth" , "Port Louis" , "Port Moresby" , "Prague" , "Reykjavik" , "Riga" , "Riyadh" , "Rome" , "Saigon" , "Salvador" , "San Juan" , "Sarajevo" , "Saskatchewan" , "Seoul" , "Singapore" , "Skopje" , "Stockholm" , "Taipei" , "Tallinn" , "Tashkent" , "Tbilisi" , "Tokyo" , "Tonga" , "Ulan Bator" , "Vienna" , "Vilnius" , "Vladivostok" , "Warsaw" , "Windhoek" , "Yangon" , "Yekaterinburg" , "Yerevan"]
        _.response.headers["Content-Type"] = "application/json"
        res = wdt.get()
        res[1]["timezone_set"] = timezone_set
        return json.dumps(res)

    @_.expose
    def sdate(self, **kwargs):
        '''
            Set DateTime setting
        '''
        import ml_w_date_time as wdt
        import json
        import libs.tools
        res = {}

        libs.tools.v(kwargs)
        if len(kwargs["time_server"]) > 0:
            for k in kwargs:
                if k != "date" and k != "time":
                    res[k] = libs.tools.convert(kwargs[k])
                else:
                    res[k] = ''
        else:
            for k in kwargs:
                res[k] = libs.tools.convert(kwargs[k])

        libs.tools.v(res)
        return json.dumps(wdt.set(cfg = res))

    @_.expose
    def start_arping(self, **kwargs):
        '''
            Send request for starting Unsolicited ARP & NDP
        '''
        import ml_w_diagnostic_tools as wdt
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wdt.start_arping())

    @_.expose
    def stop_arping(self, **kwargs):
        '''
            Send request for stopping Unsolicited ARP & NDP
        '''
        import ml_w_diagnostic_tools as wdt
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wdt.stop_arping())

    @_.expose
    def start_ping(self, **kwargs):
        '''
            Send request for starting ping
        '''
        import ml_w_diagnostic_tools as wdt
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wdt.start_ping(target = libs.tools.convert(kwargs["address"])))

    @_.expose
    def stop_ping(self, **kwargs):
        '''
            Send request for starting ping
        '''
        import ml_w_diagnostic_tools as wdt
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wdt.stop_ping())

    @_.expose
    def start_traceroute(self, **kwargs):
        '''
            Send request for starting ping
        '''
        import ml_w_diagnostic_tools as wdt
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wdt.start_traceroute(target = libs.tools.convert(kwargs["address"])))

    @_.expose
    def stop_traceroute(self, **kwargs):
        '''
            Send request for starting ping
        '''
        import ml_w_diagnostic_tools as wdt
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wdt.stop_traceroute())

    @_.expose
    def getInterfaces(self):
        '''
            Get all available NIC name, include real device, vlan, and bridge
        '''
        import json
        import libs.tools
        libs.tools.v(self._getInterface())
        return json.dumps(self._getInterface())
