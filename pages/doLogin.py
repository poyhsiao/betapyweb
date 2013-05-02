#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
cherrypy web doLogin page

Created on 2013/04/30

@author: Kim Hsiao

'''
import os
import sys
import cherrypy
from jinja2 import Environment, FileSystemLoader

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../../middleware'))
env = Environment(loader=FileSystemLoader('static/template'))


class Login:
    @cherrypy.expose
    def index(self, **kwargs):
        print kwargs
        username = kwargs['AccountAlias']
        password = kwargs['Password']

        cherrypy.session['headers'] = cherrypy.request.headers
        cherrypy.session['username'] = username
        cherrypy.session['password'] = password

        print cherrypy.session

        tpl = env.get_template('default.html')
        return tpl.render(userinfo=cherrypy.session)
        # import ml_w_login
        # res = ml_w_login.get(username=username, password=password)
        # print res
        # if not res[0]:
        #     raise cherrypy.HTTPRedirect('/')
        # else:
        #     raise cherrypy.HTTPRedirect('/main')
