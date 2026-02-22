import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tight">
          404
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Page not found
        </p>
        <p className="mt-4 text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </main>
  )
}
