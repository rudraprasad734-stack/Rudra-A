"""Turn column-OCR text of a prelims paper into draft Q-format (Q<n>|text / a|..d| option lines)."""
import sys, os, re, glob
BASE = '/home/user/Rudra-A/_papers/cols'

OPT = re.compile(r'^\s*[\(\{\[fl|]?\s*([abcd]|ce|dq|aj|ec)\s*[\)\}\]]\s*(.*)$')
QN = re.compile(r'^\s*(\d{1,3})\s*[\.,]\s+(.*)$')
NOISE = re.compile(r'(^[A-Z]-[A-Z]{3}-[A-Z]-[A-Z]{3,}|/\d+A?\s*\d*$|^\[?\s*P\.?\s*T\.?\s*O|SPACE FOR ROUGH|^\d{1,2}$)')
MK = re.compile(r'(?:(?<=\s)|(?<=^)|(?<=\.))([\(\{\[fji|"\']{1,2}\s?(?:a|b|c|d|e|q|ce|co|dq|aj|6b|6|ec|da|ad|fb|aq|@)\s?[\)\}\]j|?]{1,2})(?=\s|$)')
MAP = {'ce': 'c', 'dq': 'd', 'aj': 'a', 'ec': 'c'}

def lines(name):
    d = os.path.join(BASE, name)
    out = []
    pages = sorted({re.search(r'p-(\d+)\.', p).group(1) for p in glob.glob(d + '/p-*.txt')}, key=int)
    for n in pages:
        pl = []
        for side in 'LR':
            p = f'{d}/p-{n}.{side}.txt'
            if os.path.exists(p):
                pl += [l.rstrip() for l in open(p) if l.strip()]
        joined = ' '.join(pl)
        if 'COMMENCEMENT' in joined or 'Penalty for wrong' in joined or 'PENALTY FOR WRONG' in joined:
            continue
        out += pl
    return out

def parse(name):
    qs = []
    cur = None
    expect = 1
    raw = lines(name)
    i = 0
    while i < len(raw):
        l = raw[i]; i += 1
        # split a line where the next expected question number starts mid-line
        e = str(expect)
        mm = re.search(r'(?:(?<=\s)|^)[\$\'"]?(' + e[:-1] + r'|[\$\'"S])?' + e[-1] + r'\s*[\.,]\s+(?=[A-Z"\'‘“])', l) if len(e) > 1 else None
        if mm and mm.start() > 0 and not QN.match(l):
            raw.insert(i, e + '. ' + l[mm.end():]); l = l[:mm.start()]
        elif mm and mm.start() == 0 and not QN.match(l):
            l = e + '. ' + l[mm.end():]
        if NOISE.search(l.strip()):
            continue
        m = QN.match(l)
        if m and expect <= int(m.group(1)) <= expect + 6 and (int(m.group(1)) == expect or (len(m.group(2).split()) >= 3 and m.group(2)[:1].isupper())):
            n = int(m.group(1))
            while expect < n:
                qs.append({'n': expect, 'text': ['<<NUMBER NOT FOUND - check previous question text>>'], 'opts': {}}); expect += 1
            cur = {'n': expect, 'text': [m.group(2)], 'opts': {}}
            qs.append(cur); expect += 1; last = 'text'
            continue
        if cur is None:
            continue
        parts = MK.split(l)
        # parts: [pre, marker, text, marker, text...]
        if len(parts) > 1 and (parts[0].strip() == '' or last != 'text' or len(cur['opts']) == 0):
            pre = parts[0].strip()
            if pre:
                (cur['text'] if last == 'text' else cur['opts'][last]).append(pre)
            for j in range(1, len(parts), 2):
                nxt = 'abcd'[len(cur['opts'])] if len(cur['opts']) < 4 else None
                if nxt is None:
                    cur['opts'][last].append(parts[j] + parts[j+1]); continue
                cur['opts'][nxt] = [parts[j+1].strip()]; last = nxt
            continue
        if last == 'text':
            cur['text'].append(l)
        else:
            cur['opts'][last].append(l)
    return qs

if __name__ == '__main__':
    name = sys.argv[1]
    qs = parse(name)
    for q in qs:
        print(f"Q{q['n']}|" + '\n'.join(q['text']))
        for k in 'abcd':
            if k in q['opts']:
                print(f"{k}|" + ' '.join(q['opts'][k]))
            else:
                print(f"{k}|<<MISSING>>")
    print(f'## parsed {len(qs)} questions', file=sys.stderr)
