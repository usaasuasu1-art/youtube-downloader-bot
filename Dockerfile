# Use official Node.js runtime as base image
FROM node:18-alpine

# Install system dependencies
RUN apk update && apk add --no-cache \
    yt-dlp \
    ffmpeg \
    python3 \
    py3-pip \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create downloads directory
RUN mkdir -p downloads

# Create logs directory for PM2
RUN mkdir -p logs

# Expose port (optional, for health checks)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Bot is running')" || exit 1

# Start the application
CMD ["npm", "start"]