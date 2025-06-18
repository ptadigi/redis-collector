# 🚀 Git Setup & Upload Guide

## Quick Git Commands

### 1. Initialize Git Repository

```bash
# Initialize git (if not done yet)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Redis Collector n8n custom node"
```

### 2. Connect to Remote Repository

#### GitHub
```bash
# Add GitHub remote
git remote add origin https://github.com/yourusername/n8n-redis-collector.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### GitLab
```bash
# Add GitLab remote
git remote add origin https://gitlab.com/yourusername/n8n-redis-collector.git

# Push to GitLab
git branch -M main
git push -u origin main
```

#### Bitbucket
```bash
# Add Bitbucket remote
git remote add origin https://bitbucket.org/yourusername/n8n-redis-collector.git

# Push to Bitbucket
git branch -M main
git push -u origin main
```

### 3. One-Command Upload

```bash
# All in one (after setting remote)
git add . && git commit -m "Redis Collector node ready for deployment" && git push
```

## 📁 What's Included in Repository

✅ **Source Code**
- `src/` - TypeScript source files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

✅ **Deployment Scripts**
- `deploy.sh` - Linux/macOS deployment
- `deploy-windows.bat` - Windows deployment
- `deploy-helper.js` - Cross-platform helper

✅ **Documentation**
- `README.md` - Complete usage guide
- `quick-install.md` - Fast deployment guide
- `GIT-SETUP.md` - This file

✅ **Configuration**
- `.gitignore` - Git ignore rules
- `.eslintrc.js` - Code linting
- `.prettierrc` - Code formatting
- `gulpfile.js` - Build tasks

❌ **Excluded** (via .gitignore)
- `node_modules/` - Dependencies
- `dist/` - Built files
- `.env` - Environment variables
- IDE and OS files

## 🔄 Update Workflow

### After Making Changes
```bash
# Stage changes
git add .

# Commit with message
git commit -m "Update: describe your changes"

# Push to remote
git push
```

### Deploy Updated Version
```bash
# On your VPS
cd your-project-folder
git pull
./deploy.sh
```

## 🌟 Repository Structure

```
n8n-redis-collector/
├── 📁 src/
│   ├── 📄 index.ts
│   └── 📁 nodes/
│       └── 📁 RedisCollector/
│           ├── 📄 RedisCollector.node.ts
│           └── 🖼️ redisCollector.svg
├── 📄 package.json
├── 📄 tsconfig.json
├── 🔧 deploy.sh
├── 🔧 deploy-windows.bat
├── 🔧 deploy-helper.js
├── 📖 README.md
├── 📖 quick-install.md
└── ⚙️ configuration files
```

## 🎯 Next Steps After Upload

1. **Share Repository URL** with your team
2. **Clone on VPS**: `git clone <your-repo-url>`
3. **Deploy**: `cd project && ./deploy.sh`
4. **Enjoy**: Redis Collector node in n8n!

## 🔗 Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Clone repository
git clone <repository-url>

# Pull latest changes
git pull

# View remotes
git remote -v
```

---

**Ready to upload? Run the commands above and your Redis Collector node will be live on Git! 🚀**