"""usage: patch.py fin.txt patches.txt out.txt
patch file: blocks separated by lines '@@'; within a block, old and new separated by a line '=='.
Every old must occur exactly once (or the block starts with '*' line meaning replace all)."""
import sys, re
src = open(sys.argv[1]).read()
blocks = open(sys.argv[2]).read().split('\n@@\n')
bad = 0
for b in blocks:
    if not b.strip(): continue
    allm = b.startswith('*\n')
    if allm: b = b[2:]
    if '\n==\n' not in b:
        print('BAD BLOCK', b[:60]); bad += 1; continue
    old, new = b.split('\n==\n', 1)
    old = old.strip('\n'); new = new.rstrip('\n')
    c = src.count(old)
    if c == 0 or (c > 1 and not allm):
        print('COUNT', c, repr(old[:80])); bad += 1; continue
    src = src.replace(old, new)
# generic option clean-ups
src = re.sub(r'(?m)^([a-d]\|.*?)(\d),(\d)', lambda m: m.group(1) + m.group(2) + ', ' + m.group(3), src)
src = re.sub(r'(?m)^([a-d]\|.*?)(\d),(\d)', lambda m: m.group(1) + m.group(2) + ', ' + m.group(3), src)
src = re.sub(r'(?m)^(\d\.)\s*', r'\1 ', src)
open(sys.argv[3], 'w').write(src)
left = re.findall(r'MISSING|NOT FOUND', src)
print('bad patches:', bad, ' remaining markers:', len(left), ' questions:', len(re.findall(r'(?m)^Q\d+\|', src)))
