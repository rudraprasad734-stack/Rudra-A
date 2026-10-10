# Second check of a transcription: every number and every longer English word typed into questions.txt must also be found
# in an OCR of the paper's page images. Only the differences are printed, so only those questions need a look.
#   python3 -I checktext.py <subject folder, e.g. chemistry> <folder with the PDFs named <year>_<paper>.pdf> [<year>_<paper> ...]
# OCR text is cached in <pdf folder>/ocr/<year>_<paper>.txt.
import sys, os, re, subprocess, pymupdf
sub, pdfs = sys.argv[1], sys.argv[2]; only = sys.argv[3:]
here = os.path.dirname(os.path.abspath(__file__)); qs = os.path.join(here, sub, 'questions.txt')
os.makedirs(os.path.join(pdfs, 'ocr'), exist_ok=True)
def ocr(n):
    out = os.path.join(pdfs, 'ocr', n + '.txt')
    if os.path.exists(out): return open(out, encoding='utf8').read()
    d = pymupdf.open(os.path.join(pdfs, n + '.pdf')); txt = []
    for i, p in enumerate(d):
        f = os.path.join(pdfs, 'ocr', f'{n}_{i+1}.png'); p.get_pixmap(dpi=200).save(f)
        txt.append(subprocess.run(['tesseract', f, '-', '-l', 'eng', '--psm', '4'], capture_output=True, text=True).stdout); os.remove(f)
    t = '\n\f\n'.join(txt); open(out, 'w', encoding='utf8').write(t); return t
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
cache = {}
for l in open(qs, encoding='utf8'):
    f = l.rstrip('\n').split('|', 4)
    if len(f) < 5 or not re.match(r'\d{4}$', f[0]): continue
    n = f[0] + '_' + f[1]
    if only and n not in only: continue
    if n not in cache: cache[n] = ocr(n); cache[n + 'p'] = [set(re.findall(r'[a-z]{4,}', t.lower())) for t in cache[n].split('\n\f\n')] if '\f' in cache[n] else [set(re.findall(r'[a-z]{4,}', cache[n].lower()))]; cache[n + 'w'] = set(re.findall(r'[a-z]{4,}', cache[n].lower()))
    o = cache[n]
    # page-local check: the words of a question must be printed on the page where it is (best-matching OCR page, plus the next one)
    qw = set(re.findall(r'[a-z]{4,}', f[4].lower())); pg = cache[n + 'p']; sc = [len(qw & p) for p in pg]; best = sc.index(max(sc)); words = pg[best] | (pg[best + 1] if best + 1 < len(pg) else set())
    text = f[4].replace('₀', '0').replace('₁', '1').replace('₂', '2').replace('₃', '3').replace('₄', '4').replace('₅', '5').replace('₆', '6').replace('₇', '7').replace('₈', '8').replace('₉', '9')
    bad = []
    for tok in re.findall(r'\d+(?:[.,]\d+)*', text):
        d = re.sub(r'\D', '', tok)
        if len(d) < 3: continue
        if not re.search(r'(?<!\d)' + r'[^\d\n]{0,2}'.join(d) + r'(?!\d)', o): bad.append(tok)
    for w in set(re.findall(r'[A-Za-z]{7,}', f[4])):
        if w.lower() not in words and not any(w.lower()[:6] in x for x in words if len(x) >= 6): bad.append(w)
    if bad: print(f'{f[0]}|{f[1]}|{f[2]}: {" ".join(sorted(set(bad))[:12])}')
