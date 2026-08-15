# fashions
fashions website for fashions.maaworld.in

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
