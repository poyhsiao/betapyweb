#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
work for js code-generating, comination and compress on fly

Created on 2013/04/30

@author: Kim Hsiao
'''
import os
import jsmin
# compress engine


class JS(object):
    jsPath = os.path.abspath(os.path.dirname(__file__) + '/../static/script')
    dataPath = os.path.abspath(os.path.dirname(__file__) + '/../static/data')

    def __init__(self, files=['jquery.js'], path=jsPath):
        '''
            initialial
        '''
        self.files = files
        self.path = path

    def setFile(self, files):
        '''
            set files for compressed with
        '''
        self.files = files

    def setPath(self, path=jsPath):
        '''
            set the folder which content the js files
        '''
        self.path = path

    def getFiles(self):
        '''
            get the files will be compress and join together
        '''
        return self.files

    def getPath(self):
        '''
            get the given folder path
        '''
        return self.path

    def getContent(self):
        '''
            return all fs file without any compression
        '''
        res = ''
        for f in self.files:
            fp = open(self.path + '/' + f, 'r')
            res += fp.read()
            fp.close()
        return res

    def getMini(self):
        '''
            retrun the final result with minified
        '''
        c = self.getContent()
        return jsmin.jsmin(c)
