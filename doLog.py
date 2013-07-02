#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
work for all service relative function which is always called by Ajax

Created on 2013/06/03

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

class Log(object):
    def getUser(self):
        user = _.session.get("username")

        if None == user:
            raise _.HTTPRedirect('/')
        else:
            return user

    @_.expose
    def index(self, **kwargs):
        return self.view(**kwargs)

    @_.expose
    def view(self, **kwargs):
        '''
            System log viewer
            format:
            {"server_ip": "192.168.0.1",
            "facility": "local0"
            }
        '''
        import ml_w_view as wvi
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(wvi.refresh())

    @_.expose
    def syslog(self, **kwargs):
        '''
            Syslog getter and setter
            format:
            (True, {'server_ip': '192.168.0.1', 'facility': 'local0'})
        '''
        import ml_w_syslog as wsl
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        if "facility" in kwargs:
            # syslog setter
            libs.tools.v(kwargs)
            return json.dumps(wsl.set(user = self.getUser(), cfg = kwargs))
        else:
            # syslog getter
            return json.dumps(user = self.getUser(), wsl.get())
