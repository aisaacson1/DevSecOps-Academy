#!/bin/bash

# Script to update config.js with Supabase credentials
# Usage: ./update-config.sh <supabase-url> <supabase-anon-key>

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <supabase-url> <supabase-anon-key>"
    echo ""
    echo "Example:"
    echo "  $0 https://your-project.supabase.co eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    exit 1
fi

SUPABASE_URL="$1"
SUPABASE_ANON_KEY="$2"
CONFIG_FILE="dist/config.js"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: $CONFIG_FILE not found!"
    echo "Please run 'npm run build' first."
    exit 1
fi

echo "Updating $CONFIG_FILE with provided credentials..."

cat > "$CONFIG_FILE" << EOF
window.APP_CONFIG = {
  VITE_SUPABASE_URL: '$SUPABASE_URL',
  VITE_SUPABASE_ANON_KEY: '$SUPABASE_ANON_KEY'
};
EOF

echo "✓ Configuration updated successfully!"
echo ""
echo "You can now deploy the dist/ folder to OpenShift."
echo ""
echo "To verify, check the diagnostics page after deployment:"
echo "  https://your-app-url/diagnostics"
