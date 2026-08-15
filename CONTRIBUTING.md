# Contributing

## Branching rule
- Do not commit work directly on main.
- Create a feature branch for every change.
- Open a pull request to merge into main.

## Branch naming
- Use format: feature/<short-topic>
- Examples:
  - feature/homepage-copy
  - feature/product-grid
  - feature/contact-form

## Standard flow
1. Checkout main and pull latest changes.
2. Create a feature branch.
3. Make changes and commit with clear messages.
4. Push the feature branch to origin.
5. Open a pull request to main.
6. Merge only after review.

## Local guardrail
- This repository includes a local pre-push hook in .githooks/pre-push.
- It blocks direct pushes to main and master.
- Run this once after cloning:
  - git config core.hooksPath .githooks

## Commit style
- Prefer clear, concise commit messages.
- Keep each commit focused on one change.
