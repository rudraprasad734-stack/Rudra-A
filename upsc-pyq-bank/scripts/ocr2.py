import sys, os, glob, subprocess
BASE = '/home/user/Rudra-A/_papers'
f = sys.argv[1]
b = os.path.splitext(os.path.basename(f))[0]
d = os.path.join(BASE, 'ocr', b)
if os.path.exists(os.path.join(d, '.done2')):
    sys.exit(0)
os.makedirs(d, exist_ok=True)
for p in glob.glob(os.path.join(d, '*.pgm')):
    os.remove(p)
subprocess.run(['pdftoppm', '-r', '300', '-gray', os.path.join(BASE, f), os.path.join(d, 'p')], check=True)
env = dict(os.environ, OMP_THREAD_LIMIT='1')
for img in sorted(glob.glob(os.path.join(d, 'p-*.pgm'))):
    stem = img[:-4]
    if not os.path.exists(stem + '.txt'):
        subprocess.run(['tesseract', img, stem, '-l', 'eng', '--psm', '4'], env=env, capture_output=True)
    subprocess.run(['tesseract', img, stem + '.h', '-l', 'hin+eng', '--psm', '4'], env=env, capture_output=True)
    os.remove(img)
open(os.path.join(d, '.done'), 'w').close()
open(os.path.join(d, '.done2'), 'w').close()
print('done', f, flush=True)
