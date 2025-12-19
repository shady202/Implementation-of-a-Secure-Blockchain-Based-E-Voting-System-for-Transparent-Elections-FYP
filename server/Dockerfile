FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with offline fallback
RUN npm ci --prefer-offline --no-audit || npm install

# Copy all source files
COPY . .

# Expose port
EXPOSE 3001

# Start server
CMD ["npx", "ts-node", "src/index.ts"]
