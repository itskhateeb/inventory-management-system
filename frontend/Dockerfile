# Use Node 18 Alpine for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Run the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]