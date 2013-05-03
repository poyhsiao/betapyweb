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
from jinja2 import Environment, FileSystemLoader

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../../middleware'))
env = Environment(loader=FileSystemLoader('static/template'))


class Login:
    @_.expose
    def index(self, **kwargs):
        # print kwargs
        username = kwargs['AccountAlias']
        password = kwargs['Password']

        _.session['headers'] = _.request.headers
        _.session['username'] = username
        _.session['password'] = password
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


def dologin(**kwargs):
    login = Login()
    return login.index(**kwargs)


def logout():
    id = _.session.id
    _.session.clear()
    _.session.delete()
    raise _.HTTPRedirect('/')
    # lock current session
