#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
cherrypy indepenent tools to help to debug

Created on 2013/05/03

@author: Kim Hsiao

'''
import os


def translation(lang='en-US'):
    import gettext
    langdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../locale')
    return gettext.translation(domain='messages', localedir=langdir, languages=[lang])


def getCurrentDir():
    import os
    return os.path.dirname(os.path.abspath(__file__))


def v(obj, display='print'):
    try:
        if 'print' == display:
            print('This object has folloing content')
            print("\t")
            print '''
            ----------------------------------
            '''
            for k in obj:
                print(k + ' = ' + obj[k])
    except:
        print obj
    finally:
        print("\t")
        print '''
        ----------------------------------
        '''
