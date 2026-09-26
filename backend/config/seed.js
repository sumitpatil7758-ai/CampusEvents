const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains data, skipping auto-seed.');
      return;
    }

    console.log('Database is empty. Seeding initial demo data...');
    const hashedPassword = await bcrypt.hash('Password123', 10);

    const studentSumit = await User.create({
      name: 'Sumit Patil',
      email: 'sumit@student.edu',
      password: hashedPassword,
      role: 'student',
      college_id: 'CS2024001',
      department: 'Computer Science',
      year: '3rd Year',
      phone: '9876543210'
    });

    const studentPriya = await User.create({
      name: 'Priya Sharma',
      email: 'priya@student.edu',
      password: hashedPassword,
      role: 'student',
      college_id: 'IT2024015',
      department: 'IT',
      year: '2nd Year',
      phone: '9876543211'
    });

    const studentRahul = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul@student.edu',
      password: hashedPassword,
      role: 'student',
      college_id: 'EC2024008',
      department: 'Electronics',
      year: '4th Year',
      phone: '9876543212'
    });

    const organizerAnita = await User.create({
      name: 'Dr. Anita Desai',
      email: 'anita@organizer.edu',
      password: hashedPassword,
      role: 'organizer',
      college_id: 'FAC001',
      department: 'Computer Science',
      year: 'Faculty',
      phone: '9876543213'
    });

    const organizerVikram = await User.create({
      name: 'Prof. Vikram Singh',
      email: 'vikram@organizer.edu',
      password: hashedPassword,
      role: 'organizer',
      college_id: 'FAC002',
      department: 'IT',
      year: 'Faculty',
      phone: '9876543214'
    });

    // Seed Events
    const hackathon = await Event.create({
      title: 'AI & Innovation Hackathon',
      description: 'Join us for an exciting 8-hour hackathon focused on Artificial Intelligence and Machine Learning! Build innovative solutions to real-world problems using cutting-edge AI technologies.',
      category: 'Hackathon',
      event_date: '2026-10-15',
      start_time: '09:00',
      end_time: '17:00',
      venue: 'Seminar Hall A',
      organizer_id: organizerAnita._id,
      organizer_name: organizerAnita.name,
      organizer_email: organizerAnita.email,
      contact_number: '9876543213',
      max_participants: 100,
      registration_deadline: '2026-10-12',
      banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
      rules: '1. Teams of 2-4 members allowed\n2. All code must be written during the hackathon\n3. Judging criteria: Innovation, Technical Complexity, Presentation',
      requirements: 'Laptop with internet connectivity, GitHub account',
      status: 'upcoming'
    });

    const workshop = await Event.create({
      title: 'Web Development Workshop',
      description: 'Learn modern web development from scratch! Hands-on workshop covering HTML5, CSS3, JavaScript, and Node.js fundamentals.',
      category: 'Workshop',
      event_date: '2026-10-20',
      start_time: '10:00',
      end_time: '16:00',
      venue: 'Computer Lab 3',
      organizer_id: organizerAnita._id,
      organizer_name: organizerAnita.name,
      organizer_email: organizerAnita.email,
      contact_number: '9876543213',
      max_participants: 50,
      registration_deadline: '2026-10-18',
      banner_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
      rules: '1. Follow along with instructor\n2. Complete hands-on exercises\n3. Certificates provided',
      requirements: 'Laptop with VS Code and Node.js installed',
      status: 'upcoming'
    });

    const sports = await Event.create({
      title: 'Annual Sports Meet 2026',
      description: 'Compete in track and field events, football, cricket, badminton, and table tennis. Show your department spirit!',
      category: 'Sports',
      event_date: '2026-11-05',
      start_time: '07:00',
      end_time: '18:00',
      venue: 'College Sports Ground',
      organizer_id: organizerVikram._id,
      organizer_name: organizerVikram.name,
      organizer_email: organizerVikram.email,
      contact_number: '9876543214',
      max_participants: 200,
      registration_deadline: '2026-11-01',
      banner_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop',
      rules: '1. Sports attire mandatory\n2. Max 3 events per student',
      requirements: 'College ID and sports attire',
      status: 'upcoming'
    });

    const cultural = await Event.create({
      title: 'Cultural Fest - Rangoli',
      description: 'Experience vibrant cultural diversity with music, dance, drama, art, and fashion performances!',
      category: 'Cultural',
      event_date: '2026-11-15',
      start_time: '09:00',
      end_time: '21:00',
      venue: 'College Auditorium',
      organizer_id: organizerVikram._id,
      organizer_name: organizerVikram.name,
      organizer_email: organizerVikram.email,
      contact_number: '9876543214',
      max_participants: 300,
      registration_deadline: '2026-11-10',
      banner_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
      rules: '1. Solo or group entries accepted\n2. Time limit enforced',
      requirements: 'Costumes and props arranged in advance',
      status: 'upcoming'
    });

    const seminar = await Event.create({
      title: 'Entrepreneurship Seminar',
      description: 'Learn from successful entrepreneurs and startup founders! Keynotes, funding strategies, and networking lunch.',
      category: 'Seminar',
      event_date: '2026-10-25',
      start_time: '11:00',
      end_time: '15:00',
      venue: 'Conference Room B',
      organizer_id: organizerAnita._id,
      organizer_name: organizerAnita.name,
      organizer_email: organizerAnita.email,
      contact_number: '9876543213',
      max_participants: 80,
      registration_deadline: '2026-10-23',
      banner_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop',
      rules: 'Formal attire recommended',
      requirements: 'Curiosity and passion for startups',
      status: 'upcoming'
    });

    const competition = await Event.create({
      title: 'Coding Competition - CodeStorm',
      description: 'Test your algorithmic problem solving skills across multiple difficulty tiers. Win prizes and certificates!',
      category: 'Competition',
      event_date: '2026-10-30',
      start_time: '14:00',
      end_time: '18:00',
      venue: 'Computer Lab 1 & 2',
      organizer_id: organizerAnita._id,
      organizer_name: organizerAnita.name,
      organizer_email: organizerAnita.email,
      contact_number: '9876543213',
      max_participants: 60,
      registration_deadline: '2026-10-28',
      banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
      rules: '1. Individual participation\n2. Languages: C++, Java, Python\n3. Plagiarism results in disqualification',
      requirements: 'Problem solving skills',
      status: 'upcoming'
    });

    // Seed Registrations
    await Registration.create({
      registration_id: 'REG-2026-00001',
      event_id: hackathon._id,
      student_id: studentPriya._id,
      student_name: studentPriya.name,
      email: studentPriya.email,
      phone: studentPriya.phone,
      college_id: studentPriya.college_id,
      department: studentPriya.department,
      year: studentPriya.year,
      status: 'registered'
    });

    await Registration.create({
      registration_id: 'REG-2026-00002',
      event_id: workshop._id,
      student_id: studentPriya._id,
      student_name: studentPriya.name,
      email: studentPriya.email,
      phone: studentPriya.phone,
      college_id: studentPriya.college_id,
      department: studentPriya.department,
      year: studentPriya.year,
      status: 'registered'
    });

    await Registration.create({
      registration_id: 'REG-2026-00003',
      event_id: sports._id,
      student_id: studentRahul._id,
      student_name: studentRahul.name,
      email: studentRahul.email,
      phone: studentRahul.phone,
      college_id: studentRahul.college_id,
      department: studentRahul.department,
      year: studentRahul.year,
      status: 'registered'
    });

    // Seed Notifications
    await Notification.create({
      user_id: studentSumit._id,
      title: 'Welcome to CampusConnect!',
      message: 'Welcome to CampusConnect, Sumit! Explore upcoming college events and register easily.',
      type: 'info',
      is_read: false
    });

    await Notification.create({
      user_id: studentSumit._id,
      title: 'New Hackathon Announced',
      message: 'AI & Innovation Hackathon is open for registration. Secure your spot now!',
      type: 'announcement',
      is_read: false
    });

    console.log('✅ Demo data successfully seeded into MongoDB!');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

module.exports = seedData;
