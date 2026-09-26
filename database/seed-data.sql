-- ============================================
-- CampusConnect - Seed Data
-- Run this AFTER schema.sql
-- ============================================
-- NOTE: Passwords are hashed with bcryptjs (10 rounds)
-- All demo passwords are: Password123
-- Hash: $2a$10$rIC/p5YKxHODY3OlRKFDUeF3w5BODJgqI3I6ZKz7RqQyFJxfGxHaW

-- ============================================
-- 1. DEMO USERS
-- ============================================
INSERT INTO users (id, name, email, password, role, college_id, department, year, phone) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Sumit Patil',
    'sumit@student.edu',
    '$2a$10$rIC/p5YKxHODY3OlRKFDUeF3w5BODJgqI3I6ZKz7RqQyFJxfGxHaW',
    'student',
    'CS2024001',
    'Computer Science',
    '3rd Year',
    '9876543210'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Priya Sharma',
    'priya@student.edu',
    '$2a$10$rIC/p5YKxHODY3OlRKFDUeF3w5BODJgqI3I6ZKz7RqQyFJxfGxHaW',
    'student',
    'IT2024015',
    'IT',
    '2nd Year',
    '9876543211'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Rahul Kumar',
    'rahul@student.edu',
    '$2a$10$rIC/p5YKxHODY3OlRKFDUeF3w5BODJgqI3I6ZKz7RqQyFJxfGxHaW',
    'student',
    'EC2024008',
    'Electronics',
    '4th Year',
    '9876543212'
),
(
    '44444444-4444-4444-4444-444444444444',
    'Dr. Anita Desai',
    'anita@organizer.edu',
    '$2a$10$rIC/p5YKxHODY3OlRKFDUeF3w5BODJgqI3I6ZKz7RqQyFJxfGxHaW',
    'organizer',
    'FAC001',
    'Computer Science',
    'Faculty',
    '9876543213'
),
(
    '55555555-5555-5555-5555-555555555555',
    'Prof. Vikram Singh',
    'vikram@organizer.edu',
    '$2a$10$rIC/p5YKxHODY3OlRKFDUeF3w5BODJgqI3I6ZKz7RqQyFJxfGxHaW',
    'organizer',
    'FAC002',
    'IT',
    'Faculty',
    '9876543214'
);

-- ============================================
-- 2. DEMO EVENTS
-- ============================================
INSERT INTO events (id, title, description, category, event_date, start_time, end_time, venue, organizer_id, organizer_name, organizer_email, contact_number, max_participants, registration_deadline, banner_url, rules, requirements, status) VALUES
(
    'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'AI & Innovation Hackathon',
    'Join us for an exciting 8-hour hackathon focused on Artificial Intelligence and Machine Learning! Build innovative solutions to real-world problems using cutting-edge AI technologies. Teams of 2-4 members will compete for exciting prizes and internship opportunities.',
    'Hackathon',
    '2026-10-15',
    '09:00',
    '17:00',
    'Seminar Hall A',
    '44444444-4444-4444-4444-444444444444',
    'Dr. Anita Desai',
    'anita@organizer.edu',
    '9876543213',
    100,
    '2026-10-12',
    '',
    '1. Teams of 2-4 members allowed\n2. All code must be written during the hackathon\n3. Use of pre-trained models is allowed\n4. Judging criteria: Innovation, Technical Complexity, Presentation\n5. All participants must bring their own laptops',
    'Basic knowledge of Python or JavaScript\nLaptop with internet connectivity\nGitHub account',
    'upcoming'
),
(
    'aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Web Development Workshop',
    'Learn modern web development from scratch! This hands-on workshop covers HTML5, CSS3, JavaScript ES6+, React.js fundamentals, and deploying your first web application. Perfect for beginners who want to start their web development journey.',
    'Workshop',
    '2026-10-20',
    '10:00',
    '16:00',
    'Computer Lab 3',
    '44444444-4444-4444-4444-444444444444',
    'Dr. Anita Desai',
    'anita@organizer.edu',
    '9876543213',
    50,
    '2026-10-18',
    '',
    '1. Individual participation only\n2. Follow along with instructor\n3. Complete all exercises during the session\n4. Certificate of completion will be provided',
    'Laptop with VS Code installed\nBasic understanding of HTML\nChrome or Firefox browser',
    'upcoming'
),
(
    'aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Annual Sports Meet 2026',
    'The much-awaited Annual Sports Meet is here! Participate in various track and field events, team sports, and individual competitions. Show your athletic prowess and win medals for your department. Events include: 100m Sprint, 200m Relay, Long Jump, Shot Put, Cricket, Football, Badminton, and Table Tennis.',
    'Sports',
    '2026-11-05',
    '07:00',
    '18:00',
    'College Sports Ground',
    '55555555-5555-5555-5555-555555555555',
    'Prof. Vikram Singh',
    'vikram@organizer.edu',
    '9876543214',
    200,
    '2026-11-01',
    '',
    '1. Students must carry valid college ID\n2. Sports attire is mandatory\n3. Each student can participate in max 3 events\n4. Medical fitness certificate required for track events\n5. Fair play policy will be strictly enforced',
    'Valid College ID\nSports shoes and attire\nMedical fitness certificate',
    'upcoming'
),
(
    'aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Cultural Fest - Rangoli',
    'Experience the vibrant cultural diversity of our college! Rangoli 2026 brings together music, dance, drama, art, and fashion under one roof. Participate in solo/group performances, art exhibitions, debate competitions, and more. Celebrity judges and exciting prizes await!',
    'Cultural',
    '2026-11-15',
    '09:00',
    '21:00',
    'College Auditorium',
    '55555555-5555-5555-5555-555555555555',
    'Prof. Vikram Singh',
    'vikram@organizer.edu',
    '9876543214',
    300,
    '2026-11-10',
    '',
    '1. Individual and group entries accepted\n2. Performance time limit: Solo 5 min, Group 10 min\n3. No vulgarity in any performance\n4. Props must be arranged by participants\n5. Judges'' decision will be final',
    'Prepare your performance/act in advance\nArrange costumes and props\nRegister for specific sub-events at the venue',
    'upcoming'
),
(
    'aaaa5555-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Entrepreneurship Seminar',
    'Learn from successful entrepreneurs and startup founders! This seminar features keynote speeches, panel discussions, and networking sessions. Topics include: Startup Ideation, Funding Strategies, Building MVPs, Marketing on a Budget, and Scaling Your Business. Special session on government startup schemes and incubator programs.',
    'Seminar',
    '2026-10-25',
    '11:00',
    '15:00',
    'Conference Room B',
    '44444444-4444-4444-4444-444444444444',
    'Dr. Anita Desai',
    'anita@organizer.edu',
    '9876543213',
    80,
    '2026-10-23',
    '',
    '1. Formal attire recommended\n2. Q&A session at the end\n3. Networking lunch included\n4. Bring business cards if available',
    'Interest in entrepreneurship\nNotebook for taking notes\nResume/CV for networking (optional)',
    'upcoming'
),
(
    'aaaa6666-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Coding Competition - CodeStorm',
    'Test your programming skills in this exciting coding competition! Solve algorithmic challenges across 3 difficulty levels. The competition follows an ACM-ICPC style format with problems ranging from easy to expert level. Top 3 winners will receive cash prizes and coding merchandise.',
    'Competition',
    '2026-10-30',
    '14:00',
    '18:00',
    'Computer Lab 1 & 2',
    '44444444-4444-4444-4444-444444444444',
    'Dr. Anita Desai',
    'anita@organizer.edu',
    '9876543213',
    60,
    '2026-10-28',
    '',
    '1. Individual participation only\n2. Languages allowed: C, C++, Java, Python\n3. No internet access during competition\n4. Time limit: 4 hours\n5. Scoring based on problems solved and time taken\n6. Plagiarism will result in disqualification',
    'Strong knowledge of Data Structures and Algorithms\nProficiency in at least one programming language (C/C++/Java/Python)\nHackerRank or LeetCode practice recommended',
    'upcoming'
);

-- ============================================
-- 3. DEMO REGISTRATIONS
-- ============================================
INSERT INTO registrations (id, registration_id, event_id, student_id, student_name, email, phone, college_id, department, year, status) VALUES
(
    'bbbb1111-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'REG-2026-00001',
    'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'Priya Sharma',
    'priya@student.edu',
    '9876543211',
    'IT2024015',
    'IT',
    '2nd Year',
    'registered'
),
(
    'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'REG-2026-00002',
    'aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'Priya Sharma',
    'priya@student.edu',
    '9876543211',
    'IT2024015',
    'IT',
    '2nd Year',
    'registered'
),
(
    'bbbb3333-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'REG-2026-00003',
    'aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '33333333-3333-3333-3333-333333333333',
    'Rahul Kumar',
    'rahul@student.edu',
    '9876543212',
    'EC2024008',
    'Electronics',
    '4th Year',
    'registered'
),
(
    'bbbb4444-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'REG-2026-00004',
    'aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '33333333-3333-3333-3333-333333333333',
    'Rahul Kumar',
    'rahul@student.edu',
    '9876543212',
    'EC2024008',
    'Electronics',
    '4th Year',
    'registered'
),
(
    'bbbb5555-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'REG-2026-00005',
    'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '33333333-3333-3333-3333-333333333333',
    'Rahul Kumar',
    'rahul@student.edu',
    '9876543212',
    'EC2024008',
    'Electronics',
    '4th Year',
    'registered'
);

-- ============================================
-- 4. DEMO NOTIFICATIONS
-- ============================================
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(
    '22222222-2222-2222-2222-222222222222',
    'Registration Successful',
    'You have been successfully registered for AI & Innovation Hackathon. Your registration ID is REG-2026-00001.',
    'registration',
    false
),
(
    '22222222-2222-2222-2222-222222222222',
    'Registration Successful',
    'You have been successfully registered for Web Development Workshop. Your registration ID is REG-2026-00002.',
    'registration',
    false
),
(
    '33333333-3333-3333-3333-333333333333',
    'Registration Successful',
    'You have been successfully registered for Annual Sports Meet 2026. Your registration ID is REG-2026-00003.',
    'registration',
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'Event Reminder',
    'Reminder: Cultural Fest - Rangoli is happening on November 15, 2026. Don''t forget to prepare your performance!',
    'reminder',
    false
),
(
    '11111111-1111-1111-1111-111111111111',
    'Welcome to CampusConnect!',
    'Welcome to CampusConnect, Sumit! Start exploring exciting college events and register for the ones you love.',
    'info',
    false
),
(
    '11111111-1111-1111-1111-111111111111',
    'New Event: AI & Innovation Hackathon',
    'A new hackathon has been posted! AI & Innovation Hackathon on October 15, 2026 at Seminar Hall A. Register before seats fill up!',
    'announcement',
    false
),
(
    '11111111-1111-1111-1111-111111111111',
    'Event Reminder',
    'Your Web Development Workshop starts tomorrow at 10:00 AM in Computer Lab 3. Don''t forget to bring your laptop!',
    'reminder',
    false
);

-- ============================================
-- SEED DATA COMPLETE!
-- 
-- Test Accounts (all passwords: Password123):
--   Student: sumit@student.edu
--   Student: priya@student.edu
--   Student: rahul@student.edu
--   Organizer: anita@organizer.edu
--   Organizer: vikram@organizer.edu
-- ============================================
