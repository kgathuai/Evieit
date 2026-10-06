#!/usr/bin/env python3
"""Fetch freely-licensed photos for Uni-Learn.

Prefers each topic's Wikipedia lead image (curated, so far more relevant than a
raw keyword search) and falls back to a Wikimedia Commons search. Only files
under a public-domain or Creative Commons licence are accepted, and the author
and licence of every download is recorded so it can be attributed.

Run:  python3 tools/fetch-images.py
"""
import json, os, re, sys, time, urllib.parse, urllib.request

UA = 'UniLearnTV/0.1 (offline educational TV app; https://github.com/kgathuai/Evieit)'
OUT = 'public/images'
ALLOWED = re.compile(r'(public domain|cc0|cc[ -]by(-sa)?[ -]?\d|no restrictions)', re.I)
# A few terms need nudging so Wikipedia returns the everyday object a child means.
TITLE_OVERRIDE = {
    'Ox': 'Ox', 'Boy': 'Boy', 'Jar': 'Jar', 'Nest': 'Bird nest', 'Ice': 'Ice',
    'Rain': 'Rain', 'Sun': 'Sun', 'Moon': 'Moon', 'Tree': 'Tree', 'Water': 'Water',
    'X-ray': 'X-ray', 'Queen': 'Crown', 'Hot Dog': 'Hot dog', 'Ice Cream': 'Ice cream',
    'Fries': 'French fries', 'Pants': 'Trousers', 'Socks': 'Sock', 'Shoes': 'Shoe',
    'Airplane': 'Airliner', 'Helicopter': 'Helicopter', 'Motorcycle': 'Motorcycle',
    'Bicycle': 'Bicycle', 'Train': 'Train', 'Truck': 'Truck', 'Bus': 'Bus',
    'Boat': 'Boat', 'Car': 'Car', 'Donkey': 'Donkey', 'Ox': 'Ox',
}
SKIP = {'Boy', 'Queen', 'X-ray'}   # photographs of people or radiographs: keep the emoji


def api(base, params):
    url = base + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        return json.load(r)


def wikipedia_image(term):
    title = TITLE_OVERRIDE.get(term, term)
    try:
        d = api('https://en.wikipedia.org/w/api.php', {
            'action': 'query', 'format': 'json', 'redirects': '1', 'titles': title,
            'prop': 'pageimages', 'pithumbsize': '480'})
    except Exception:
        return None, None
    for p in (d.get('query') or {}).get('pages', {}).values():
        t = p.get('thumbnail')
        if t and t.get('source'):
            return t['source'], 'File:' + str(p.get('pageimage'))
    return None, None


def commons_search(term):
    try:
        d = api('https://commons.wikimedia.org/w/api.php', {
            'action': 'query', 'format': 'json', 'generator': 'search',
            'gsrsearch': 'filetype:bitmap ' + term, 'gsrlimit': '6', 'gsrnamespace': '6',
            'prop': 'imageinfo', 'iiprop': 'url|extmetadata|mime', 'iiurlwidth': '480'})
    except Exception:
        return None, None
    for p in (d.get('query') or {}).get('pages', {}).values():
        ii = (p.get('imageinfo') or [{}])[0]
        if ii.get('mime') in ('image/jpeg', 'image/png') and ii.get('thumburl'):
            return ii['thumburl'], p.get('title')
    return None, None


def extmetadata(file_title):
    if not file_title:
        return {}
    try:
        d = api('https://commons.wikimedia.org/w/api.php', {
            'action': 'query', 'format': 'json', 'titles': file_title,
            'prop': 'imageinfo', 'iiprop': 'extmetadata'})
    except Exception:
        return {}
    for p in (d.get('query') or {}).get('pages', {}).values():
        return (p.get('imageinfo') or [{}])[0].get('extmetadata', {}) or {}
    return {}


def field(em, key):
    v = (em.get(key) or {}).get('value')
    return re.sub(r'<[^>]+>', '', str(v)).strip() if v else ''


def download(url, path):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=90) as r:
        data = r.read()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(data)
    return len(data)


def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def main():
    src = open('hooks/useUniLearn.js', encoding='utf-8').read()

    def names(const):
        m = re.search(r'export const ' + const + r' = \[(.*?)\n\];', src, re.S)
        return re.findall(r"name: '([^']+)'", m.group(1)) if m else []

    animals = sorted(set(names('DOMESTIC_ANIMALS') + names('WILD_ANIMALS') + names('ANIMAL_SOUNDS')))
    words = [w for _, w in re.findall(r"(\w): \{ word: '([^']+)'", 
             re.search(r'export const LETTER_WORDS = \{(.*?)\n\};', src, re.S).group(1))]
    existing = {p[:-4]: os.path.join(dp, p) for dp, _, fs in os.walk(OUT)
                for p in fs if p.endswith(('.jpg', '.png'))}

    targets = []
    for a in animals:
        targets.append(('animals', a))
    for v in names('VEHICLES'):
        targets.append(('vehicles', v))
    for c in names('CLOTHES'):
        targets.append(('clothes', c))
    for w in words:
        targets.append(('words', w))

    manifest, attribution, failed, reused = {}, [], [], 0
    for folder, term in targets:
        key = f'{folder}:{term}'
        ex = existing.get(slug(term))
        if ex and folder == 'words':          # reuse an existing fruit/food photo
            manifest[key] = ex.replace('public/', '')
            reused += 1
            continue
        if term in SKIP:
            failed.append((key, 'skipped by policy'))
            continue
        try:
            url, file_title = wikipedia_image(term)
            if not url:
                url, file_title = commons_search(term)
            if not url:
                failed.append((key, 'no image found'))
                continue
            em = extmetadata(file_title)
            lic = field(em, 'LicenseShortName') or 'unknown'
            if not ALLOWED.search(lic):
                failed.append((key, f'licence not allowed: {lic}'))
                continue
            path = f'{OUT}/{folder}/{slug(term)}.jpg'
            size = download(url, path)
            manifest[key] = path.replace('public/', '')
            attribution.append({
                'item': term, 'module': folder, 'file': path.replace('public/', ''),
                'title': file_title, 'author': field(em, 'Artist') or 'unknown',
                'licence': lic, 'licenceUrl': field(em, 'LicenseUrl'),
                'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(file_title.replace(' ', '_')),
            })
            print(f'  ok   {key:28s} {size/1024:6.1f} kB  {lic}')
        except Exception as e:
            failed.append((key, str(e)[:70]))
        time.sleep(0.25)

    json.dump(manifest, open('tools/image-manifest.json', 'w'), indent=2)
    json.dump(attribution, open('tools/image-attribution.json', 'w'), indent=2)
    print(f'\ndownloaded {len(attribution)}  reused {reused}  failed {len(failed)}')
    for k, why in failed:
        print(f'  FAIL {k:28s} {why}')


if __name__ == '__main__':
    main()
