# RepoForge Publish Action

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Publish packages to [RepoForge.io](https://repoforge.io) from your GitHub Actions workflow.

## 🚀 Features

- Supports publishing private Python, Docker, Debian, and NPM packages
- Works seamlessly with GitHub-hosted runners
- CI/CD-friendly – no manual steps required
- Secure token-based authentication

## 🔧 Usage

Add the following step to your GitHub Actions workflow:

```yaml
- name: Publish to RepoForge.io
  uses: repoforge/publish-action@v1
  with:
    api_token: ${{ secrets.REPOFORGE_TOKEN }}
	hash_id: my_unique_hash
    package_path: ./dist/
    repository: my-private-repo
    format: python
```
