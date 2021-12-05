#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Kelly Cairns'
SITENAME = u'Kelly Cairns DVM MS DACVIM'
SITEURL = ''

THEME = 'themes/Flex'

# flex
FAVICON = '/static/favicon.ico'
SITELOGO = '/static/sitelogo.jpg'
SITETITLE = u'Manzikert 2021'
HOME_HIDE_TAGS = False
MAIN_MENU = True
FEED_USE_SUMMARY = True

# load script for clarity
MICROSOFT_CLARITY = "57gfdnsu7m"

PLUGIN_PATHS = ['../pelican-plugins' ]

PLUGINS = ['sitemap', 'feed_summary']

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}

CC_LICENSE = {
    "name": "Creative Commons Attribution-ShareAlike",
    "version": "4.0",
    "slug": "by-sa",
}

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

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pathway Vet Alliance', 'https://pathwayvets.com/'),)

# Social widget
SOCIAL = (('LinkedIn', 'https://linkedin.com/in/kelly-cairns-68425060'),
          )

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
