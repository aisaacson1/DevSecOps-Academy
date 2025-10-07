# OpenShift White Page Fix - Summary of Changes

## Problem
The application showed a white page when deployed to OpenShift because Supabase environment variables weren't available at runtime.

## Root Cause
Vite applications bake environment variables into the JavaScript bundle at build time. Variables prefixed with `VITE_` must be set during the build process, not at deployment time.

## Solution Implemented

### 1. Error Boundary Component
**File**: `src/components/ErrorBoundary.tsx`

- Catches JavaScript errors that would otherwise show a white page
- Displays user-friendly error messages with troubleshooting steps
- Shows stack traces for debugging
- Provides reload and navigation options

### 2. Runtime Configuration Support
**Files**:
- `src/lib/config.ts` - Configuration loader that checks both runtime and build-time sources
- `public/config.js` - Runtime configuration file
- `index.html` - Updated to load config.js before the app

**How it works**:
1. Checks `window.APP_CONFIG` for runtime configuration
2. Falls back to build-time `import.meta.env` values
3. Allows configuration without rebuilding

### 3. Enhanced Error Handling
**File**: `src/lib/supabase.ts`

- Detailed console logging of configuration status
- Clear error messages explaining the problem
- Instructions for both build-time and runtime configuration
- Shows which environment variables are missing

### 4. Diagnostics Page
**File**: `src/pages/Diagnostics.tsx`
**Route**: `/diagnostics`

Features:
- Real-time configuration status display
- Environment variable visibility
- Step-by-step fix instructions
- System health checks

### 5. Improved Vite Configuration
**File**: `vite.config.ts`

- Explicit base path configuration
- Proper build output settings
- Server and preview port configuration
- OpenShift-compatible settings

### 6. Deployment Scripts and Documentation
**Files**:
- `OPENSHIFT_DEPLOYMENT.md` - Comprehensive deployment guide
- `QUICK_FIX.md` - Quick troubleshooting steps
- `update-config.sh` - Script to update runtime configuration
- `.s2i/environment` - S2I build environment variables
- `.s2i/environment.template` - Template for S2I configuration

## How to Use

### For Immediate Fix (Already Deployed)

**Option 1: Update Runtime Configuration**
```bash
oc rsh <pod-name>
vi /opt/app-root/src/dist/config.js
# Update with your credentials
exit
oc delete pod <pod-name>
```

**Option 2: Use the Update Script**
```bash
./update-config.sh https://your-project.supabase.co your-anon-key
# Deploy the dist/ folder
```

### For New Deployments

**Option 1: Build with Environment Variables**
```bash
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run build
# Deploy dist/
```

**Option 2: Use S2I Environment File**
```bash
cp .s2i/environment.template .s2i/environment
# Edit .s2i/environment with your credentials
# Commit and push to trigger OpenShift build
```

**Option 3: Set in Build Config**
```bash
oc set env bc/<build-config> \
  VITE_SUPABASE_URL=... \
  VITE_SUPABASE_ANON_KEY=...
oc start-build <build-config>
```

## Verification Steps

1. **Check the landing page loads**
   - Visit your app URL
   - You should see the DevSecOps Academy landing page

2. **Check the diagnostics page**
   - Visit `/diagnostics`
   - All checks should show green (✓)
   - Configuration source should be displayed

3. **Check browser console**
   - Press F12 to open Developer Tools
   - Go to Console tab
   - Should see: "Supabase client initialized successfully"
   - Should see: "Configuration source: runtime" or "build-time"

4. **Test functionality**
   - Try signing up for an account
   - Try logging in
   - Verify dashboard loads

## What Each File Does

### Application Files
- `ErrorBoundary.tsx` - Catches and displays errors gracefully
- `config.ts` - Loads configuration from multiple sources
- `supabase.ts` - Initializes Supabase with better error handling
- `Diagnostics.tsx` - Shows configuration and system status

### Configuration Files
- `config.js` - Runtime configuration (can be edited after build)
- `.s2i/environment` - S2I build-time configuration
- `vite.config.ts` - Vite build configuration

### Documentation Files
- `OPENSHIFT_DEPLOYMENT.md` - Complete deployment guide
- `QUICK_FIX.md` - Quick troubleshooting steps
- `DEPLOYMENT_FIXES.md` - This file, explaining all changes

### Helper Scripts
- `update-config.sh` - Updates config.js with credentials

## Benefits

1. **Better Error Visibility**: No more white pages - see exactly what's wrong
2. **Flexible Configuration**: Can configure at build time OR runtime
3. **Easy Debugging**: Diagnostics page and detailed console logs
4. **Production Ready**: Proper error boundaries and fallbacks
5. **Documentation**: Clear guides for deployment and troubleshooting

## Migration Guide

If you're updating an existing deployment:

1. **Pull the latest code** with all these changes
2. **Build the application** with environment variables set
3. **Deploy to OpenShift**
4. **Verify** using the diagnostics page

Or for quick testing:

1. **Build locally**: `npm run build`
2. **Update config**: `./update-config.sh <url> <key>`
3. **Deploy dist folder**
4. **Visit /diagnostics** to verify

## Troubleshooting

### Still seeing white page?
1. Open browser console (F12) and check for errors
2. Visit `/diagnostics` to see configuration status
3. Check that config.js is accessible at `/config.js`
4. Verify environment variables are set correctly

### Config.js not found?
1. Check that `public/config.js` exists in your source
2. Verify build includes it: `ls dist/config.js`
3. Make sure OpenShift is serving static files correctly

### Environment variables not working?
1. For S2I builds, check `.s2i/environment` exists
2. For build config, verify: `oc set env bc/<name> --list`
3. Remember: Variables must be set BEFORE building, not after

## Security Notes

- The `.s2i/environment` file is in `.gitignore` to prevent committing secrets
- Use `.s2i/environment.template` as a template
- Anon keys are safe to expose in client-side code (they're meant to be public)
- Never commit Service Role keys or other sensitive credentials

## Support

For issues:
1. Check `/diagnostics` page first
2. Check browser console for detailed error messages
3. Review `QUICK_FIX.md` for common issues
4. Check `OPENSHIFT_DEPLOYMENT.md` for detailed deployment steps
