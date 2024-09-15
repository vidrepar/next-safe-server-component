import { CustomError } from "./custom-error";

export class ForbiddenError extends CustomError {
  digest: string = `ForbiddenError;${this.message}`;
  constructor(message: string = 'Forbidden') {
    super(message);
  }

  render(reset?: () => void) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">403 Forbidden</h1>
          <p className="text-xl text-gray-600">{this.message || 'Unknown error'}</p>
          {reset ? <button onClick={reset} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Try again</button> : null}
        </div>
      </div>
    );
  }
}

export class TooManyRequestsError extends CustomError {
  digest: string = `TooManyRequestsError;${this.message}`;
  constructor(message: string = 'Too Many Requests') {
    super(message);
  }

  render(reset?: () => void) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">429 Too Many Requests</h1>
          <p className="text-xl text-gray-600">{this.message || 'Unknown error'}</p>
          {reset ? <button onClick={reset} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Try again</button> : null}
        </div>
      </div>
    );
  }
}

export class MiddlewareNextNotCalledError extends CustomError {
  digest: string = `MiddlewareNextNotCalledError;${this.message}`;
  constructor(message: string = 'Middleware next() not called') {
    super(message);
  }

  render(reset?: () => void) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Middleware next() not called</h1>
          <p className="text-xl text-gray-600">{this.message || 'Unknown error'}</p>
          {reset ? <button onClick={reset} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Try again</button> : null}
        </div>
      </div>
    );
  }
}

export class ComponentNotSetError extends CustomError {
  digest: string = `ComponentNotSetError;${this.message}`;
  constructor(message: string = 'Component not set') {
    super(message);
  }

  render(reset?: () => void) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Component not set</h1>
          <p className="text-xl text-gray-600">{this.message || 'Unknown error'}</p>
          {reset ? <button onClick={reset} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Try again</button> : null}
        </div>
      </div>
    );
  }
}


