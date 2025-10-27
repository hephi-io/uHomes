# Commit Message Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to maintain a clean and consistent commit history. This helps with automated changelog generation, semantic versioning, and better project maintenance.

## Quick Start

### Using Commitizen (Recommended)

```bash
npm run commit
```

This will guide you through creating a properly formatted commit message interactively.

### Manual Commits

If you prefer to write commit messages manually, follow the format below:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type       | Description                              | Example                                 |
| ---------- | ---------------------------------------- | --------------------------------------- |
| `feat`     | A new feature                            | `feat: add user authentication`         |
| `fix`      | A bug fix                                | `fix: resolve login validation error`   |
| `docs`     | Documentation changes                    | `docs: update API documentation`        |
| `style`    | Code style changes (formatting, etc.)    | `style: format code with prettier`      |
| `refactor` | Code refactoring without feature changes | `refactor: simplify user service logic` |
| `perf`     | Performance improvements                 | `perf: optimize database queries`       |
| `test`     | Adding or updating tests                 | `test: add unit tests for auth service` |
| `chore`    | Maintenance tasks, dependencies          | `chore: update dependencies`            |
| `ci`       | CI/CD pipeline changes                   | `ci: add automated testing workflow`    |
| `build`    | Build system changes                     | `build: update webpack configuration`   |
| `revert`   | Reverting previous commits               | `revert: remove experimental feature`   |

## Scope (Optional)

The scope should be the area of the codebase affected:

- `api` - Backend API changes
- `web` - Frontend web app changes
- `landing` - Landing page changes
- `shared` - Shared packages/utilities
- `ui` - UI component changes
- `auth` - Authentication related
- `db` - Database related

### Examples with Scope:

```
feat(api): add user registration endpoint
fix(web): resolve navigation menu bug
docs(shared): update utility function documentation
```

## Description

- Use imperative mood ("add feature" not "added feature")
- Start with lowercase letter
- No period at the end
- Keep it concise but descriptive

### Good Examples:

```
feat: add dark mode toggle
fix: resolve memory leak in image processing
docs: update installation instructions
```

### Bad Examples:

```
Added new feature
FIX: Bug in login
docs: Updated README.
```

## Body (Optional)

Use the body to explain:

- What the change does
- Why the change was made
- Any breaking changes

```
feat(api): add user profile endpoint

This endpoint allows users to retrieve and update their profile information.
Includes validation for email format and password strength requirements.

BREAKING CHANGE: The user model now requires a 'profile' field
```

## Footer (Optional)

Common footers:

- `BREAKING CHANGE:` - Indicates breaking changes
- `Closes #123` - References issues/PRs
- `Co-authored-by: Name <email>` - Multiple authors

## Examples

### Simple Feature

```
feat: add user dashboard
```

### Feature with Scope

```
feat(web): add responsive navigation menu
```

### Bug Fix

```
fix: resolve CORS error in API requests
```

### Breaking Change

```
feat(api): redesign user authentication

BREAKING CHANGE: The authentication endpoint now requires a different request format
```

### Documentation Update

```
docs: update API documentation for v2.0
```

## What Happens When You Commit

1. **Pre-commit Hook**: Automatically runs linting and formatting on staged files
2. **Commit Message Validation**: Checks that your commit message follows the conventional format
3. **Auto-formatting**: Prettier formats your code according to project standards

## Troubleshooting

### Invalid Commit Message

If you get a commitlint error, your message doesn't follow the conventional format. Check:

- Does it start with a valid type? (`feat:`, `fix:`, etc.)
- Is the description in imperative mood?
- Is the format correct?

### Pre-commit Hook Fails

If the pre-commit hook fails:

- Check for linting errors in your code
- Run `npm run lint:staged` to see what's failing
- Fix the issues and try committing again

## Benefits

- **Automated Changelogs**: Generate changelogs from commit history
- **Semantic Versioning**: Automatically determine version bumps
- **Better Collaboration**: Clear, consistent commit messages
- **Code Quality**: Automatic formatting and linting
- **Project Maintenance**: Easier to track changes and debug issues

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitizen Documentation](https://github.com/commitizen/cz-cli)
- [Commitlint Rules](https://commitlint.js.org/#/reference-rules)
