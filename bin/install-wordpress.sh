#!/bin/bash

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

HOST_PORT=$(docker-compose port wordpress 80 | awk -F : '{printf $2}')
WP_CLI="docker-compose run --rm cli"

echo "";

# Perform a fresh deploy
echo $(status_message "Performing a fresh deploy...")
grunt deploy

# Wait until the docker containers are setup properely
echo $(status_message "Attempting to connect to WordPress...")
until $(curl -L http://localhost:$HOST_PORT -so - 2>&1 | grep -q "WordPress"); do
    echo '...'
    sleep 5
done
echo $(status_message "Connected to the localhost WordPress...")

# Checking if WordPress is already installed
if ! $(${WP_CLI} core is-installed); then

  # Set the correct file permissions
	docker-compose run --user=root --rm cli chown www-data -R /var/www/
	docker-compose run --user=root --rm wordpress find /var/www/ -type d -exec chmod 755 {} \;
	docker-compose run --user=root --rm wordpress find /var/www/ -type f -exec chmod 644 {} \;

	# Install WordPress
	echo $(status_message "Installing WordPress...")
	${WP_CLI} core install --url=localhost --title="Quicklink for WordPress" --admin_user=wordpress --admin_password=wordpress --admin_email=info@luehrsen-heinrich.de

	# Check for WordPress updates, just in case the WordPress image isn't up to date.
	${WP_CLI} core update

	# Activate the plugin
	${WP_CLI} plugin activate quicklink

	# Import and activate needed plugins
	${WP_CLI} plugin install wordpress-importer query-monitor debug-bar amp pwa --activate
	${WP_CLI} plugin install gutenberg

	echo $(status_message "Downloading WordPress theme unit test data...")
	${WP_CLI} curl -O https://raw.githubusercontent.com/WPTRT/theme-unit-test/master/themeunittestdata.wordpress.xml >/dev/null 2>&1

	echo $(status_message "Importing WordPress theme unit test data...\n")
	${WP_CLI} import themeunittestdata.wordpress.xml --authors=create

	# Activate debugging
	${WP_CLI} config set WP_DEBUG true --raw

  docker-compose run --user=root wordpress chown www-data -R /var/www/

else
	echo $(status_message "WordPress is already installed...")
fi
