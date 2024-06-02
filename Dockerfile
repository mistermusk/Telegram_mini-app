# Use an official Node.js image with Yarn
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application with Vite
RUN yarn build

# Use a simple web server to serve the static files
RUN yarn global add serve

# Expose the port the app runs on
EXPOSE 80

# Command to serve the build directory
CMD ["serve", "-s", "dist", "-l", "80"]
