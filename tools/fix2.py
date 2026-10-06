#!/usr/bin/env python3
"""Second pass: items where keyword search returned the wrong subject.

Uses the lead image of a specific, unambiguous Wikipedia article (curated), and
rejects anything whose file title looks like a drawing, print or diagram rather
than a photograph.
"""
import json, os, re, time, urllib.parse, urllib.request

UA = 'UniLearnTV/0.1 (offline educational TV app; https://github.com/kgathuai/Evieit)'
ALLOWED = re.compile(r'(public domain|cc0|cc[ -]by(-sa)?[ -]?\d)', re.I)
# A museum drawing or a cartoon is not a photograph of a real thing.
NOT_A_PHOTO = re.compile(r'(drawing|engraving|illustration|painting|print|MET DP|sketch|'
                         r'diagram|cartoon|poster|logo|coat of arms|map|chart|graph|svg)', re.I)

FIX = {
    ('animals', 'Alligator'): ['American alligator', 'Alligator'],
    ('animals', 'Ox'):        ['Zebu', 'Ox'],
    ('clothes', 'Hat'):       ['Baseball cap', 'Fedora'],
    ('words', 'Hat'):         ['Baseball cap', 'Fedora'],
    ('clothes', 'Shorts'):    ['Shorts', 'Cargo shorts'],
    ('words', 'Water'):       ['Drinking water', 'Glass of water'],
    ('words', 'Jar'):         ['Mason jar', 'Glass jar'],
}


def api(base, params):
    url = base + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    return json.load(urllib.request.urlopen(req, timeout=45))


def field(em, k):
    v = (em.get(k) or {}).get('value')
    return re.sub(r'<[^>]+>', '', str(v)).strip() if v else ''


def slug(n):
    return re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-')


man = json.load(open('tools/image-manifest.json'))
att = [a for a in json.load(open('tools/image-attribution.json'))
       if (a['module'], a['item']) not in FIX]

for (folder, item), titles in FIX.items():
    done = False
    for title in titles:
        if done:
            break
        d = api('https://en.wikipedia.org/w/api.php', {
            'action': 'query', 'format': 'json', 'redirects': '1', 'titles': title,
            'prop': 'pageimages', 'pithumbsize': '480'})
        for p in (d.get('query') or {}).get('pages', {}).values():
            thumb = (p.get('thumbnail') or {}).get('source')
            fname = p.get('pageimage')
            if not thumb or not fname:
                continue
            file_title = 'File:' + str(fname)
            if NOT_A_PHOTO.search(file_title):
                print(f'  skip (not a photo): {file_title[:60]}')
                continue
            em = {}
            dd = api('https://commons.wikimedia.org/w/api.php', {
                'action': 'query', 'format': 'json', 'titles': file_title,
                'prop': 'imageinfo', 'iiprop': 'extmetadata'})
            for pp in (dd.get('query') or {}).get('pages', {}).values():
                em = (pp.get('imageinfo') or [{}])[0].get('extmetadata', {}) or {}
            lic = field(em, 'LicenseShortName')
            if not ALLOWED.search(lic or ''):
                print(f'  skip (licence {lic}): {file_title[:50]}')
                continue
            req = urllib.request.Request(thumb, headers={'User-Agent': UA})
            data = urllib.request.urlopen(req, timeout=90).read()
            path = f'public/images/{folder}/{slug(item)}.jpg'
            open(path, 'wb').write(data)
            man[f'{folder}:{item}'] = path.replace('public/', '')
            att.append({'item': item, 'module': folder, 'file': path.replace('public/', ''),
                        'title': file_title, 'author': field(em, 'Artist') or 'unknown',
                        'licence': lic, 'licenceUrl': field(em, 'LicenseUrl'),
                        'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(file_title.replace(' ', '_'))})
            print(f'  fixed {folder}:{item:10s} {len(data)/1024:6.1f} kB  {lic:14s} {file_title[5:55]}')
            done = True
            break
        time.sleep(0.2)
    if not done:
        print(f'  STILL BAD {folder}:{item}')

json.dump(man, open('tools/image-manifest.json', 'w'), indent=2)
json.dump(att, open('tools/image-attribution.json', 'w'), indent=2)
print('done')
