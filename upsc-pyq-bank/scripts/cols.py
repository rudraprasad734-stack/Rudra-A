import sys, os, re, glob, subprocess
from PIL import Image
BASE = '/home/user/Rudra-A/_papers'
DEV = re.compile('[ऀ-ॿ]')
f = sys.argv[1]
b = os.path.splitext(os.path.basename(f))[0]
d = os.path.join(BASE, 'ocr', b)
out = os.path.join(BASE, 'cols', b)
os.makedirs(out, exist_ok=True)
if os.path.exists(os.path.join(out, '.done')):
    sys.exit(0)
env = dict(os.environ, OMP_THREAD_LIMIT='1')
for h in sorted(glob.glob(os.path.join(d, 'p-*.h.txt'))):
    n = re.search(r'p-(\d+)\.h\.txt$', h).group(1)
    t = open(h).read()
    nd = len(DEV.findall(t)); nl = len(re.findall('[A-Za-z]', t))
    if nl < 200 or nd > 0.15 * nl:
        continue  # Hindi page or blank
    stem = os.path.join(out, f'p-{n}')
    subprocess.run(['pdftoppm', '-r', '300', '-gray', '-f', str(int(n)), '-l', str(int(n)), '-singlefile', os.path.join(BASE, f), stem], check=True)
    im = Image.open(stem + '.pgm')
    w, hh = im.size
    # find the gutter: the column of pixels near the middle with the most white
    px = im.load()
    best, bx = -1, w // 2
    for x in range(int(w * 0.42), int(w * 0.58), 2):
        s = sum(1 for y in range(0, hh, 6) if px[x, y] > 200)
        if s > best:
            best, bx = s, x
    for side, box in (('L', (0, 0, bx, hh)), ('R', (bx, 0, w, hh))):
        im.crop(box).save(f'{stem}.{side}.png')
        subprocess.run(['tesseract', f'{stem}.{side}.png', f'{stem}.{side}', '-l', 'eng', '--psm', '6'], env=env, capture_output=True)
        os.remove(f'{stem}.{side}.png')
    os.remove(stem + '.pgm')
open(os.path.join(out, '.done'), 'w').close()
print('done', f, flush=True)
