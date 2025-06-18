#!/bin/bash
echo "🐳 Deploying Redis Collector to Docker n8n..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if n8n container is running
if ! docker ps | grep -q "n8n"; then
    echo "❌ Error: n8n container is not running. Please start your n8n container first."
    exit 1
fi

# Install dependencies and build
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Create custom nodes directory in container
echo "📂 Creating custom nodes directory..."
docker exec n8n mkdir -p /home/node/.n8n/custom

# Copy built files to container
echo "📋 Copying files to container..."
docker cp ./dist/. n8n:/home/node/.n8n/custom/
docker cp ./package.json n8n:/home/node/.n8n/custom/

# Set proper permissions
echo "🔐 Setting permissions..."
docker exec n8n chown -R node:node /home/node/.n8n/custom
docker exec n8n chmod -R 755 /home/node/.n8n/custom

# Restart container to load the new node
echo "🔄 Restarting n8n container..."
docker restart n8n

echo "✅ Deploy completed successfully!"
echo "🌐 Your n8n should be available at: http://localhost:5678"
echo "🔍 Look for 'Redis Collector' in the node palette."

# Wait a moment and check if container is running
sleep 5
if docker ps | grep -q "n8n"; then
    echo "✅ n8n container is running successfully."
else
    echo "⚠️  Warning: n8n container may have issues. Check with 'docker logs n8n'"
fi