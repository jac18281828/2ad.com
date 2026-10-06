#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

import datetime
import os

AUTHOR = u'Dr. Kelly Cairns'
SITENAME = u'Kelly Cairns DVM MS DACVIM'
SITEURL = u'https://kellycairns.com'

THEME = 'themes/Flex'
CUSTOM_CSS = 'static/custom.css?v=8'

# Site templates that replace the theme's: partial/footer.html adds a note above the license line.
THEME_TEMPLATES_OVERRIDES = [os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')]
# Fills the footer's copyright line, which otherwise reads just "©  -".
COPYRIGHT_NAME = AUTHOR
COPYRIGHT_YEAR = datetime.date.today().year

# flex
FAVICON = '/favicon.ico'
SITELOGO = '/static/KellyHeadshot.jpg'
SITETITLE = u'%s' % AUTHOR
SITESUBTITLE = (u'<span class="kc-subtitle">Veterinary Medical Leader<br>'
                u'<span class="kc-role">Educator |</span> '
                u'<span class="kc-role">Strategist |</span> '
                u'<span class="kc-role">Advisor</span></span>')
HOME_HIDE_TAGS = False
MAIN_MENU = True
# Top bar: Home, then Contact, so every page is one click from getting in touch
MENUITEMS = (
    ('Contact', '/pages/contact.html'),
)
PAGES_SORT_ATTRIBUTE = 'menu_order'
FEED_USE_SUMMARY = True
BROWSER_COLOR = '#333'
# Used for link previews (LinkedIn, texts), Google's search snippet and the
# structured data; keep it under about 160 characters so it isn't cut off.
SITEDESCRIPTION = (u'%s helps veterinary schools, hospitals and industry partners build better '
                   u'education, stronger clinical quality and the leaders who deliver care.' % AUTHOR)

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
}


PATH = 'content'

TIMEZONE = 'America/Chicago'

DEFAULT_LANG = u'en'

# Drafts are not written to the output; Pelican would serve them under /drafts/.
DRAFT_SAVE_AS = ''
DRAFT_LANG_SAVE_AS = ''

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (
    ('publications', '/category/publication.html'),
    ('media', '/category/news.html'),
    ('podcasts', '/category/podcast.html'),
    ('all posts', '/blog.html'),
)

# Social icons, shown under the name in the sidebar
SOCIAL = (
    ('linkedin', 'https://linkedin.com/in/kelly-cairns-68425060'),
)

DEFAULT_PAGINATION = 8

# The home page is content/pages/home.md; the post list lives at blog.html
INDEX_SAVE_AS = 'blog.html'

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
