# DRM Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Frontend Integration Guide](#frontend-integration-guide)
7. [Token Management](#token-management)

---

## Overview

The DRM (Disaster Response Management) Backend API is built with Django REST Framework and provides authentication endpoints for user registration, login, logout, and Google OAuth integration.

### Features
- JWT-based authentication using `djangorestframework-simplejwt`
- User registration with role-based access (Citizen/Organization)
- Email/password authentication
- Google OAuth integration
- Token refresh and blacklisting
- CORS enabled for frontend integration

### Technology Stack
- **Framework**: Django 5.2.11
- **API**: Django REST Framework 3.16.1
- **Authentication**: djangorestframework-simplejwt 5.5.1
- **Documentation**: drf-spectacular (Swagger UI)

---

## Base URL

```
Development: http://localhost:8000
Production: https://your-domain.com
```

All API endpoints are prefixed with `/api/auth/`

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. There are two types of tokens:

1. **Access Token**: Short-lived (60 minutes), used for authenticated requests
2. **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### Authentication Flow

1. User registers/logs in → Receives `access` and `refresh` tokens
2. Include `access` token in request headers: `Authorization: Bearer <access_token>`
3. When access token expires → Use `refresh` token to get a new access token
4. On logout → Blacklist the refresh token

---

## API Endpoints

### 1. Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register/`

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "citizen"  // Optional: "citizen" (default) or "organization"
}
```

**Request Headers**:
```
Content-Type: application/json
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "email": "john@example.com",
    "role": "citizen",
    "username": "johndoe"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "email": ["This field is required."],
  "password": ["This field is required."]
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "citizen"
  }'
```

---

### 2. Login

Authenticate user and receive JWT tokens.

**Endpoint**: `POST /api/auth/login/`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Error Responses**:

401 Unauthorized (Invalid credentials):
```json
{
  "error": "Invalid credentials"
}
```

400 Bad Request (Missing fields):
```json
{
  "error": "Email and password are required"
}
```

400 Bad Request (Google user):
```json
{
  "error": "This account uses Google Login. Please sign in with Google."
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

---

### 3. Refresh Token

Obtain a new access token using a refresh token.

**Endpoint**: `POST /api/auth/refresh-token/`

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Error Response** (401 Unauthorized):
```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/api/auth/refresh-token/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "your_refresh_token_here"
  }'
```

---

### 4. Logout

Blacklist the refresh token to invalidate the session.

**Endpoint**: `POST /api/auth/logout/`

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response** (200 OK):
```json
{
  "detail": "Successfully logged out."
}
```

**Error Response** (400 Bad Request):
```json
{
  "refresh": ["This field is required."]
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "your_refresh_token_here"
  }'
```

---

### 5. Google OAuth Authentication

Authenticate using Google OAuth ID token.

**Endpoint**: `POST /api/auth/google-auth/`

**Request Body**:
```json
{
  "id_token": "google_id_token_here",
  "role": "citizen"  // Optional: "citizen" (default) or "organization"
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "email": "user@gmail.com",
    "role": "citizen",
    "username": "John Doe"
  },
  "is_new_user": true
}
```

**Error Responses**:

400 Bad Request (Missing token):
```json
{
  "error": "Google ID token is required"
}
```

400 Bad Request (Invalid token):
```json
{
  "error": "Invalid Google token"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/api/auth/google-auth/ \
  -H "Content-Type: application/json" \
  -d '{
    "id_token": "google_id_token_from_frontend",
    "role": "citizen"
  }'
```

---

## Error Handling

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid credentials
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message here"
}
```

Or for validation errors:

```json
{
  "field_name": ["Error message for this field"]
}
```

---

## Frontend Integration Guide

### 1. Setup

#### Install Dependencies

```bash
npm install axios  # or your preferred HTTP client
```

#### Create API Service

Create `src/services/api.js` (or `api.ts` for TypeScript):

```javascript
import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Try to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token/`,
          { refresh: refreshToken }
        )

        const { access } = response.data
        localStorage.setItem('access_token', access)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
```

### 2. Authentication Service

Create `src/services/auth.js`:

```javascript
import api from './api'

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/register/', userData)
    const { access, refresh, user } = response.data
    
    // Store tokens
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(user))
    
    return { access, refresh, user }
  },

  // Login user
  async login(email, password) {
    const response = await api.post('/login/', { email, password })
    const { access, refresh } = response.data
    
    // Store tokens
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    
    return { access, refresh }
  },

  // Logout user
  async logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (refreshToken) {
      try {
        await api.post('/logout/', { refresh: refreshToken })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    
    // Clear local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  // Refresh access token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await api.post('/refresh-token/', {
      refresh: refreshToken,
    })
    
    const { access } = response.data
    localStorage.setItem('access_token', access)
    
    return access
  },

  // Google OAuth login
  async googleAuth(idToken, role = 'citizen') {
    const response = await api.post('/google-auth/', {
      id_token: idToken,
      role,
    })
    
    const { access, refresh, user, is_new_user } = response.data
    
    // Store tokens
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(user))
    
    return { access, refresh, user, is_new_user }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}
```

### 3. React Components Example

#### Login Component

```jsx
import React, { useState } from 'react'
import { authService } from '../services/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.login(email, password)
      // Redirect to dashboard or home
      window.location.href = '/dashboard'
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default Login
```

#### Register Component

```jsx
import React, { useState } from 'react'
import { authService } from '../services/auth'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'citizen',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.register(formData)
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (err) {
      if (err.response?.data) {
        // Handle validation errors
        const errors = Object.values(err.response.data).flat()
        setError(errors.join(', '))
      } else {
        setError('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="citizen">Citizen</option>
        <option value="organization">Organization</option>
      </select>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

export default Register
```

#### Google OAuth Component

```jsx
import React from 'react'
import { authService } from '../services/auth'

function GoogleLogin() {
  const handleGoogleLogin = async () => {
    try {
      // Initialize Google Sign-In (using Google Identity Services)
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      })

      window.google.accounts.id.prompt()
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  const handleCredentialResponse = async (response) => {
    try {
      const { access, refresh, user, is_new_user } = await authService.googleAuth(
        response.credential
      )
      
      if (is_new_user) {
        // Handle new user flow
        console.log('New user registered:', user)
      }
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Google auth error:', error)
    }
  }

  return (
    <button onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  )
}

export default GoogleLogin
```

### 4. Protected Route Example

```jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { authService } from '../services/auth'

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
```

### 5. Making Authenticated Requests

```jsx
import React, { useEffect, useState } from 'react'
import api from '../services/api'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // The api instance automatically adds the Authorization header
        const response = await api.get('/some-protected-endpoint/')
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return <div>{/* Render your data */}</div>
}
```

---

## Token Management

### Token Storage

Store tokens securely:
- **Local Storage**: Simple but less secure (XSS vulnerable)
- **HttpOnly Cookies**: More secure (recommended for production)
- **Memory**: Most secure but lost on page refresh

### Token Expiration

- **Access Token**: 60 minutes
- **Refresh Token**: 7 days

### Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely** (consider HttpOnly cookies)
3. **Implement automatic token refresh** before expiration
4. **Handle token refresh failures** gracefully
5. **Clear tokens on logout**
6. **Validate tokens on the frontend** before making requests

### Token Refresh Strategy

```javascript
// Refresh token 5 minutes before expiration
const REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes in milliseconds

setInterval(async () => {
  const token = localStorage.getItem('access_token')
  if (token) {
    try {
      // Decode token to check expiration (using jwt-decode library)
      const decoded = jwt_decode(token)
      const expirationTime = decoded.exp * 1000
      const now = Date.now()
      
      if (expirationTime - now < REFRESH_THRESHOLD) {
        await authService.refreshToken()
      }
    } catch (error) {
      console.error('Token refresh error:', error)
    }
  }
}, 60000) // Check every minute
```

---

## API Documentation (Swagger)

Interactive API documentation is available at:

```
http://localhost:8000/api/docs/
```

This provides a Swagger UI interface where you can:
- View all available endpoints
- Test API calls directly
- See request/response schemas
- Understand authentication requirements

---

## Environment Variables

Required environment variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
GOOGLE_CLIENT_ID=your-google-client-id
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## Support

For issues or questions:
1. Check the Swagger documentation at `/api/docs/`
2. Review error messages in API responses
3. Check server logs for detailed error information

---

## Changelog

### Version 1.0.0
- Initial release
- User registration and login
- JWT authentication
- Google OAuth integration
- Token refresh and logout
