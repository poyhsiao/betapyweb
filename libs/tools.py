#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
cherrypy indepenent tools to help to debug

Created on 2013/05/03

@author: Kim Hsiao

'''


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
