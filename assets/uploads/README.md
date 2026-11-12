# Site images

The site loads WebP files with these exact names. If a file is missing, it
automatically falls back to the matching SVG placeholder in `assets/`.

| File               | Used for            | Size      |
| ------------------ | ------------------- | --------- |
| `portrait.webp`    | Hero portrait       | 600 × 800 |
| `standing.webp`    | Process section     | 600 × 800 |
| `service-1.webp`   | Services marquee    | 480 × 640 |
| `service-2.webp`   | Services marquee    | 480 × 640 |
| `service-3.webp`   | Services marquee    | 480 × 640 |
| `work-1.webp`      | Selected work 01    | 640 × 400 |
| `work-2.webp`      | Selected work 02    | 640 × 400 |
| `work-3.webp`      | Selected work 03    | 640 × 400 |
| `work-4.webp`      | Selected work 04    | 640 × 400 |
| `work-5.webp`      | Selected work 05    | 640 × 400 |
| `blog-1.webp`      | Field notes 01      | 480 × 600 |
| `blog-2.webp`      | Field notes 02      | 480 × 600 |
| `blog-3.webp`      | Field notes 03      | 480 × 600 |

Tips: keep each file under ~250 KB. Use lowercase names and the `.webp`
extension exactly as shown. To convert a phone photo:

```sh
ffmpeg -i input.jpg -vf "scale=480:640:force_original_aspect_ratio=increase,crop=480:640" -c:v libwebp -quality 82 output.webp
```
