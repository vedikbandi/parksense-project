import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl border border-gray-200 p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          aria-label="Retry connection to backend"
        >
          <RefreshCw className="w-5 h-5" />
          Retry Connection
        </button>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 font-semibold mb-3">
            🔧 Troubleshooting Steps:
          </p>
          <ul className="mt-2 text-sm text-gray-600 text-left space-y-2 bg-gray-50 rounded-lg p-4">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">1.</span>
              <span>Ensure FastAPI backend is running on port 8000</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">2.</span>
              <span>Check <code className="bg-white px-2 py-0.5 rounded text-xs border border-gray-300">NEXT_PUBLIC_API_URL</code> in .env.local</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">3.</span>
              <span>Verify CORS settings in backend/main.py</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-2">4.</span>
              <span>Run: <code className="bg-white px-2 py-0.5 rounded text-xs border border-gray-300 font-mono">python backend/main.py</code></span>
            </li>
          </ul>
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          🚦 Bangalore Traffic Police • Gridlock Hackathon 2.0
        </div>
      </div>
    </div>
  );
}