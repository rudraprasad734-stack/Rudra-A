# Finds, for every question that carries tables / matrices / formulas, the printed English statement on the page images
# (OCR line boxes) and writes rows for boxes.txt.  usage: autobox.py <pdf folder> [--paper=2017|1]
import sys,os,re,csv,io,subprocess,json
import pymupdf
here=os.path.dirname(os.path.abspath(__file__)); pdfdir=sys.argv[1]; only=[a[8:] for a in sys.argv if a.startswith('--paper=')]
def norm(s): return re.findall(r'[a-z0-9]{3,}',s.lower())
def ocr_lines(pdf,pg,dpi=150):
    d=pymupdf.open(pdf); pix=d[pg-1].get_pixmap(dpi=dpi); W,H=pix.width,pix.height
    tmp=os.path.join('/tmp','_ab_%d.png'%os.getpid()); pix.save(tmp)
    r=subprocess.run(['tesseract',tmp,'-','-l','eng','--psm','4','tsv'],capture_output=True,text=True).stdout
    rows=list(csv.reader(io.StringIO(r),delimiter='\t',quoting=csv.QUOTE_NONE)); ix={h:i for i,h in enumerate(rows[0])}; L={}
    for x in rows[1:]:
        if len(x)<12 or x[ix['level']]!='5' or not x[ix['text']].strip(): continue
        k=(x[ix['block_num']],x[ix['par_num']],x[ix['line_num']]); l,t,w,h=[int(x[ix[c]]) for c in('left','top','width','height')]
        e=L.setdefault(k,[l,t,l+w,t+h,[]]); e[0]=min(e[0],l); e[1]=min(e[1],t); e[2]=max(e[2],l+w); e[3]=max(e[3],t+h); e[4].append(x[ix['text']])
    os.remove(tmp)
    out=[{'y0':v[1]/H,'y1':v[3]/H,'x0':v[0]/W,'x1':v[2]/W,'t':' '.join(v[4])} for v in L.values()]
    return sorted(out,key=lambda a:a['y0'])

rows_all={}
for l in open(os.path.join(here,'questions.txt'),encoding='utf8'):
    if not re.match(r'^\d{4}\|',l): continue
    y,p,q,m,t=l.rstrip('\n').split('|',4)
    rows_all.setdefault((y,p),[]).append((q,t))
def is_cand(t):
    tab='[[' in t or len(re.findall(r'\d',t))>=40 or re.search(r'(Year|Sample|Age|Commodity|Row|Plant|Origin|Block|Stratum|Treatment)[^|]{0,15}:',t)
    frm=len(re.findall(r'[\^_Σ∫√→≥≤≠∂]',t))>=4
    return ('T' if tab else 'f') if (tab or frm) else None
res=[]; bad=[]
for (y,p),qs in sorted(rows_all.items()):
    if only and f'{y}|{p}' not in only: continue
    pdf=os.path.join(pdfdir,f'{y}_{p}.pdf'); n=len(pymupdf.open(pdf))
    cache=os.path.join(here,'.ocrcache'); os.makedirs(cache,exist_ok=True); cf=os.path.join(cache,f'{y}_{p}.json')
    if os.path.exists(cf): pages=json.load(open(cf))
    else:
        pages=[ocr_lines(pdf,i) for i in range(1,n+1)]; json.dump(pages,open(cf,'w'))
    vocab=set()
    for _,t in qs: vocab.update(norm(t))
    flat=[(i+1,j,ln) for i,pg in enumerate(pages) for j,ln in enumerate(pg) if 0.035<ln['y0']<0.84]
    def eng(ln):
        w=norm(ln['t']); return len(w)>=2 and sum(x in vocab for x in w)/len(w)>=0.5
    E=[(pg,j,ln) for pg,j,ln in flat if eng(ln)]
    # 1) start line of every question, in printed order  2) a question ends at the last English line before the next question starts
    starts=[]; cur=0
    for q,t in qs:
        tk=norm(re.sub(r'\s+',' ',t)); head=set(tk[:12]); si=None
        for need in (4,3):
            for i in range(cur,min(len(E),cur+30)):
                lt=set(norm(E[i][2]['t']))
                if len(lt&head)>=min(need,max(2,len(head)//2)): si=i; break
            if si is not None: break
        starts.append(si)
        if si is not None: cur=si+1
    for k,(q,t) in enumerate(qs):
        kind=is_cand(t)
        if not kind: continue
        si=starts[k]
        if si is None: bad.append((y,p,q,'no start line')); continue
        nxt=next((s for s in starts[k+1:] if s is not None),None)
        ei=(nxt-1) if nxt is not None else len(E)-1
        if ei<si: ei=si
        s_pg,s_j,_=E[si]; e_pg,e_j,_=E[ei]
        if s_pg==e_pg:
            res.append((y,p,q,s_pg,pages[s_pg-1][s_j]['y0'],pages[s_pg-1][e_j]['y1'],kind))
        else:
            res.append((y,p,q,s_pg,pages[s_pg-1][s_j]['y0'],max(ln['y1'] for pg,j,ln in E if pg==s_pg),kind))
            for pg in range(s_pg+1,e_pg+1):
                js=[(j,ln) for g,j,ln in E if g==pg]
                if not js: continue
                y1=pages[pg-1][e_j]['y1'] if pg==e_pg else max(ln['y1'] for g,j,ln in E if g==pg)
                res.append((y,p,q,pg,js[0][1]['y0'],y1,kind))
with open(os.path.join(here,'boxes_auto.txt'),'w',encoding='utf8') as f:
    f.write('# auto-detected: year|paper|qno|page|y0-y1|alt\n')
    for y,p,q,pg,y0,y1,kind in res: f.write(f'{y}|{p}|{q}|{pg}|{y0:.3f}-{y1:.3f}|Question {q} as printed ({"table or matrix" if kind=="T" else "formula"})\n')
print(len(res),'boxes;',len(bad),'not found'); [print('  NOT FOUND',b) for b in bad]
