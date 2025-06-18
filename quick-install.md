# 🚀 Quick Install Guide

## One-Command Deployment

### Linux/macOS (VPS/Self-hosted)

```bash
# Clone or upload project to VPS
git clone <your-repo-url> gomtin
cd gomtin

# Make script executable and run
chmod +x deploy.sh
./deploy.sh

# Or specify custom n8n path
./deploy.sh /path/to/n8n/home
```

### Windows

```cmd
# Download or clone project
cd gomtin

# Run deployment script
deploy-windows.bat

# Or specify custom n8n path
deploy-windows.bat "C:\Users\YourName\.n8n"
```

### Docker One-Liner

```bash
# Build and run with custom node
docker build -t n8n-redis-collector .
docker run -d --name n8n -p 5678:5678 n8n-redis-collector
```

## Git Workflow

### 1. Push to Git Repository

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial Redis Collector node"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on VPS

```bash
# SSH to your VPS
ssh user@your-vps-ip

# Clone and deploy in one go
git clone <your-repo-url> redis-collector && cd redis-collector && chmod +x deploy.sh && ./deploy.sh
```

### 3. Update Deployment

```bash
# On VPS, update and redeploy
cd redis-collector
git pull
./deploy.sh
```

## NPM Package (Future)

```bash
# After publishing to npm
npm install -g n8n-nodes-redis-collector

# Or in n8n directory
cd ~/.n8n
npm install n8n-nodes-redis-collector
```

## Verification

After deployment, check:

1. **Files exist**: `ls ~/.n8n/custom/n8n-nodes-redis-collector/`
2. **n8n restart**: `pkill -f n8n && n8n start`
3. **Web interface**: Open n8n → Look for "Redis Collector" node

## Troubleshooting

### Node not appearing
```bash
# Check n8n logs
n8n start --verbose

# Verify custom path
echo $N8N_CUSTOM_EXTENSIONS

# Manual verification
ls -la ~/.n8n/custom/n8n-nodes-redis-collector/
```

### Permission issues
```bash
# Fix permissions
chmod -R 755 ~/.n8n/custom/
chown -R $(whoami) ~/.n8n/custom/
```

### Build issues
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

**🎯 Goal**: From zero to working Redis Collector node in under 2 minutes!