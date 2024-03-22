#!/bin/bash

# Check if dist directory exists
if [ ! -d "./EchoServerReact/dist" ]; then
  echo "dist directory not found, running npm run build..."
  cd EchoServerReact || exit
  npm install
  npm run build
  cd ..
fi

# Run docker-compose up
echo "Starting Docker containers with docker-compose..."
docker-compose up
