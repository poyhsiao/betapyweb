# -*- coding: utf-8 -*1-
'''
Created on 2013/4/12

@author: kimhsiao

Title: Cherrypy study

Description: It's a easy start concept for cherrypy
'''

import os.path
current_dir = os.path.dirname(os.path.abspath(__file__))

import cherrypy

class Root:
  @cherrypy.expose
  def index(self):
    print "Hello World"

if __name__ == '__main__':
  cherrypy.config.update(
    {
    'environment': 'production',
    'server.socket_port': 8000,
    'server.socket_host': '0.0.0.0',
    'log.error_file': 'site.log',
    'log.screen': True
    }
  )

  mime_type = {
    'text': {
      'js': 'text/javascript',
      'json': 'application/json',
      'css': 'text/css',
      'html': 'text/html',
      'htm': 'text/htm'
    }, 
    'binary': {
      'png': 'image/png',
      'gif': 'image/gif',
      'jpg': 'image/jpeg',
      'ico': 'image/x-icon'
    }
  }

  conf = {
    '/css': {
      'tools.staticdir.on': True,
      'tools.staticdir.dir': os.path.join(current_dir, 'static/css'),
      # 'tools.staticdir.content_types': mime_type['text'],
      'tools.caching.on': True,
      'tools.caching.delay': 3600,
      'tools.encode.on': True,
      'tools.gzip.on': True,
      # 'tools.gzip.mime_types': mime_type['text']
    },
    '/template': {
      'tools.staticdir.on': True,
      'tools.staticdir.dir': os.path.join(current_dir, 'static/template'),
      # 'tools.staticdir.content_types': mime_type['text'],
      'tools.caching.on': True,
      'tools.caching.delay': 3600,
      'tools.encode.on': True,
      'tools.gzip.on': True,
      # 'tools.gzip.mime_types': mime_type['text']
    },
    '/script': {
      'tools.staticdir.on': True,
      'tools.staticdir.dir': os.path.join(current_dir, 'static/script'),
      # 'tools.staticdir.content_types': mime_type['text'],
      'tools.caching.on': True,
      'tools.caching.delay': 3600,
      'tools.encode.on': True,
      'tools.gzip.on': True,
      # 'tools.gzip.mime_types': mime_type['text']
    },
    '/data': {
      'tools.staticdir.on': True,
      'tools.staticdir.dir': os.path.join(current_dir, 'static/data'),
      # 'tools.staticdir.content_types': mime_type['text'],
      'tools.caching.on': True,
      'tools.caching.delay': 3600,
      'tools.encode.on': True,
      'tools.gzip.on': True,
      # 'tools.gzip.mime_types': mime_type['text']
    },
    '/image': {
      'tools.staticdir.on': True,
      'tools.staticdir.dir': os.path.join(current_dir, 'static/image'),
      # 'tools.staticdir.content_types': mime_type['binary'],
      'tools.caching.on': True,
      'tools.caching.delay': 3600,
      'tools.encode.on': True,
      'tools.gzip.on': True,
      # 'tools.gzip.mime_types': mime_type['text']
    }
  }

  cherrypy.quickstart(Root(), '/', config = conf)