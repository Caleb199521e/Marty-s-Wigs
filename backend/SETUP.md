# Backend Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

Run this command in the `backend` folder:

```bash
npm install
```

If you get errors, try:

```bash
npm install --legacy-peer-deps
```

### 2. Install MongoDB

**Option A: MongoDB Atlas (Recommended - Free & Cloud-based)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Click "Build a Database" → Choose "Free" (M0)
4. Select your region (closest to you)
5. Create cluster (wait 3-5 minutes)
6. Create database user:
   - Click "Database Access" → "Add New Database User"
   - Username: `admin`
   - Password: Choose a strong password (save it!)
7. Whitelist your IP:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm
8. Get connection string:
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

**Option B: Local MongoDB**

1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Use connection string: `mongodb://localhost:27017/martys-wigs`

### 3. Setup Cloudinary (Optional - for image uploads)

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard
4. Copy these values:
   - Cloud Name
   - API Key
   - API Secret
5. Add to `.env` file

**Note:** If you skip Cloudinary, images will be stored locally in `uploads/` folder.

### 4. Configure Environment Variables

Edit `.env` file in the `backend` folder:

```env
# Use your MongoDB connection string
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/martys-wigs

# Change this to a random secret string
JWT_SECRET=your_random_secret_string_here_make_it_long_and_random

# Add Cloudinary credentials (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Set admin login credentials
ADMIN_EMAIL=admin@martyswigs.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### 5. Create Uploads Folder (if not using Cloudinary)

```bash
mkdir uploads
```

### 6. Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### 7. Test the API

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"OK","message":"Server is running"}
```

## Troubleshooting

### Error: Cannot find module 'multer-storage-cloudinary'

**Solution:**
```bash
npm install multer-storage-cloudinary
```

### Error: MongooseServerSelectionError

**Possible causes:**
1. MongoDB is not running (if using local)
2. Wrong connection string
3. IP not whitelisted (if using Atlas)
4. Incorrect username/password

**Solution:**
- Check your `MONGODB_URI` in `.env`
- Make sure MongoDB Atlas allows your IP
- Verify username and password are correct

### Error: EADDRINUSE (Port already in use)

**Solution:**
- Change PORT in `.env` to a different number (e.g., 5001)
- Or kill the process using port 5000

### Cloudinary not working

**Solution:**
- Make sure all three Cloudinary variables are set in `.env`
- Verify credentials on Cloudinary dashboard
- If still not working, server will use local storage automatically

## Next Steps

1. ✅ Backend is running
2. 📝 Update frontend `API_BASE_URL` to `http://localhost:5000/api`
3. 🎨 Start building admin dashboard
4. 📊 Add sample data to database
5. 🚀 Deploy to production

## Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# View logs
# Check terminal where server is running

# Stop server
# Press Ctrl+C in terminal
```

## Important Notes

- ⚠️ Never commit `.env` file to GitHub
- 🔒 Change default admin password before deploying
- 💾 Always backup your database before major changes
- 📧 Setup email service for booking notifications (future task)
