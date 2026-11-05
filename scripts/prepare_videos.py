#!/usr/bin/env python3
"""Create web copies without trimming, retiming, or changing point-cloud content."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'images/demo'
OUTPUT = ROOT / 'images/processed'
OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = []
for source in sorted(SOURCE.glob('*.mp4')):
    name = source.stem.split('-')[0]
    target = OUTPUT / f'{name}.mp4'
    poster = OUTPUT / f'{name}.jpg'
    if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
            '-i', str(source), '-map', '0:v:0', '-map', '0:a?',
            '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'fast',
            '-crf', '23', '-pix_fmt', 'yuv420p', '-threads', '4',
            '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(target)], check=True)
    if not poster.exists() or poster.stat().st_mtime < target.stat().st_mtime:
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
            '-ss', '5', '-i', str(target), '-frames:v', '1', '-q:v', '3', str(poster)], check=True)
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error',
        '-show_format', '-show_streams', '-of', 'json', str(target)]))
    manifest.append({'id': name, 'source': source.name,
                     'duration': float(probe['format']['duration']),
                     'bytes': target.stat().st_size})
    print(f'{name}: {target.stat().st_size / 1e6:.1f} MB', flush=True)
(OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
