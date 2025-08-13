# ---- 1) Build frontend (Vite) ----
FROM node:20-alpine AS frontend
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and fix Rollup for Linux
RUN npm ci --omit=optional
RUN npm install @rollup/rollup-linux-x64-musl --no-save --ignore-engines

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# ---- 2) Install backend deps ----
FROM node:20-alpine AS backend_deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=optional

# ---- 3) Runtime ----
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies and source
COPY --from=backend_deps /app/backend/node_modules ./backend/node_modules
COPY backend ./backend

# Copy built frontend
COPY --from=frontend /app/dist ./dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "backend/src/server.js"]
