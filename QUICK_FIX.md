# Quick Fix for White Page in OpenShift

## The Problem
You're seeing a white page because Supabase environment variables aren't available at runtime in your OpenShift deployment.

## Quick Fix (Option 1): Update Runtime Config

If you can access your OpenShift pod:

```bash
# 1. Find your pod
oc get pods

# 2. Access the pod
oc rsh <pod-name>

# 3. Find and edit config.js
vi /opt/app-root/src/dist/config.js

# 4. Replace the empty values with your credentials:
window.APP_CONFIG = {
  VITE_SUPABASE_URL: 'https://jcaygvhmjukkxgpfkmgk.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYXlndmhtanVra3hncGZrbWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjUwNTYsImV4cCI6MjA3NTQwMTA1Nn0.pKnCk6OriQ7KjcfqHt3O6jO75uR5ykhNo1hK5wcoXug'
};

# 5. Exit and restart the pod
exit
oc delete pod <pod-name>
```

## Quick Fix (Option 2): Rebuild with Environment Variables

If you're using OpenShift builds:

```bash
# Set environment variables in your build config
oc set env bc/<build-config-name> \
  VITE_SUPABASE_URL=https://jcaygvhmjukkxgpfkmgk.supabase.co \
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYXlndmhtanVra3hncGZrbWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjUwNTYsImV4cCI6MjA3NTQwMTA1Nn0.pKnCk6OriQ7KjcfqHt3O6jO75uR5ykhNo1hK5wcoXug

# Trigger a new build
oc start-build <build-config-name>
```

## Quick Fix (Option 3): Local Build with Env Vars

Build locally with environment variables and deploy the dist folder:

```bash
# Build with env vars
VITE_SUPABASE_URL=https://jcaygvhmjukkxgpfkmgk.supabase.co \
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYXlndmhtanVra3hncGZrbWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjUwNTYsImV4cCI6MjA3NTQwMTA1Nn0.pKnCk6OriQ7KjcfqHt3O6jO75uR5ykhNo1hK5wcoXug \
npm run build

# Deploy the dist/ folder to OpenShift
```

## Verify the Fix

After applying any of the above fixes:

1. Visit your application URL - you should see the landing page
2. Check `/diagnostics` to verify configuration is correct
3. Open browser console (F12) - you should see "Supabase client initialized successfully"

## What Changed

The application now includes:

1. **Error Boundary** - Shows helpful error messages instead of a white page
2. **Runtime Configuration** - Can load config from `/config.js` at runtime
3. **Diagnostics Page** - Visit `/diagnostics` to see configuration status
4. **Better Error Messages** - Console logs explain exactly what's missing

## Need More Help?

Check the browser console (F12 → Console tab) for detailed error messages and instructions.
