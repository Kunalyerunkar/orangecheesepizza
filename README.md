# Orange Cheese Pizza - Food Ordering Website

A full-stack MERN application for ordering food from Orange Cheese Pizza restaurant.

## Features

- Responsive design for both desktop and mobile views
- User authentication with Clerk
- Food menu with categories
- Food customization options
- Shopping cart functionality
- Order placement and tracking
- User profile management
- Admin panel for managing food items, orders, and users
- Cloudinary integration for image storage

## Tech Stack

### Frontend

- React.js with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management
- React Router for navigation
- Clerk for authentication

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for API authentication
- Cloudinary for image storage
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account
- Clerk account

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/orangecheesepizza.git
cd orangecheesepizza
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Set up environment variables:

For backend (.env file in backend folder):

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

For frontend (.env file in frontend folder):

```
VITE_API_URL=http://localhost:8000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

5. Run the application:

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

## Project Structure

### Backend

- `models/` - MongoDB models
- `controllers/` - API controllers
- `routes/` - API routes
- `middleware/` - Custom middleware
- `server.js` - Entry point

### Frontend

- `src/components/` - Reusable React components
- `src/pages/` - Page components
- `src/types/` - TypeScript interfaces
- `src/api/` - API service functions
- `src/store/` - State management
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions

## License

MIT

## Acknowledgements

- Created by [Your Name]
- Design inspiration from [orangecheesepizza.com](https://orangecheesepizza.com)
