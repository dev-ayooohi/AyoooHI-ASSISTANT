#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create it using the template in README.md"
  exit 1
fi

# Check if node_modules directory exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the bot
echo "Starting Discord bot..."
npm start 