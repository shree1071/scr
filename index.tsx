import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ErrorMessage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-red-200">
      <div className="text-center">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Configuration Error</h1>
        <p className="text-slate-600 mb-6">
          Missing Clerk Publishable Key. Please set <code className="bg-slate-100 px-2 py-1 rounded text-sm">VITE_CLERK_PUBLISHABLE_KEY</code> in your <code className="bg-slate-100 px-2 py-1 rounded text-sm">.env.local</code> file.
        </p>
        <div className="bg-slate-50 rounded p-4 text-left">
          <p className="text-sm font-semibold text-slate-700 mb-2">Create a <code>.env.local</code> file in the root directory with:</p>
          <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded overflow-x-auto">
            VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key-here
          </pre>
        </div>
      </div>
    </div>
  </div>
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

if (!PUBLISHABLE_KEY) {
  root.render(
    <React.StrictMode>
      <ErrorMessage />
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}