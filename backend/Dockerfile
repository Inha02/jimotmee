# Use Node.js LTS as base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY ./package.json ./yarn.lock ./

# Install dependencies
RUN yarn install

# Copy application code
COPY . .

# Expose application port
EXPOSE 3000

# Run application
CMD ["yarn", "start"]
