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

class Wizard(object):
    @_.expose
    def index(self, **kwargs):
        return self.ckDNS(**kwargs)

    @_.expose
    def ckDNS(self, **kwargs):
        import ml_w_wizard_dns as dns
        import json
        import libs.tools

#         if "hostname" in kwargs:
#             libs.tools.v(kwargs)
#             return json.dumps(dns.check(cfg = kwargs))
#         else:
#             return json.dumps((False, None))
        return json.dumps((False, None))
