#!/bin/bash

# Exit if any command fails
set -e

# Change to the expected directory
cd "$(dirname "$0")/.."

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Load the .env file in root
loadenv

echo $GITHUB_TOKEN
