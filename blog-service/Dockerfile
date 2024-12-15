# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file (optional if you want it to be copied during build)
COPY .env .env

# Expose the port your app will run on
EXPOSE 5002

# Command to run your app
CMD ["npm", "start"]
