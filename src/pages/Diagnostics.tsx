import { CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
import { getConfig } from '../lib/config';

export default function Diagnostics() {
  const config = getConfig();
  const envVars = import.meta.env;

  const checks = [
    {
      name: 'Supabase URL',
      status: Boolean(config.supabaseUrl),
      value: config.supabaseUrl || 'Not set',
      required: true,
    },
    {
      name: 'Supabase Anon Key',
      status: Boolean(config.supabaseAnonKey),
      value: config.supabaseAnonKey
        ? `${config.supabaseAnonKey.substring(0, 20)}...`
        : 'Not set',
      required: true,
    },
    {
      name: 'Configuration Source',
      status: config.isConfigured,
      value: config.source,
      required: false,
    },
  ];

  const allPassed = checks.filter((c) => c.required).every((c) => c.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-center mb-8">
          <Shield className="w-12 h-12 text-blue-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">System Diagnostics</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
          <div className="flex items-center mb-6">
            {allPassed ? (
              <>
                <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    All Systems Operational
                  </h2>
                  <p className="text-slate-300">
                    Your application is properly configured
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-400 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Configuration Issues Detected
                  </h2>
                  <p className="text-slate-300">
                    Some required configuration is missing
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            {checks.map((check) => (
              <div
                key={check.name}
                className="bg-black/20 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1">
                    {check.status ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">
                          {check.name}
                        </h3>
                        {check.required && (
                          <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mt-1 break-all">
                        {check.value}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 mr-3" />
            <h2 className="text-xl font-bold text-white">
              Environment Variables
            </h2>
          </div>
          <div className="bg-black/20 rounded-lg p-4 border border-white/10">
            <pre className="text-slate-300 text-sm overflow-auto">
              {JSON.stringify(
                Object.keys(envVars).reduce((acc: Record<string, string>, key) => {
                  acc[key] = key.includes('KEY') || key.includes('SECRET')
                    ? '[REDACTED]'
                    : String(envVars[key]);
                  return acc;
                }, {}),
                null,
                2
              )}
            </pre>
          </div>
        </div>

        {!allPassed && (
          <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30">
            <h2 className="text-xl font-bold text-white mb-4">
              How to Fix Configuration Issues
            </h2>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  Option 1: Build-time Configuration (Recommended)
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    Set environment variables in your OpenShift Build Config or
                    CI/CD pipeline:
                    <pre className="bg-black/30 rounded p-2 mt-2 text-sm">
                      VITE_SUPABASE_URL=https://your-project.supabase.co{'\n'}
                      VITE_SUPABASE_ANON_KEY=your-anon-key
                    </pre>
                  </li>
                  <li>Rebuild your application with these variables set</li>
                  <li>Deploy the new build</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">
                  Option 2: Runtime Configuration
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    Edit the <code className="bg-black/30 px-2 py-1 rounded">/config.js</code> file in your deployment
                  </li>
                  <li>
                    Add your Supabase credentials:
                    <pre className="bg-black/30 rounded p-2 mt-2 text-sm">
{`window.APP_CONFIG = {
  VITE_SUPABASE_URL: 'https://your-project.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'your-anon-key'
};`}
                    </pre>
                  </li>
                  <li>Restart your application</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
