#!/usr/bin/env python3
"""Fetch photos for items that do not have one yet.

Same approach as fetch-images.py - Wikipedia lead image first, Commons search as
a fallback, public-domain/CC licences only - but it skips anything already in
tools/image-manifest.json so it is cheap to re-run after adding new items.
"""
import json, os, re, time, urllib.parse, urllib.request

UA = 'UniLearnTV/0.1 (offline educational TV app; https://github.com/kgathuai/Evieit)'
ALLOWED = re.compile(r'(public domain|cc0|cc[ -]by(-sa)?[ -]?\d)', re.I)
NOT_A_PHOTO = re.compile(r'(drawing|engraving|illustration|painting|print|MET DP|sketch|'
                         r'diagram|cartoon|poster|logo|coat of arms|map|chart|graph|logo|svg)', re.I)
# Terms whose plain article is about something else.
TITLE_OVERRIDE = {
    'Date': 'Date palm', 'Starfruit': 'Carambola', 'Plantain': 'Cooking banana',
    'Currant': 'Zante currant', 'Gooseberry': 'Gooseberry', 'Persimmon': 'Persimmon',
    'Guinea Pig': 'Guinea pig', 'Goldfish': 'Goldfish', 'Ferret': 'Ferret',
    'Dove': 'Mourning dove', 'Quail': 'Common quail', 'Bull': 'Bull',
    'Seal': 'Earless seal', 'Otter': 'Eurasian otter', 'Hyena': 'Spotted hyena',
    'Buffalo': 'African buffalo', 'Antelope': 'Impala', 'Chimpanzee': 'Chimpanzee',
    'Baboon': 'Baboon', 'Meerkat': 'Meerkat', 'Porcupine': 'Porcupine',
    'Squirrel': 'Eastern gray squirrel', 'Bat': 'Bat', 'Chameleon': 'Chameleon',
    'Lizard': 'Lizard', 'Butterfly': 'Butterfly', 'Frog': 'Frog',
    'Tractor': 'Tractor', 'Ambulance': 'Ambulance', 'Fire Engine': 'Fire engine',
    'Police Car': 'Police car', 'Rocket': 'Rocket', 'Taxi': 'Taxi',
    'Van': 'Van', 'Scooter': 'Kick scooter', 'Skateboard': 'Skateboard',
    'Hot Air Balloon': 'Hot air balloon', 'Bulldozer': 'Bulldozer', 'Canoe': 'Canoe',
    'T-shirt': 'T-shirt', 'Sweater': 'Sweater', 'Coat': 'Overcoat',
    'Raincoat': 'Raincoat', 'Boots': 'Boot', 'Sandals': 'Sandal',
    'Gloves': 'Glove', 'Belt': 'Belt (clothing)', 'Tie': 'Necktie',
    'Pyjamas': 'Pajamas', 'Uniform': 'School uniform', 'Cap': 'Baseball cap',
    'Carrot': 'Carrot', 'Potato': 'Potato', 'Onion': 'Onion', 'Cabbage': 'Cabbage',
    'Broccoli': 'Broccoli', 'Cucumber': 'Cucumber', 'Pumpkin': 'Pumpkin',
    'Peas': 'Pea', 'Beans': 'Common bean', 'Maize': 'Maize',
    'Chapati': 'Chapati', 'Samosa': 'Samosa', 'Omelette': 'Omelette',
    'Yoghurt': 'Yogurt', 'Milk': 'Milk',
    'Apricot': 'Apricot', 'Nectarine': 'Nectarine', 'Mandarin': 'Mandarin orange',
    'Lychee': 'Lychee', 'Mulberry': 'Mulberry', 'Cranberry': 'Cranberry',
    'Fox': 'Red fox',
}
SKIP = {'Cap'}   # would come back as a branded baseball cap; keep the emoji


def api(base, params):
    url = base + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    return json.load(urllib.request.urlopen(req, timeout=45))


def field(em, k):
    v = (em.get(k) or {}).get('value')
    return re.sub(r'<[^>]+>', '', str(v)).strip() if v else ''


def slug(n):
    return re.sub(r'[^a-z0-9]+', '-', n.lower()).strip('-')


def wiki_image(term):
    title = TITLE_OVERRIDE.get(term, term)
    try:
        d = api('https://en.wikipedia.org/w/api.php', {
            'action': 'query', 'format': 'json', 'redirects': '1', 'titles': title,
            'prop': 'pageimages', 'pithumbsize': '480'})
    except Exception:
        return None, None
    for p in (d.get('query') or {}).get('pages', {}).values():
        t = p.get('thumbnail')
        if t and t.get('source') and p.get('pageimage'):
            return t['source'], 'File:' + str(p['pageimage'])
    return None, None


def commons_search(term):
    try:
        d = api('https://commons.wikimedia.org/w/api.php', {
            'action': 'query', 'format': 'json', 'generator': 'search',
            'gsrsearch': 'filetype:bitmap ' + term, 'gsrlimit': '8', 'gsrnamespace': '6',
            'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime', 'iiurlwidth': '480'})
    except Exception:
        return None, None
    for p in (d.get('query') or {}).get('pages', {}).values():
        ii = (p.get('imageinfo') or [{}])[0]
        if ii.get('mime') != 'image/jpeg' or not ii.get('thumburl'):
            continue
        if NOT_A_PHOTO.search(p.get('title', '')):
            continue
        return ii['thumburl'], p['title']
    return None, None


def extmetadata(file_title):
    try:
        d = api('https://commons.wikimedia.org/w/api.php', {
            'action': 'query', 'format': 'json', 'titles': file_title,
            'prop': 'imageinfo', 'iiprop': 'extmetadata'})
    except Exception:
        return {}
    for p in (d.get('query') or {}).get('pages', {}).values():
        return (p.get('imageinfo') or [{}])[0].get('extmetadata', {}) or {}
    return {}


src = open('hooks/useUniLearn.js', encoding='utf-8').read()
def names(c):
    m = re.search(r'export const ' + c + r' = \[(.*?)\n\];', src, re.S)
    return re.findall(r"name: '([^']+)'", m.group(1)) if m else []

targets = ([('animals', n) for n in sorted(set(names('DOMESTIC_ANIMALS') + names('WILD_ANIMALS') + names('ANIMAL_SOUNDS')))]
           + [('vehicles', n) for n in names('VEHICLES')]
           + [('clothes', n) for n in names('CLOTHES')]
           + [('fruits', n) for n in names('FRUITS')]
           + [('foods', n) for n in names('FOODS')])

man = json.load(open('tools/image-manifest.json'))
att = json.load(open('tools/image-attribution.json'))
new, failed = 0, []

for folder, term in targets:
    key = f'{folder}:{term}'
    have = man.get(key)
    if have and os.path.exists('public/' + have):
        continue                                    # already have a photo
    if term in SKIP:
        failed.append((key, 'skipped by policy')); continue
    try:
        url, title = wiki_image(term)
        if not url:
            url, title = commons_search(term)
        if not url:
            failed.append((key, 'no image found')); continue
        if NOT_A_PHOTO.search(title or ''):
            failed.append((key, f'not a photo: {title}')); continue
        em = extmetadata(title)
        lic = field(em, 'LicenseShortName')
        if not ALLOWED.search(lic or ''):
            failed.append((key, f'licence {lic}')); continue
        data = urllib.request.urlopen(
            urllib.request.Request(url, headers={'User-Agent': UA}), timeout=90).read()
        path = f'public/images/{folder}/{slug(term)}.jpg'
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, 'wb').write(data)
        man[key] = path.replace('public/', '')
        att.append({'item': term, 'module': folder, 'file': path.replace('public/', ''),
                    'title': title, 'author': field(em, 'Artist') or 'unknown',
                    'licence': lic, 'licenceUrl': field(em, 'LicenseUrl'),
                    'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_'))})
        new += 1
        print(f'  ok  {key:26s} {len(data)/1024:6.1f} kB  {lic}')
    except Exception as e:
        failed.append((key, str(e)[:60]))
    time.sleep(0.2)

json.dump(man, open('tools/image-manifest.json', 'w'), indent=2)
json.dump(att, open('tools/image-attribution.json', 'w'), indent=2)
print(f'\nnew images: {new}   manifest: {len(man)}   failed: {len(failed)}')
for k, w in failed:
    print(f'  FAIL {k:26s} {w}')
