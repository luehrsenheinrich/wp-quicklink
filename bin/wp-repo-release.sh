#!/bin/bash

# usage: sh wp-repo-release.sh [zip-file] [plugin-slug] [version]

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Set the base working directory
basedir=$(mreadlink "$(dirname "$0")/..")

# Change to the expected directory
cd "$basedir"

# Setup variables
file=$(mreadlink "$1")
wpdomain=$2
version=$3

if [[ ${file: -4} != ".zip" ]]; then
    echo "The file $file is not a zip."
    exit 1
fi

folder=$(basename $1)
r=$(( RANDOM % 10000 ));
wd="$folder-$r"

# Move into our temporary working folder
cd "/tmp/" || exit

# Create a dir where we can unzip our contents
mkdir "$wd"

# Set the target of the zip extraction
extract="/tmp/$wd/upload"

# Actually unzip
unzip "$file" -d "$extract" > /dev/null

# Move into the working directory
cd "$wd" || exit

echo $(status_message "Cloning SVN locally")
svn co "https://plugins.svn.wordpress.org/$wpdomain" > /dev/null

echo $(status_message "Copying new plugin version on SVN locally")
rm -fr "$wpdomain"/trunk
cp -r "$extract/$wpdomain/." ./"$wpdomain"/trunk
rm -fr "$wpdomain"/tags/
rsync -rv --exclude=*.psd "$basedir/assets/." ./"$wpdomain"/assets

echo $(status_message "Deploying new plugin version on SVN remote")
cd "$wpdomain" || exit
# Delete all file, so we have a fresh file base
svn delete --keep-local *

# This command force to add all the files, also if they are new
svn add --force * --auto-props --parents --depth infinity -q
echo $(status_message "Commiting to WordPress.org")
svn ci -m "tagging version $version"

cd /tmp/ || exit
rm -fr "./$wd"
echo " "
