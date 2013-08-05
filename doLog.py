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
        import libs.login
        user = libs.login.cklogin()
        if False == user:
            raise _.HTTPRedirect('/')
        else:
            return user

    @_.expose
    def index(self, **kwargs):
        return self.view(**kwargs)

    @_.expose
    def viewCatalog(self, *args, **kwargs):
        '''
            get System log of catalog
            format:
                (True, ["system", ...])
                (False, list)
        '''
        import libs.login
        if False == libs.login.cklogin():
            raise _.HTTPRedirect('/')

        import ml_w_view as wvi
        import json
        import libs.tools
        res = wvi.get_logtype(user = self.getUser())
        libs.tools.v(res)
        _.response.headers["Content-Type"] = "application/json"
        return json.dumps(res)

#     @_.expose
#     def view(self, **kwargs):
#         '''
#             System log viewer
#             format:
#             {"server_ip": "192.168.0.1",
#             "facility": "local0"
#             }
#         '''
#         import libs.login
#         if False == libs.login.cklogin():
#             raise _.HTTPRedirect('/')
#
#         import ml_w_view as wvi
#         import json
#         import libs.tools
#         _.response.headers["Content-Type"] = "application/json"
#         return json.dumps(wvi.refresh())

    @_.expose
    def view(self, *args, **kwargs):
        '''
            get system log detail
            format:
                ['2013-02-07T16:04:24.352987+08:00 localhost rsyslogd: [origin software="rsyslogd" swVersion="7.2.4" x-pid="1857" x-info="http://www.rsyslog.com"] start\n',
                "2013-02-07T16:04:24.352351+08:00 localhost rsyslogd-2184: action '*' treated as ':omusrmsg:*' - please change syntax, '*' will not be supported in the future [try http://www.rsyslog.com/e/2184 ]\n",
                '2013-02-07T16:04:24.355371+08:00 localhost kernel: [    0.000000] Initializing cgroup subsys cpuset\n',
                ...]
        '''
        import libs.login
        if False == libs.login.cklogin():
            raise _.HTTPRedirect('/')

        import ml_w_view as wvi
        import json
        import libs.tools
        if "logtype" in kwargs:
            res = wvi.refresh(user = self.getUser(), logtype = kwargs["logtype"])
            _.response.headers["Content-Type"] = "application/json"
            return json.dumps(res)
        else:
            res = (False, ["System Error"])
            return json.dumps(res)

    @_.expose
    def syslog(self, **kwargs):
        '''
            Syslog getter and setter
            format:
            (True, {'server_ip': '192.168.0.1', 'facility': 'local0'})
        '''
        import libs.login
        if False == libs.login.cklogin():
            raise _.HTTPRedirect('/')

        import ml_w_syslog as wsl
        import json
        import libs.tools
        _.response.headers["Content-Type"] = "application/json"
        if "facility" in kwargs:
            # syslog setter
            libs.tools.v(kwargs)
            res = wsl.set(user = self.getUser(), cfg = kwargs)
            if False == res[0]:
                return json.dumps([res[0], libs.tools.translateMessage(res[1])])
            else:
                return json.dumps(res)
            # return json.dumps(wsl.set(user = self.getUser(), cfg = kwargs))
        else:
            # syslog getter
            return json.dumps(wsl.get())
