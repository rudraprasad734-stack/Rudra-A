# boxes.txt -> figures.txt. Each row: year|paper|qno|page|y0-y1|alt ; x box fixed 0.10-0.90 (crop.py trims the blank margin), kind 'table' (no neighbour-text erasing)
import re,os
here=os.path.dirname(os.path.abspath(__file__)); out=['# year|paper|qno|page|x0,y0,x1,y1 (fractions)|alt|table']
for l in open(os.path.join(here,'boxes.txt'),encoding='utf8'):
    if not re.match(r'^\d{4}\|',l): continue
    y,p,q,pg,yy,alt=l.rstrip('\n').split('|',5); y0,y1=yy.split('-')
    xs='0.08,%.3f,0.97,%.3f'%(float(y0)-0.003,float(y1)+0.005) ; out.append(f'{y}|{p}|{q}|{pg}|{xs}|{alt.replace(chr(124),"given")}|table')
open(os.path.join(here,'figures.txt'),'w',encoding='utf8').write('\n'.join(out)+'\n'); print(len(out)-1,'rows')
