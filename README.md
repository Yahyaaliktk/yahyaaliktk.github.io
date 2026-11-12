# Yahya Ali — Web Developer Portfolio

Live: https://yahyaaliktk.github.io/

A cinematic, scroll-driven one-page portfolio for Yahya Ali (`yahyaaliktk`).
Pure HTML, CSS and vanilla JS, powered by GSAP ScrollTrigger and Lenis smooth
scroll. No build step.

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
assets/         SVG fallbacks, favicon, social preview
assets/uploads/ WebP photos used by the site
LICENSE         MIT license (original notice retained)
CREDITS.md      attribution and dependency licenses
```

## Customize

- Colors: `:root` variables in `css/style.css` (`--bg`, `--fg`, `--accent`)
- Copy, name, email, socials: `index.html`
- Images: replace the WebP files in `assets/uploads/` (keep the same filenames).
  Missing files fall back to the matching SVG in `assets/`.
- Animation feel: durations and eases in `js/main.js`

## Performance notes

- Local WebP images with lightweight SVG fallbacks.
- Hero image is eager/high priority; below-the-fold images are lazy-loaded with
  fixed dimensions to avoid layout shift.
- Custom cursor and liquid trail only run on fine-pointer devices.
- `prefers-reduced-motion` disables smooth scroll, cursor effects and CSS
  animations.

## License

MIT. See [`LICENSE`](LICENSE) and [`CREDITS.md`](CREDITS.md).
