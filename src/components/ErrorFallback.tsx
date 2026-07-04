import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title,
  message = "We're having trouble loading this content right now.",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-orange-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
        {message}
      </p>

      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export const SectionErrorFallback: React.FC<{ sectionName: string }> = ({ sectionName }) => {
  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-6 text-center">
          <AlertCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
          <p className="text-sm text-orange-700 dark:text-orange-300">
            Unable to load {sectionName} at the moment. Please refresh the page to try again.
          </p>
        </div>
      </div>
    </div>
  );
};