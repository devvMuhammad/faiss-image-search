#!/bin/bash

# Script to rename files in subset folder to indexed names (0.jpg, 1.jpg, etc.)

# Check if subset directory exists
if [ ! -d "subset" ]; then
    echo "Error: subset directory not found!"
    exit 1
fi

# Change to the subset directory
cd subset

# Create a temporary directory to avoid naming conflicts
mkdir -p temp_rename

# Counter for indexing
counter=0

# Sort files by name for consistent ordering and rename them
for file in $(ls *.jpg 2>/dev/null | sort); do
    if [ -f "$file" ]; then
        # Move to temp directory with new name
        mv "$file" "temp_rename/${counter}.jpg"
        echo "Renamed $file -> ${counter}.jpg"
        ((counter++))
    fi
done

# Move all files back to the subset directory
mv temp_rename/*.jpg .
rmdir temp_rename

echo "Renamed $counter files successfully!"
echo "Files now have indexed names: 0.jpg, 1.jpg, 2.jpg, ..."