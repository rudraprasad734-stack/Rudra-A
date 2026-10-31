#!/usr/bin/env python3
"""Reads the proofread Prelims GS papers in ../bank-docs and writes pyq-stats.json: the question-type mix by year,
how many statements a question has, the option sets UPSC uses, stem and option lengths.
Run:  python3 pyq_stats.py   (from this folder)"""
import json, glob, re, collections, os

HERE = os.path.dirname(os.path.abspath(__file__))

def qtype(t, o):
    tl = t.lower()
    if re.search(r'statement[- ]?(i|1)\b', tl) and re.search(r'statement[- ]?(ii|2)\b', tl): return 'assertion-reason'
    if re.search(r'how many (of the|of these|pairs|statements|items)', tl): return 'how-many'
    if re.search(r'\bpairs?\b', tl): return 'pairs'
    if re.search(r'(?m)^\s*(1|I)\.\s', t) or re.search(r'consider the following statements', tl): return 'statements/items'
    if re.search(r'chronolog|correct sequence|arrange', tl): return 'sequence'
    return 'single-answer'

def load():
    Q = []
    for f in sorted(glob.glob(os.path.join(HERE, '..', 'bank-docs', 'prelims-*-gs1.json'))):
        d = json.load(open(f))
        for q in d['questions']:
            if q.get('options'): Q.append((d['year'], q['text'], q['options'], q.get('answer')))
    return Q

def count_items(t): return len(re.findall(r'(?m)^\s*(\d|I{1,3}|IV|V)\.\s', t))

if __name__ == '__main__':
    Q = load()
    by_year = collections.defaultdict(collections.Counter)
    for y, t, o, a in Q: by_year[y][qtype(t, o)] += 1
    recent = collections.Counter(qtype(t, o) for y, t, o, a in Q if y >= 2024)
    items = collections.Counter(); sets = collections.Counter()
    for y, t, o, a in Q:
        if qtype(t, o) == 'statements/items' and y >= 2024:
            items[count_items(t)] += 1; sets[' | '.join(x.strip() for x in o)] += 1
    sa = [(t, o) for y, t, o, a in Q if qtype(t, o) == 'single-answer']
    out = {
        'papers': sorted({y for y, *_ in Q}), 'questions': len(Q),
        'mix_by_year': {str(y): dict(c) for y, c in sorted(by_year.items())},
        'mix_2024_2025_percent': {k: round(100 * v / sum(recent.values())) for k, v in recent.items()},
        'items_per_statement_question_2024_2025': dict(sorted(items.items())),
        'top_option_sets_statements_2024_2025': sets.most_common(6),
        'avg_stem_words': round(sum(len(t.split()) for y, t, o, a in Q) / len(Q), 1),
        'avg_stem_words_by_year': {str(y): round(sum(len(t.split()) for yy, t, o, a in Q if yy == y) / sum(1 for yy, *_ in Q if yy == y)) for y in sorted(by_year)},
        'avg_option_words_single_answer': round(sum(sum(len(x.split()) for x in o) / len(o) for t, o in sa) / len(sa), 1),
        'answer_positions_2024': dict(collections.Counter(a for y, t, o, a in Q if a)),
    }
    json.dump(out, open(os.path.join(HERE, 'pyq-stats.json'), 'w'), indent=1, ensure_ascii=False)
    print(json.dumps(out, indent=1, ensure_ascii=False))
