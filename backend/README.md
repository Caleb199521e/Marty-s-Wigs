# Marty's Wigs & Makeover - Backend API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update MongoDB connection string
   - Add Cloudinary credentials (sign up at cloudinary.com)
   - Set JWT secret and admin credentials

3. **Start Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Public Endpoints
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/featured` - Get featured items
- `GET /api/services` - Get all services
- `GET /api/testimonials` - Get approved testimonials
- `GET /api/settings` - Get site settings
- `POST /api/bookings` - Create booking

### Admin Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/gallery` - Create gallery item
- `PUT /api/gallery/:id` - Update gallery item
- `DELETE /api/gallery/:id` - Delete gallery item
- Similar CRUD for services, testimonials, bookings, settings

## Database Setup

The application will automatically create collections on first run. 

For MongoDB Atlas (recommended):
1. Create account at mongodb.com
2. Create a cluster
3. Add database user
4. Whitelist your IP
5. Get connection string

## Image Upload

Images are stored on Cloudinary. Sign up for free account at cloudinary.com
