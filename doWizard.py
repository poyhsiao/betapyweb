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

        if "hostname" in kwargs:
            libs.tools.v(kwargs)
            return json.dumps(dns.check(cfg = kwargs))
        else:
            return json.dumps((False, None))

    @_.expose
    def ckMode(self, **kwargs):
        import ml_w_wizard_mode as mode
        import json
        import libs.tools

        if "mode" in kwargs:
            libs.tools.v(kwargs)
            return json.dumps(mode.check(cfg = kwargs))
        else:
            return json.dumps((False, None))

    @_.expose
    def ckVRRP(self, **kwargs):
        import ml_w_wizard_vrrp as vrrp
        import json
        import libs.tools

        if "virtual-router-id" in kwargs:
            libs.tools.v(kwargs)
            data = {"vrrp": "vrrp" in kwargs,
                    "virtual-router-id": kwargs["virtual-router-id"]}
            return json.dumps(vrrp.check(cfg = data))
        else:
            return json.dumps((False, None))

    @_.expose
    def cks0e2(self, **kwargs):
        import ml_w_wizard_s0e2 as s0e2
        import json
        import libs.tools

        if "ipv4_default_gateway" in kwargs:
            libs.tools.v(kwargs)
            return json.dumps(s0e2.check(cfg = kwargs))
        else:
            return json.dumps((False, None))

    @_.expose
    def cks0e1(self, **kwargs):
        import ml_w_wizard_s0e1 as s0e1
        import json
        import libs.tools

        if "s0e1@@ipv4_fixed@@ipv4_address" in kwargs:
            libs.tools.v(kwargs)
            return json.dumps(s0e1.check(cfg = kwargs))
        else:
            return json.dumps((False, None))
