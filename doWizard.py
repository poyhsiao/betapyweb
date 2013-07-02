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
import libs.tools

from jinja2 import Environment, FileSystemLoader
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../middleware'))
# work for middleware access

env = Environment(loader = FileSystemLoader('static/template'), extensions = ['jinja2.ext.i18n'])

class Wizard(object):
    def getUser(self):
        user = _.session.get("username")

        if None == user:
            raise _.HTTPRedirect('/')
        else:
            return user

    @_.expose
    def index(self, **kwargs):
        return self.ckDNS(**kwargs)

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
    def ckDNS(self, **kwargs):
        import ml_w_wizard_dns as dns
        import json

        if "hostname" in kwargs:
            libs.tools.v(kwargs)
            _.session["wizard"]["dns"] = kwargs
            return json.dumps(dns.check(user = self.getUser(), cfg = kwargs))
        else:
            return json.dumps((False, None))

    @_.expose
    def ckMode(self, **kwargs):
        import ml_w_wizard_mode as mode
        import json

        if "mode" in kwargs:
            libs.tools.v(kwargs)
            _.session["wizard"]["mode"] = kwargs
            return json.dumps(mode.check(user = self.getUser(), cfg = kwargs))
        else:
            return json.dumps((False, None))

    @_.expose
    def ckVRRP(self, **kwargs):
        import ml_w_wizard_vrrp as vrrp
        import json

        if "virtual-router-id" in kwargs:
            libs.tools.v(kwargs)
            data = {"vrrp": "vrrp" in kwargs,
                    "virtual-router-id": kwargs["virtual-router-id"]}

            _.session["wizard"]["vrrp"] = data
            return json.dumps(vrrp.check(user = self.getUser(), cfg = data))
        else:
            return json.dumps((False, None))

    @_.expose
    def cks0e2(self, **kwargs):
        import ml_w_wizard_s0e2 as s0e2
        import json

        goptTmp = []
        res = {}
        keya = ["ipv4_floating", "ipv4_fixed"]


        if "ipv4_default_gateway" in kwargs:
            for k in kwargs:
                if "@@" in k:
                    kk = k.split("@@")
                    if "list" == type(kk).__name__ and len(kk) > 1:
                        goptTmp = self._unstructDict(kwargs, "@@")

            for k in goptTmp:
                if "ipv4_default_gateway" == k:
                    res[k] = goptTmp[k]
                else:
                    for ka in keya:
                        if not ka in res:
                            res[ka] = []

                        if "list" == type(goptTmp[k][ka + "@@ipv4_address"]).__name__ and "list" == type(goptTmp[k][ka + "@@ipv4_prefix"]).__name__:
                            for kb in range(len(goptTmp[k][ka + "@@ipv4_address"])):
                                res[ka].append({"ipv4_address": libs.tools.convert(goptTmp[k][ka + "@@ipv4_address"][kb]), "ipv4_prefix": libs.tools.convert(goptTmp[k][ka + "@@ipv4_prefix"][kb])})
                        else:
                            res[ka].append({"ipv4_address": libs.tools.convert(goptTmp[k][ka + "@@ipv4_address"]), "ipv4_prefix": libs.tools.convert(goptTmp[k][ka + "@@ipv4_prefix"])})

            _.session["wizard"]["s0e2"] = res
            return json.dumps(s0e2.check(user = self.getUser(), cfg = res))
        else:
            return json.dumps((False, None))

    @_.expose
    def cks0e1(self, **kwargs):
        import ml_w_wizard_s0e1 as s0e1
        import json

        goptTmp = []
        res = {}
        keya = ["ipv4_floating", "ipv4_fixed"]

        if "s0e1@@ipv4_fixed@@ipv4_address" in kwargs:
            libs.tools.v(kwargs)
            for k in kwargs:
                if "@@" in k:
                    kk = k.split("@@")
                    if "list" == type(kk).__name__ and len(kk) > 1:
                        goptTmp = self._unstructDict(kwargs, "@@")

            for k in goptTmp:
                for ka in keya:
                    if not ka in res:
                        res[ka] = []

                    if "list" == type(goptTmp[k][ka + "@@ipv4_address"]).__name__ and "list" == type(goptTmp[k][ka + "@@ipv4_prefix"]).__name__:
                        for kb in range(len(goptTmp[k][ka + "@@ipv4_address"])):
                            res[ka].append({"ipv4_address": libs.tools.convert(goptTmp[k][ka + "@@ipv4_address"][kb]), "ipv4_prefix": libs.tools.convert(goptTmp[k][ka + "@@ipv4_prefix"][kb])})
                    else:
                        res[ka].append({"ipv4_address": libs.tools.convert(goptTmp[k][ka + "@@ipv4_address"]), "ipv4_prefix": libs.tools.convert(goptTmp[k][ka + "@@ipv4_prefix"])})

            _.session["wizard"]["s0e1"] = res
            return json.dumps(s0e1.check(user = self.getUser(), cfg = res))
        else:
            return json.dumps((False, None))

    @_.expose
    def ckSLB(self, **kwargs):
        import ml_w_wizard_slb as slb
        import json

        opt = []
        goptTmp = []

        if "slb" in kwargs:
            for k in kwargs:
                if "@@" in k:
                    kk = k.split("@@")
                    if "list" == type(kk).__name__ and len(kk) > 1:
                        goptTmp = self._unstructDict(kwargs, "@@")

            for k in goptTmp:
                if not "slb" == k:
                    opt.append(goptTmp[k])

            libs.tools.v(opt)

            _.session["wizard"]["slb"] = opt

            res = slb.check(user = self.getUser(), cfg = opt)

            if True == res[0]:
                return self.saveWizard()
            else:
                return json.dumps(res)
        else:
            return json.dumps((False, None))

    @_.expose
    def ckSession(self, **kwargs):
        import json

        if "name" in kwargs:
            libs.tools.v(_.session.get(kwargs["name"]))
            return json.dumps(_.session.get(kwargs["name"]))
        else:
            libs.tools.v(_.session.items())
            return json.dumps(_.session.items())

    def saveWizard(self):
        import ml_w_wizard_dns as dns
        import ml_w_wizard_mode as mode
        import ml_w_wizard_vrrp as vrrp
        import ml_w_wizard_s0e2 as s0e2
        import ml_w_wizard_s0e1 as s0e1
        import ml_w_wizard_slb as slb
        import json

        data = _.session["wizard"]
        user = self.getUser()

        res = dns.set(user=user, cfg=data["dns"])
        if False = res[0]:
            return json.dumps(res)
        res = mode.set(user=user, cfg=data["mode"])
        if False = res[0]:
            return json.dumps(res)
        res = vrrp.set(user=user, cfg=data["vrrp"])
        if False = res[0]:
            return json.dumps(res)
        res = s0e2.set(user=user, cfg=data["s0e2"])
        if False = res[0]:
            return json.dumps(res)
        res = s0e1.set(user=user, cfg=data["s0e1"])
        if False = res[0]:
            return json.dumps(res)
        res = slb.set(user=user, cfg=data["slb"])
        if False = res[0]:
            return json.dumps(res)

        return json.dumps(res)
