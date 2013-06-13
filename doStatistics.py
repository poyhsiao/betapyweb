#!/usr/bin/env python
# -*- coding: utf-8 -*1-
'''
work for all service relative function which is always called by Ajax

Created on 2013/06/03

@author: Kim Hsiao
'''

import os
import sys
import cherrypy as _

from jinja2 import Environment, FileSystemLoader
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../middleware'))
# work for middleware access

env = Environment(loader = FileSystemLoader('static/template'), extensions = ['jinja2.ext.i18n'])

class Statistics(object):
    @_.expose
    def index(self, **kwargs):
        return self.counters(**kwargs)

    @_.expose
    def counters(self, **kwargs):
        '''
            Statistics >> Counters
            format:
            {
                "vips": [
                    {
                        "vip": "192.168.200.200",
                        "port": 443,
                        "connections": 0,
                        "inbound_packets": 0,
                        "inbound_bytes": 0,
                        "outbound_packets": 0,
                        "outbound_bytes": 0,
                        "rips": [
                            {
                                "rip": "192.168.200.200",
                                "port": 443,
                                "connections": 0,
                                "inbound_packets": 0,
                                "inbound_bytes": 0,
                                "outbound_packets": 0,
                                "outbound_bytes": 0
                            },
                            ...
                        ]
                    },
                    ...
                ]
            }
        '''
        import ml_w_counters as wcn
        import json
        import libs.tools

        if "counters" in kwargs:
            pass
        else:
            data = wcn.get()
            if 'list' == type(data[1]['vips']).__name__ and len(data[1]['vips']) == 0:
                '''
                    generate sample data
                '''
                data = (True, {'vips': [{"vip": "192.168.200.200",
                                         "port": 443,
                                         "connections": 0,
                                         "inbound_packages": 0,
                                         "inbound_bytes": 0,
                                         "outbound_packages": 0,
                                         "outbound_bytes": 0,
                                         "rips": [{"rip": "192.168.200.200",
                                                   "port": 443,
                                                   "connections": 0,
                                                   "inbound_packages": 0,
                                                   "inbound_bytes": 0,
                                                   "outbound_packages": 0,
                                                   "outbound_bytes": 0,
                                                   }]
                                         }]
                               }
                        )
            return json.dumps(data)

    @_.expose
    def rates(self, **kwargs):
        '''
            Statistics >> rates
            format:
            {
                "vips": [
                    {
                        "vip": "192.168.200.200",
                        "port": 443,
                        "connections/sec": 0,
                        "inbound_packets/sec": 0,
                        "inbound_bytes/sec": 0,
                        "outbound_packets/sec": 0,
                        "outbound_bytes/sec": 0,
                        "rips": [
                            {
                                "rip": "192.168.200.200",
                                "port": 443,
                                "connections/sec": 0,
                                "inbound_packets/sec": 0,
                                "inbound_bytes/sec": 0,
                                "outbound_packets/sec": 0,
                                "outbound_bytes/sec": 0
                            },
                            ...
                        ]
                    },
                    ...
                ]
            }
        '''
        import ml_w_rates as wrt
        import json
        import libs.tools

        if "rates" in kwargs:
            pass
        else:
            data = wrt.get()
            if 'list' == type(data[1]['vips']).__name__ and len(data[1]['vips']) == 0:
                '''
                    Generate sample data
                '''
                data = (True, {"vips": [{"vip": "192.168.200.200",
                          "port": 443,
                          "connections/sec": 0,
                          "inbound_packets/sec": 0,
                          "inbound_bytes/sec": 0,
                          "outbound_packets/sec": 0,
                          "outbound_bytes/sec": 0,
                          "rips": [{"rip": "192.168.200.200",
                                    "port": 443,
                                    "connections/sec": 0,
                                    "inbound_packets/sec": 0,
                                    "inbound_bytes/sec": 0,
                                    "outbound_packets/sec": 0,
                                    "outbound_bytes/sec": 0,
                                    }]
                             }]
                       })

            return json.dumps(data)

    @_.expose
    def persistence(self, **kwargs):
        '''
            Statistics >> Persistence Info
            format:
                {"vips": [{"vip": "192.168.200.200",
                            "persistent": 300,
                            "netmask": 24,
                            "prefix": 0,
                            "rips": [{"rip": "192.168.200.200",
                                    "weight": 1,
                                    "persistent": 100,
                                    "active": 0,
                                    "inactive": 0
                                },
                                ...
                            ]
                        },
                        {
                            "vip": "2001::1",
                            "persistent": 300,
                            "netmask": 0,
                            "prefix": 128,
                            "rips": [
                                {
                                    "rip": "2001::2",
                                    "weight": 1,
                                    "persistent": 100,
                                    "active": 0,
                                    "inactive": 0
                                },
                                ...
                            ]
                        },
                        ...
                    ]
                }
        '''
        import ml_w_persistence_info as wpi
        import json
        import libs.tools

        if "persistence" in kwargs:
            pass
        else:
            data = wpi.get()
            if 'list' == type(data[1]['vips']).__name__ and len(data[1]['vips']) == 0:
                '''
                    Generate sample data
                '''
                data = (True, {"vips": [{"vip": "192.168.200.200",
                                  "persistent": 300,
                                  "netmask": 24,
                                  "prefix": 0,
                                  "rips": [{"rip": "192.168.200.200",
                                            "weight": 1,
                                            "persistent": 100,
                                            "active": 0,
                                            "inactive": 0
                                            }]
                                  }, {"vip": "2001::1",
                                      "persistent": 300,
                                      "netmask": 0,
                                      "prefix": 128,
                                      "rips": [{"rip": "2001::2",
                                                "weight": 1,
                                                "persistent": 100,
                                                "active": 0,
                                                "inactive": 0
                                                }]
                                  }]
                        })

            return json.dumps(data)
