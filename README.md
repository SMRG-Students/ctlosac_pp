# CT-LO-MSAC project page

Static research project page with the supplementary video and ground-truth
point-cloud reconstructions for all nine in-house sequences.

## Local development

From this directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

No package installation or frontend build is required. Serve this directory as
static files to deploy; include `images/processed`, `images/demo`, `main.js`,
and `styles.css` alongside `index.html`.

## Prepare videos

Requires Python 3 and FFmpeg with the `libx264` encoder:

```sh
python3 scripts/prepare_videos.py
```

Original recordings remain in `images/demo`. The script produces 1280-pixel-wide
H.264/yuv420p MP4s with fast-start metadata, JPEG posters, and a media manifest
in `images/processed`. Existing up-to-date outputs are reused. The complete
recordings and their playback speed are preserved: no trimming, retiming,
cropping, or alteration of the point clouds is performed. These are screen
recordings, so their durations are not dataset acquisition durations.

The gallery explains the reference-trajectory construction described in the
paper. Its videos support qualitative inspection of alignment, rather than an
independent numerical accuracy measurement. Environment filters and exclusive
video playback are progressive enhancements; all sequences remain accessible
without JavaScript. Videos load only when requested, with original-file links
available on every card.
