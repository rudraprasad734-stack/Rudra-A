import sys, re
from wordfreq import zipf_frequency as zf
NEWLINE_START = re.compile(r'^(\d{1,2}\s*[\.\)]|[IVX]{1,4}\.\s|Statement\s*[IVX1-3]|Select the correct|Which (of|one of) the|How many|In how many|Which among|Consider the following|Assertion|Reason|List[- ]?I|Code|Passage|Directions?)')
FIX = [(r'[‘’]', "'"), (r'[“”]', '"'), (r'\s+([:?,;])', r'\1'), (r'\s+[\'"|;,\.\*°`]+\s*$', ''), (r'\s{2,}', ' '), (r'^i\.\s', '1. '), (r'^I\.\s(?=[A-Z])', '1. '), (r'^land ', '1 and '), (r'^\s*[\'‘|»]\s*$', '')]
def clean(t):
    t = t.strip()
    for a, b in FIX: t = re.sub(a, b, t)
    return t.strip()
def join(lines):
    out = []
    for l in lines:
        l = clean(l)
        if not l: continue
        if out and not NEWLINE_START.match(l):
            prev = out[-1]
            if prev.endswith('-'):
                w1 = re.findall(r'([A-Za-z]+)-$', prev); w2 = re.findall(r'^([A-Za-z]+)', l)
                if w1 and w2 and zf((w1[0] + w2[0]).lower(), 'en') > 2.0 and zf(w1[0].lower(), 'en') < 2.5:
                    out[-1] = prev[:-1] + l
                else:
                    out[-1] = prev + l
            else:
                out[-1] = prev + ' ' + l
        else:
            out.append(l)
    return out
cur = None
blocks = []
for raw in open(sys.argv[1]):
    raw = raw.rstrip('\n')
    m = re.match(r'^(Q\d+)\|(.*)$', raw)
    o = re.match(r'^([a-d])\|(.*)$', raw)
    if m:
        cur = {'q': m.group(1), 'text': [m.group(2)], 'opts': []}; blocks.append(cur)
    elif o and cur:
        cur['opts'].append((o.group(1), clean(o.group(2))))
    elif cur:
        cur['text'].append(raw)
for b in blocks:
    t = join(b['text'])
    print(b['q'] + '|' + '\n'.join(t))
    for k, v in b['opts']:
        print(k + '|' + v)
