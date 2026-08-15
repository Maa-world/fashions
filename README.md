# fashions
fashions website for fashions.maaworld.in

## Current catalogue behaviour
- Product data is loaded from Google Sheets first, then falls back to local `data/products.js` if the sheet is unavailable.
- Product images and short videos are hosted in Google Drive and referenced in sheet columns.
- Product cards support a quick-view overlay with large image preview and next/previous navigation.

See [docs/google-sheets-catalogue.md](docs/google-sheets-catalogue.md) for the catalogue model and operations workflow.

## Development workflow
- Use feature branches for all changes.
- Open a pull request to merge into main.
- Do not push directly to main.

## Hook setup
This repository includes a local pre-push hook that blocks direct pushes to main/master.

Run once after clone:

```bash
git config core.hooksPath .githooks
```
