# Cuts the figures listed in figures.txt out of the paper PDFs and writes figures.json.
#   python3 -I crop.py <folder with the PDFs named <year>_<paper>.pdf>
# Output images: upsc-pyq-bank/page/img/civil-engineering/<year>-<paper>-<qno>-<n>.webp (also read by the page as relative "img/...").
import sys,os,re,json
import pymupdf
from PIL import Image
here=os.path.dirname(os.path.abspath(__file__)); pdfdir=sys.argv[1]
SUBJ=os.path.basename(here); out=os.path.join(here,'../../../page/img',SUBJ); os.makedirs(out,exist_ok=True)
import numpy as np
def levels(im):
    # page show-through (the other side of the sheet) is pale grey: push it to white, keep the printed ink
    a=np.asarray(im,dtype=np.float32); a=np.where(a>=200,255,a*255/200); return Image.fromarray(a.astype('uint8'))
def bands(a,axis,gap):
    # runs of rows (axis 1) or columns (axis 0) that hold ink, merged when closer than <gap>
    has=(a<140).any(axis=axis); idx=np.flatnonzero(has); out=[]
    for i in idx:
        if out and i-out[-1][1]<=gap: out[-1][1]=i
        else: out.append([i,i])
    return [b for b in out if b[1]-b[0]>=3 or len(out)==1]   # specks and hairlines are noise, not content
STRIPLOG=[]
def strip_edges(im,gap=2,maxh=70):
    h0=im.height
    # drop slivers of the neighbouring question text that the box clips at the top or bottom edge:
    # a thin band of ink touching the crop edge, with clean paper between it and the figure
    for _ in range(4):
        a=np.asarray(im); ink=(a<120).sum(axis=1)>=2; idx=np.flatnonzero(ink)
        if len(idx)==0: break
        bs=[]
        for i in idx:
            if bs and i-bs[-1][1]<=gap: bs[-1][1]=i
            else: bs.append([i,i])
        if len(bs)<2: break
        H=a.shape[0]; t,b=bs[0],bs[-1]; cut=False
        if t[0]<=2 and t[1]-t[0]<maxh and bs[1][0]-t[1]>gap: im=im.crop((0,bs[1][0]-4,im.width,H)); cut=True
        elif b[1]>=H-3 and b[1]-b[0]<maxh and b[0]-bs[-2][1]>gap: im=im.crop((0,0,im.width,bs[-2][1]+5)); cut=True
        if not cut: break
    STRIPLOG.append(h0-im.height)
    return im
def trim(im,pad=8,lv=True):
    # cut the blank margin so the crop hugs the drawing (the boxes in figures.txt are only approximate)
    im=strip_edges(levels(im) if lv else im); bb=im.point(lambda v:255 if v<185 else 0).getbbox()
    if not bb: return im
    x0,y0,x1,y1=bb; return im.crop((max(0,x0-pad),max(0,y0-pad),min(im.width,x1+pad),min(im.height,y1+pad)))
# trims.txt: year|paper|qno|n|top|bottom = how many whole bands of question text to drop above/below the n-th figure of that question
TRIM={}
tp=os.path.join(here,'trims.txt')
if os.path.exists(tp):
    for l in open(tp,encoding='utf8'):
        if re.match(r'^\d{4}\|',l):
            f=l.strip().split('|'); y,p,q,n,t,b=f[:6]; TRIM[f'{y}|{p}|{q}|{n}']=(int(t),int(b),int(f[6]) if len(f)>6 else 7)
def drop_bands(im,t,b,gap=7):
    a=np.asarray(im)
    for _ in range(t):
        bs=bands(a,1,gap)
        if len(bs)>1: im=im.crop((0,bs[1][0]-3,im.width,im.height)); a=np.asarray(im)
    for _ in range(b):
        bs=bands(a,1,gap)
        if len(bs)>1: im=im.crop((0,0,im.width,bs[-2][1]+4)); a=np.asarray(im)
    return im
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
        n0=len(STRIPLOG); im=trim(im)
        if STRIPLOG[-1]>0 and os.environ.get('STRIPLOG'): print('STRIPPED',key,n,STRIPLOG[-1],'px')
        t,b,g=TRIM.get(f'{key}|{n}',(0,0,7))
        if t or b: im=trim(drop_bands(im,t,b,g),lv=False)
        im.save(os.path.join(out,name),'WEBP',quality=80,method=6)
    figs.setdefault(key,[]).append({'u':f'img/{SUBJ}/{name}','a':alt,'k':kind})
keep={os.path.basename(f['u']) for v in figs.values() for f in v}
for f in os.listdir(out):
    if f.endswith('.webp') and f not in keep: os.remove(os.path.join(out,f))
json.dump(figs,open(os.path.join(here,'figures.json'),'w'),indent=1)
print(sum(len(v) for v in figs.values()),'figures for',len(figs),'questions')
