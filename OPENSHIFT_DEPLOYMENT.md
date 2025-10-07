# OpenShift Deployment Guide

## Overview

This guide explains how to deploy your DevSecOps Learning application to OpenShift and resolve the white page issue.

## Root Cause of White Page Issue

The white page in OpenShift deployments is typically caused by missing Supabase environment variables. Vite applications require environment variables prefixed with `VITE_` to be set at **build time**, not runtime.

## Solution Options

### Option 1: Build-Time Configuration (Recommended)

Build the application with environment variables set in your CI/CD pipeline or OpenShift Build Config.

#### Steps:

1. **Set Environment Variables in OpenShift Build Config**

```bash
oc set env bc/your-build-config \
  VITE_SUPABASE_URL=https://jcaygvhmjukkxgpfkmgk.supabase.co \
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Trigger a New Build**

```bash
oc start-build your-build-config
```

3. **Deploy the New Build**

The application will now have the environment variables baked into the JavaScript bundle.

#### For S2I (Source-to-Image) Builds:

Create a `.s2i/environment` file in your repository:

```bash
VITE_SUPABASE_URL=https://jcaygvhmjukkxgpfkmgk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Option 2: Runtime Configuration

If you cannot rebuild with environment variables, you can modify the configuration at runtime.

#### Steps:

1. **Access your running pod**

```bash
oc rsh <pod-name>
```

2. **Edit the config.js file**

```bash
vi /opt/app-root/src/dist/config.js
```

or if using a different base directory:

```bash
find / -name "config.js" 2>/dev/null
```

3. **Update with your Supabase credentials**

```javascript
window.APP_CONFIG = {
  VITE_SUPABASE_URL: 'https://jcaygvhmjukkxgpfkmgk.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

4. **Restart the pod**

```bash
oc delete pod <pod-name>
```

The deployment will automatically create a new pod.

### Option 3: ConfigMap for Runtime Configuration

Create a ConfigMap to manage the configuration file.

#### Steps:

1. **Create a ConfigMap**

```bash
oc create configmap app-config --from-file=config.js
```

Where `config.js` contains:

```javascript
window.APP_CONFIG = {
  VITE_SUPABASE_URL: 'https://jcaygvhmjukkxgpfkmgk.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

2. **Mount the ConfigMap in your Deployment**

```yaml
spec:
  template:
    spec:
      containers:
      - name: your-app
        volumeMounts:
        - name: config
          mountPath: /opt/app-root/src/dist/config.js
          subPath: config.js
      volumes:
      - name: config
        configMap:
          name: app-config
```

3. **Apply the changes**

```bash
oc apply -f deployment.yaml
```

## Diagnostic Tools

### Access the Diagnostics Page

Once deployed, navigate to `/diagnostics` to see the configuration status:

```
https://your-app-url.openshift-domain.com/diagnostics
```

This page will show:
- Which environment variables are set
- Configuration source (build-time vs runtime)
- Detailed instructions for fixing any issues

### Check Browser Console

1. Open your application in a browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Look for configuration-related error messages

The application now provides detailed error messages explaining exactly what's missing and how to fix it.

### Check Application Logs

```bash
oc logs <pod-name>
```

Look for any startup errors or configuration issues.

## Verification

After implementing one of the solutions above:

1. Visit your application URL
2. You should see the landing page instead of a white page
3. Check `/diagnostics` to confirm all checks pass
4. Try logging in to verify full functionality

## Common Issues

### Issue: Still seeing white page after setting environment variables

**Solution**: Make sure you've triggered a new build after setting the environment variables. Environment variables set in the deployment config won't affect an already-built application.

### Issue: 404 errors for assets

**Solution**: Check that your OpenShift route is configured correctly and that the base path in `vite.config.ts` matches your deployment path.

### Issue: Config file not found

**Solution**: Verify that `public/config.js` is included in your build and deployed correctly. It should be accessible at `https://your-app-url/config.js`.

## Support

For additional help, check the diagnostics page at `/diagnostics` which provides real-time configuration status and troubleshooting steps.

## Your Current Credentials

```
VITE_SUPABASE_URL=https://jcaygvhmjukkxgpfkmgk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYXlndmhtanVra3hncGZrbWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjUwNTYsImV4cCI6MjA3NTQwMTA1Nn0.pKnCk6OriQ7KjcfqHt3O6jO75uR5ykhNo1hK5wcoXug
```

Use these in your OpenShift configuration.
