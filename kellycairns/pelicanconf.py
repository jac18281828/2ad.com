#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Kelly Cairns'
SITENAME = u'Kelly Cairns DVM MS DACVIM'
SITEURL = ''

THEME = 'themes/Flex'

# flex
FAVICON = 'favicon.ico'
SITELOGO = '/static/KellyHeadshot.jpg'
SITETITLE = u'Dr. Kelly Cairns'
HOME_HIDE_TAGS = False
MAIN_MENU = True
FEED_USE_SUMMARY = True
BROWSER_COLOR = '#333'
SITEDESCRIPTION = u'%s\'Veterinary Specialist, Public Speaker and Leader' % AUTHOR

THEME_COLOR = 'light'
THEME_COLOR_AUTO_DETECT_BROWSER_PREFERENCE = True
THEME_COLOR_ENABLE_USER_OVERRIDE = True

PYGMENTS_STYLE = 'emacs'
PYGMENTS_STYLE_DARK = 'monokai'

# plugin for clarity.microsoft.com
MICROSOFT_CLARITY = "9lturow2fn"

# https://secure.gaug.es
# plugin for gauges
GUAGES = '61b567468a27ac1647883f64'


PLUGIN_PATHS = ['../pelican-plugins' ]

PLUGINS = [
    'sitemap',
    'summary',
    'feed_summary'
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
    ('about', '/category/bio.html'),
    ('news', '/category/news.html'),
    ('coaching', '/category/coaching.html'),
    ('Thrive Pet Healthcare', 'https://www.thrivepetcare.com'),
    ('LinkedIn', 'https://linkedin.com/in/kelly-cairns-68425060'),
    ('Instagram', 'https://www.instagram.com/cairns_kelly/'),
    ('Thrive Instagram', 'https://www.instagram.com/thrive__petcare/'),
)

# Social widget
# not used in current theme
# SOCIAL = ()

DEFAULT_PAGINATION = 4

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
