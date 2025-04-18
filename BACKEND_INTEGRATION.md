 # Backend Integration Guide

This document explains how to connect this frontend application with your backend server.

## Backend API Requirements

The frontend is set up to work with a RESTful API backend that exposes the following endpoints:

### Authentication Endpoints
- `POST /api/auth/login` - For user login
- `POST /api/auth/register` - For user registration
- `POST /api/auth/logout` - For user logout

### Vehicle Endpoints
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get a single vehicle by ID
- `POST /api/demo-rides` - Request a demo ride
- `POST /api/quotes` - Request a price quote

### User/Profile Endpoints
- `GET /api/customers/profile` - Get current customer profile
- `PUT /api/customers/profile` - Update customer profile
- `GET /api/dealers/dashboard` - Get dealer dashboard statistics
- `GET /api/dealers/inventory` - Get dealer inventory
- `PUT /api/dealers/inventory` - Update dealer inventory
- `GET /api/admin/dealers` - Admin endpoint to get all dealers
- `GET /api/admin/customers` - Admin endpoint to get all customers

## API Response Format

The frontend expects API responses in the following format:

### Authentication Responses
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "customer" // or "dealer" or "admin"
  }
}
```

### Vehicle Responses
```json
[
  {
    "id": "vehicle-id",
    "name": "Vehicle Name",
    "price": "₹10.89 - 19.65 Lakh",
    "image": "/vehicle-image-url.jpg",
    "features": ["Feature 1", "Feature 2"],
    "specifications": {
      "Engine": "1.5L Turbocharged",
      "Transmission": "7-Speed DCT",
      "Fuel Type": "Petrol"
    }
  }
]
```

## Configuration

1. Update the API base URL in `lib/apiClient.ts`:
   ```typescript
   const API_BASE_URL = '/api'; // This uses the Next.js proxy
   ```

2. Configure the API proxy in `v0-user-next.config.mjs`:
   ```javascript
   async rewrites() {
     return [
       {
         source: '/api/:path*',
         destination: 'http://your-backend-url/api/:path*', // Replace with your actual backend URL
       },
     ];
   }
   ```

## Authentication Flow

The frontend handles authentication through:

1. The `AuthProvider` in `lib/auth-context.tsx` which manages user sessions
2. JWT tokens stored in localStorage
3. Protected routes using the `ProtectedRoute` component

## Testing the Integration

1. Start your backend server
2. Update the API URL configuration as explained above
3. Start the frontend with `npm run dev`
4. Test the login functionality
5. Test fetching vehicles and other data from the backend

## Common Issues

### CORS Issues
If you encounter CORS issues, make sure your backend allows requests from your frontend origin or use the Next.js API proxy configuration.

### Authentication Issues
- Check that your backend returns tokens in the expected format
- Ensure that protected routes in the backend validate tokens correctly

### Data Format Issues
- Make sure your backend API responses match the expected data structures
- Check the console for fetch errors if data isn't loading correctly

## Next Steps

1. Complete the implementation of form submissions
2. Add real-time notifications for updates
3. Implement file uploads for vehicle images
4. Add error boundaries and fallback UI for API failures