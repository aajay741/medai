# 🎭 MEDAI Admin Panel - Complete Setup Guide

## 📋 Overview

Complete admin panel system for managing MEDAI ticket bookings with:
- **Backend**: PHP + MySQL
- **Frontend**: React Admin Dashboard
- **Features**: Booking management, statistics, authentication

---

## 🗄️ Database Setup

### Step 1: Create Database

1. Open **phpMyAdmin** or MySQL command line
2. Run the SQL file:
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```

   Or manually execute the SQL in `backend/database/schema.sql`

### Step 2: Verify Tables

Check that these tables were created:
- ✅ `bookings` - Stores all ticket bookings
- ✅ `admin_users` - Admin authentication
- ✅ `activity_logs` - Admin activity tracking
- ✅ `booking_statistics` - Statistics view

### Step 3: Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ IMPORTANT**: Change this password in production!

---

## 🔧 Backend Setup (PHP)

### Step 1: Configure Database Connection

Edit `backend/config/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'medai_bookings');
define('DB_USER', 'root'); // Your MySQL username
define('DB_PASS', ''); // Your MySQL password
```

### Step 2: Setup PHP Server

**Option A: Using XAMPP/WAMP**
1. Copy `backend` folder to `C:\xampp\htdocs\medai\`
2. Access via: `http://localhost/medai/backend/api/`

**Option B: Using PHP Built-in Server**
```bash
cd backend
php -S localhost:8000
```
Access via: `http://localhost:8000/api/`

### Step 3: Test API Endpoints

Test in browser or Postman:

**Dashboard Stats**
```
GET http://localhost/medai/backend/api/dashboard.php
```

**Get Bookings**
```
GET http://localhost/medai/backend/api/bookings.php
```

**Login**
```
POST http://localhost/medai/backend/api/auth.php
Body: {"username": "admin", "password": "admin123"}
```

---

## 🎨 Frontend Setup (React)

### Step 1: Update API URLs

If your backend is NOT at `http://localhost/medai/backend/api/`, update these files:
- `src/pages/AdminLogin.jsx`
- `src/pages/AdminDashboard.jsx`
- `src/pages/Booking.jsx` (when integrated)

Change:
```javascript
const response = await fetch('http://localhost/medai/backend/api/auth.php', {
```

To your actual backend URL.

### Step 2: Access Admin Panel

**Login Page**
```
http://localhost:5173/admin/login
```

**Dashboard** (after login)
```
http://localhost:5173/admin/dashboard
```

---

## 📊 API Endpoints Reference

### Authentication

**POST** `/api/auth.php` - Login
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**GET** `/api/auth.php` - Verify Session

**DELETE** `/api/auth.php` - Logout

### Bookings

**GET** `/api/bookings.php` - Get all bookings
Query params:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `location` - Filter by location
- `status` - Filter by status
- `search` - Search by name/email/reference

**POST** `/api/bookings.php` - Create booking
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "location": "Chennai",
  "eventDate": "2026-03-15",
  "eventTime": "7:00 PM",
  "ticketType": "VIP",
  "quantity": 2,
  "specialRequests": "Wheelchair accessible"
}
```

**PUT** `/api/bookings.php` - Update booking status
```json
{
  "id": 1,
  "status": "confirmed"
}
```

**DELETE** `/api/bookings.php?id=1` - Delete booking

### Dashboard

**GET** `/api/dashboard.php` - Get statistics
Returns:
- Total bookings
- Total revenue
- Bookings by location
- Recent bookings
- Revenue by month

---

## 🎯 Features

### Admin Dashboard

✅ **Statistics Cards**
- Total bookings
- Total revenue
- Today's bookings
- Monthly bookings

✅ **Booking Management**
- View all bookings in table
- Search by name/email/reference
- Filter by location
- Filter by status
- Update booking status
- Delete bookings

✅ **Real-time Data**
- Auto-refresh on actions
- Pagination support
- Responsive design

### Security Features

✅ **Authentication**
- Session-based login
- Password hashing (bcrypt)
- Token validation
- Auto logout on session expire

✅ **Input Validation**
- SQL injection prevention (PDO prepared statements)
- XSS protection (sanitization)
- CSRF protection ready
- CORS configuration

✅ **Activity Logging**
- Login tracking
- IP address logging
- Action history

---

## 🎨 Admin Panel UI

### Color Scheme
- Background: Dark gradient (#030303 → #1a0a1a)
- Primary: Purple (#A78BFA)
- Success: Green
- Warning: Yellow
- Danger: Red

### Components
- Glassmorphism cards
- Smooth animations (Framer Motion)
- Responsive tables
- Real-time filters
- Status badges

---

## 🔐 Security Checklist

### Before Production:

- [ ] Change default admin password
- [ ] Update `JWT_SECRET` in config.php
- [ ] Set `display_errors = 0` in config.php
- [ ] Enable HTTPS
- [ ] Restrict CORS to production domain
- [ ] Add rate limiting
- [ ] Enable database backups
- [ ] Add CSRF tokens
- [ ] Implement 2FA (optional)
- [ ] Add input validation on frontend

---

## 📱 Booking Flow

### User Side (Frontend)
1. User fills booking form
2. Form data sent to `/api/bookings.php`
3. Booking reference generated
4. Confirmation shown to user

### Admin Side (Dashboard)
1. Admin logs in at `/admin/login`
2. Dashboard shows statistics
3. Bookings table displays all bookings
4. Admin can:
   - View booking details
   - Update status (confirmed/pending/cancelled)
   - Delete bookings
   - Filter and search
   - Export data (future feature)

---

## 🗂️ File Structure

```
medai/
├── backend/
│   ├── config/
│   │   └── config.php          # Database & app configuration
│   ├── api/
│   │   ├── auth.php            # Authentication endpoints
│   │   ├── bookings.php        # Booking CRUD operations
│   │   └── dashboard.php       # Statistics & analytics
│   └── database/
│       └── schema.sql          # Database schema
│
└── src/
    └── pages/
        ├── AdminLogin.jsx      # Admin login page
        ├── AdminDashboard.jsx  # Admin dashboard
        └── Booking.jsx         # User booking form (to be updated)
```

---

## 🐛 Troubleshooting

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `config.php`
- Ensure database `medai_bookings` exists

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS` in `config.php`
- Check browser console for exact error

### 404 on API Calls
- Verify backend folder location
- Check `.htaccess` if using Apache
- Ensure PHP files have correct permissions

### Login Not Working
- Check database has admin user
- Verify password hash in database
- Check browser console for errors
- Clear localStorage and try again

---

## 🚀 Next Steps

### Recommended Enhancements:
1. **Email Notifications** - Send booking confirmations
2. **PDF Tickets** - Generate downloadable tickets
3. **Payment Integration** - Razorpay/Stripe
4. **Export to Excel** - Download booking reports
5. **Analytics Dashboard** - Charts and graphs
6. **Multi-admin Support** - Role-based access
7. **Booking Calendar** - Visual date picker
8. **SMS Notifications** - Twilio integration

---

## 📞 Support

For issues or questions:
- Check this guide first
- Review error logs in browser console
- Check PHP error logs
- Verify database structure

---

## 🎉 Quick Start Commands

```bash
# 1. Setup database
mysql -u root -p < backend/database/schema.sql

# 2. Start PHP server (if not using XAMPP)
cd backend
php -S localhost:8000

# 3. Start React app
npm run dev

# 4. Access admin panel
# Login: http://localhost:5173/admin/login
# Username: admin
# Password: admin123
```

---

**Admin Panel is now ready! 🎭✨**
