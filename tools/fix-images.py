#!/usr/bin/env python3
"""Re-fetch specific items whose first choice was wrong or unusable.

Each entry gives explicit Commons search phrases, tried in order. The first
JPEG under an allowed licence wins. Purely visual problems (a flag where a bird
belongs, a molecular diagram where water belongs) cannot be detected
automatically, so these are curated by hand after reviewing a contact sheet.
"""
import json, os, re, time, urllib.parse, urllib.request

UA = 'UniLearnTV/0.1 (offline educational TV app; https://github.com/kgathuai/Evieit)'
ALLOWED = re.compile(r'(public domain|cc0|cc[ -]by(-sa)?[ -]?\d)', re.I)

FIX = {
    ('animals', 'Turkey'):    ['Meleagris gallopavo', 'Domestic turkey bird', 'Wild turkey bird'],
    ('animals', 'Deer'):      ['Red deer stag', 'Roe deer', 'Fallow deer'],
    ('animals', 'Eagle'):     ['Bald eagle portrait', 'Golden eagle', 'White-tailed eagle'],
    ('animals', 'Turtle'):    ['Green sea turtle swimming', 'Sea turtle', 'Tortoise'],
    ('animals', 'Alligator'): ['American alligator', 'Alligator mississippiensis'],
    ('animals', 'Bear'):      ['Brown bear', 'Ursus arctos'],
    ('animals', 'Ox'):        ['Ox cattle', 'Zebu bull', 'Bull cattle'],
    ('clothes', 'Hat'):       ['Wide brim hat', 'Fedora hat', 'Baseball cap'],
    ('clothes', 'Shorts'):    ['Denim shorts', 'Cargo shorts'],
    ('clothes', 'Skirt'):     ['Pleated skirt', 'Denim skirt'],
    ('clothes', 'Shoes'):     ['Sneakers pair', 'Leather shoes pair'],
    ('clothes', 'Socks'):     ['Pair of socks', 'Socks'],
    ('words', 'Hat'):         ['Wide brim hat', 'Fedora hat', 'Baseball cap'],
    ('words', 'Rain'):        ['Rain drops on window', 'Rainfall', 'Rain shower'],
    ('words', 'Sun'):         ['Sun in the sky', 'Sunset sun', 'Sun through clouds'],
    ('words', 'Water'):       ['Glass of drinking water', 'Drinking water glass', 'Water drop'],
    ('words', 'Jar'):         ['Glass jar empty', 'Mason jar'],
}


def api(params):
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    return json.load(urllib.request.urlopen(req, timeout=45))


def field(em, k):
    v = (em.get(k) or {}).get('value')
    return re.sub(r'<[^>]+>', '', str(v)).strip() if v else ''


def slug(n):
    return re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-')


man = json.load(open('tools/image-manifest.json'))
att = json.load(open('tools/image-attribution.json'))
att = [a for a in att if (a['module'], a['item']) not in FIX]

for (folder, item), queries in FIX.items():
    done = False
    for q in queries:
        if done:
            break
        d = api({'action': 'query', 'format': 'json', 'generator': 'search',
                 'gsrsearch': 'filetype:bitmap ' + q, 'gsrlimit': '10', 'gsrnamespace': '6',
                 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime', 'iiurlwidth': '480'})
        for p in (d.get('query') or {}).get('pages', {}).values():
            ii = (p.get('imageinfo') or [{}])[0]
            if ii.get('mime') != 'image/jpeg' or not ii.get('thumburl'):
                continue
            em = ii.get('extmetadata', {})
            lic = field(em, 'LicenseShortName')
            if not ALLOWED.search(lic or ''):
                continue
            title = p.get('title')
            req = urllib.request.Request(ii['thumburl'], headers={'User-Agent': UA})
            data = urllib.request.urlopen(req, timeout=90).read()
            path = f'public/images/{folder}/{slug(item)}.jpg'
            os.makedirs(os.path.dirname(path), exist_ok=True)
            open(path, 'wb').write(data)
            man[f'{folder}:{item}'] = path.replace('public/', '')
            att.append({'item': item, 'module': folder, 'file': path.replace('public/', ''),
                        'title': title, 'author': field(em, 'Artist') or 'unknown',
                        'licence': lic, 'licenceUrl': field(em, 'LicenseUrl'),
                        'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_'))})
            print(f'  fixed {folder}:{item:10s} {len(data)/1024:6.1f} kB  {lic:16s} {title[6:56]}')
            done = True
            break
        time.sleep(0.2)
    if not done:
        print(f'  STILL BAD {folder}:{item}')

json.dump(man, open('tools/image-manifest.json', 'w'), indent=2)
json.dump(att, open('tools/image-attribution.json', 'w'), indent=2)
print(f'\nreplaced {len(FIX)} items; manifest now {len(man)}')
