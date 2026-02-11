-- Add Events Table to existing schema

USE medai_bookings;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(100) NOT NULL,
    venue_name VARCHAR(255),
    venue_address TEXT,
    event_date DATE NOT NULL,
    event_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50),
    duration VARCHAR(50),
    category VARCHAR(100),
    image_url VARCHAR(500),
    ticket_types JSON, -- Store ticket types and prices as JSON
    total_seats INT DEFAULT 100,
    available_seats INT DEFAULT 100,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_event_date (event_date),
    INDEX idx_status (status),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample events
INSERT INTO events (title, description, location, venue_name, venue_address, event_date, event_time, end_time, category, ticket_types, total_seats, available_seats, status, featured) VALUES
('MEDAI Live: Comedy Night', 'An evening of laughter with top comedians and AI-generated humor', 'Chennai', 'Phoenix MarketCity', 'Velachery Main Rd, Chennai', '2026-03-15', '7:00 PM', '10:00 PM', 'Comedy', 
'[{"type":"General Admission","price":500,"description":"Standard seating"},{"type":"VIP","price":1500,"description":"Premium seating with complimentary drinks"},{"type":"Premium","price":2500,"description":"Front row seats with meet & greet"}]', 
200, 150, 'upcoming', true),

('MEDAI Experience: Bengaluru', 'Interactive performance with real-time AI visuals and spatial audio', 'Bengaluru', 'Orion Mall', 'Brigade Gateway, Rajajinagar', '2026-03-20', '8:00 PM', '11:00 PM', 'Performance', 
'[{"type":"General Admission","price":600,"description":"Standard seating"},{"type":"VIP","price":1800,"description":"Premium seating with complimentary drinks"}]', 
150, 120, 'upcoming', true),

('MEDAI Showcase: Coimbatore', 'Sensory marvel combining comedy, music, and technology', 'Coimbatore', 'Brookefields Mall', 'Avinashi Road, Coimbatore', '2026-03-25', '6:30 PM', '9:30 PM', 'Showcase', 
'[{"type":"General Admission","price":450,"description":"Standard seating"},{"type":"VIP","price":1200,"description":"Premium seating"}]', 
100, 80, 'upcoming', false);

-- Update bookings table to link with events
ALTER TABLE bookings ADD COLUMN event_id INT NULL AFTER booking_reference;
ALTER TABLE bookings ADD FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD INDEX idx_event_id (event_id);
