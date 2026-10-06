#!/usr/bin/env python3
"""Retry items whose Wikipedia lead image was not under an allowed licence, by
searching Commons directly and accepting the first acceptable candidate."""
import json, re, time, urllib.parse, urllib.request, os

UA = 'UniLearnTV/0.1 (offline educational TV app; https://github.com/kgathuai/Evieit)'
ALLOWED = re.compile(r'(public domain|cc0|cc[ -]by(-sa)?[ -]?\d)', re.I)
RETRY = {
    'animals': ['Bear', 'Elephant', 'Giraffe', 'Zebra'],
    'words': ['Zebra'],
}
QUERIES = ['{t}', '{t} animal', 'male {t}', '{t} portrait']


def api(base, params):
    url = base + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.load(r)


def field(em, k):
    v = (em.get(k) or {}).get('value')
    return re.sub(r'<[^>]+>', '', str(v)).strip() if v else ''


def slug(n):
    return re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-')


manifest = json.load(open('tools/image-manifest.json'))
attrib = json.load(open('tools/image-attribution.json'))

for folder, terms in RETRY.items():
    for term in terms:
        done = False
        for q in QUERIES:
            if done:
                break
            d = api('https://commons.wikimedia.org/w/api.php', {
                'action': 'query', 'format': 'json', 'generator': 'search',
                'gsrsearch': 'filetype:bitmap ' + q.format(t=term),
                'gsrlimit': '8', 'gsrnamespace': '6',
                'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime', 'iiurlwidth': '480'})
            for p in (d.get('query') or {}).get('pages', {}).values():
                ii = (p.get('imageinfo') or [{}])[0]
                if ii.get('mime') not in ('image/jpeg', 'image/png') or not ii.get('thumburl'):
                    continue
                em = ii.get('extmetadata', {})
                lic = field(em, 'LicenseShortName')
                if not ALLOWED.search(lic or ''):
                    continue
                title = p.get('title')
                req = urllib.request.Request(ii['thumburl'], headers={'User-Agent': UA})
                data = urllib.request.urlopen(req, timeout=90).read()
                path = f'public/images/{folder}/{slug(term)}.jpg'
                os.makedirs(os.path.dirname(path), exist_ok=True)
                open(path, 'wb').write(data)
                manifest[f'{folder}:{term}'] = path.replace('public/', '')
                attrib.append({
                    'item': term, 'module': folder, 'file': path.replace('public/', ''),
                    'title': title, 'author': field(em, 'Artist') or 'unknown',
                    'licence': lic, 'licenceUrl': field(em, 'LicenseUrl'),
                    'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')),
                })
                print(f'  ok  {folder}:{term:12s} {len(data)/1024:6.1f} kB  {lic}  {title[:44]}')
                done = True
                break
            time.sleep(0.2)
        if not done:
            print(f'  FAIL {folder}:{term}')

json.dump(manifest, open('tools/image-manifest.json', 'w'), indent=2)
json.dump(attrib, open('tools/image-attribution.json', 'w'), indent=2)
print(f'\ntotal images now: {len(manifest)}')
