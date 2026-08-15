# Google Sheets Catalogue Plan

Use Google Sheets as the first product source for fashions.maaworld.in.

## Why this approach
- Free to start
- Easy for non-technical updates
- Good fit for early catalogue management
- Can later be replaced by a CMS without changing the product model too much

## Recommended sheet name
- Products

## Live sheet in Drive (current setup)
- Drive structure: `MaaWorld-Assets/10-brands/fashions/01-catalogue/2026/jewels`
- Sheet file name: `fashions-products-live` (Google Sheets)
- Spreadsheet ID: `1EuOCA-GcGV1aFwXUV10_kIvvHnZzxFb-Dz9nv4IJRZw`
- Sheet gid: `234732728`
- Access mode: `Anyone with the link` (Viewer)

The site now loads catalogue records directly from this sheet through:
- `https://docs.google.com/spreadsheets/d/1EuOCA-GcGV1aFwXUV10_kIvvHnZzxFb-Dz9nv4IJRZw/gviz/tq?tqx=out:json&gid=234732728`

If the sheet is temporarily unavailable, the page falls back to local `data/products.js`.

## Product interaction behaviour (current UI)
- Clicking a product image opens a large quick-view panel.
- Left and right arrows move through product images.
- Thumbnail clicks jump to a selected image.
- Keyboard support: `Esc` closes, `Left Arrow` and `Right Arrow` navigate.
- A `Quick view` button is also available on each card.

## Required columns
- id
- category
- subcategory
- product_name
- price
- currency
- short_description
- image_url_1
- image_url_2
- image_url_3
- image_url_4
- video_url_1
- video_url_2
- availability
- featured
- whatsapp_message
- sort_order

## Column meaning
- id: unique product code, for example `JW-001`
- category: top-level group, for example `Jewels` or `Sarees`
- subcategory: group under the category, for example `1gm gold`
- product_name: customer-facing product title
- price: plain numeric value without currency symbol
- currency: `INR`
- short_description: short one or two line summary
- image_url_1..image_url_4: public image links for one product (main + additional views)
- video_url_1..video_url_2: optional short product video links
- availability: `In Stock`, `Made to Order`, or `Sold Out`
- featured: `Yes` or `No`
- whatsapp_message: message prefilled for enquiry
- sort_order: number used for display order

## Current launch structure
- Category: `Jewels`
  - Subcategory: `1gm gold`
  - Subcategory: `Jadau collection`
  - Subcategory: `Pearls & Beads`
- Category: `Sarees`

## Suggested update workflow
1. Add or edit rows in Google Sheets.
2. Keep image links public and stable.
3. Mark unavailable products instead of deleting them.
4. Use `sort_order` to control display position.
5. Keep `whatsapp_message` short and product-specific.

## Next implementation step
We can build the fashions catalogue page in this order:
1. read mock data from a local JSON or CSV file using the same columns
2. render product cards grouped by category and subcategory
3. replace the mock source with a published Google Sheet feed

## Publishing options later
- Quickest: publish the sheet as CSV and fetch it in the site
- Stronger control: use a small Worker endpoint to read and transform sheet data
- Long-term: migrate the same model into a CMS

## Product photos
- Use `image_url_1` as the primary photo and `image_url_2..4` as additional views.
- Use `video_url_1` for the main product video and `video_url_2` only if needed.
- Google Drive can be used in phase 1.
- Use the direct Drive image URL format, not the normal share page URL.
- Keep product image naming tied to the product id.

See [google-drive-images.md](google-drive-images.md) for the exact format and folder plan.

## File in this repo
Use [google-sheets-catalogue.md](google-sheets-catalogue.md) with [products_template.csv](../data/products_template.csv) as the starting template.