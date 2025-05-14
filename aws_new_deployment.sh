#!/bin/bash
# deploy.sh

# Exit on error
set -e

# Configuration
KEY_FILE="kaps-ec2-instance-key.pem"
EC2_HOST="ubuntu@ec2-100-24-44-74.compute-1.amazonaws.com"
REMOTE_DIR="/var/www/kaps9.in/html"
LOCAL_BUILD_DIR="./dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to check if a command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
        exit 1
    fi
}

# Function to retry a command
retry_command() {
    local max_attempts=3
    local attempt=1
    local command="$@"

    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt of $max_attempts..."
        $command
        if [ $? -eq 0 ]; then
            return 0
        fi
        echo "Command failed, retrying in 5 seconds..."
        sleep 5
        attempt=$((attempt + 1))
    done
    return 1
}

echo "Starting deployment process..."

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo -e "${RED}Error: Key file $KEY_FILE not found${NC}"
    exit 1
fi

# Set proper permissions for key file
echo "Setting key file permissions..."
chmod 400 "$KEY_FILE"
check_status "Key file permissions set"

# Build the React app
echo "Building React app..."
npm run build
check_status "React app built"

# Check if build directory exists
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo -e "${RED}Error: Build directory $LOCAL_BUILD_DIR not found${NC}"
    exit 1
fi

# Create a temporary directory for the build
echo "Creating temporary directory..."
TEMP_DIR=$(mktemp -d)
cp -r "$LOCAL_BUILD_DIR"/* "$TEMP_DIR"
check_status "Files copied to temporary directory"

# Copy files to EC2 with retry
echo "Copying files to EC2..."
retry_command scp -i "$KEY_FILE" -o ConnectTimeout=10 -o ServerAliveInterval=30 -r "$TEMP_DIR"/* "$EC2_HOST:$REMOTE_DIR"
check_status "Files copied to EC2"

# Clean up temporary directory
echo "Cleaning up..."
rm -rf "$TEMP_DIR"
check_status "Temporary directory cleaned up"

# SSH into EC2 and set permissions
echo "Setting permissions on EC2..."
retry_command ssh -i "$KEY_FILE" -o ConnectTimeout=10 -o ServerAliveInterval=30 "$EC2_HOST" "sudo chown -R www-data:www-data $REMOTE_DIR && sudo find $REMOTE_DIR -type d -exec chmod 755 {} \; && sudo find $REMOTE_DIR -type f -exec chmod 644 {} \;"
check_status "Permissions set on EC2"

echo -e "${GREEN}Deployment completed successfully!${NC}"