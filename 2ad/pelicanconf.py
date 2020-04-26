#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'John Cairns'
SITENAME = u'John Cairns'
SITEURL = u''

STATIC_PATHS = ('static',
                'images',
                'static/robots.txt',
                'static/favicon.ico',
                'static/site.webmanifest',
                'static/android-chrome-192x192.png',
                'static/android-chrome-512x512.png',
                'static/apple-touch-icon.png',
                'static/favicon-16x16.png',
                'static/favicon-32x32.png',
                'static/favicon.ico',
)

EXTRA_PATH_METADATA = {
    'static/robots.txt': {'path': 'robots.txt'},
    'static/favicon.ico': {'path': 'favicon.ico'},
    'static/site.webmanifest': {'path': 'site.webmanifest'},
    'static/android-chrome-192x192.png': {'path': 'android-chrome-192x192.png'},
    'static/android-chrome-512x512.png': {'path': 'android-chrome-512x512.png'},
    'static/apple-touch-icon.png': {'path': 'apple-touch-icon.png'},
    'static/favicon-16x16.png': {'path': 'favicon-16x16.png'},
    'static/favicon-32x32.png': {'path': 'favicon-32x32.png'},
    'static/favicon-ico': {'path': 'favicon.ico'},    
}

PATH = 'content'

TIMEZONE = 'America/Chicago'

DEFAULT_LANG = u'en'

WITH_FUTURE_DATES = False

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Java Disruptor BlockingQueue', 'https://github.com/conversant/disruptor/'),
         ('R-Tree', 'https://github.com/conversant/rtree'),
         ('GitHub', 'https://github.com/jac18281828'),
         ('Documenting The Decline', 'https://documentingthedecline.com'),
         ('Mike Riley'), ('https://mikeriley.com'),
         ('Johns Basement'), ('https://www.youtube.com/channel/UCik0xMsb7kSpPUvT2JoJQ1w'),
         ('Samer Kanjo'), ('https://samer.kanjo.net'),
         ('Jeanette Cairns', 'https://jeanettecairns.com/'),
         ('Emmy', 'https://emmycairns.com/'),
         #('Mina', 'https://minacairns.com'),
         #('Archie', 'https://archiecairns.com'),
)

# Social widget
SOCIAL = (('LinkedIn', 'https://www.linkedin.com/in/johnacairns'),
          ('Instagram', 'https://www.instagram.com/israeljmath/'),
          ('LibriVox', 'https://librivox.org/reader/12659'),
)

DEFAULT_PAGINATION = 5

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
