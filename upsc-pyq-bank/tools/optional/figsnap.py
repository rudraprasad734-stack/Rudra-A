# Snaps a figure box to the printed page so a crop holds the whole figure and nothing else.
#   needs: numpy, opencv (pip install opencv-python-headless)
# The box in figures.txt only has to be roughly right. Every blob of ink (ink is dilated a little so a word or an atom label is
# one blob) that crosses the box edge is looked at once:
#   - mostly inside the box  -> it is part of the figure: the box grows to hold all of it (never more than MAXGROW px)
#   - mostly outside the box -> it belongs to the neighbouring text: the part inside the box is erased
import numpy as np, cv2
MAXGROW = 70
import os
THR = float(os.environ.get("SNAP_THR", "0.8"))   # share of a blob that must lie inside the box for the box to grow around it
def snap(ink, box, maxgrow=MAXGROW, it=2, prose=()):
    """ink: bool page array, box: (x0,y0,x1,y1) in px. Returns (box, erase mask for the final box, notes)."""
    H, W = ink.shape
    d = cv2.dilate(ink.astype('uint8'), np.ones((2 * it + 1, 2 * it + 1), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(d, connectivity=8)
    x0, y0, x1, y1 = [int(v) for v in box]; notes = []
    # blobs that lie on a line of printed prose (found by OCR, see prose_lines) are question text: never grown into, always erased
    istext = set()
    for (px0, py0, px1, py1) in prose:
        for i in set(np.unique(lab[max(0, py0):py1, max(0, px0):px1])) - {0}:
            x, y, w, h, area = st[i]
            ox0, oy0, ox1, oy1 = max(x, px0), max(y, py0), min(x + w, px1), min(y + h, py1)
            if ox1 > ox0 and oy1 > oy0 and (ox1 - ox0) * (oy1 - oy0) >= 0.5 * w * h: istext.add(i)
    def edge_ids(x0, y0, x1, y1):
        s = lab[y0:y1, x0:x1]
        return set(np.unique(np.concatenate([s[0, :], s[-1, :], s[:, 0], s[:, -1]]))) - {0}
    for _ in range(8):
        grew = False
        for i in edge_ids(x0, y0, x1, y1):
            x, y, w, h, area = st[i]
            ix0, iy0, ix1, iy1 = max(x, x0), max(y, y0), min(x + w, x1), min(y + h, y1)
            inside = (lab[iy0:iy1, ix0:ix1] == i).sum()
            if i in istext or inside / area < THR: continue
            nx0, ny0, nx1, ny1 = min(x0, x), min(y0, y), max(x1, x + w), max(y1, y + h)
            if (nx0, ny0, nx1, ny1) == (x0, y0, x1, y1): continue
            if max(x0 - nx0, y0 - ny0, nx1 - x1, ny1 - y1) > maxgrow:
                notes.append('big blob at the edge (not grown)'); continue
            x0, y0, x1, y1 = max(0, nx0), max(0, ny0), min(W, nx1), min(H, ny1); grew = True
        if not grew: break
    erase = np.zeros((y1 - y0, x1 - x0), bool)
    for i in edge_ids(x0, y0, x1, y1):
        x, y, w, h, area = st[i]
        ix0, iy0, ix1, iy1 = max(x, x0), max(y, y0), min(x + w, x1), min(y + h, y1)
        sub = lab[iy0:iy1, ix0:ix1] == i
        if i in istext or (sub.sum() / area < THR and (sub.sum() < 450 or min(ix1 - ix0, iy1 - iy0) <= 14)):   # prose, a small piece, or a thin sliver of a neighbouring line
            erase[iy0 - y0:iy1 - y0, ix0 - x0:ix1 - x0] |= sub; notes.append('erased %d px of neighbouring text' % sub.sum())
        elif sub.sum() / area < THR:
            notes.append('big blob cut by the box edge, left as it is (%d px)' % sub.sum())
    return (x0, y0, x1, y1), erase, notes


def prose_lines(gray, box, margin=45, scale=2):
    """OCR the box plus a margin; return the boxes (page px) of lines that hold 3+ confident words in a row = printed question text."""
    import subprocess, tempfile, os
    from PIL import Image
    H, W = gray.shape; x0, y0, x1, y1 = [int(v) for v in box]
    X0, Y0, X1, Y1 = max(0, x0 - margin), max(0, y0 - margin), min(W, x1 + margin), min(H, y1 + margin)
    im = Image.fromarray(gray[Y0:Y1, X0:X1]); im = im.resize((im.width * scale, im.height * scale))
    fd, tmp = tempfile.mkstemp(suffix='.png'); os.close(fd); im.save(tmp)
    try: out = subprocess.run(['tesseract', tmp, '-', '--psm', '6', 'tsv'], capture_output=True, text=True).stdout
    finally: os.remove(tmp)
    lines = {}
    for r in out.split('\n')[1:]:
        f = r.split('\t')
        if len(f) < 12 or not f[11].strip(): continue
        try: conf = float(f[10])
        except ValueError: continue
        t = f[11].strip()
        if conf < 70 or len(t) < 2 or not t.isalpha(): continue
        key = tuple(f[1:5]); l, tp, w, h = [int(v) for v in f[6:10]]
        lines.setdefault(key, []).append((l, tp, l + w, tp + h))
    res = []
    for ws in lines.values():
        if len(ws) >= 3:
            res.append((X0 + min(a[0] for a in ws) // scale - 3, Y0 + min(a[1] for a in ws) // scale - 3, X0 + max(a[2] for a in ws) // scale + 3, Y0 + max(a[3] for a in ws) // scale + 3))
    return res
