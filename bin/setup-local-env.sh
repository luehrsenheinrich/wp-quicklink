#!/bin/bash

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Change to the expected directory
cd "$(dirname "$0")/.."

echo $(status_message "Starting the WP Munich development enviroment..." )

# Check Node and NVM are installed
. "$(dirname "$0")/install-npm.sh"

# Check Docker is installed and running
. "$(dirname "$0")/install-docker.sh"

# Install WPCS
. "$(dirname "$0")/install-wpcs.sh"

# Install wordpress and needed components
. "$(dirname "$0")/install-wordpress.sh"

CURRENT_URL=$(docker-compose run -T --rm cli option get siteurl)

echo "\nWelcome to WP Munich Blocks\n"
echo "Run $(action_format "grunt watch"), then open $(action_format "$CURRENT_URL") to get started!"
