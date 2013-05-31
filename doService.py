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
