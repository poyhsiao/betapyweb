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

env = Environment(loader=FileSystemLoader('static/template'), extensions=['jinja2.ext.i18n'])

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
            return tpl.render(info=obj[1])

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
        res = dns.set(cfg=kwargs)
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
        size = len(kwargs["interface"])
        if len(kwargs["interface"]) > 0:
            op = []
            for i in range(0, size):
                if len(kwargs["interface"][i]) > 1 and len(kwargs["vlan_id"]) > 0:
                    op.append({"interface": libs.tools.convert(kwargs["interface"][i]), "vlan_id": int(kwargs["vlan_id"][i])})

        dat = {"vconfig": op}
        libs.tools.v(dat)
        res = vlan.set(cfg=dat)
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
        return True