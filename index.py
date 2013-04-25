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
        print "Hello world"

if __name__ == '__main__':
    cherrypy.config.update({'environment': 'production',
                            'log.error_file': 'site.log',
                            'server.socket_port': 8000,
                            # bind port number, default is 8080
                            'socket_host': '0.0.0.0',
                            # bind ipv4 default is 127.0.0.1
                            'log.screen': True})

    mime_type = {'js': 'text/javascript',
                 'json': 'application/json',
                 'css': 'text/css',
                 'png': 'image/png',
                 'gif': 'image/gif',
                 'jpg': 'image/jpeg',
                 'ico': 'image/x-icon',
                 'html': 'text/html',
                 'htm': 'text/html'
    }

    conf = {'/css': {'tools.staticdir.on': True,
                     'tools.caching.on': True,
                     'tools.caching.delay': 3600,
                     'tools.staticdir.dir': os.path.join(current_dir, 'static/css'),
                     'tools.staticdir.content_types': mime_type,
                     'tools.gzip.mime_types': mime_type
                     },
            '/template': {'tools.staticdir.on': True,
                      'tools.caching.on': True,
                      'tools.caching.delay': 3600,
                      'tools.staticdir.dir': os.path.join(current_dir, 'static/template'),
                      'tools.staticdir.content_types': mime_type,
                      'tools.gzip.mime_types': mime_type
                      },
            '/script': {'tools.staticdir.on': True,
                        'tools.caching.on': True,
                        'tools.caching.delay': 3600,
                        'tools.staticdir.dir': os.path.join(current_dir, 'static/script'),
                        'tools.staticdir.content_types': mime_type,
                        'tools.gzip.mime_types': mime_type
                        },
            '/image': {'tools.staticdir.on': True,
                       'tools.caching.on': True,
                       'tools.caching.delay': 3600,
                       'tools.staticdir.dir': os.path.join(current_dir, 'static/image'),
                       'tools.staticdir.content_types': mime_type,
                       'tools.gzip.mime_types': mime_type
                       },
            '/data': {'tools.staticdir.on': True,
                      'tools.caching.on': True,
                      'tools.caching.delay': 3600,
                      'tools.staticdir.dir': os.path.join(current_dir, 'static/data'),
                      'tools.staticdir.content_types': mime_type,
                      'tools.gzip.mime_types': mime_type
                      }
                    }

    cherrypy.quickstart(Root(), '/', config = conf)
