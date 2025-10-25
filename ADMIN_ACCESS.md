# Admin Dashboard Access Guide

## 🔗 Admin URLs

### Login Page
```
http://127.0.0.1:5500/admin/login.html
```

### Dashboard (after login)
```
http://127.0.0.1:5500/admin/dashboard.html
```

### All Admin Pages
```
http://127.0.0.1:5500/admin/login.html       - Login
http://127.0.0.1:5500/admin/dashboard.html   - Dashboard Overview
http://127.0.0.1:5500/admin/gallery.html     - Gallery Management
http://127.0.0.1:5500/admin/bookings.html    - Bookings Management
http://127.0.0.1:5500/admin/services.html    - Services Management
http://127.0.0.1:5500/admin/testimonials.html - Testimonials Management
http://127.0.0.1:5500/admin/settings.html    - Website Settings
```

---

## 🔑 Login Credentials

**Default Admin Account:**
- Email: `admin@martyswigs.com`
- Password: `ChangeThisPassword123!`

⚠️ **Change these credentials in production!**

Edit in: `backend/.env`

---

## ✅ Pre-Access Checklist

Before accessing admin dashboard:

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] You see "✅ MongoDB Connected" in terminal
- [ ] You see "🚀 Server running on port 5001"
- [ ] Live Server is running (for frontend)
- [ ] You're using the correct URL (http://127.0.0.1:5500)

---

## 🚨 Troubleshooting

### "Cannot connect to server"
**Cause:** Backend not running  
**Solution:** 
```bash
cd backend
npm run dev
```

### "Invalid credentials"
**Cause:** Wrong email or password  
**Solution:** 
- Check `backend/.env` for correct credentials
- Default: `admin@martyswigs.com` / `ChangeThisPassword123!`

### "Session expired"
**Cause:** JWT token expired  
**Solution:** 
- Logout and login again
- Token lasts 24 hours

### "404 Not Found"
**Cause:** Wrong URL or Live Server not running  
**Solution:**
- Make sure Live Server is running
- Check URL is `http://127.0.0.1:5500/admin/login.html`

### Page loads but features don't work
**Cause:** API connection issue  
**Solution:**
- Check backend is running on port 5001
- Check `admin/js/admin.js` has `API_BASE_URL = 'http://localhost:5001/api'`
- Check browser console (F12) for errors

---

## 🎯 Quick Start (Step by Step)

### 1. Start Backend
```bash
cd c:\Users\Quo Bena\Desktop\Projects\Marty's Wigs\backend
npm run dev
```

### 2. Start Frontend
- Open VS Code
- Right-click `index.html`
- Select "Open with Live Server"

### 3. Access Admin
- Go to: http://127.0.0.1:5500/admin/login.html
- Login with credentials above

### 4. Start Managing!
- Upload images
- Manage bookings
- Update services
- And more!

---

## 📱 Admin Dashboard Features

### ✅ What You Can Do:

| Page | Features |
|------|----------|
| **Dashboard** | View stats, recent bookings, quick actions |
| **Gallery** | Upload images, organize by category, delete images |
| **Bookings** | View all bookings, update status, filter by date |
| **Services** | Add/edit services, set pricing, manage features |
| **Testimonials** | Approve reviews, add client photos, mark as featured |
| **Settings** | Update contact info, social links, business hours |

---

## 🔐 Security Notes

### ⚠️ IMPORTANT:

1. **Change default password** before going live
2. **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
3. **Never share credentials** publicly
4. **Logout when done** on shared computers
5. **Use HTTPS** in production

### Change Admin Password:

Edit `backend/.env`:
```env
ADMIN_EMAIL=your-secure-email@domain.com
ADMIN_PASSWORD=YourV3ry$tr0ngP@ssw0rd!
```

Then restart backend:
```bash
npm run dev
```

---

## 📞 Need Help?

If you can't access the admin dashboard:

1. Check backend terminal for errors
2. Check browser console (F12) for errors
3. Verify all credentials are correct
4. Make sure both frontend and backend are running
5. Try logging out and logging in again

---

**Last Updated:** December 2024  
**Access Level:** Administrator Only  
**Session Duration:** 24 hours
