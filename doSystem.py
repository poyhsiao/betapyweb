#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
work for all system relative function which is always called by Ajax

Created on 2013/04/30

@author: Kim Hsiao
'''

import os
import sys
import cherrypy as _

from jinja2 import Environment, FileSystemLoader
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../middleware'))
# work for middleware access

env = Environment(loader=FileSystemLoader('static/template'), extensions=['jinja2.ext.i18n'])

from libs.tools import *
# all necessary libs


class System(object):
    # def __init__(self, callable, *args, **kwargs):
    #     self.callable = callable
    #     self.args = args
    #     self.kwargs = kwargs

    # def __call__(self):
    #     return self.callable(*self.args, **self.kwargs)

    @_.expose
    def index(self, *args, **kwargs):
        print args
        print kwargs
        return 'Hello World!'

    @_.expose
    def summary(self, **kwargs):
        '''
            System -> Summary access
        '''
        import ml_w_summary_system as wsys
        # import summary middleware
        obj = wsys.get()
        print obj
        if not obj[0]:
            # some error occured
            return 'Fail'
        else:
            tpl = env.get_template('summary.json')
            trans = translation()
            env.install_gettext_translations(trans['obj'])
            # import gettext for language translation
            return tpl.render(info=obj[1])
