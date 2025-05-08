#!/bin/bash
# deploy.sh

# Build the React app
npm run build

# Allow the ssh
chmod 400 "kaps-ec2-instance-key.pem"

# Copy files to EC2
scp -i "kaps-ec2-instance-key.pem" -r ./dist/* ubuntu@ec2-100-24-44-74.compute-1.amazonaws.com:/var/www/kaps9.in/html

# SSH into EC2 and set permissions
#ssh -i "kaps-ec2-instance-key.pem" ubuntu@ec2-100-24-44-74.compute-1.amazonaws.com

# Set proper ownership for web server
#sudo chown -R www-data:www-data /var/www/kaps9.in/html

# Set proper permissions
#sudo find /var/www/kaps9.in/html -type d -exec chmod 755 {} \;
#sudo find /var/www/kaps9.in/html -type f -exec chmod 644 {} \;