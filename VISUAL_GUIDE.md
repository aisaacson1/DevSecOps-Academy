# Visual Troubleshooting Guide

## What You'll See Now vs Before

### BEFORE (White Page Issue)
```
┌─────────────────────────────┐
│                             │
│                             │
│      (Blank White Page)     │
│                             │
│                             │
└─────────────────────────────┘
```
**Console**: `Error: Missing Supabase environment variables`
**User Experience**: 😞 Confused and stuck

### AFTER (With Fixes Applied)

#### Scenario 1: Missing Configuration
```
┌─────────────────────────────────────────┐
│  ⚠️  Something went wrong               │
│                                         │
│  Missing required Supabase              │
│  configuration!                         │
│                                         │
│  Error: Missing Supabase environment    │
│  variables                              │
│                                         │
│  [Stack trace...]                       │
│                                         │
│  📋 Configuration Issue?                │
│  Make sure your environment             │
│  variables are set:                     │
│  • VITE_SUPABASE_URL                    │
│  • VITE_SUPABASE_ANON_KEY               │
│                                         │
│  [Reload Page]  [Go to Home]            │
└─────────────────────────────────────────┘
```
**Console**: Detailed error with instructions
**User Experience**: 😊 Clear steps to fix

#### Scenario 2: Proper Configuration
```
┌─────────────────────────────────────────┐
│  🛡️  DevSecOps Academy                  │
│  ─────────────────────────────          │
│  [Sign In]  [Get Started]               │
│                                         │
│  Master DevSecOps Through               │
│  Gamification                           │
│                                         │
│  Learn development, security, and       │
│  operations practices...                │
│                                         │
│  [Start Learning Free]                  │
│  [Explore Features]                     │
└─────────────────────────────────────────┘
```
**Console**: `Supabase client initialized successfully`
**User Experience**: 🎉 App works perfectly

## Diagnostic Page View

Navigate to `/diagnostics` to see:

```
┌────────────────────────────────────────────┐
│  🛡️  System Diagnostics                    │
│                                            │
│  ✓ All Systems Operational                │
│  Your application is properly configured   │
│                                            │
│  Configuration Checks                      │
│  ┌──────────────────────────────────────┐ │
│  │ ✓ Supabase URL                       │ │
│  │   https://jcay...supabase.co         │ │
│  │   [Required]                         │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ ✓ Supabase Anon Key                  │ │
│  │   eyJhbGciOiJIUzI1NiI...            │ │
│  │   [Required]                         │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ ✓ Configuration Source               │ │
│  │   runtime                            │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Environment Variables                     │
│  {                                         │
│    "VITE_SUPABASE_URL": "https://...",    │
│    "VITE_SUPABASE_ANON_KEY": "[REDACTED]" │
│  }                                         │
│                                            │
│  [Back to Home]                            │
└────────────────────────────────────────────┘
```

## Browser Console Output

### BEFORE
```
❌ Error: Missing Supabase environment variables
   at supabase.ts:7
```

### AFTER (Without Config)
```
❌ Missing Supabase environment variables!
❌ VITE_SUPABASE_URL: Missing
❌ VITE_SUPABASE_ANON_KEY: Missing
❌ Available env vars: Object { BASE_URL: "/", MODE: "production", ... }
❌ Window config: Object { VITE_SUPABASE_URL: "", VITE_SUPABASE_ANON_KEY: "" }

Error:
    Missing required Supabase configuration!

    For OpenShift deployments, you have two options:

    Option 1 (Recommended): Build-time configuration
    1. Set environment variables before building:
       - VITE_SUPABASE_URL
       - VITE_SUPABASE_ANON_KEY
    2. Run: npm run build
    3. Deploy the dist/ folder

    Option 2: Runtime configuration
    1. Edit /config.js in your deployment:
       window.APP_CONFIG = {
         VITE_SUPABASE_URL: 'https://your-project.supabase.co',
         VITE_SUPABASE_ANON_KEY: 'your-anon-key'
       };
    2. Restart your application
```

### AFTER (With Config)
```
✓ Supabase client initialized successfully
✓ Configuration source: runtime
✓ Supabase URL: https://jcaygvhmjukkxgpfkmgk.supabase.co
```

## Quick Reference: Fix Commands

### Check Pod Logs
```bash
oc logs <pod-name> | grep -i error
```

### Access Pod to Fix Config
```bash
oc rsh <pod-name>
vi /opt/app-root/src/dist/config.js
```

### Set Build Config Environment
```bash
oc set env bc/<build-config> \
  VITE_SUPABASE_URL=https://... \
  VITE_SUPABASE_ANON_KEY=...
```

### Build Locally with Env Vars
```bash
VITE_SUPABASE_URL=... \
VITE_SUPABASE_ANON_KEY=... \
npm run build
```

### Update Config After Build
```bash
./update-config.sh https://... key...
```

## Decision Tree

```
Is your page blank (white)?
├─ YES → Open browser console (F12)
│  │
│  ├─ See detailed error message?
│  │  ├─ YES → Follow the instructions in the error
│  │  └─ NO  → Visit /diagnostics page
│  │
│  └─ Error says "Missing Supabase environment variables"?
│     ├─ Already deployed?
│     │  └─ Use Quick Fix Option 1 (edit config.js in pod)
│     │
│     └─ Not deployed yet?
│        └─ Use Build-time configuration
│
└─ NO  → App is working! 🎉
   └─ Still want to verify? Visit /diagnostics
```

## Files You Need to Know

```
project/
├── dist/
│   ├── config.js           ← Edit this for runtime config
│   └── index.html          ← Loads config.js
│
├── .s2i/
│   ├── environment         ← S2I build-time config (gitignored)
│   └── environment.template ← Template for above
│
├── src/
│   ├── lib/
│   │   ├── config.ts       ← Config loader
│   │   └── supabase.ts     ← Enhanced with error handling
│   │
│   ├── components/
│   │   └── ErrorBoundary.tsx ← Catches errors
│   │
│   └── pages/
│       └── Diagnostics.tsx  ← /diagnostics page
│
├── QUICK_FIX.md            ← Start here for problems
├── OPENSHIFT_DEPLOYMENT.md ← Complete deployment guide
└── update-config.sh        ← Helper script
```

## Success Indicators

✅ Landing page loads with DevSecOps Academy branding
✅ Console shows "Supabase client initialized successfully"
✅ `/diagnostics` shows all green checkmarks
✅ No white page
✅ Can sign up and log in

## Failure Indicators

❌ White/blank page
❌ Console errors about missing environment variables
❌ `/diagnostics` shows red X marks
❌ Can't access the app

If you see failure indicators, check `QUICK_FIX.md`!
