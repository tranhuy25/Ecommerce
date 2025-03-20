# Use the official Node.js image as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the dependencies for your app
RUN npm install --force

# Copy the rest of the application files into the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Command to start your app
CMD ["npm", "run", "start"]
