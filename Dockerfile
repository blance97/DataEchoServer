# Use Node.js v18 Alpine for the build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and lockfiles for workspaces
COPY package.json package-lock.json ./
# Copy the workspace folders (frontend and backend)
COPY frontend ./frontend
COPY backend ./backend

# Install dependencies and build the app
RUN npm install
RUN npm run build

# Use a lean Node.js image for the runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy node_modules and build output from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/frontend ./frontend
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/build ./build

# Install only production dependencies
RUN npm install --only=production

# Expose the port (using the port defined in your backend configuration)
EXPOSE 3000

# Start the backend server (compiled output is in backend/dist)
CMD [ "npm", "run", "start:backend", "--prefix", "backend" ]