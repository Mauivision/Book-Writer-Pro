# 🚀 Cursor Extensions Installation Guide

## Quick Install Commands

Copy and paste these extension IDs into Cursor's Extensions panel:

### Essential Extensions
```
esbenp.prettier-vscode
bradlc.vscode-tailwindcss
ms-vscode.vscode-typescript-next
ms-python.python
yzhang.markdown-all-in-one
shd101wyy.markdown-preview-enhanced
ms-vscode.vscode-json
eamodio.gitlens
ms-vscode.vscode-eslint
ms-vscode.vscode-jest
```

### Writing & Documentation
```
yzhang.markdown-all-in-one
shd101wyy.markdown-preview-enhanced
streetsidesoftware.code-spell-checker
alefragnani.bookmarks
gruntfuggly.todo-tree
```

### React & TypeScript
```
dsznajder.es7-react-js-snippets
pmneo.tsimporter
formulahendry.auto-rename-tag
coenraads.bracket-pair-colorizer-2
esbenp.prettier-vscode
```

### AI & Automation
```
github.copilot
tabnine.tabnine-vscode
streetsidesoftware.code-spell-checker
usernamehw.errorlens
```

## Installation Steps

1. **Open Cursor**
2. **Press** `Ctrl+Shift+X` (Windows) or `Cmd+Shift+X` (Mac)
3. **Search** for each extension ID above
4. **Click** "Install" for each one

## Alternative: Create .vscode/extensions.json

Create this file in your project root:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-python.python",
    "yzhang.markdown-all-in-one",
    "shd101wyy.markdown-preview-enhanced",
    "ms-vscode.vscode-json",
    "eamodio.gitlens",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-jest",
    "dsznajder.es7-react-js-snippets",
    "pmneo.tsimporter",
    "formulahendry.auto-rename-tag",
    "coenraads.bracket-pair-colorizer-2",
    "github.copilot",
    "tabnine.tabnine-vscode",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens",
    "alefragnani.bookmarks",
    "gruntfuggly.todo-tree"
  ]
}
```

Then Cursor will prompt you to install recommended extensions when you open the project.

## Most Important Extensions for Your Book Writer

1. **Markdown All in One** - For your story files
2. **Tailwind CSS IntelliSense** - For styling
3. **TypeScript Importer** - For React development
4. **GitLens** - For version control
5. **Prettier** - For code formatting
6. **Word Count** - For writing progress
7. **Python** - For Ollama integration
8. **GitHub Copilot** - AI assistance

## After Installation

1. **Restart Cursor** to ensure all extensions load properly
2. **Configure settings** in `.vscode/settings.json`
3. **Test extensions** by opening your project files

Your book writer project will be much more powerful with these extensions! 🚀
