import React from 'react';
import { ComponentNotSetError, ForbiddenError, MiddlewareNextNotCalledError, TooManyRequestsError } from '../errors';

interface ErrorFallbackProps {
  error: Error;
}

const gradientStyles = {
  forbidden: 'bg-gradient-to-r from-red-500 to-orange-500',
  tooManyRequests: 'bg-gradient-to-r from-yellow-400 to-orange-500',
  middlewareNextNotCalled: 'bg-gradient-to-r from-red-500 to-orange-500',
  componentNotSet: 'bg-gradient-to-r from-red-500 to-orange-500',
  default: 'bg-gradient-to-r from-blue-500 to-purple-500',
};

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  let title: string;
  let gradientStyle: string;

  if (error instanceof ForbiddenError) {
    title = '403 Forbidden';
    gradientStyle = gradientStyles.forbidden;
  } else if (error instanceof TooManyRequestsError) {
    title = '429 Too Many Requests';
    gradientStyle = gradientStyles.tooManyRequests;
  } else if (error instanceof MiddlewareNextNotCalledError) {
    title = 'Middleware next() not called';
    gradientStyle = gradientStyles.middlewareNextNotCalled;
  } else if (error instanceof ComponentNotSetError) {
    title = 'Component not set';
    gradientStyle = gradientStyles.componentNotSet;
  } else {
    title = 'An error occurred';
    gradientStyle = gradientStyles.default;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${gradientStyle}`}>
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{title}</h1>
        <p className="text-xl text-gray-600">{error.message || 'Unknown error'}</p>
      </div>
    </div>
  );
};

export default ErrorFallback;