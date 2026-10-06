#!/usr/bin/env python3
"""Final pass for the new items. Anything that cannot be sourced as a genuine,
relevant photograph is dropped back to its emoji rather than shipping a wrong
picture."""
import json, os, re, time, urllib.parse, urllib.request

UA = 'UniLearnTV/0.1 (offline educational TV app; https://github.com/kgathuai/Evieit)'
ALLOWED = re.compile(r'(public domain|cc0|cc[ -]by(-sa)?[ -]?\d|attribution)', re.I)
NOT_A_PHOTO = re.compile(r'\b(drawing|engraving|illustration|painting|sketch|diagram|cartoon|'
                         r'poster|logo|chart|map|plate|fashion|coat of arms)\b', re.I)

# item -> (queries, regex the filename must satisfy)
FIX = {
    ('vehicles', 'Taxi'):      (['London black cab', 'Taxi cab street', 'Taxi automobile'], r'taxi|cab'),
    ('vehicles', 'Scooter'):   (['Motor scooter', 'Vespa scooter'], r'scooter|vespa'),
    ('clothes', 'Coat'):       (['Winter coat', 'Overcoat clothing', 'Wool coat'], r'coat'),
    ('clothes', 'Sandals'):    (['Sandals footwear', 'Sandal shoe leather'], r'sandal'),
    ('clothes', 'Pyjamas'):    (['Pajamas clothing', 'Pyjamas clothing'], r'pajama|pyjama'),
    ('fruits', 'Nectarine'):   (['Nectarine fruit', 'Nectarine'], r'nectarine'),
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
reverted = []

for (folder, item), (queries, must) in FIX.items():
    want = re.compile(must, re.I)
    done = False
    for q in queries:
        if done:
            break
        d = api({'action': 'query', 'format': 'json', 'generator': 'search',
                 'gsrsearch': 'filetype:bitmap ' + q, 'gsrlimit': '14', 'gsrnamespace': '6',
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
            att = [a for a in att if not (a['module'] == folder and a['item'] == item)]
            att.append({'item': item, 'module': folder, 'file': path.replace('public/', ''),
                        'title': title, 'author': field(em, 'Artist') or 'unknown',
                        'licence': lic, 'licenceUrl': field(em, 'LicenseUrl'),
                        'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_'))})
            print(f'  fixed {folder}:{item:9s} {len(data)/1024:6.1f} kB  {lic:14s} {title[5:52]}')
            done = True
            break
        time.sleep(0.2)
    if not done:
        p = 'public/' + man.pop(f'{folder}:{item}', '')
        att = [a for a in att if a['file'] != p.replace('public/', '')]
        if os.path.exists(p):
            os.remove(p)
        reverted.append(f'{folder}:{item}')
        print(f'  REVERTED to emoji: {folder}:{item}')

json.dump(man, open('tools/image-manifest.json', 'w'), indent=2)
json.dump(att, open('tools/image-attribution.json', 'w'), indent=2)
print(f'\nmanifest {len(man)}; reverted: {reverted}')
