# ur10.github.io

Personal site of Utkarsh Rai — https://ur10.github.io

Static HTML, no build step. Edit the pages and push.

## Structure

- `index.html` — academic-style homepage: sticky profile column, About, Robot Learning and Optimization & Estimation entries (thumbnail left, title / venue / result / links right), Publications, Experience, Education
- `site.css` / `site.js` — shared styles and behaviour for every page (research entries, project-page template, scope labels, diagrams, chart, light/dark themes, offscreen video pausing, chart tooltips)
- `projects/force-aware-insertion/` — flagship UR5e page: hardware result → method → evaluation → engineering → contributions → limitations
- `projects/real2render2real/` — Real2Render: outcome → research story → engineering details. Also loads the older `styles.css` and its own `r2.css` / `r2.js`
- `projects/pointcloud-adaptation/` — UR10 residual SAC + Q-advantage gate
- `projects/certifiable-imu/` — Cayley preintegration, QCQP/SDP certificates, runtime chart
- `assets/force/`, `assets/imu/` — media copied from the force-sim2real-ur5e and certifiable-imu-preintegration repos
- `assets/cv/` — résumé PDF
- `.nojekyll` — serve files as-is, don't run Jekyll

## Conventions

Every result carries a scope label saying where it was measured: `scope hw` (physical hardware), `scope sim` (physics simulation), `scope render` (rendered kinematic twin), `scope data` (recorded sensor data). Project pages share one template: centered title block with pill buttons, teaser, a key-result box (question / setting / measurement / comparator), then centered sections.

The IMU runtime chart is generated from `assets/imu/scaling.csv`:

```sh
python3 scripts/build_runtime_chart.py
```

## Preview

```sh
python3 -m http.server 8790 --bind 127.0.0.1
```

Then open http://127.0.0.1:8790. The Real2Render 3D viewer needs HTTP, not `file://`.

Media is re-encoded for the web; keep looping thumbnails small:

```sh
ffmpeg -i IN -vf "scale=520:-2:flags=lanczos,fps=20" -an \
  -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart OUT.mp4
```
