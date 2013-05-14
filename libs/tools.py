#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
cherrypy indepenent tools to help to debug

Created on 2013/05/03

@author: Kim Hsiao

'''
import os
import cherrypy as _


class Cookie:
    def setCookie(self, expire='session', **kwargs):
        cookie = _.response.cookie
        if len(kwargs) > 0:
            for k in kwargs:
                cookie[k] = kwargs[k]
                if not expire == 'session':
                    cookie[k]['expires'] = expire

    def getCookie(self, key=None):
        cookie = _.request.cookie
        if key is None:
            return cookie
        else:
            try:
                return cookie[key]
            except:
                return False


def translation():
    '''
        translation tool for gettext translation
        will return a dictionary:
            "obj" is the translator object
            "lang" is current selected language
    '''
    import gettext

    if 'LANG' in _.session:
        # if user is login or LANG is defined in session
        lang = _.session['LANG']
    else:
        lang = 'en-US'

    langdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../locale')
    return {'obj': gettext.translation(domain='messages', localedir=langdir, languages=[lang]), 'lang': lang}


def v(obj, display='print'):
    '''
        debug tool which will over-format the output message
        parameter:
            "obj": can be any kind of data type
            "display": current is "print" only
    '''
    if 'print' == display:
        import pprint as pp
        print '''
        ---------- start ------------------------
        '''
        pp.pprint(obj)
        print '''
        ----------  end ------------------------
        '''
def convert(str):
    import unicodedata as codec
    return codec.normalize('NFKD', str).encode("UTF-8", "ignore")
