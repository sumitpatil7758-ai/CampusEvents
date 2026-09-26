-- ============================================
-- CampusConnect - Database Schema
-- College Event Management System
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'organizer')),
    college_id VARCHAR(50),
    department VARCHAR(100),
    year VARCHAR(20),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups during login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- 2. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Technical', 'Cultural', 'Sports', 'Workshop',
        'Seminar', 'Competition', 'Hackathon'
    )),
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    contact_number VARCHAR(20),
    max_participants INTEGER NOT NULL DEFAULT 100 CHECK (max_participants > 0),
    registration_deadline DATE NOT NULL,
    banner_url TEXT,
    rules TEXT,
    requirements TEXT,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN (
        'upcoming', 'ongoing', 'completed', 'cancelled'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);

-- ============================================
-- 3. REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_id VARCHAR(20) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    student_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    college_id VARCHAR(50),
    department VARCHAR(100),
    year VARCHAR(20),
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN (
        'registered', 'cancelled', 'attended'
    )),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student_id ON registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

-- Prevent duplicate active registrations (same student, same event, not cancelled)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_registration 
    ON registrations(event_id, student_id) 
    WHERE status != 'cancelled';

-- ============================================
-- 4. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN (
        'registration', 'reminder', 'update', 'cancellation', 'announcement', 'info'
    )),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching user notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);

-- ============================================
-- 5. DISABLE ROW LEVEL SECURITY
-- (We handle auth in our Express backend)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow the anon key full access (our backend handles authorization)
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on events" ON events
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on registrations" ON registrations
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on notifications" ON notifications
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- SCHEMA COMPLETE!
-- Now run seed-data.sql to add demo data.
-- ============================================
