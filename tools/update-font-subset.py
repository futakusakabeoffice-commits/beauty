#!/usr/bin/env python3
"""Regenerate the Noto Sans JP web-font URL so it contains only the characters the site uses.

Google Fonts' `text=` parameter returns one small font file per weight instead of dozens of
unicode-range slices, which removes most of the re-layout work on mobile. Run this after
changing any Japanese text in the HTML or JS files:

    python3 tools/update-font-subset.py

Characters that are not in the subset (e.g. text typed into the forms) fall back to
"Hiragino Sans" / the system sans-serif font.
"""
import html
import pathlib
import re
import string
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
FAMILY = 'Noto+Sans+JP:wght@400;500;700;900'
LINK = re.compile(r'(<link class="webfonts webfonts-jp" rel="stylesheet" href=")[^"]*(")')
# The <noscript> fallback link (no class attribute) for Noto Sans JP.
NOSCRIPT = re.compile(r'(<link rel="stylesheet" href=")https://fonts\.googleapis\.com/css2\?family=Noto\+Sans\+JP[^"]*(")')


def site_text():
    chars = set(string.printable.strip()) | {' '}
    for path in list(ROOT.glob('*.html')) + list(ROOT.glob('js/*.js')):
        src = path.read_text(encoding='utf-8')
        if path.suffix == '.html':
            src = re.sub(r'<(script|style)\b.*?</\1>', ' ', src, flags=re.S)
            src = re.sub(r'<!--.*?-->', ' ', src, flags=re.S)
            attrs = re.findall(r'(?:placeholder|value)="([^"]*)"', src)
            src = re.sub(r'<[^>]+>', ' ', src) + ' '.join(attrs)
            src = html.unescape(src)
        chars |= {c for c in src if not c.isspace()}
    return ''.join(sorted(chars))


def main():
    text = site_text()
    url = ('https://fonts.googleapis.com/css2?family=' + FAMILY + '&display=swap&text='
           + urllib.parse.quote(text, safe=''))
    href = html.escape(url, quote=True)
    for path in ROOT.glob('*.html'):
        src = path.read_text(encoding='utf-8')
        new = LINK.sub(lambda m: m.group(1) + href + m.group(2), src)
        new = NOSCRIPT.sub(lambda m: m.group(1) + href + m.group(2), new)
        if new != src:
            path.write_text(new, encoding='utf-8')
            print('updated', path.name)
    print(f'{len(text)} characters, URL length {len(url)}')


if __name__ == '__main__':
    main()
