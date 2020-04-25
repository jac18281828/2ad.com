#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'John Cairns'
SITENAME = u'Documenting the Decline'
SITEURL = ''

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
LINKS = (('DTD by John Cairns', 'https://2ad.com/'),
         )

# Social widget
SOCIAL = (('Instagram', 'https://www.instagram.com/israeljmath/'),          
          )

DEFAULT_PAGINATION = 3

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
