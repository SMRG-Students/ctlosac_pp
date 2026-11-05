# CT-LO-MSAC project page

Static research project page with the supplementary video and ground-truth
point-cloud reconstructions for all nine in-house sequences.

## Local development

From this directory:

```sh
python3 scripts/serve.py
```

The server supports HTTP byte-range requests, which browsers need to seek
reliably in MP4s. Use this script instead of `python3 -m http.server`; the
standard server can reset the playhead to the beginning when seeking. Stop it
with Ctrl+C. If the port is occupied, use `python3 scripts/serve.py --port 8001`.

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

## Set sequence playback boundaries in HTML

Each in-house sequence player in `index.html` specifies seconds to skip:

```html
<video data-trim-start="2" data-trim-end="2" controls playsinline ...>
```

`data-trim-start` skips seconds from the beginning; `data-trim-end` skips
seconds from the end (not an absolute timestamp). Change these independently
for each sequence; use `0` to keep an endpoint. Keep their sum below the video
duration. Invalid ranges fall back to full playback. Update the gallery note
if the displayed trimming policy changes.

JavaScript starts playback at the configured boundary, restricts seeking to
the selected range, pauses at its end, and restarts from the selected beginning
when Play is pressed again. Native controls still display the full file's
timeline. Without JavaScript the full recording plays. Video files and original
links are unchanged, and the supplementary demo is not trimmed.

Playback boundaries require hosting with HTTP byte-range support, as provided
by GitHub Pages and `scripts/serve.py`. Media Range requests receive HTTP 206
responses from the local server.
