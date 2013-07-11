#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
_ web doLogin page

Created on 2013/04/30

@author: Kim Hsiao

'''
import os
import sys
import cherrypy as _
import libs.tools
from jinja2 import Environment, FileSystemLoader

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../middleware'))
# set middleware path in system path

# import libs.tools as tools
env = Environment(loader = FileSystemLoader('static/template'))


class Login(object):
    @_.expose
    def index(self, **kwargs):
        # print kwargs
        username = kwargs['AccountAlias']
        password = kwargs['Password']
        lang = kwargs['Language']

        _.session['LANG'] = lang
        # save perfer language first

        import ml_w_login as wlogin
        login = wlogin.get(username = username, password = password)
        libs.tools.v(login)
        if login[0]:

            import ml_w_account as wa

            _.session['headers'] = _.request.headers
            _.session['username'] = username
            _.session['password'] = password

            libs.tools.v(username)
            dat = wa.get(user = username)
            libs.tools.v(dat)

            dat = wa.get(user = username)[1]['user']
            for v in dat:
                if username == v["name"]:
                    for kk, vv in v.items():
                        _.session[kk] = vv

            libs.tools.v(_.session.items())

            raise _.HTTPRedirect('/main/')
            # tpl = env.get_template('default.html')
            # return tpl.render(userinfo=_.session)
            # import ml_w_login
            # res = ml_w_login.get(username=username, password=password)
            # print res
            # if not res[0]:
            #     raise _.HTTPRedirect('/')
            # else:
            #     raise _.HTTPRedirect('/main')
        else:
            raise _.HTTPRedirect('/')


def login(**kwargs):
    return Login().index(**kwargs)


def logout():
    _.session.clear()
    _.session.delete()
    raise _.HTTPRedirect('/')
    # lock current session
