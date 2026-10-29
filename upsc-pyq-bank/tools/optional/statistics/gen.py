# overrides.txt (manual) + boxes_auto.txt (OCR-detected) -> figures.txt. Each row: year|paper|qno|page|y0-y1|alt ; x box 0.08-0.97 (crop.py trims the blank margin), kind 'table'
import re,os
here=os.path.dirname(os.path.abspath(__file__))
def rd(fn):
    d={}; o=os.path.join(here,fn)
    if not os.path.exists(o): return d
    for l in open(o,encoding='utf8'):
        if re.match(r'^\d{4}\|',l):
            y,p,q,pg,yy,alt=l.rstrip('\n').split('|',5); d.setdefault((y,p,q),[]).append((pg,yy,alt))
    return d
import json
def rdb():
    d={}; o=os.path.join(here,'bandrows.txt')
    for l in open(o,encoding='utf8'):
        if re.match(r'^\d{4}\|',l):
            y,p,q,pg,br=l.rstrip('\n').split('|')
            if br.startswith('y'):
                a0,a1=br[1:].split('-'); d.setdefault((y,p,q),[]).append((pg,'%.4f-%.4f'%(float(a0),float(a1)),'')); continue
            b0,b1=[int(v) for v in br.split('-')]
            bands=json.load(open(os.path.join(here,'.bands',f'{y}_{p}-{pg}.json')))
            d.setdefault((y,p,q),[]).append((pg,'%.4f-%.4f'%(bands[b0][0],bands[b1][1]),''))
    return d
man=rd('overrides.txt'); bd=rdb(); text={}
for l in open(os.path.join(here,'questions.txt'),encoding='utf8'):
    if re.match(r'^\d{4}\|',l): y,p,q,m,t=l.rstrip('\n').split('|',4); text[(y,p,q)]=t
out=['# year|paper|qno|page|x0,y0,x1,y1 (fractions)|alt|table']
keys=sorted(set(man)|set(bd),key=lambda k:(k[0],k[1],[int(x) if x.isdigit() else x for x in re.findall(r'\d+|[a-z]+',k[2])]))
for k in keys:
    for pg,yy,alt in (bd.get(k) or man[k]):
        y0,y1=[float(v) for v in yy.split('-')]
        if k not in man or not alt: alt='Table, matrix or formulas printed with this question: '+text[k][:100].replace('|','/')
        out.append('%s|%s|%s|%s|0.08,%.3f,0.97,%.3f|%s|table'%(k[0],k[1],k[2],pg,max(0,y0-0.003),min(1,y1+0.004),alt.replace('|','/')))
open(os.path.join(here,'figures.txt'),'w',encoding='utf8').write('\n'.join(out)+'\n'); print(len(out)-1,'rows')
