#!/bin/bash

# Exit if any command fails
set -e

# Change to the expected directory
cd "$(dirname "$0")"
sleep 10

composer install
php freemius-deploy.php
