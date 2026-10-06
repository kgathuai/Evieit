#!/usr/bin/env python3
"""Third pass: require the searched noun to appear in the file title, and avoid
branded or fashion imagery. Anything still unsuitable is dropped back to its
emoji rather than shipping a wrong photo."""
import json, os, re, time, urllib.parse, urllib.request

UA = 'UniLearnTV/0.1 (offline educational TV app; https://github.com/kgathuai/Evieit)'
ALLOWED = re.compile(r'(public domain|cc0|cc[ -]by(-sa)?[ -]?\d)', re.I)
NOT_A_PHOTO = re.compile(r'(drawing|engraving|illustration|painting|print|MET DP|sketch|'
                         r'diagram|cartoon|poster|logo|coat of arms|map|chart|graph|svg)', re.I)

# item -> (queries, regex the file title must match)
FIX = {
    ('clothes', 'Shorts'): (['Bermuda shorts', 'Denim shorts', 'Shorts clothing'], r'short'),
    ('clothes', 'Hat'):    (['Straw hat', 'Sun hat', 'Hat white background'], r'hat|cap'),
    ('words', 'Hat'):      (['Straw hat', 'Sun hat', 'Hat white background'], r'hat|cap'),
    ('words', 'Water'):    (['Glass of water', 'Water glass drinking'], r'water|glass'),
    ('clothes', 'Skirt'):  (['Denim skirt', 'Long skirt clothing'], r'skirt'),
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
att = [a for a in json.load(open('tools/image-attribution.json'))
       if (a['module'], a['item']) not in FIX]

still_bad = []
for (folder, item), (queries, must) in FIX.items():
    want = re.compile(must, re.I)
    done = False
    for q in queries:
        if done:
            break
        d = api({'action': 'query', 'format': 'json', 'generator': 'search',
                 'gsrsearch': 'filetype:bitmap ' + q, 'gsrlimit': '12', 'gsrnamespace': '6',
                 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime', 'iiurlwidth': '480'})
        for p in (d.get('query') or {}).get('pages', {}).values():
            title = p.get('title', '')
            if not want.search(title) or NOT_A_PHOTO.search(title):
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
            open(path, 'wb').write(data)
            man[f'{folder}:{item}'] = path.replace('public/', '')
            att.append({'item': item, 'module': folder, 'file': path.replace('public/', ''),
                        'title': title, 'author': field(em, 'Artist') or 'unknown',
                        'licence': lic, 'licenceUrl': field(em, 'LicenseUrl'),
                        'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_'))})
            print(f'  fixed {folder}:{item:9s} {len(data)/1024:6.1f} kB  {lic:14s} {title[5:52]}')
            done = True
            break
        time.sleep(0.2)
    if not done:
        still_bad.append((folder, item))
        print(f'  NO GOOD PHOTO: {folder}:{item} -> will fall back to emoji')

# drop the wrong files so nothing misleading ships
for folder, item in still_bad:
    p = f'public/images/{folder}/{slug(item)}.jpg'
    if os.path.exists(p):
        os.remove(p)
    man.pop(f'{folder}:{item}', None)

json.dump(man, open('tools/image-manifest.json', 'w'), indent=2)
json.dump(att, open('tools/image-attribution.json', 'w'), indent=2)
print(f'\nmanifest now {len(man)} items; reverted to emoji: {len(still_bad)}')
