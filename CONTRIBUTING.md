# Contributing Guide

## Branch Strategy

```
main         ← stable, production-ready
  └── dev    ← integration branch (merge features here)
       ├── feature/backend-auth
       ├── feature/agent-pipeline
       └── feature/frontend-dashboard
```

### Rules
1. **Never push directly to `main` or `dev`**.
2. Create a feature branch from `dev`: `git checkout -b feature/your-feature dev`
3. Make your changes, commit, and push.
4. Open a Pull Request to `dev`.
5. At least **1 teammate** must review before merging.

## Commit Convention

Use prefixes for clear history:

| Prefix | Use for |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation |
| `style:` | Formatting (no logic change) |
| `refactor:` | Code restructuring |
| `test:` | Adding/updating tests |
| `chore:` | Build/config changes |

**Example**: `feat: add user registration endpoint`

## Getting Started for a New Teammate

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/WPL_Project.git
cd WPL_Project

# 2. Create .env
cp .env.example .env

# 3. Start with Docker
docker-compose up --build

# 4. Create your branch
git checkout dev
git pull origin dev
git checkout -b feature/your-feature
```

## Pull Request Checklist

- [ ] Code runs without errors
- [ ] Tested manually
- [ ] Commit messages follow convention
- [ ] No sensitive data (API keys, passwords) committed
