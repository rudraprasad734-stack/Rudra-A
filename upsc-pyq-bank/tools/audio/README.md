# Timer sounds

`make_sounds.py` builds the ten 60-second stereo FLAC loops in `page/audio/` (numpy + soundfile).
`qa_sounds.py` prints loop-join, loudness and band balance for each file and writes a spectrogram sheet.

The loops are exactly periodic (noise shaped in the frequency domain, whole cycles per minute, events and echo
wrapped round the end), so the app plays them with a plain `loop = true` and there is no audible join.
Re-run `python3 make_sounds.py` after changing a recipe; the files are deterministic.
The app keeps a downloaded copy in the Cache Storage store `upsc-sounds-v1` so they play offline.
