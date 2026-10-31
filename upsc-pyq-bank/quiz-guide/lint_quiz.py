#!/usr/bin/env python3
"""Checks a Current Affairs Quizzes month file against the UPSC Prelims style learned from the PYQ bank.
Run:  python3 lint_quiz.py ../page/quiz/2026-09.json [more files]
Errors (exit code 1) are structural problems. Warnings are style gaps against the UPSC pattern in README.md."""
import json, re, sys, collections, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pyq_stats import qtype, count_items

TARGET = {'statements/items': (35, 55), 'how-many': (15, 30), 'assertion-reason': (8, 18), 'single-answer': (15, 35)}   # percent ranges, 2024-25 mix
STATEMENT_SETS = [['1 only', '2 only', 'both 1 and 2', 'neither 1 nor 2'], ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3']]
HOWMANY_SETS = [['only one', 'only two', 'all three', 'none'], ['only one', 'only two', 'only three', 'all four']]
AR_START = 'both statement'

def lint(path):
    d = json.load(open(path)); qs = d['questions']; E, W = [], []
    ids = collections.Counter(q['id'] for q in qs)
    types = collections.Counter(); pos = collections.Counter(); longest = n_long = 0
    for q in qs:
        i = q['id']; o = q['opts']; ln = lambda m, bag: bag.append(f'{i}: {m}')
        for k in ('id', 'subject', 'q', 'opts', 'ans', 'why'):
            if k not in q or q[k] in ('', None): ln(f'missing {k}', E)
        if ids[i] > 1: ln('duplicate id', E)
        if not isinstance(q.get('ans'), int) or not 0 <= q['ans'] < len(o): ln('ans out of range', E); continue
        if len(set(x.strip().lower() for x in o)) != len(o): ln('duplicate options', E)
        if q.get('src') and not str(q['src'].get('url', '')).startswith('https://'): ln('source url present but not https', E)
        t = qtype(q['q'], o); types[t] += 1; pos[q['ans']] += 1
        low = [x.strip().lower().rstrip('.') for x in o]
        if t == 'statements/items':
            n = count_items(q['q'])
            if n and not 2 <= n <= 5: ln(f'{n} statements; UPSC uses 2 to 5 (mostly 3)', W)
            if n and not any(sorted(low) == sorted(s) for s in STATEMENT_SETS) and not all(re.search(r'\d|^[ivx]+', x) for x in low): ln('options are not the standard "1 and 2 only" set', W)
            if n == 3 and not all(re.fullmatch(r'\d only|\d and \d only|1, 2 and 3', x) for x in low): ln('3 statements: options should be combinations such as 1 and 2 only / 1, 2 and 3', W)
            if 'which of the statements given above' not in q['q'].lower() and 'select the correct answer' not in q['q'].lower() and 'which of the above' not in q['q'].lower(): ln('closing line should be "Which of the statements given above is/are correct?"', W)
        if t == 'how-many' and not any(sorted(low) == sorted(s) for s in HOWMANY_SETS): ln('how-many options should be Only one / Only two / All three / None', W)
        if t == 'assertion-reason' and not low[0].startswith(AR_START): ln('assertion-reason options should use the four standard Statement I/II choices', W)
        if t == 'single-answer' and len(q['q'].split()) < 12: ln('very short stem; UPSC stems average 40 words (add the context: "With reference to ..., which one of the following is correct?")', W)
        if len(q['q'].split()) > 140: ln('stem over 140 words', W)
        lens = [len(x) for x in o]
        if len(set(lens)) > 1 and max(lens) >= 20:   # years, dates and one-word answers are too short to give anything away
            n_long += 1; longest += lens[q['ans']] == max(lens)
    total = len(qs)
    if total:
        for k, (lo, hi) in TARGET.items():
            p = round(100 * types.get(k, 0) / total)
            if not lo <= p <= hi: W.append(f'PACK: {k} is {p}% (UPSC 2024-25 is about {lo}-{hi}%)')
        for a in range(4):
            if total >= 40 and not 0.15 <= pos.get(a, 0) / total <= 0.35: W.append(f'PACK: answer position {"ABCD"[a]} is {round(100*pos.get(a,0)/total)}%')
        if n_long and longest / n_long > 0.4: W.append(f'PACK: correct option is the longest in {round(100*longest/n_long)}% of questions')
    return total, types, E, W

if __name__ == '__main__':
    bad = 0
    for p in sys.argv[1:]:
        total, types, E, W = lint(p)
        print(f'== {p}: {total} questions, mix {dict(types)}')
        for m in E: print('ERROR', m)
        shown = [w for w in W if w.startswith('PACK')] + [w for w in W if not w.startswith('PACK')][:15]
        for m in shown: print('warn ', m)
        if len(W) > len(shown): print(f'warn  ... and {len(W)-len(shown)} more per-question warnings')
        print(f'   errors {len(E)}, warnings {len(W)}'); bad += bool(E)
    sys.exit(1 if bad else 0)
