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

            return json.dumps(snmp.set(cfg = res))

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

            return json.dumps(wem.set(cfg = res))
        else:
            # for information getter
            return json.dumps(wem.get())

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
            libs.tools.v(kwargs)
            return json.dumps(kwargs)
        else:
            # getter
            return json.dumps(wvr.get())
