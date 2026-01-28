# Use Node.js environment
FROM node:18-alpine

WORKDIR /app

# Copy package definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose Vite's port
EXPOSE 5173

# Start the dev server exposed to the network
CMD ["npm", "run", "dev", "--", "--host"]