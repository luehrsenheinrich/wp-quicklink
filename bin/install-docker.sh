#!/bin/bash

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

echo "";

# Check that Docker is installed
if ! command_exists "docker"; then
	echo $(error_message "Docker doesn't seem to be installed. Please head on over to the Docker site to download it: $(action_format "https://www.docker.com/community-edition#/download")")
	exit 1
fi

# Check that Docker is running
if ! docker info >/dev/null 2>&1; then
	echo $(error_message "Docker isn't running. Please check that you've started your Docker app, and see it in your system tray.")
	exit 1
fi

# Stop existing containers
echo $(status_message "Stopping Docker containers...")
docker-compose stop >/dev/null 2>&1

# Stop containers on port 80
if docker inspect -f {{.State.Running}} $(docker ps -a -q --filter="publish=80") >/dev/null 2>&1; then
	echo $(status_message "Stopping Docker containers on port 80...")
	docker stop $(docker ps -a -q --filter="publish=80")
fi

# Download image updates
echo $(status_message "Downloading Docker image updates...")
docker-compose pull

# Launch the containers
echo $(status_message "Starting Docker containers...")
docker-compose up -d >/dev/null
