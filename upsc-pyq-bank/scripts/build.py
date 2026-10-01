import re, json, os, glob
SP = '/tmp/claude-0/-home-user-Rudra-A/8d6d6fe3-157c-5862-b382-28c5f4190943/scratchpad'
OUT = SP + '/bank/docs'; os.makedirs(OUT, exist_ok=True)
FOLDER = 'From your Drive folder "Upsc question bank"'
NEWF = 'From your Drive folder "Upsc question bank" (Mains and pre after 2022 questions mixed)'
def parse_mains(path):
    qs = []
    for line in open(path, encoding='utf-8'):
        line = line.rstrip('\n')
        m = re.match(r'^Q(\d+(?:\([a-e]\))?)\|M([\d.]+)\|(.*)$', line)
        if m:
            mk = float(m.group(2)); mk = int(mk) if mk.is_integer() else mk
            qs.append({'qno': m.group(1), 'text': m.group(3).strip(), 'marks': mk})
        elif line.strip():
            qs[-1]['text'] += '\n' + line.strip()
    return qs
def parse_pre(path):
    qs = []; passage = None; last = None
    for line in open(path, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip(): continue
        if line.startswith('P|'):
            passage = None if line[2:].strip() == '-' else line[2:].strip(); last = 'P'; continue
        m = re.match(r'^Q(\d+)\|(.*)$', line)
        if m:
            q = {'qno': int(m.group(1)), 'text': m.group(2).strip(), 'options': []}
            if passage: q['passage'] = passage
            qs.append(q); last = 'text'; continue
        o = re.match(r'^([a-d])\|(.*)$', line)
        if o and qs:
            qs[-1]['options'].append(o.group(2).strip()); last = 'opt'; continue
        if last == 'P': passage += '\n' + line.strip()
        elif last == 'text': qs[-1]['text'] += '\n' + line.strip()
        elif last == 'opt': qs[-1]['options'][-1] += ' ' + line.strip()
    return qs
PAPERS = {'gs1': 'GS Paper I', 'gs2': 'GS Paper II', 'gs3': 'GS Paper III', 'gs4': 'GS Paper IV', 'essay': 'Essay', 'anth1': 'Anthropology Paper I', 'anth2': 'Anthropology Paper II'}
docs = {}
for p in sorted(glob.glob(SP + '/ext/mains/*.txt')):
    y, k = re.match(r'.*/(\d{4})_(\w+)\.txt$', p).groups(); y = int(y)
    exam = 'optional' if k.startswith('anth') else 'mains'
    qs = parse_mains(p)
    src = (NEWF if y >= 2023 else FOLDER) + '. Question text copied from the official paper (English version).'
    did = f'{exam}-{y}-{k}'
    docs[did] = {'exam': exam, 'paper': PAPERS[k], 'year': y, 'complete': True, 'source': src, 'count': len(qs), 'questions': qs}
PRE = {'pre2014.txt': (2014, 'gs1'), 'pre2020.txt': (2020, 'gs1'), 'pre2021.txt': (2021, 'gs1'), 'csat2020.txt': (2020, 'csat'), 'csat2021.txt': (2021, 'csat'), 'pre2025.txt': (2025, 'gs1'), 'pre/2015_gs1.txt': (2015, 'gs1')}
NOTES = {('csat',2020): ' Q11, Q50, Q51 and Q57 contain symbols or figures that are not readable in the scan.', ('gs1',2021): ' Questions 56–60 are missing from the scan in the folder.', ('csat',2021): ' Some pages are missing from the scan in the folder, so 23 questions are not here.'}
for f, (y, k) in PRE.items():
    qs = parse_pre(SP + '/ext/' + f)
    src = (NEWF if y >= 2023 else FOLDER) + '. Question text copied from the official paper (English version). No answer key.' + NOTES.get((k, y), '')
    docs[f'prelims-{y}-{k}'] = {'exam': 'prelims', 'paper': 'GS Paper I' if k == 'gs1' else 'CSAT (GS Paper II)', 'year': y, 'complete': (y, k) not in [(2021,'gs1'),(2021,'csat')], 'source': src, 'count': len(qs), 'questions': qs}
# 2024 GS1 from the earlier answer-key extraction
pq = json.load(open(SP + '/pyq/pre2024.json'))
docs['prelims-2024-gs1'] = {'exam': 'prelims', 'paper': 'GS Paper I', 'year': 2024, 'complete': True,
    'source': 'Official 2024 GS Paper I questions with the answer key from the PDF you shared earlier (the copy in your Drive folder is an image-only scan).',
    'count': len(pq), 'questions': [dict({'qno': q['qno'], 'text': q['stem'], 'options': q['options']}, **({'answer': q['answer']} if q.get('answer') else {})) for q in pq]}
# checks
probs = []
for did, d in docs.items():
    seen = set()
    for q in d['questions']:
        key = (d['exam'], re.sub(r'\W+', '', q['text'].lower())[:200])
        if str(q['qno']) in seen: probs.append((did, 'dup qno', q['qno']))
        seen.add(str(q['qno']))
        if d['exam'] == 'prelims' and len(q.get('options', [])) != 4: probs.append((did, 'opts', q['qno'], len(q.get('options', []))))
        if re.search(r'MISSING|NOT FOUND|<<', q['text'] + ' '.join(q.get('options', []))): probs.append((did, 'marker', q['qno']))
    json.dump(d, open(f'{OUT}/{did}.json', 'w'), ensure_ascii=False)
# duplicate questions across bank
allq = {}
for did, d in docs.items():
    for q in d['questions']:
        k = re.sub(r'\W+', '', q['text'].lower())
        if len(k) > 60: allq.setdefault(k, []).append(f"{did}#{q['qno']}")
dups = [v for v in allq.values() if len(v) > 1]
tot = sum(d['count'] for d in docs.values())
print(len(docs), 'docs', tot, 'questions'); print('problems', probs[:20], len(probs)); print('dups', dups[:10])
for did in sorted(docs): print(did, docs[did]['count'], end=' | ')
