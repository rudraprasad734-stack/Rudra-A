# Finds the text/ink bands of a page (runs of rows holding ink) so a crop box can be chosen by band numbers, not by eyeballing.
#   bands.py <pdf folder> <year_paper> <page> [<page>...]   writes scratchpad/bands/<key>-<pg>.png (numbered bands) and .bands/<key>-<pg>.json
import sys,os,json
import numpy as np,pymupdf
from PIL import Image,ImageDraw,ImageFont
here=os.path.dirname(os.path.abspath(__file__)); pdfdir=sys.argv[1]; key=sys.argv[2]
S='/tmp/claude-0/-home-user-Rudra-A/8d6d6fe3-157c-5862-b382-28c5f4190943/scratchpad/bands'; os.makedirs(S,exist_ok=True); os.makedirs(os.path.join(here,'.bands'),exist_ok=True)
d=pymupdf.open(os.path.join(pdfdir,key+'.pdf'))
for pg in sys.argv[3:]:
    pix=d[int(pg)-1].get_pixmap(dpi=100); im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples); a=np.asarray(im.convert('L')); H,W=a.shape
    ink=(a[:, int(W*0.06):int(W*0.94)]<150).sum(axis=1)>=2
    idx=np.flatnonzero(ink); bs=[]
    for i in idx:
        if bs and i-bs[-1][1]<=4: bs[-1][1]=i
        else: bs.append([i,i])
    bs=[b for b in bs if b[1]-b[0]>=3 and 0.03*H<b[0]<0.97*H]
    json.dump([[b[0]/H,(b[1]+1)/H] for b in bs],open(os.path.join(here,'.bands',f'{key}-{pg}.json'),'w'))
    dr=ImageDraw.Draw(im)
    for n,(y0,y1) in enumerate(bs):
        dr.rectangle([0,y0,3,y1],fill=(255,0,0) if n%2==0 else (255,140,0)); dr.text((5,y0-2),str(n),fill=(220,0,0))
        dr.text((W-22,y0-2),str(n),fill=(220,0,0))
    im.save(os.path.join(S,f'{key}-{pg}.png'))
    print(key,pg,len(bs),'bands')
