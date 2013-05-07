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
# import libs.tools as tools
from jinja2 import Environment, FileSystemLoader

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../middleware'))
# import libs.tools as tools
env = Environment(loader=FileSystemLoader('static/template'))


class Login:
    @_.expose
    def index(self, **kwargs):
        # print kwargs
        username = str(kwargs['AccountAlias'])
        password = str(kwargs['Password'])
        lang = kwargs['Language']

        _.session['LANG'] = lang
        # save perfer language first

        _.session['headers'] = _.request.headers
        _.session['username'] = username
        _.session['password'] = password

        # _.session['LANG'] = lang
        # save necessary information into session

        # print _.session

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


def login(**kwargs):
    return Login().index(**kwargs)


def logout():
    _.session.clear()
    _.session.delete()
    raise _.HTTPRedirect('/')
    # lock current session
