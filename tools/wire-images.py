#!/usr/bin/env python3
"""Add imageSrc to every data entry that has a photo in tools/image-manifest.json.

Idempotent: entries that already carry an imageSrc are left alone, so this can
be re-run after adding items or fetching more images.
"""
import json, re, pathlib

man = json.load(open('tools/image-manifest.json'))

def table(prefix):
    return {k.split(':', 1)[1]: v for k, v in man.items() if k.startswith(prefix + ':')}

ARRAYS = [('FRUITS', 'fruits'), ('DOMESTIC_ANIMALS', 'animals'), ('WILD_ANIMALS', 'animals'),
          ('ANIMAL_SOUNDS', 'animals'), ('VEHICLES', 'vehicles'), ('CLOTHES', 'clothes'),
          ('FOODS', 'foods')]

p = pathlib.Path('hooks/useUniLearn.js')
s = p.read_text(encoding='utf-8')
total = 0

for const, prefix in ARRAYS:
    m = re.search(r'(export const ' + const + r' = \[)(.*?)(\n\];)', s, re.S)
    look = table(prefix)
    hits = [0]
    def add(mm):
        whole, name, rest = mm.group(0), mm.group(1), mm.group(2)
        if 'imageSrc' in whole:
            return whole
        path = look.get(name)
        if not path:
            return whole
        hits[0] += 1
        return "{ name: '%s',%s imageSrc: '%s' }" % (name, rest.rstrip().rstrip(',') + ',', path)
    s = s[:m.start(2)] + re.sub(r"\{ name: '([^']+)',([^}]*?)\}", add, m.group(2)) + s[m.end(2):]
    print(f'  {const:18s} +{hits[0]}')
    total += hits[0]

# LETTER_WORDS are keyed by letter rather than name
m = re.search(r'(export const LETTER_WORDS = \{)(.*?)(\n\};)', s, re.S)
look = table('words')
hits = [0]
def addw(mm):
    whole = mm.group(0)
    if 'imageSrc' in whole:
        return whole
    letter, word, emoji = mm.group(1), mm.group(2), mm.group(3)
    path = look.get(word)
    if not path:
        return whole
    hits[0] += 1
    return "%s: { word: '%s', emoji: '%s', imageSrc: '%s' }" % (letter, word, emoji, path)
s = s[:m.start(2)] + re.sub(r"(\w): \{ word: '([^']+)',\s*emoji: '([^']*)' \}", addw, m.group(2)) + s[m.end(2):]
print(f'  {"LETTER_WORDS":18s} +{hits[0]}')
total += hits[0]

p.write_text(s, encoding='utf-8')
print('wired:', total)
