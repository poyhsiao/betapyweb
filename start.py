#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
_ web start up

Created on 2013/04/30

@author: Kim Hsiao

'''

import os.path
import sys
import cherrypy as _
import gzip
import cStringIO
from jinja2 import Environment, FileSystemLoader

current_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = current_dir + '/static'
script_dir = static_dir + '/script'
template_dir = static_dir + '/template'
data_dir = static_dir + '/data'
image_dir = static_dir + '/image'
css_dir = static_dir + '/css'

sys.path.append(current_dir)
# add this path as a package
sys.path.append(os.path.join(current_dir, '../middleware'))

# from login import Login

env = Environment(loader = FileSystemLoader('static/template'), extensions = ['jinja2.ext.i18n'])

from libs.login import cklogin
# work for login relative checking

from libs.tools import *

import doSystem as ds
import doService as de
import doStatistics as dt
import doLog as dl


def initNonStaticResponse():
    # Only compress the page if the client said it accepted it
    if request.headerMap.get('accept-encoding', '').find('gzip') != -1:
        # Compress page
        zbuf = cStringIO.StringIO()
        zfile = gzip.GzipFile(mode = 'wb', fileobj = zbuf, compresslevel = 9)
        zfile.write(response.body)
        zfile.close()
        response.body = zbuf.getvalue()
        response.headerMap['content-encoding'] = 'gzip'

class Root:
    @_.expose
    def index(self):
        '''
            main page which is login page
        '''
        if _.session.locked:
            _.session.release_lock()
        _.session.clean_up()
        # clean up all expired sessions
        if not cklogin():
            # if not login, then redirect to login page
            tpl = env.get_template('login.html')
            trans = translation()
            env.install_gettext_translations(trans['obj'])
            # import gettext for language translation
            return tpl.render(lang = trans['lang'])
        else:
            # if logged in already, show /main/ page
            raise _.HTTPRedirect('/main/')

    @_.expose
    def doLogin(self, **kwargs):
        '''
            login handler will use doLogin file
        '''
        from doLogin import login
        return login(**kwargs)

    @_.expose
    def main(self, **kwargs):
        '''
            it's main page
        '''
        if cklogin():
            # if user logged in, the show the content
            trans = translation()
            # save default language
            tpl = env.get_template("default.html")
            env.install_gettext_translations(trans['obj'])
            return tpl.render(userinfo = _.session)
        else:
            # if not login, go back to login page
            raise _.HTTPRedirect('/')

    @_.expose
    def logout(self, **kwargs):
        from doLogin import logout
        return logout()

    # @_.expose
    # def system(self, opt):
    #     return ds.System(opt)

    @_.expose
    def menuitem(self, **kwargs):
        '''
            translate menu items and display it
        '''
        tpl = env.get_template('menuitem.json')
        env.install_gettext_translations(translation()['obj'])
        return tpl.render()

    @_.expose
    def js(self, **kwargs):
        '''TESTING
            should become the all-in-one js normal request
            the require should be as get method as
            /js?files=jquery.js&files=underscore.js&files=underscore.js&files=bootstrap.js
        '''
        if kwargs is not None and 'files' in kwargs:
            import libs.jsReturn as j
            js = j.JS(kwargs['files'])
            data = js.getContent()
            return data

    @_.expose
    def jsmin(self, **kwargs):
        '''TESTING
            should become the all-in-one js normal request with COMPRESS
            the require should be as get method as
            /jsmin?files=jquery.js&files=underscore.js&files=underscore.js&files=bootstrap.js
        '''
        if kwargs is not None and 'files' in kwargs:
            import libs.jsReturn as j
            js = j.JS(kwargs['files'])
            data = js.getMini()
            return data

    @_.expose
    def getTpl(self, **kwargs):
        '''
            Try to get template file for underscore
        '''
        try:
            if 'file' in kwargs:
                tpl = env.get_template('/js/' + kwargs['file'] + '.html')
                trans = translation()
                env.install_gettext_translations(trans['obj'])
                # import gettext for language translation
                return tpl.render(lang = trans['lang'])
            else:
                return kwargs
        except Exception as e:
            import libs.tools
            libs.tools.v(e)
            return e


if __name__ == '__main__':
    _.config.update({
        'environment': 'production',
        'server.socket_port': 8000,
        'server.socket_host': '0.0.0.0',
        'log.error_file': 'site.log',
        'log.screen': True,
        'tools.sessions.locking': 'explicit'
    })

    content_type = {'text': {
        'js': 'text/javascript',
        'json': 'application/json',
        'css': 'text/css',
        'html': 'text/html',
        'htm': 'text/htm'
    }, 'binary': {
        'png': 'image/png',
        'gif': 'image/gif',
        'jpg': 'image/jpeg',
        'ico': 'image/x-icon'}
    }

    mime_type = {'text': [
        'text/javascript',
        # js
        'application/json',
        # json
        'text/css',
        # css
        'text/html',
        # html / htm
        'text/plain'
        # other plain text file
    ], 'binary': [
        'image/png',
        # png
        'image/gif',
        # gif
        'image/jpeg',
        # jpg
        'image/x-icon'
        # ico
    ]}

    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.sessions.storage_type': 'file',
            'tools.sessions.storage_path': os.path.join(current_dir, 'session'),
            'tools.sessions.timeout': 600
        },
        '/css': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/css'),
            'tools.staticdir.content_types': content_type['text'],
        },
        '/template': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/template'),
            'tools.staticdir.content_types': content_type['text'],
        },
        '/script': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/script'),
            'tools.staticdir.content_types': content_type['text'],
        },
        '/data': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/data'),
            'tools.staticdir.content_types': content_type['text'],
        },
        '/image': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/image'),
            'tools.staticdir.content_types': content_type['binary'],
        },
        '/img': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/image'),
            'tools.staticdir.content_types': content_type['binary'],
        }
    }

    root = Root()
    root.system = ds.System()
    root.service = de.Service()
    root.stat = dt.Statistics()
    root.log = dl.Log()
    # root.doLogin = Login()
    # root.main = main()

    # _.tree.mount(Login(), '/doLogin', config=conf)
    # _.quickstart(Root(), '/', config=conf)
    _.tree.mount(root, '/', config = conf)
    _.engine.start()
