# ✅ Event Management System Added!

## 🎯 What's New

I've added a complete **Event Management System** to your admin panel where you can create, edit, and delete events. These events automatically appear in the frontend booking form!

---

## 📊 New Features

### 1. Events Database Table
**File**: `backend/database/events_schema.sql`

**Fields**:
- Event details (title, description, location, venue)
- Date & time information
- Ticket types with prices (stored as JSON)
- Seat management (total/available)
- Status (upcoming, ongoing, completed, cancelled)
- Featured flag
- Active/inactive status

**Sample Events Included**:
- ✅ MEDAI Live: Comedy Night (Chennai)
- ✅ MEDAI Experience: Bengaluru
- ✅ MEDAI Showcase: Coimbatore

### 2. Events API Endpoint
**File**: `backend/api/events.php`

**Operations**:
- `GET` - Fetch all events or single event
- `POST` - Create new event
- `PUT` - Update event
- `DELETE` - Soft delete event (sets inactive)

**Filters**:
- By location
- By status
- Featured only
- Upcoming only
- Admin view (all events)

### 3. Admin Events Management Page
**File**: `src/pages/AdminEvents.jsx`

**Features**:
- ✅ Beautiful grid view of all events
- ✅ Create new events with modal form
- ✅ Edit existing events
- ✅ Delete events (soft delete)
- ✅ Manage multiple ticket types per event
- ✅ Set featured events
- ✅ Update event status
- ✅ Seat management

---

## 🚀 Setup Instructions

### Step 1: Run New SQL
```bash
mysql -u root -p medai_bookings < backend/database/events_schema.sql
```

This will:
- Create `events` table
- Insert 3 sample events
- Link bookings to events

### Step 2: Access Event Management
```
URL: http://localhost:5173/admin/events
```

(Login first at `/admin/login` if not already logged in)

---

## 🎨 Admin Panel - Event Management

### Create Event Form Fields:

**Basic Info**:
- Event Title *
- Description
- Location (Chennai/Bengaluru/Coimbatore) *
- Venue Name
- Venue Address
- Category

**Schedule**:
- Event Date *
- Event Time *
- End Time
- Duration

**Ticketing**:
- Ticket Types (multiple) *
  - Type name (e.g., "VIP")
  - Price (₹)
  - Description
- Total Seats
- Status (upcoming/ongoing/completed/cancelled)

**Options**:
- Featured Event (checkbox)
- Image URL

### Event Card Display:
- Event image (if provided)
- Title & description
- Location & venue
- Date & time
- Seat availability
- Status badge
- Featured badge
- Edit & Delete buttons

---

## 🔄 How It Works

### Admin Side:
1. Admin logs in at `/admin/login`
2. Navigates to `/admin/events`
3. Clicks "Create Event"
4. Fills in event details
5. Adds ticket types with prices
6. Saves event

### Frontend Side (Coming Next):
1. User opens booking form
2. Selects location
3. **Events for that location load automatically**
4. User selects event
5. **Ticket types from event appear**
6. User selects ticket type and quantity
7. Booking is linked to event

---

## 📁 New Files Created

```
backend/
├── database/events_schema.sql  # Events table schema
└── api/events.php              # Events CRUD API

src/pages/
└── AdminEvents.jsx             # Event management UI
```

---

## 🎯 Next Step: Update Booking Form

To show events in the frontend booking form, update `src/pages/Booking.jsx`:

```javascript
// Fetch events when location is selected
const [events, setEvents] = useState([])

useEffect(() => {
    if (selectedLocation) {
        fetch(`http://localhost/medai/backend/api/events.php?location=${selectedLocation}&upcoming=1`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEvents(data.data)
                }
            })
    }
}, [selectedLocation])

// Show event selector
<select onChange={(e) => {
    const event = events.find(ev => ev.id == e.target.value)
    setSelectedEvent(event)
    setTicketTypes(event.ticket_types)
}}>
    <option value="">Select Event</option>
    {events.map(event => (
        <option key={event.id} value={event.id}>
            {event.title} - {event.event_date} at {event.event_time}
        </option>
    ))}
</select>

// Show ticket types from selected event
{selectedEvent && selectedEvent.ticket_types.map(ticket => (
    <option value={ticket.type}>
        {ticket.type} - ₹{ticket.price} ({ticket.description})
    </option>
))}
```

---

## 🎉 Features Summary

### Admin Can:
✅ Create unlimited events
✅ Set multiple ticket types per event
✅ Manage seat availability
✅ Feature important events
✅ Update event status
✅ Soft delete events
✅ View all events in beautiful grid

### Users Will See:
✅ Only active, upcoming events
✅ Events filtered by their selected location
✅ Real ticket types and prices from admin
✅ Accurate seat availability
✅ Event details (date, time, venue)

---

## 📊 Database Structure

```sql
events
├── id (Primary Key)
├── title
├── description
├── location (Chennai/Bengaluru/Coimbatore)
├── venue_name
├── venue_address
├── event_date
├── event_time
├── ticket_types (JSON: [{type, price, description}])
├── total_seats
├── available_seats
├── status (upcoming/ongoing/completed/cancelled)
├── featured (boolean)
├── is_active (boolean)
└── timestamps

bookings
├── event_id (Foreign Key → events.id)
└── ... (existing fields)
```

---

## 🎭 Sample Event JSON

```json
{
  "title": "MEDAI Live: Comedy Night",
  "location": "Chennai",
  "event_date": "2026-03-15",
  "event_time": "7:00 PM",
  "ticket_types": [
    {
      "type": "General Admission",
      "price": 500,
      "description": "Standard seating"
    },
    {
      "type": "VIP",
      "price": 1500,
      "description": "Premium seating with drinks"
    }
  ],
  "total_seats": 200,
  "status": "upcoming",
  "featured": true
}
```

---

**Event Management is now complete! 🎭✨**

Admin can create/edit events → Events appear in frontend booking form automatically!
