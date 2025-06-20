#!/bin/bash
echo "=== PulseChainBot Website Update Script ==="

# List current forever processes
forever list

# Stop process 0 (main server process)
echo "Stopping server process 0..."
forever stop 0

# Pull latest changes from git
echo "Pulling latest changes from git..."
git pull

# Install/update dependencies
echo "Installing/updating dependencies..."
npm install

# Start the server with forever
echo "Starting PulseChainBot server..."
forever start index.js

# Show all logs
echo "Current forever logs:"
forever logs

# Follow logs for process 0
echo "Following logs for process 0 (Ctrl+C to exit):"
forever logs 0 -f
