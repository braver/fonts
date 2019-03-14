#!/usr/bin/env python3

"""
Generate fonts.yaml entry based on the font directory.

Uses python3 (tested on python3.6), and requires
fonttools (https://github.com/fonttools/fonttools/) and for woff2
brotlipy (https://github.com/python-hyper/brotlipy/)
"""

import sys
import os
import re
from fontTools import ttLib

FONT_SPECIFIER_FAMILY_ID = 1
def families( fontPath ):
    """ Based loosely on https://gist.github.com/pklaus/dce37521579513c574d0 """
    font = ttLib.TTFont(fontPath)
    families = set()
    for record in font['name'].names:
        if record.nameID != FONT_SPECIFIER_FAMILY_ID: continue
        if (record.string and record.string[0] == 0x00):
            name_str = record.string.decode('utf-16-be')
        else:
            name_str = record.string.decode('utf-8')
        if name_str:
            families.add(name_str)
    return families

exts=['ttf', 'otf', 'woff', 'woff2']
suffixes=['', '-bold', '-italic', '-bold-italic']

for fontpath in sys.argv[1:]:
    if fontpath.endswith('/'):
        fontpath = fontpath[:-1]
    fontdir = os.path.basename(fontpath)
    types = {}
    unknowns = []
    for file in os.listdir('{}'.format(fontpath)):
        if any(file.endswith('.'+ext) for ext in exts):
            fn = '{}/{}'.format(fontdir, file)
            fp = '{}/{}'.format(fontpath, file)
            rx = '^{}({})\\.(?:{})$'.format(
                re.escape(fontdir),
                '|'.join(suffixes),
                '|'.join(exts)
                )
            m = re.match(rx, file)
            if m:
                if m[1] == '':
                    type = 'normal'
                else:
                    type = m[1][1:]
                types[type] = (fn, fp)
            else:
                unknowns.append(fn)
    fam = set()
    allfams = set()
    for (fn, file) in types.values():
        if any(file.endswith('.'+ext) for ext in exts):
            fams = families(file)
            allfams = allfams.union(fams)
            if len(fam) > 0:
                fam = fam.intersection(fams)
            else:
                fam = fams
    if len(fam) == 0 or len(fam) > 1:
        print("# no consistent font family name for '{}'; possible options: '{}'".format(fontdir, ', '.join(sorted(allfams))))
    if len(fam) == 0:
        print("# skipping '{}' since can't choose family name".format(fontdir))
        continue
    famname, *famnames = sorted(fam)
    if len(types) == 1 and 'normal' in types:
        print("{}: '{}'".format(famname, types['normal'][0]))
        for famn in famnames:
            print("#{}: '{}'".format(famn, types['normal'][0]))
    else:
        print('{}:'.format(famname))
        for famn in famnames:
            print('#{}:'.format(famn))
        for (type, (fn, fp)) in sorted(types.items()):
            print("   {}: '{}'".format(type, fn))
    for fn in sorted(unknowns):
        print("#   unknown font variant: '{}'".format(fn))
