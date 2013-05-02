#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
cherrypy web start up

Created on 2013/04/30

@author: Kim Hsiao

'''

import os.path
import sys
import cherrypy
from jinja2 import Environment, FileSystemLoader

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../middleware'))
sys.path.append(os.path.join(current_dir, 'pages'))
env = Environment(loader=FileSystemLoader('static/template'))

from doLogin import Login


class Root:
    @cherrypy.expose
    def index(self):
        tpl = env.get_template('login.html')
        return tpl.render(start='hihi', end='data')

    @cherrypy.expose
    def main(self):
        tpl = env.get_template('default.html')
        return tpl.render(start='let', end='show')


if __name__ == '__main__':
    cherrypy.config.update({
        'environment': 'production',
        'server.socket_port': 8000,
        'server.socket_host': '0.0.0.0',
        'log.error_file': 'site.log',
        'log.screen': True
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
            'tools.caching.on': True,
            'tools.caching.delay': 3600,
            'tools.encode.on': True,
            'tools.gzip.on': True,
            'tools.gzip.mime_types': mime_type['text']
        },
        '/template': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/template'),
            'tools.staticdir.content_types': content_type['text'],
            'tools.caching.on': True,
            'tools.caching.delay': 3600,
            'tools.encode.on': True,
            'tools.gzip.on': True,
            'tools.gzip.mime_types': mime_type['text']
        },
        '/script': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/script'),
            'tools.staticdir.content_types': content_type['text'],
            'tools.caching.on': True,
            'tools.caching.delay': 3600,
            'tools.encode.on': True,
            'tools.gzip.on': True,
            'tools.gzip.mime_types': mime_type['text']
        },
        '/data': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/data'),
            'tools.staticdir.content_types': content_type['text'],
            'tools.caching.on': True,
            'tools.caching.delay': 3600,
            'tools.encode.on': True,
            'tools.gzip.on': True,
            'tools.gzip.mime_types': mime_type['text']
        },
        '/image': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': os.path.join(current_dir, 'static/image'),
            'tools.staticdir.content_types': content_type['binary'],
            'tools.caching.on': True,
            'tools.caching.delay': 3600,
            'tools.encode.on': True,
            'tools.gzip.on': True,
            'tools.gzip.mime_types': mime_type['text']
        }
    }

    root = Root()
    root.doLogin = Login()

    # cherrypy.tree.mount(Login(), '/doLogin', config=conf)
    # cherrypy.quickstart(Root(), '/', config=conf)
    cherrypy.tree.mount(root, '/', config=conf)
    cherrypy.engine.start()
