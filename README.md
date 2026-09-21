# ur10.github.io

Personal site of Utkarsh Rai — https://ur10.github.io

Static HTML, no build step. Edit `index.html` / `styles.css` and push.

- `index.html` — the whole page (about, research, projects, publications)
- `styles.css` — layout and type
- `assets/research/`, `assets/thumbs/` — looping clips (h264 mp4, muted, autoplay)
- `assets/cv/` — resume PDF
- `.nojekyll` — serve files as-is, don't run Jekyll

Media is re-encoded for the web; keep clips under ~300 KB:

```sh
ffmpeg -i IN -vf "scale=520:-2:flags=lanczos,fps=20" -an \
  -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart OUT.mp4
```
