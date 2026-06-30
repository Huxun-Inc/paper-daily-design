# Global Knowledge Earth Lottie

Website-ready Lottie package.

## Files

- `global-knowledge-earth.lottie.json` - the animation JSON.
- `ArialUnicode.ttf` - subset font containing only the glyphs used by the
  slogans, so the package stays small.
- `index.html` - minimal browser demo using `lottie-web`.

## Use On A Website

Upload `global-knowledge-earth.lottie.json` and `ArialUnicode.ttf` to the same
public folder, then load the JSON with `lottie-web`:

```html
<style>
  @font-face {
    font-family: "Arial Unicode MS";
    src: url("./ArialUnicode.ttf") format("truetype");
    font-display: block;
  }
</style>
<div id="lottie" style="width:320px;height:320px"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
<script>
  lottie.loadAnimation({
    container: document.getElementById("lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "./global-knowledge-earth.lottie.json",
  });
</script>
```

For local testing, serve the folder with a local web server instead of opening
the file directly.
