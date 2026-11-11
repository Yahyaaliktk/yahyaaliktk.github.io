# ALI

A cinematic, scroll-driven one-page studio site. Pure HTML, CSS and vanilla JS,
powered by GSAP ScrollTrigger and Lenis smooth scroll. No build step.

## Run locally

```bash
cd ~/web/cine
python3 -m http.server 8000
```

Then open http://localhost:8000

## Structure

```
index.html      all content
css/style.css   theme + responsive layout
js/main.js      GSAP + Lenis interactions
assets/         generated SVG artwork (lightweight)
LICENSE         MIT license (original notice retained)
CREDITS.md      attribution and dependency licenses
```

## Customize

- Colors: `:root` variables in `css/style.css` (`--bg`, `--fg`, `--accent`)
- Copy, name, email, socials: `index.html`
- Images: replace the SVGs in `assets/` (keep the same filenames)
- Animation feel: durations and eases in `js/main.js`

## Performance notes

- All artwork is local SVG; total site size is under 200 KB.
- Images below the fold use `loading="lazy"` and fixed dimensions.
- Custom cursor and liquid trail only run on fine-pointer devices.
- `prefers-reduced-motion` disables smooth scroll, cursor effects and CSS
  animations.

## License

MIT. See [`LICENSE`](LICENSE) and [`CREDITS.md`](CREDITS.md).
