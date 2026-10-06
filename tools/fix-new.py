#!/usr/bin/env python3
"""Fill gaps left by fetch-new.py.

Fixes two bugs from that pass: the "not a photo" filter matched the word "graph"
inside "geograph.org.uk" (rejecting a perfectly good photograph), and
"Attribution" - the readable name of CC BY - was missing from the allowlist.
"""
import json, os, re, time, urllib.parse, urllib.request

UA = 'UniLearnTV/0.1 (offline educational TV app; https://github.com/kgathuai/Evieit)'
ALLOWED = re.compile(r'(public domain|cc0|cc[ -]by(-sa)?[ -]?\d|attribution)', re.I)
NOT_A_PHOTO = re.compile(r'\b(drawing|engraving|illustration|painting|sketch|diagram|'
                         r'cartoon|poster|logo|chart|map|coat of arms)\b', re.I)
FIX = {
    ('animals', 'Baboon'):   ['Papio hamadryas', 'Baboon'],
    ('animals', 'Bull'):     ['Holstein bull', 'Bull cattle'],
    ('vehicles', 'Canoe'):   ['Canoe', 'Kayak'],
    ('clothes', 'Sandals'):  ['Sandal', 'Flip-flops'],
    ('fruits', 'Apricot'):   ['Apricot fruit', 'Apricot'],
    ('fruits', 'Peach'):     ['Peach fruit', 'Peaches'],
    ('fruits', 'Nectarine'): ['Nectarine fruit', 'Nectarine'],
    ('foods', 'Cookie'):     ['Chocolate chip cookie', 'Biscuit'],
    ('foods', 'Cabbage'):    ['Cabbage head', 'White cabbage'],
    ('foods', 'Broccoli'):   ['Broccoli head', 'Broccoli'],
}


def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    return json.load(urllib.request.urlopen(
        urllib.request.Request(url, headers={'User-Agent': UA}), timeout=45))


def field(em, k):
    v = (em.get(k) or {}).get('value')
    return re.sub(r'<[^>]+>', '', str(v)).strip() if v else ''


def slug(n):
    return re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-')


man = json.load(open('tools/image-manifest.json'))
att = json.load(open('tools/image-attribution.json'))

for (folder, item), queries in FIX.items():
    done = False
    for q in queries:
        if done:
            break
        d = api({'action': 'query', 'format': 'json', 'generator': 'search',
                 'gsrsearch': 'filetype:bitmap ' + q, 'gsrlimit': '10', 'gsrnamespace': '6',
                 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime', 'iiurlwidth': '480'})
        for p in (d.get('query') or {}).get('pages', {}).values():
            title = p.get('title', '')
            if NOT_A_PHOTO.search(title):
                continue
            ii = (p.get('imageinfo') or [{}])[0]
            if ii.get('mime') != 'image/jpeg' or not ii.get('thumburl'):
                continue
            em = ii.get('extmetadata', {})
            lic = field(em, 'LicenseShortName')
            if not ALLOWED.search(lic or ''):
                continue
            data = urllib.request.urlopen(
                urllib.request.Request(ii['thumburl'], headers={'User-Agent': UA}), timeout=90).read()
            path = f'public/images/{folder}/{slug(item)}.jpg'
            os.makedirs(os.path.dirname(path), exist_ok=True)
            open(path, 'wb').write(data)
            man[f'{folder}:{item}'] = path.replace('public/', '')
            att.append({'item': item, 'module': folder, 'file': path.replace('public/', ''),
                        'title': title, 'author': field(em, 'Artist') or 'unknown',
                        'licence': lic, 'licenceUrl': field(em, 'LicenseUrl'),
                        'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_'))})
            print(f'  fixed {folder}:{item:10s} {len(data)/1024:6.1f} kB  {lic:16s} {title[5:50]}')
            done = True
            break
        time.sleep(0.2)
    if not done:
        print(f'  no usable photo: {folder}:{item} (keeps its emoji)')

json.dump(man, open('tools/image-manifest.json', 'w'), indent=2)
json.dump(att, open('tools/image-attribution.json', 'w'), indent=2)
print('manifest now', len(man))
