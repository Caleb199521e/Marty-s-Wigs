# Cloudinary Setup Guide

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service. It allows you to:
- Upload images from your admin dashboard
- Automatically optimize images for web
- Store unlimited images (free tier: 25GB storage, 25GB bandwidth/month)
- Generate thumbnails and transformations
- Deliver images via CDN (fast loading worldwide)

---

## Step 1: Create Free Cloudinary Account

1. **Go to Cloudinary website**
   - Visit: [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)

2. **Sign up with:**
   - Email address
   - Or Google account (easier)
   - Or GitHub account

3. **Fill in the form:**
   - Name: Your name
   - Email: Your email
   - Password: Choose a strong password
   - Purpose: Select "Developer" or "Personal Project"

4. **Verify your email**
   - Check your inbox for verification email
   - Click the verification link

---

## Step 2: Get Your Cloudinary Credentials

Once logged in, you'll see your **Dashboard**.

### Find Your Credentials:

1. **Go to Dashboard** (automatic after login)
   
2. **Look for "Product Environment Credentials"** section
   
3. **Copy these three values:**

   ```
   Cloud Name: your_cloud_name_here
   API Key: 123456789012345
   API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz
   ```

   **Example Screenshot Location:**
   ```
   Product Environment Credentials
   ┌─────────────────────────────────────┐
   │ Cloud name: democloud123            │
   │ API Key:    987654321098765         │
   │ API Secret: ●●●●●●●●●●●●●●● [Show]  │ ← Click "Show"
   └─────────────────────────────────────┘
   ```

4. **Click "Show" next to API Secret** to reveal it

---

## Step 3: Add Credentials to Your Project

### Open your `.env` file:

Location: `backend/.env`

### Replace these lines:

```bash
# Before (empty):
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# After (with your actual values):
CLOUDINARY_CLOUD_NAME=democloud123
CLOUDINARY_API_KEY=987654321098765
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

### ⚠️ Important:
- **NO spaces** around the `=` sign
- **NO quotes** around the values
- Keep these credentials **SECRET** (never share publicly)

---

## Step 4: Test Cloudinary Integration

### 1. Save the `.env` file

### 2. Restart your backend server:

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### 3. Look for success message:

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5001
```

If Cloudinary is configured correctly, you **won't** see:
```
⚠️  Cloudinary not configured. Using local storage.
```

---

## Step 5: Set Up Upload Folder (Optional but Recommended)

### Create a dedicated folder in Cloudinary:

1. **Go to Media Library** in Cloudinary dashboard
   - Click "Media Library" in left sidebar

2. **Create folder structure:**
   ```
   martys-wigs/
   ├── gallery/
   ├── testimonials/
   └── hero/
   ```

3. **No code changes needed** - the middleware already uses `martys-wigs` folder

---

## Step 6: Configure Upload Presets (Optional)

For more control over uploads:

1. **Go to Settings** → **Upload**

2. **Scroll to "Upload presets"**

3. **Click "Add upload preset"**

4. **Configure:**
   - Preset name: `martys-wigs-preset`
   - Folder: `martys-wigs`
   - Format: `jpg, png, webp`
   - Quality: Auto
   - Max file size: 5 MB

5. **Save**

---

## Troubleshooting

### Error: "Invalid cloud_name"
**Solution:** Check that `CLOUDINARY_CLOUD_NAME` matches exactly from dashboard

### Error: "Invalid API credentials"
**Solution:** 
- Make sure you copied the full API Secret (it's long!)
- Remove any extra spaces
- Check for typos

### Images not uploading
**Solution:**
- Verify all three credentials are set
- Restart backend server
- Check free tier limits (25GB storage)

### Still using local storage
**Solution:**
- Make sure `.env` file is in `backend/` folder (not root)
- Credentials must have NO quotes: `CLOUDINARY_CLOUD_NAME=mycloud` ✅
- Not: `CLOUDINARY_CLOUD_NAME="mycloud"` ❌

---

## Free Tier Limits

Cloudinary Free Plan includes:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth per month
- ✅ 25 credits per month
- ✅ Unlimited transformations
- ✅ CDN delivery worldwide

**This is more than enough for starting out!**

---

## Testing Image Upload

Once configured, you can test by:

1. **Using Postman/Thunder Client:**
   ```
   POST http://localhost:5001/api/gallery
   Headers:
     Authorization: Bearer YOUR_JWT_TOKEN
   Body: form-data
     title: Test Image
     category: wigs
     image: [select file]
   ```

2. **Or wait for Admin Dashboard** (Phase 3 of project)
   - You'll have a visual interface to upload images
   - Drag and drop functionality
   - Preview before uploading

---

## Security Best Practices

### ✅ DO:
- Keep credentials in `.env` file only
- Add `.env` to `.gitignore` (already done)
- Use environment variables in production
- Regenerate API Secret if accidentally exposed

### ❌ DON'T:
- Commit `.env` to GitHub
- Share credentials publicly
- Hardcode credentials in source files
- Use production credentials in development

---

## Alternative: Skip Cloudinary for Now

If you want to start without Cloudinary:

1. **Leave `.env` credentials empty**
2. **Images will save locally** to `backend/uploads/` folder
3. **You can add Cloudinary later** without code changes

**Note:** Local storage means:
- Images stored on your computer
- No CDN (slower loading)
- Images lost if you change servers
- Not recommended for production

---

## Next Steps

After configuring Cloudinary:

1. ✅ Restart backend server
2. ✅ Verify no warning messages
3. ✅ Continue to Phase 3: Admin Dashboard
4. ✅ Test image uploads through admin interface

---

## Need Help?

**Common Issues:**

| Problem | Solution |
|---------|----------|
| Can't find credentials | Go to Dashboard → Look for "Product Environment" |
| API Secret hidden | Click "Show" button next to it |
| Forgot password | Use "Forgot Password" on login page |
| Account verification email not received | Check spam folder |

**Cloudinary Support:**
- Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Support: [https://support.cloudinary.com](https://support.cloudinary.com)

---

**Last Updated:** December 2024
