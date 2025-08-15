# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci
RUN cd backend && npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (Railway expects 8080)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "railway:start"]
