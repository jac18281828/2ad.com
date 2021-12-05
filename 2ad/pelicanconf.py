#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'John Cairns'
SITENAME = u'John Cairns'
SITEURL = u'https://2ad.com'

THEME = 'themes/Flex'

# flex
FAVICON = 'favicon.ico'
SITELOGO = '/static/sitelogo.jpg'
SITETITLE = u'Manzikert 2021'
SITEDESCRIPTION = u'%s\'s Manzikert 2021 - Writing, Code, Tech, Recipes and more' % AUTHOR
HOME_HIDE_TAGS = False
MAIN_MENU = True
FEED_USE_SUMMARY = True
#BROWSER_COLOR = '#333'
BROWSER_COLOR = '#4D0D00'

THEME_COLOR = 'dark'
THEME_COLOR_AUTO_DETECT_BROWSER_PREFERENCE = True
THEME_COLOR_ENABLE_USER_OVERRIDE = True

PYGMENTS_STYLE = 'emacs'
PYGMENTS_STYLE_DARK = 'monokai'

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

WITH_FUTURE_DATES = False

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = 'feeds/all.atom.xml'
SLUG_FEED_ATOM = 'feeds/%s.atom.xml'
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (
    ('news', '/category/news.html'),
    ('tech', '/category/tech.html'),
    ('books', '/category/books.html'),
    ('history', '/category/history.html'),
    ('food', '/category/food.html'),
    ('crypto', '/category/crypto.html'),
    ('My Author Page', 'https://www.amazon.com/author/johncairns'),
    ('Mike Riley', 'http://mikeriley.com'),
    ('John Winan\'s Basement', 'https://www.youtube.com/channel/UCik0xMsb7kSpPUvT2JoJQ1w'),
    ('Samer Kanjo', 'https://samer.kanjo.net'),
    ('',''),
    ('GitHub', 'https://github.com/jac18281828'),
    ('LinkedIn', 'https://www.linkedin.com/in/johnacairns'),
    ('LibriVox', 'https://librivox.org/reader/12659'),
)

# Social widget
#SOCIAL = (
#    ('GitHub', 'https://github.com/jac18281828'),
#    ('LinkedIn', 'https://www.linkedin.com/in/johnacairns'),
#    ('LibriVox', 'https://librivox.org/reader/12659'),
#)

DEFAULT_PAGINATION = 5

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
