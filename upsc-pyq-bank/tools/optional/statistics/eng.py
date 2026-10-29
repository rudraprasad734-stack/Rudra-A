# usage: eng.py <year_paper> <page> [<page> ...]: English-like OCR lines (cached) as  y0-y1 text ; garbled display-math lines are left out on purpose
import sys,os,re,json
here=os.path.dirname(os.path.abspath(__file__)); key=sys.argv[1]; pages=json.load(open(os.path.join(here,'.ocrcache',key+'.json')))
y,p=key.split('_'); vocab=set()
for l in open(os.path.join(here,'questions.txt'),encoding='utf8'):
    if l.startswith(f'{y}|{p}|'): vocab.update(re.findall(r'[a-z0-9]{3,}',l.split('|',4)[4].lower()))
def eng(t):
    w=re.findall(r'[a-z0-9]{3,}',t.lower()); return len(w)>=2 and sum(x in vocab for x in w)/len(w)>=0.5
for pg in sys.argv[2:]:
    print('== p'+pg)
    prev=None
    for ln in pages[int(pg)-1]:
        if ln['y0']<0.035 or ln['y0']>0.84: continue
        e=eng(ln['t'])
        if e:
            gap='' if prev is None else ('  <gap %.3f>'%(ln['y0']-prev) if ln['y0']-prev>0.03 else '')
            print('%.3f-%.3f %s%s'%(ln['y0'],ln['y1'],ln['t'][:58],gap)); prev=ln['y1']
