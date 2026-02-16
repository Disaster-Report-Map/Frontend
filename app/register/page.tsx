import React from 'react'
import RegisterForm from '../../components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Create account</h2>
        <RegisterForm />
      </div>
    </div>
  )
}
