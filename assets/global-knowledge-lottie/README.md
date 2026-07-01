# Global Knowledge Earth - Website Canvas Player

This package is the final website-ready version. It does not depend on
`lottie-web`; it uses CanvasKit/Skottie in the browser, matching the renderer
that plays the animation correctly.

## Files

- `index.html` - ready-to-use web page.
- `global-knowledge-earth.lottie.json` - animation source.
- `ArialUnicode.ttf` - 72KB subset font containing only the slogan glyphs.
- `canvaskit.js` and `canvaskit.wasm` - local CanvasKit runtime files.

## Test Locally

```bash
python3 -m http.server 8099
```

Then open:

```text
http://127.0.0.1:8099/
```

Upload all files in this folder together to your website. Do not open
`index.html` directly from the filesystem; use a web server so JSON, font, and
WASM files can be fetched correctly.
