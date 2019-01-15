#!/bin/bash

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Wait until the docker containers are setup properely
echo $(status_message "Attempting to install WordPress Coding Standards...")
composer install
