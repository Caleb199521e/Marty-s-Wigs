# 💇‍♀️ Marty's Wigs & Makeover

A modern, full-stack web application for a professional wig styling and makeup service business.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Frontend
- ✨ Modern, responsive design
- 📱 Mobile-first approach
- 🎨 Beautiful animations and transitions
- 🖼️ Interactive gallery with filtering
- 📅 Booking form with validation
- ⭐ Customer testimonials
- 🎯 SEO optimized
- ♿ Accessibility compliant

### Backend
- 🔐 Secure admin authentication
- 📊 MongoDB database
- 🖼️ Cloudinary image management
- 🔄 RESTful API
- 📝 CRUD operations for all content
- 📧 Booking management system

### Admin Dashboard (Coming Soon)
- 📸 Gallery management
- 💼 Services management
- 💬 Testimonials approval
- 📅 Booking calendar
- ⚙️ Site settings

## 🛠️ Technology Stack

### Frontend
- HTML5
- Tailwind CSS
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary
- JWT Authentication
- Multer (file uploads)

## 📁 Project Structure

```
Marty's Wigs/
├── index.html              # Main frontend file
├── backend/                # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   └── .env.example       # Environment template
├── admin/                 # Admin dashboard (coming soon)
├── .gitignore            # Git ignore rules
├── TODO.md               # Project tracking
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Cloudinary account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/martys-wigs.git
   cd martys-wigs
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start Backend Server**
   ```bash
   npm run dev
   ```

5. **Open Frontend**
   - Open `index.html` in your browser
   - Or use a local server like Live Server (VS Code extension)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@martyswigs.com
ADMIN_PASSWORD=your_secure_password
FRONTEND_URL=http://localhost:3000
```

### MongoDB Setup

**Option 1: MongoDB Atlas (Recommended)**
1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user
4. Whitelist your IP address
5. Get connection string

**Option 2: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/martys-wigs`

### Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Add to `.env` file

## 📚 API Documentation

### Public Endpoints

```
GET    /api/gallery              # Get all gallery items
GET    /api/gallery/featured     # Get featured items
GET    /api/services             # Get all services
GET    /api/testimonials         # Get approved testimonials
GET    /api/settings             # Get site settings
POST   /api/bookings             # Create new booking
```

### Admin Endpoints (Require Authentication)

```
POST   /api/auth/login           # Admin login
POST   /api/gallery              # Create gallery item
PUT    /api/gallery/:id          # Update gallery item
DELETE /api/gallery/:id          # Delete gallery item
# Similar CRUD for services, testimonials, settings
```

## 🧪 Testing

```bash
# Test API endpoints
npm test

# Or use Postman/Thunder Client
```

## 📦 Deployment

### Backend (Render/Railway/Heroku)
1. Create account on hosting platform
2. Connect GitHub repository
3. Add environment variables
4. Deploy

### Frontend (Netlify/Vercel)
1. Create account
2. Connect repository
3. Configure build settings
4. Deploy

## 🤝 Contributing

This is a private client project. For any questions or suggestions, please contact the developer.

## 📄 License

This project is proprietary and confidential.

## 📞 Contact

**Client**: Marty's Wigs & Makeover
- Instagram: [@Martys_Makeover](https://instagram.com/@Martys_Makeover)
- TikTok: [@Martys_wig_and_makeover7](https://tiktok.com/@Martys_wig_and_makeover7)

**Developer**: [Your Name]
- Email: [Your Email]
- GitHub: [Your GitHub]

## 🎯 Current Status

🟡 **In Progress** - Phase 2: Backend Setup

See [TODO.md](./TODO.md) for detailed progress tracking.

## 📝 Notes

- Always keep `.env` files secure and never commit them
- Images are stored on Cloudinary, not in repository
- Database credentials should be kept private
- Regular backups recommended before major updates

---

**Last Updated**: December 2024
