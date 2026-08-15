# Google Drive Product Image Plan

Yes, you can use Google Drive for product photos in the first phase, but use it carefully.

## Recommended first approach
1. Create one Google Drive folder for product images.
2. Upload multiple images per product (front, close-up, side, worn look).
3. Keep file names clean, for example `jw-001-classic-lakshmi-necklace.jpg`.
4. Set sharing so the image link is publicly viewable.
5. Put the public image links into `image_url_1` to `image_url_4` in Google Sheets.

## Important limitation
Google Drive share links are not ideal website image URLs by default.

Normal share links look like this:
- `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

In our current setup, the reliable website image format is:
- `https://lh3.googleusercontent.com/d/FILE_ID=w2000`

Note: we observed intermittent `403` responses for `uc?export=view` links, so prefer the `lh3.googleusercontent.com` format for catalogue images.

## Best practice for your sheet
- Store the `lh3.googleusercontent.com` image URL, not the normal share URL.
- Keep `image_url_1` as the main card image.
- Use `image_url_2..4` for alternate shots.
- Leave extra image columns empty if a product has fewer photos.

## Suggested folder structure
- `Jewels/1gm-gold/`
- `Jewels/jadau-collection/`
- `Jewels/pearls-and-beads/`
- `Sarees/`

## Risks with Google Drive
- Links can break if sharing settings change.
- Performance is not as strong as dedicated image hosting.
- Large traffic is not what Google Drive is built for.

## Better later options
- Cloudflare Images
- GitHub repository assets for a small catalogue
- A lightweight CMS with hosted assets

## Recommendation
Use Google Drive now for speed and zero extra cost.
Later, migrate product images to a stronger image host once the catalogue grows.

## Product video (optional)
- Keep short clips in the same product folder, inside `web-ready`.
- Suggested file naming: `jw-001-v1.mp4`, `jw-001-v2.mp4`.
- Keep videos short (10 to 20 seconds) and compressed.
- Add public direct links in `video_url_1` and `video_url_2` in Google Sheets.

## Multi-image mapping example
- `image_url_1`: hero/front image
- `image_url_2`: close-up detail
- `image_url_3`: side or angle view
- `image_url_4`: wearing/styling shot