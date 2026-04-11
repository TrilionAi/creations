# Contributing to Creations

Thanks for your interest in contributing! This project is a collection of lightweight desktop utilities, and we welcome improvements, bug fixes, and new ideas.

## How to Contribute

### Reporting Bugs

- Open an [issue](https://github.com/TrilionAi/creations/issues) with a clear title
- Include your OS version and app version
- Describe what happened vs. what you expected
- Add screenshots if relevant

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the feature and why it would be useful
- If possible, include mockups or references

### Submitting Code

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
3. **Make your changes** in the relevant app folder
4. **Test** your changes locally
5. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add dark mode to float-timer"
   ```
6. **Push** and open a **Pull Request**

### Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Target the `main` branch
- Describe what changed and why
- Include screenshots for UI changes
- Make sure the app still builds and runs

## Commit Convention

We use conventional commit messages:

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring without behavior change
- `chore:` — maintenance tasks

## Project Structure

Each app lives in its own folder and is fully self-contained. When contributing:

- **Don't create cross-dependencies** between apps
- **Respect each app's stack** — don't introduce new frameworks without discussion
- **Keep it lightweight** — these are meant to be small, focused tools

## Code of Conduct

Be respectful and constructive. We're here to build cool things together.

## Questions?

Open an issue or start a discussion. We're happy to help!
