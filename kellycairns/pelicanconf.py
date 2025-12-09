#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Dr. Kelly Cairns'
SITENAME = u'Kelly Cairns DVM MS DACVIM'
SITEURL = u'https://kellycairns.com'

THEME = 'themes/Flex'

# flex
FAVICON = 'favicon.ico'
SITELOGO = '/static/KellyHeadshot.jpg'
SITETITLE = u'%s' % AUTHOR
SITESUBTITLE = u'Veterinary Leader & Speaker'
HOME_HIDE_TAGS = False
MAIN_MENU = True
FEED_USE_SUMMARY = True
BROWSER_COLOR = '#333'
SITEDESCRIPTION = u'%s\' is a board-certified veterinary internal medicine specialist, executive leader, and nationally recognized educator and speaker on clinical excellence, veterinary education and wellbeing.' % AUTHOR

THEME_COLOR = 'light'
THEME_COLOR_AUTO_DETECT_BROWSER_PREFERENCE = True
THEME_COLOR_ENABLE_USER_OVERRIDE = True

PYGMENTS_STYLE = 'emacs'
PYGMENTS_STYLE_DARK = 'monokai'

# instruct flex theme to introduce the canonical link
REL_CANONICAL=True

PLUGIN_PATHS = ['../pelican-plugins' ]

PLUGINS = [
    'sitemap',
    'summary'
]

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
                'media',
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
LINKS = (
    ('news', '/category/news.html'),
    ('podcast', '/tag/podcast.html'),
    ('coaching', '/category/coaching.html'),
    ('publication', '/category/publication.html'),
    ('LinkedIn', 'https://linkedin.com/in/kelly-cairns-68425060'),
    ('Instagram', 'https://www.instagram.com/cairns_kelly/'),
)

# Social widget
# not used in current theme
# SOCIAL = ()

DEFAULT_PAGINATION = 8

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
