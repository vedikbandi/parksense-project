interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading data...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50" role="status" aria-live="polite">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-blue-600"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-12 w-12 rounded-full bg-blue-100"></div>
        </div>
      </div>
      <p className="mt-6 text-lg text-gray-700 font-medium" aria-label={message}>
        {message}
      </p>
      <div className="mt-2 flex space-x-1" aria-hidden="true">
        <div 
          className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" 
          style={{ animationDelay: '150ms' }}
        ></div>
        <div 
          className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" 
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
      <span className="sr-only">{message}</span>
    </div>
  );
}