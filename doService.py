#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
work for all service relative function which is always called by Ajax

Created on 2013/05/31

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

class Service(object):
    def getUser(self):
        user = _.session.get("username")

        if None == user:
            raise _.HTTPRedirect('/')
        else:
            return user

    @_.expose
    def index(self, **kwargs):
        return self.snmp(**kwargs)

    @_.expose
    def snmp(self, **kwargs):
        '''
            snmp setting
            data format from middleware
            (True, {'system_name': 'SLB', 'system_contact': '', 'enable': False, 'system_loca
tion': '', 'community': 'public'})
        '''
        import ml_w_snmp as snmp
        import json
        import libs.tools

        _.response.headers["Content-Type"] = "application/json"
        if 'system_name' in kwargs:
            # for updating setting
            libs.tools.v(kwargs)

            res = {'system_name': libs.tools.convert(kwargs['system_name']),
                   'system_contact': libs.tools.convert(kwargs['system_contact']),
                   'enable': 'enable' in kwargs,
                   'system_location': libs.tools.convert(kwargs['system_location']),
                   'community': libs.tools.convert(kwargs['community'])}

            libs.tools.v(res)

            return json.dumps(snmp.set(user = self.getUser(), cfg = res))

        else:
            # for information getter
            return json.dumps(snmp.get())

    @_.expose
    def email(self, **kwargs):
        '''
            snmp email notification setting
            data format from middleware
            (True, {'to': [], 'server': '', 'from': '', 'timeout': 0, 'alert': False})
        '''
        import ml_w_email as wem
        import json
        import libs.tools

        _.response.headers["Content-Type"] = "application/json"
        if "from" in kwargs:
            # for updating setting
            libs.tools.v(kwargs)
            tos = []
            if type(kwargs["to"]).__name__ == "list":
                for v in kwargs["to"]:
                    if len(v) > 0:
                        tos.append(libs.tools.convert(v))
            else:
                if len(kwargs['to']) > 0:
                    tos.append(libs.tools.convert(kwargs['to']))

            res = {'to': tos,
                   'server': libs.tools.convert(kwargs['server']),
                   'from': libs.tools.convert(kwargs['from']),
                   'timeout': int(kwargs['timeout']),
                   'alert': 'alert' in kwargs}

            libs.tools.v(res)

            return json.dumps(wem.set(user = self.getUser(), cfg = res))
        else:
            # for information getter
            return json.dumps(wem.get())

    def _unstructDict(self, indict, sep, debug = False):
        '''
            tools to convert string to dict
            indict:
                input dict which is string contained will be convert to stuctrued dict
            sep:
                separator (detemeter) to separate string
            debug:
                no use right now
        '''
        from libs.tools import convert as convert
        from libs.tools import v as v

        outdict = {}
        for k in indict:
            if sep in k:
                gstr = k.split(sep)
                base = gstr[0]
                glen = len(base + sep)
                if not base in outdict:
                    outdict[base] = {}

                key = convert(k[glen:])
                outdict[base][key] = convert(indict[k])
            else:
                k = convert(k)
                outdict[k] = convert(indict[k])

        return outdict

    @_.expose
    def vrrp(self, **kwargs):
        '''
            VRRPv2 getter and setter
            format:
            {'group': [{'group-name': 'VG_1',
                     'instance': [{'additional_track_interface': [{'interface': 's0e2'}],
                                   'advertisement-interval': 10,
                                   'delay-gratuitous-arp': 5,
                                   'instance-name': 'VI_1',
                                   'interface': 's0e1',
                                   'ipv4_vip': [{'interface': 's0e1',
                                                 'ipv4': '192.168.1.1',
                                                 'netmask': '255.255.255.0'}],
                                   'ipv4_vr': [{'destination-ipv4': '192.168.1.1',
                                                'gateway': '192.168.1.1',
                                                'interface': 's0e1',
                                                'netmask': '255.255.255.0'}],
                                   'ipv6_vip': [{'interface': 's0e1',
                                                 'ipv6': '2001::1',
                                                 'prefix': 64}],
                                   'ipv6_vr': [{'destination-ipv6': '2001::1',
                                                'gateway': '2001::1',
                                                'interface': 's0e1',
                                                'prefix': 64}],
                                   'preempt': True,
                                   'priority': 1,
                                   'sync-interface': 's0e1',
                                   'virtual-router-id': 1
                               }]
                       }]
               }
        '''
        import ml_w_vrrpv2 as wvr
        import json
        import libs.tools

        _.response.headers["Content-Type"] = "application/json"
        if 'group' in kwargs:
            # setter

            dat = kwargs

            res = []
            opt = []
            goptTmp = []
            nopt = {}

            for k in dat:
                if "@@" in k:
                    kk = k.split("@@")
                    if "list" == type(kk).__name__ and len(kk) > 1:
                        libs.tools.v(dat)
                        goptTmp = self._unstructDict(dat, "@@")

            gopt = []
            for k in goptTmp:
                if not "vrrpv2" == goptTmp[k]:
                    gopt.append(goptTmp[k])


            prefix = "instance@@"
            for k in range(0, len(gopt)):
                dat = self._unstructDict(gopt[k], "@@")
                iopt = []
                ioptTmp = self._unstructDict(dat["instance"], "@@")

                for kk in ioptTmp:
                    if "list" == type(ioptTmp[kk]["instance-name"]).__name__:
                        ov = ioptTmp[kk]["instance-name"][0]
                        ioptTmp[kk]["instance-name"] = ov

                    data = self._unstructDict(ioptTmp[kk], "@@")
                    if "preempt" in data.keys():
                        if "true" == data["preempt"]:
                            data["preempt"] = True
                        else:
                            data["preempt"] = False
                    if "ipv4_vip" in data.keys():
                        ov = []
                        da = self._unstructDict(data["ipv4_vip"], "@@")
                        for kt in da:
                            ov.append(da[kt])
                        data["ipv4_vip"] = ov
                    if "ipv4_vr" in data.keys():
                        ov = []
                        da = self._unstructDict(data["ipv4_vr"], "@@")
                        for kt in da:
                            ov.append(da[kt])
                        data["ipv4_vr"] = ov
                    if "ipv6_vip" in data.keys():
                        ov = []
                        da = self._unstructDict(data["ipv6_vip"], "@@")
                        for kt in da:
                            ov.append(da[kt])
                        data["ipv6_vip"] = ov
                    if "ipv6_vr" in data.keys():
                        ov = []
                        da = self._unstructDict(data["ipv6_vr"], "@@")
                        for kt in da:
                            ov.append(da[kt])
                        data["ipv6_vr"] = ov
                    if "additional_track_interface" in data.keys():
                        ov = []
                        da = self._unstructDict(data["additional_track_interface"], "@@")
                        for kt in da:
                            ov.append(da[kt])
                        data["additional_track_interface"] = ov
                    iopt.append(data)

                res.append({"group-name": dat["group-name"], "instance": iopt})

            res = {"group": res}

            return json.dumps(wvr.set(user = self.getUser(), cfg = res))
        else:
            # getter
            return json.dumps(wvr.get())

    @_.expose
    def slb(self, **kwargs):
        '''
            slb getter and setter
            format:
            {"ip":
                {"ipv4":
                    [{"label": "one",
                    "ip_address": ["10.1.1.4"]
                    },
                    {"label": "many",
                    "ip_address": ["10.1.1.1", "10.1.1.2", "10.1.1.3", "10.1.1.4"]
                    },
                    {"label": "ANY",
                    "ip_address": ["ANY"]
                    }],
                "ipv6":
                    [{"label": "one",
                    "ip_address": ["2001::1"]
                    },
                    {"label": "many",
                    "ip_address": ["2001::1", "2001::2", "2001::3", "2001::4"]
                    },
                    {"label": "ANY",
                    "ip_address": ["ANY"]
                    }]
                },
            "service_group":
                {"ipv4":
                    [{"label": "group1_v4",
                    "protocol": "TCP",
                    "application_port": [80, 443]
                    }],
                "ipv6":
                    [{"label": "group1_v6",
                    "protocol": "TCP",
                    "application_port": [80, 443]
                    }]
                },
            "real_server_group":
                {"ipv4":
                    [{"label": "real1_v4",
                    "ip_address": "10.1.1.1",
                    "weight": 1,
                    "health_check": "NA",
                    "maintenance_mode": False
                    },
                    {"label": "real2_v4",
                    "ip_address": "10.1.1.1",
                    "weight": 1,
                    "health_check": "HTTP_GET",
                    "http_get":
                        {"url": "/",
                        "status_code": 200,
                        "from_local_ip": "10.1.1.1",
                        "to_remote_port": 80,
                        "connection_timeout": 10,
                        "delay_before_retry": 10
                        },
                    "maintenance_mode": False
                    },
                    {"label": "real3_v4",
                    "ip_address": "10.1.1.1",
                    "weight": 1,
                    "health_check": "HTTPS_GET",
                    "https_get":
                        {"url": "/",
                        "status_code": 200,
                        "from_local_ip": "10.1.1.1",
                        "to_remote_port": 80,
                        "connection_timeout": 10,
                        "delay_before_retry": 10
                        },
                    "maintenance_mode": False
                    },
                    {"label": "real4_v4",
                    "ip_address": "10.1.1.1",
                    "weight": 1,
                    "health_check": "ICMP_CHECK",
                    "icmp_check":
                        {"timeout": 10},
                    "maintenance_mode": False
                    }]
                "ipv6":
                    [{"label": "real1_v6",
                    "ip_address": "2001::1",
                    "weight": 1,
                    "health_check": "TCP_CHECK",
                    "tcp_check":
                        {"from_local_ip": "2001::2",
                        "to_remote_ip": "2001::3",
                        "connection_timeout": 10
                        },
                    "maintenance_mode": False
                    },
                    {"label": "real2_v6",
                    "ip_address": "2001::1",
                    "weight": 1,
                    "health_check": "SMTP_CHECK",
                    "smtp_check":
                        {"helo_name": "",
                        "from_local_ip": "2001::2",
                        "to_remote_ip": "2001::3",
                        "to_remote_port": 25,
                        "connection_timeout": 10
                        },
                    "maintenance_mode": False
                    },
                    {"label": "real3_v6",
                    "ip_address": "2001::1",
                    "weight": 1,
                    "health_check": "PATTERN_CHECK",
                    "pattern_check":
                        {"send": "GET / HTTP/1.0\r\n\r\n",
                        "expect": "HTTP",
                        "to_remote_ip": "2001::3",
                        "to_remote_port": 80,
                        "timeout": 10
                        },
                    "maintenance_mode": False
                    }]
                },
            "fallback_server":
                {"ipv4":
                    [{"label": "fall1_v4",
                    "ip_address": "10.1.1.1"
                    },
                    {"label": "NA",
                    "ip_address": "NA"
                    }],
                "ipv6":
                    [{"label": "fall1_v6",
                    "ip_address": "2001::1"
                    },
                    {"label": "NA",
                    "ip_address": "NA"
                    }]
                },
            "property":
                [{"label": "proper1",
                "forward_method": "NAT",
                "balance_mode": "Round-robin",
                "health_check_interval": 10,
                "persistence": 10,
                "ipv4_netmask": "255.255.255.0",
                "ipv6_prefix": 64
                }]
            "policy":
                {"ipv4":
                    [{"source_ip": "one",
                    "destination_ip": "many",
                    "service_group": "group1_v4",
                    "action": "VIP",
                    "real_server_group": "real1_v4",
                    "fallback_server": "fall1_v4",
                    "property": "proper1"
                    }],
                "ipv6":
                    [{"source_ip": "one",
                    "destination_ip": "many",
                    "service_group": "group1_v6",
                    "action": "Accept",
                    "real_server_group": "",
                    "fallback_server": "",
                    "property": ""
                    }]
                }
            }
        '''
        import ml_w_slb as slb
        import json
        import libs.tools
        if "slb" in kwargs:
            dat = kwargs
            res = {}
            opt = []
            goptTmp = []
            nopt = {}

            for k in dat:
                if "@@" in k:
                    kk = k.split("@@")
                    if "list" == type(kk).__name__ and len(kk) > 1:
                        goptTmp = self._unstructDict(dat, "@@")

            gopt = {}

            for k in goptTmp:
                if not "slb" == k:
                    gopt[k] = goptTmp[k]

            for k in gopt:
                if "property" == k:
                    po = []
                    da = self._unstructDict(gopt["property"], "@@")
                    for kk in da:
                        po.append(da[kk])

                    nopt["property"] = po
                elif not "real_server_group" == k:
                    da = self._unstructDict(gopt[k], "@@")
                    db = {}
                    dc = []
                    nopt[k] = {}
                    for kk in da:
                        db = self._unstructDict(da[kk], "@@")
                        for ka in db:
                            dc.append(db[ka])
                            nopt[k][kk] = dc
                else:
                    da = self._unstructDict(gopt[k], "@@")
                    db = {}
                    dc = []
                    nopt[k] = {}
                    for kk in da:
                        if not kk in nopt[k]:
                            nopt[k][kk] = []

                        db = self._unstructDict(da[kk], "@@")
                        for ka in db:
                            dc = self._unstructDict(db[ka], "@@")
                            for kb in dc:
                                if "label" == kb:
                                    nopt[k][kk].append({kb : dc[kb]})
                                else:
                                    de = self._unstructDict(dc[kb], "@@")
                                    for kc in de:
                                        df = {}
                                        dg = de[kc]
                                        df = self._unstructDict(dg, "@@")
                                        nopt[k][kk].append({kb: df})
            libs.tools.v(nopt);
            return json.dumps(slb.set(user = self.getUser(), cfg = nopt));
        else:
            # getter
            return json.dumps(slb.get())

    @_.expose
    def connect(self, **kwargs):
        '''
            connection limit getter and setter
            format:
                {"ipv4": [
                    {
                        "source_ip": "ANY",
                        "destination_ip": "ANY",
                        "protocol": "TCP",
                        "limit_rate": 5,
                        "limit_rate_unit": "second",
                        "limit_burst": 5
                    },
                    {
                        "source_ip": "ANY",
                        "destination_ip": "ANY",
                        "protocol": "UDP",
                        "limit_rate": 5,
                        "limit_rate_unit": "minute",
                        "limit_burst": 5
                    },
                    ...
                ],
                "ipv6": [
                    {
                        "source_ip": "ANY",
                        "destination_ip": "ANY",
                        "protocol": "TCP",
                        "limit_rate": 5,
                        "limit_rate_unit": "second",
                        "limit_burst": 5
                    },
                    {
                        "source_ip": "ANY",
                        "destination_ip": "ANY",
                        "protocol": "UDP",
                        "limit_rate": 5,
                        "limit_rate_unit": "minute",
                        "limit_burst": 5
                    },
                    ...
                ]}
        '''
        import ml_w_connection_limit as wcl
        import json
        import libs.tools
        if "connect" in kwargs:
            # setter
            dat = kwargs
            res = {}
            opt = []
            goptTmp = []
            nopt = {}

            for k in dat:
                if "@@" in k:
                    kk = k.split("@@")
                    if "list" == type(kk).__name__ and len(kk) > 1:
                        goptTmp = self._unstructDict(dat, "@@")

            gopt = {}

            for k in goptTmp:
                if not "connect" == k:
                    gopt[k] = goptTmp[k]

            for k in gopt:
                nopt[k] = []
                res = self._unstructDict(gopt[k], "@@")
                dd = {}
                for kk in res:
                    dd = self._unstructDict(res[kk], "@@")
                    nopt[k].append(dd)


            return json.dumps(wcl.set(user = self.getUser(), cfg = nopt))
        else:
            # getter
            data = wcl.get()
            return json.dumps(data)

    @_.expose
    def nat64(self, **kwargs):
        '''
            nat64 getter and setter
            format:
                {
                    "enable": True,
                    "ipv6": "64:ff9b::",
                    "ipv6_prefix": 96,
                    "ipv4": "0.0.0.0"
                }
        '''
        import ml_w_nat64 as nat64
        import json
        import libs.tools
        if "nat64" in kwargs:
            # setter
            res = {"enable": "enable" in kwargs,
                   "ipv6": kwargs["ipv6"],
                   "ipv6_prefix": kwargs["ipv6_prefix"],
                   "ipv4": kwargs["ipv4"]}

            return json.dumps(nat64.set(user = self.getUser(), cfg = res))
        else:
            # getter
            return json.dumps(nat64.get())

