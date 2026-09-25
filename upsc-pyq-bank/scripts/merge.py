import sys, os, re, glob, difflib
from wordfreq import zipf_frequency as zf
BASE = '/home/user/Rudra-A/_papers/ocr'
DEV = re.compile('[ऀ-ॿ]')

def escore(l):
    w = [x.lower() for x in re.findall(r'[A-Za-z]+', l)]
    if not w:
        return 0, 0
    good = sum(len(x) for x in w if len(x) > 1 and zf(x, 'en') >= 3.0)
    return good / sum(len(x) for x in w), sum(1 for x in w if len(x) >= 4 and zf(x, 'en') >= 3.0)

def page_lines(d, n):
    e = [l.rstrip() for l in open(f'{d}/p-{n}.txt') if l.strip()]
    h = [l.rstrip() for l in open(f'{d}/p-{n}.h.txt') if l.strip()]
    picked = {}
    extra = []
    for l in h:
        nd = len(DEV.findall(l)); nl = len(re.findall('[A-Za-z]', l))
        if nd > 0.25 * nl or not re.search('[A-Za-z]{2,}', l):
            continue
        best, br = None, 0
        for i, c in enumerate(e):
            r = difflib.SequenceMatcher(None, l, c).ratio()
            if r > br:
                best, br = i, r
        if br > 0.75:
            picked.setdefault(best, [])
            if br < 0.97 and len(l.split()) > len(e[best].split()):
                picked[best].append(l)
        else:
            extra.append(l)
    idx = sorted(picked)
    out = []
    for k, i in enumerate(idx):
        out.append(e[i])
        for alt in picked[i]:
            out.append('    [alt] ' + alt)
        if k + 1 < len(idx):
            for j in range(i + 1, idx[k + 1]):
                s, n4 = escore(e[j])
                if s >= 0.85 and n4 >= 3:
                    out.append(e[j] + '   <<gap-fill>>')
    for l in extra:
        out.append(l + '   <<h-only>>')
    return out

def paper(name):
    d = f'{BASE}/{name}'
    pages = sorted((re.search(r'p-(\d+)\.txt$', p).group(1) for p in glob.glob(f'{d}/p-*.txt') if not p.endswith('.h.txt')), key=int)
    res = []
    for n in pages:
        if not os.path.exists(f'{d}/p-{n}.h.txt'):
            continue
        res.append(f'--- page {n}')
        res += page_lines(d, n)
    return res

if __name__ == '__main__':
    os.makedirs('/home/user/Rudra-A/_papers/en', exist_ok=True)
    for name in sys.argv[1:]:
        open(f'/home/user/Rudra-A/_papers/en/{name}.txt', 'w').write('\n'.join(paper(name)) + '\n')
        print('ok', name)
