#!/bin/bash

# Deployment script for Swimming School project
# Uploads built project to remote server via SFTP

set -e  # Exit on error

# Configuration
SFTP_KEY="/tmp/temp_key"
SFTP_USER="zo38jc84r87i"
SFTP_HOST="92.205.133.19"
REMOTE_DIR="test"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment...${NC}"

# Check if SFTP key exists
if [ ! -f "$SFTP_KEY" ]; then
    echo -e "${RED}❌ Error: SFTP key not found at $SFTP_KEY${NC}"
    exit 1
fi

# Check if we're in the project directory
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the project directory?${NC}"
    exit 1
fi

# Build the project
echo -e "${YELLOW}📦 Building project...${NC}"
cd "$PROJECT_DIR"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed${NC}"

# Function to upload a file
upload_file() {
    local local_file=$1
    local remote_file=$2
    sftp -i "$SFTP_KEY" -q "$SFTP_USER@$SFTP_HOST" << EOF > /dev/null 2>&1
cd $REMOTE_DIR
put $local_file $remote_file
quit
EOF
}

# Function to create remote directory (handles nested paths)
create_remote_dir() {
    local remote_path=$1
    # Split path and create each directory level
    IFS='/' read -ra DIRS <<< "$remote_path"
    local current_path="$REMOTE_DIR"
    
    for dir in "${DIRS[@]}"; do
        [ -z "$dir" ] && continue
        sftp -i "$SFTP_KEY" -q "$SFTP_USER@$SFTP_HOST" << EOF > /dev/null 2>&1
cd $current_path
mkdir $dir 2>/dev/null || true
quit
EOF
        current_path="$current_path/$dir"
    done
}

# Upload files recursively
upload_directory() {
    local local_dir=$1
    local remote_base=$2
    
    echo -e "${BLUE}📤 Uploading $local_dir to $remote_base...${NC}"
    
    # Ensure we're in project directory
    cd "$PROJECT_DIR"
    
    # Find all files and upload them
    find "$local_dir" -type f | while read -r file; do
        # Get relative path from the local_dir
        rel_path="${file#$local_dir/}"
        # Remove leading slash if present
        rel_path="${rel_path#/}"
        remote_dir_path=$(dirname "$remote_base/$rel_path")
        remote_file="$remote_base/$rel_path"
        
        # Create remote directory if needed
        if [ "$remote_dir_path" != "." ] && [ "$remote_dir_path" != "$remote_base" ]; then
            create_remote_dir "$remote_dir_path"
        fi
        
        # Upload file - use absolute path
        echo -e "   ${YELLOW}→${NC} $rel_path"
        file_dir=$(dirname "$file")
        file_name=$(basename "$file")
        
        # Change to file's directory for upload (using absolute path)
        if [ -d "$PROJECT_DIR/$file_dir" ]; then
            cd "$PROJECT_DIR/$file_dir"
        else
            cd "$PROJECT_DIR"
        fi
        
        upload_file "$file_name" "$remote_file"
    done
    
    # Return to project directory
    cd "$PROJECT_DIR"
}

# Main upload process
echo -e "${YELLOW}📤 Uploading files to remote server ($SFTP_USER@$SFTP_HOST:$REMOTE_DIR/)...${NC}"

# Create remote directory structure
echo -e "${BLUE}📁 Creating remote directory structure...${NC}"
create_remote_dir "dist/assets"
create_remote_dir "server"
create_remote_dir "data/db"

# Upload dist directory
cd "$PROJECT_DIR"
upload_directory "dist" "dist"

# Upload server directory
upload_directory "server" "server"

# Upload root files
echo -e "${BLUE}📤 Uploading root files...${NC}"
cd "$PROJECT_DIR"
for file in package.json package-lock.json README.md; do
    if [ -f "$file" ]; then
        echo -e "   ${YELLOW}→${NC} $file"
        upload_file "$file" "$file"
    fi
done

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${GREEN}📁 Project structure on server ($REMOTE_DIR/):${NC}"
echo "   ├── dist/"
echo "   │   ├── index.html"
echo "   │   ├── favicon.ico"
echo "   │   ├── manifest.json"
echo "   │   ├── robots.txt"
echo "   │   └── assets/ (all JS/CSS files)"
echo "   ├── server/"
echo "   │   └── index.js"
echo "   ├── data/"
echo "   │   └── db/ (database directory)"
echo "   ├── package.json"
echo "   ├── package-lock.json"
echo "   └── README.md"
echo ""
echo -e "${YELLOW}🚀 Next steps on server:${NC}"
echo "   1. cd $REMOTE_DIR"
echo "   2. npm install"
echo "   3. node server/index.js"
echo ""
