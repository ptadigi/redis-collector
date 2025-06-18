#!/bin/bash

# Redis Collector Node - One-command deployment script
# Usage: ./deploy.sh [n8n_user_home_path]
# Example: ./deploy.sh /home/n8n

set -e

echo "🚀 Starting Redis Collector Node deployment..."

# Default n8n home path
N8N_HOME=${1:-"$HOME/.n8n"}
CUSTOM_DIR="$N8N_HOME/custom"
NODE_DIR="$CUSTOM_DIR/n8n-nodes-redis-collector"

echo "📁 N8N Home: $N8N_HOME"
echo "📦 Node Directory: $NODE_DIR"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "src/nodes/RedisCollector/RedisCollector.node.ts" ]; then
    echo "❌ Error: Please run this script from the gomtin project root directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Create custom directory if it doesn't exist
echo "📁 Creating custom nodes directory..."
mkdir -p "$CUSTOM_DIR"

# Remove existing installation if present
if [ -d "$NODE_DIR" ]; then
    echo "🗑️  Removing existing installation..."
    rm -rf "$NODE_DIR"
fi

# Copy built files
echo "📋 Copying built files..."
cp -r dist "$NODE_DIR"

# Copy package.json for metadata
cp package.json "$NODE_DIR/"

# Set proper permissions
echo "🔐 Setting permissions..."
chmod -R 755 "$NODE_DIR"

# Check if n8n is running and suggest restart
if pgrep -f "n8n" > /dev/null; then
    echo "⚠️  n8n is currently running. You need to restart it to load the new node."
    echo "💡 Run: pkill -f n8n && n8n start"
else
    echo "✅ n8n is not running. Start it with: n8n start"
fi

echo ""
echo "🎉 Redis Collector Node deployed successfully!"
echo "📍 Location: $NODE_DIR"
echo ""
echo "📋 Next steps:"
echo "   1. Restart n8n if it's running"
echo "   2. Open n8n web interface"
echo "   3. Look for 'Redis Collector' in the nodes panel"
echo ""
echo "🔧 Environment variable (optional):"
echo "   export N8N_CUSTOM_EXTENSIONS=\"$CUSTOM_DIR\""
echo ""
echo "✨ Happy automating!"