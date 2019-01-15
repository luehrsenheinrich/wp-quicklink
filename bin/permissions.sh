#!/bin/bash

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Set the correct file permissions
docker-compose run -u root --rm wordpress find /var/www/ -type d -exec chmod 755 {} \;
docker-compose run -u root --rm wordpress find /var/www/ -type f -exec chmod 644 {} \;
docker-compose run -u root wordpress chown www-data -R /var/www/
