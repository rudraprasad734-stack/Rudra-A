#!/usr/bin/env python3
"""Make the native Android launch screen identical to the web opening animation.

Run after `bubblewrap update` and before `gradlew bundleRelease`:
    python3 patch-splash.py <twa project dir> <2048px icon png>

The TWA launch screen draws splash.png at its native pixel size, centred (ScaleType.CENTER).
We replace it with the round icon (148 dp across) on flat #20262D, which is exactly what the
web opening animation (index.html #splash) draws on its first frame, so there is no visible jump.
"""
import sys, os
from PIL import Image, ImageDraw
proj, icon = sys.argv[1], sys.argv[2]
BG = (0x20, 0x26, 0x2D); CANVAS_DP = 296; ICON_DP = 148
src = Image.open(icon).convert("RGB")
for d, f in [("mdpi", 1), ("hdpi", 1.5), ("xhdpi", 2), ("xxhdpi", 3), ("xxxhdpi", 4)]:
    size = int(CANVAS_DP * f); dia = int(ICON_DP * f)
    big = dia * 4
    art = src.resize((big, big), Image.LANCZOS)
    mask = Image.new("L", (big, big), 0); ImageDraw.Draw(mask).ellipse([0, 0, big - 1, big - 1], fill=255)
    art = art.resize((dia, dia), Image.LANCZOS); mask = mask.resize((dia, dia), Image.LANCZOS)
    canvas = Image.new("RGB", (size, size), BG)
    canvas.paste(art, ((size - dia) // 2, (size - dia) // 2), mask)
    path = os.path.join(proj, "app/src/main/res/drawable-%s/splash.png" % d)
    canvas.save(path, optimize=True); print("wrote", path, canvas.size)
# Android 12+ draws its own splash first: make it a plain background colour (no icon) so it blends in.
res = os.path.join(proj, "app/src/main/res")
os.makedirs(os.path.join(res, "values"), exist_ok=True); os.makedirs(os.path.join(res, "values-v31"), exist_ok=True)
os.makedirs(os.path.join(res, "drawable"), exist_ok=True)
open(os.path.join(res, "drawable/splash_empty.xml"), "w").write(
 '<?xml version="1.0" encoding="utf-8"?>\n<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">\n'
 '    <size android:width="1dp" android:height="1dp"/>\n    <solid android:color="#00000000"/>\n</shape>\n')
open(os.path.join(res, "values/styles.xml"), "w").write(
 '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <style name="AppTheme" parent="@android:style/Theme.Translucent.NoTitleBar"/>\n</resources>\n')
open(os.path.join(res, "values-v31/styles.xml"), "w").write(
 '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <style name="AppTheme" parent="@android:style/Theme.Translucent.NoTitleBar">\n'
 '        <item name="android:windowSplashScreenBackground">@color/backgroundColor</item>\n'
 '        <item name="android:windowSplashScreenAnimatedIcon">@drawable/splash_empty</item>\n'
 '        <item name="android:windowSplashScreenIconBackgroundColor">@color/backgroundColor</item>\n    </style>\n</resources>\n')
mf = os.path.join(proj, "app/src/main/AndroidManifest.xml"); t = open(mf).read()
t = t.replace('android:theme="@android:style/Theme.Translucent.NoTitleBar"', 'android:theme="@style/AppTheme"')
open(mf, "w").write(t); print("manifest theme ->", "@style/AppTheme" in t)
