#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
_ web login relatived handler

Created on 2013/05/03

@author: Kim Hsiao

'''

import sys
import os

current_dir = os.path.abspath(os.path.dirname(__file__))
sys.path.append(os.path.join(current_dir, '../../middleware'))
import cherrypy as _


def cklogin(arr = False):
    # check if user is logon already
    if False == arr:
        session = _.session
    else:
        session = arr

    import tools

    try:
        # lock the session first for checking
#         if 'username' in _.session and _.session['username'] is not None:
#             return _.session['username']
        if 'username' in session:
            if session['username'] is not None:
                return session['username']
            else:
                return False
        else:
            return False
    except:
        return False


def login(username = None, password = None, success = '/main/', fail = '/'):
    # login into the site
    import ml_w_login
    res = ml_w_login.get(username, password)
    if not res[0]:
        # login success
        raise _.HTTPRedirect(success)
    else:
        # login fail
        raise _.HTTPRedirect(fail)
