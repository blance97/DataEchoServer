#!/bin/bash

# Step 1: Build the React app
echo "Building the React app..."
cd EchoServerReact || exit
npm install
npm run build

# Step 2: Create the public directory if it does not exist
echo "Creating public directory if it does not exist..."
mkdir -p ../backendNode/public

# Step 3: Move the built files to the backend directory
echo "Moving built files to the backend directory..."
mv dist/* ../backendNode/public

# Step 4: Build the Docker image for the backend
echo "Building the Docker image for the backend..."
cd ../backendNode || exit
docker build -t backend-node .

# Step 5: Run the Docker container
echo "Running the Docker container..."
docker run -d -p 3000:3000 backend-node

echo "Application deployed successfully!"
