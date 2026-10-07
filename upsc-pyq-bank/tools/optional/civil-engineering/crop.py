# Cuts the figures listed in figures.txt out of the paper PDFs and writes figures.json.
#   python3 -I crop.py <folder with the PDFs named <year>_<paper>.pdf>
# Output images: upsc-pyq-bank/page/img/civil-engineering/<year>-<paper>-<qno>-<n>.webp (also read by the page as relative "img/...").
import sys,os,re,json
import pymupdf
from PIL import Image
here=os.path.dirname(os.path.abspath(__file__)); pdfdir=sys.argv[1]
SUBJ=os.path.basename(here); out=os.path.join(here,'../../../page/img',SUBJ); os.makedirs(out,exist_ok=True)
figs={}; count={}
for line in open(os.path.join(here,'figures.txt'),encoding='utf8'):
    if not re.match(r'^\d{4}\|',line): continue
    y,p,q,pg,bb,alt,kind=[x.strip() for x in line.rstrip('\n').split('|')]
    key=f'{y}|{p}|{q}'; n=count[key]=count.get(key,0)+1
    name=f'{y}-{p}-{re.sub(r"[^0-9a-z]","",q.lower())}-{n}.webp'
    if kind=='crop':
        doc=pymupdf.open(os.path.join(pdfdir,f'{y}_{p}.pdf')); page=doc[int(pg)-1]
        x0,y0,x1,y1=[float(v) for v in bb.split(',')]; r=page.rect
        clip=pymupdf.Rect(r.x0+x0*r.width,r.y0+y0*r.height,r.x0+x1*r.width,r.y0+y1*r.height)
        pix=page.get_pixmap(dpi=170,clip=clip); im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples).convert('L')
        im.save(os.path.join(out,name),'WEBP',quality=80,method=6)
    figs.setdefault(key,[]).append({'u':f'img/{SUBJ}/{name}','a':alt,'k':kind})
json.dump(figs,open(os.path.join(here,'figures.json'),'w'),indent=1)
print(sum(len(v) for v in figs.values()),'figures for',len(figs),'questions')
