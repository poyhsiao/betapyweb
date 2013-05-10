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
        import unicodedata as codec
        for k in kwargs:
            kwargs[k] = codec.normalize('NFKD', kwargs[k]).encode("UTF-8", "ignore")
        res = dns.set(cfg=kwargs)
        _.response.headers["Content-Type"] = "application/json"
        # return json.dumps(kwargs)
        return json.dumps(res)
