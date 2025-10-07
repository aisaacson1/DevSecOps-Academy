# 🚀 START HERE - OpenShift White Page Fix

## You're Seeing a White Page?

**Don't Panic!** This is now fixed. Follow these simple steps:

## Step 1: Choose Your Fix Method

### 🔧 Already Deployed? (Quick Fix - 5 minutes)

```bash
# Connect to your pod
oc rsh <pod-name>

# Edit the config file
vi /opt/app-root/src/dist/config.js

# Replace the empty values with:
window.APP_CONFIG = {
  VITE_SUPABASE_URL: 'https://jcaygvhmjukkxgpfkmgk.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYXlndmhtanVra3hncGZrbWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjUwNTYsImV4cCI6MjA3NTQwMTA1Nn0.pKnCk6OriQ7KjcfqHt3O6jO75uR5ykhNo1hK5wcoXug'
};

# Exit and restart
exit
oc delete pod <pod-name>
```

**✅ Done!** Your app should now work.

### 🏗️ New Deployment? (Recommended Way - 10 minutes)

```bash
# Option 1: Set in Build Config
oc set env bc/<build-config-name> \
  VITE_SUPABASE_URL=https://jcaygvhmjukkxgpfkmgk.supabase.co \
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYXlndmhtanVra3hncGZrbWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjUwNTYsImV4cCI6MjA3NTQwMTA1Nn0.pKnCk6OriQ7KjcfqHt3O6jO75uR5ykhNo1hK5wcoXug

# Trigger build
oc start-build <build-config-name>
```

OR

```bash
# Option 2: Use S2I Environment File
cp .s2i/environment.template .s2i/environment
# (File is already populated with your credentials)
git add .s2i/environment
git commit -m "Add Supabase config"
git push
```

**✅ Done!** OpenShift will build and deploy with the correct config.

## Step 2: Verify It Works

1. **Visit your app URL**
   - Should see: DevSecOps Academy landing page ✅
   - Not: Blank white page ❌

2. **Visit `/diagnostics`**
   - Should see: All green checkmarks ✅
   - Shows: Configuration status and source

3. **Open Browser Console** (Press F12)
   - Should see: "Supabase client initialized successfully" ✅
   - Not: Error messages ❌

## Step 3: Test Authentication

1. Click "Get Started" or "Sign Up"
2. Create an account
3. Log in

**If all steps work: 🎉 Congratulations! You're all set!**

## 🆘 Still Having Issues?

### Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Still white page | Check browser console (F12) for errors |
| Config.js not found | Rebuild app: `npm run build` |
| Can't edit pod files | Use build config method instead |
| Environment vars not working | Must be set BEFORE building |

### Detailed Help

- **Quick fixes**: See `QUICK_FIX.md`
- **Full deployment guide**: See `OPENSHIFT_DEPLOYMENT.md`
- **Visual guide**: See `VISUAL_GUIDE.md`
- **All changes explained**: See `DEPLOYMENT_FIXES.md`

### Diagnostic Tools

1. **Visit** `/diagnostics` on your deployed app
2. **Check** browser console (F12 → Console tab)
3. **Review** pod logs: `oc logs <pod-name>`

## 📚 What Was Fixed?

This deployment now includes:

✅ **Error Boundary** - Shows helpful errors instead of white pages
✅ **Runtime Configuration** - Can configure without rebuilding
✅ **Diagnostics Page** - Real-time config status at `/diagnostics`
✅ **Better Error Messages** - Console shows exactly what's wrong
✅ **Multiple Config Options** - Build-time or runtime configuration
✅ **Complete Documentation** - Step-by-step guides for every scenario

## 🎯 Quick Reference

### Your Credentials
```
VITE_SUPABASE_URL=https://jcaygvhmjukkxgpfkmgk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYXlndmhtanVra3hncGZrbWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjUwNTYsImV4cCI6MjA3NTQwMTA1Nn0.pKnCk6OriQ7KjcfqHt3O6jO75uR5ykhNo1hK5wcoXug
```

### Useful Commands
```bash
# List pods
oc get pods

# Check pod logs
oc logs <pod-name>

# Access pod shell
oc rsh <pod-name>

# Restart pod
oc delete pod <pod-name>

# List build configs
oc get bc

# Start build
oc start-build <build-config>
```

## ✨ Success Checklist

- [ ] No white page - landing page shows
- [ ] `/diagnostics` shows green checkmarks
- [ ] Console shows "Supabase client initialized"
- [ ] Can sign up for an account
- [ ] Can log in
- [ ] Dashboard loads after login

**All checked?** 🎉 **You're done!**

---

**Need Help?** Start with `QUICK_FIX.md` for common issues.

**Want Details?** Check `OPENSHIFT_DEPLOYMENT.md` for the complete guide.
